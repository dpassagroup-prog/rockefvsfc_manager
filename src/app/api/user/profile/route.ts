import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();
    if (!kindeUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { fullName, phone } = body;

    const updatedUser = await db
      .update(users)
      .set({ fullName, phone })
      .where(eq(users.kindeId, kindeUser.id))
      .returning();

    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}