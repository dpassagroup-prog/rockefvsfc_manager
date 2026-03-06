import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from '@/lib/db';
import { users, players } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const kindeUser = await getUser();
    if (!kindeUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the parent from database
    const parent = await db.query.users.findFirst({
      where: eq(users.kindeId, kindeUser.id),
    });
    if (!parent) {
      return NextResponse.json({ error: 'Parent not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      ageGroup,
      phone,
      address,
      placeOfBirth,
      mysafaId,
      nationalId,
      nationality,
      previousClub,
      position,
      season,
      emergencyContactName,
      emergencyContactPhone,
      medicalNotes,
      consentPhotos,
      consentVideos,
      consentTravel,
      termsAccepted,
      parentSignature,
      parentAddress,
    } = body;

    // If parent provided a new address, update the users table
    if (parentAddress && parentAddress !== parent.address) {
      await db.update(users)
        .set({ address: parentAddress })
        .where(eq(users.id, parent.id));
    }

    // Insert the player
    const [newPlayer] = await db.insert(players).values({
      firstName,
      lastName,
      dateOfBirth: new Date(dateOfBirth),
      ageGroup,
      parentId: parent.id,
      phone: phone || null,
      address: address || null,
      placeOfBirth: placeOfBirth || null,
      mysafaId: mysafaId || null,
      nationalId: nationalId || null,
      nationality: nationality || null,
      previousClub: previousClub || null,
      position: position || null,
      season: season || '2026',
      emergencyContactName: emergencyContactName || null,
      emergencyContactPhone: emergencyContactPhone || null,
      medicalNotes: medicalNotes || null,
      consentPhotos: consentPhotos || false,
      consentVideos: consentVideos || false,
      consentTravel: consentTravel || false,
      termsAccepted: termsAccepted || false,
      termsAcceptedAt: termsAccepted ? new Date() : null,
      parentSignature: parentSignature || null,
      registrationStatus: 'pending', // new registrations are pending
    }).returning();

    return NextResponse.json({ success: true, player: newPlayer });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}