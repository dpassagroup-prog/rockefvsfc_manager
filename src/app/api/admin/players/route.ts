import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Optionally check if the user is admin (you can add role check)

    const body = await request.json();
    const { firstName, lastName, dateOfBirth, ageGroup, parentId } = body;

    const [newPlayer] = await db.insert(players).values({
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      ageGroup,
      parentId: parentId || null, // will be null if not provided
      status: 'active',
    }).returning();

    return NextResponse.json(newPlayer);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}