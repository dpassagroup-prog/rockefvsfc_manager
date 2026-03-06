import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { players } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { generatePlayerInvoices } from '@/lib/invoice-generator';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ playerId: string }> }
) {
  try {
    const { playerId } = await params;
    const body = await request.json();
    const { status, reason } = body;

    const updateData: any = { registrationStatus: status };
    if (status === 'accepted') {
      // Also set the player's active status to 'active' if accepted
      updateData.status = 'active';
    }

    // Update player status
    await db.update(players)
      .set(updateData)
      .where(eq(players.id, playerId));

    // If accepted, generate invoices
    if (status === 'accepted') {
      // Fetch player to get parentId and season
      const player = await db.query.players.findFirst({
        where: eq(players.id, playerId),
      });
      if (player) {
        await generatePlayerInvoices(player.id, player.parentId!, player.season ?? '2026');
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}