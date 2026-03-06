import { db } from "@/lib/db";
import { players } from "@/lib/db/schema";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';
import { generatePlayerInvoices } from '@/lib/invoice-generator';

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Optionally check if the user is admin (you can add role check)

    const body = await request.json();
    const { firstName, lastName, dateOfBirth, ageGroup, parentId, registrationStatus, season } = body;

    const [newPlayer] = await db.insert(players).values({
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      ageGroup,
      parentId: parentId || null, // will be null if not provided
      status: registrationStatus === 'accepted' ? 'active' : 'pending',
      registrationStatus: registrationStatus || 'pending',
      season: season || '2026',
    }).returning();

    // If accepted, generate invoices
    if (registrationStatus === 'accepted' && parentId) {
      await generatePlayerInvoices(newPlayer.id, parentId, season || '2026');
    }

    return NextResponse.json(newPlayer);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}