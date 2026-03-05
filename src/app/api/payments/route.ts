import { db } from "@/lib/db";
import { payments, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get the database user
    const dbUser = await db.query.users.findFirst({
      where: eq(users.kindeId, user.id),
    });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();
    const { invoiceId, amount, proofUrl } = body;

    const [newPayment] = await db.insert(payments).values({
      invoiceId,
      amount: Math.round(amount * 100),
      proofUrl,
      status: 'pending',
      uploadedBy: dbUser.id,
    }).returning();

    return NextResponse.json(newPayment);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}