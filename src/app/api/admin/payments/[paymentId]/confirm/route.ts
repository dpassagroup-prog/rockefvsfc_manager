import { db } from "@/lib/db";
import { payments, invoices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await params;
    
    // Update payment status to confirmed
    await db.update(payments)
      .set({ status: 'confirmed' })
      .where(eq(payments.id, paymentId));

    // Get the payment to find its invoice
    const payment = await db.query.payments.findFirst({
      where: eq(payments.id, paymentId),
    });
    if (payment && payment.invoiceId) {
      // Mark invoice as paid
      await db.update(invoices)
        .set({ status: 'paid' })
        .where(eq(invoices.id, payment.invoiceId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}