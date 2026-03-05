import { NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { db } from "@/lib/db";
import { users, players } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { recipientType, parentId, ageGroup, subject, message } = body;

    // Determine list of parent emails
    let parentEmails: string[] = [];

    if (recipientType === 'all') {
      const parents = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.role, 'parent'));
      parentEmails = parents.map(p => p.email).filter(Boolean) as string[];
    } else if (recipientType === 'single' && parentId) {
      const parent = await db
        .select({ email: users.email })
        .from(users)
        .where(eq(users.id, parentId));
      if (parent[0]?.email) parentEmails = [parent[0].email];
    } else if (recipientType === 'ageGroup' && ageGroup) {
      // Find all players in that age group, then get their parents
      const parentIds = await db
        .select({ parentId: players.parentId })
        .from(players)
        .where(eq(players.ageGroup, ageGroup));
      const uniqueParentIds = [...new Set(parentIds.map(p => p.parentId).filter(Boolean))] as string[];
      const parents = await db
        .select({ email: users.email })
        .from(users)
        .where(inArray(users.id, uniqueParentIds));
      parentEmails = parents.map(p => p.email).filter(Boolean) as string[];
    }

    if (parentEmails.length === 0) {
      return NextResponse.json({ error: 'No recipients found' }, { status: 400 });
    }

    // Send email using Resend
    const html = `
      <h2>${subject}</h2>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p style="font-size:0.8em; color:#666;">ROCKEFVSFC Manager - Automated Notification</p>
    `;

    await sendEmail({
      to: parentEmails,
      subject,
      html,
    });

    return NextResponse.json({ success: true, recipients: parentEmails.length });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}