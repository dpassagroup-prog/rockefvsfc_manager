import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { parentId, amount, dueDate, description } = body;

    const [newInvoice] = await db.insert(invoices).values({
      parentId,
      amount: Math.round(amount * 100), // store in cents
      dueDate: new Date(dueDate),
      description,
      status: 'pending',
    }).returning();

    return NextResponse.json(newInvoice);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}