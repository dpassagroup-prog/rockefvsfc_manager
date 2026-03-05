import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const kindeUser = await getUser();

  if (!kindeUser) {
    redirect('/api/auth/login');
  }

  // Ensure the user exists in our database
  let dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, kindeUser.id),
  });

  if (!dbUser) {
    // New user – insert as parent
    const [newUser] = await db
      .insert(users)
      .values({
        kindeId: kindeUser.id,
        email: kindeUser.email || '',
        fullName: `${kindeUser.given_name || ''} ${kindeUser.family_name || ''}`.trim(),
        role: 'parent',
      })
      .returning();
    dbUser = newUser;
  }

  // No UI here – just render the child (role‑specific layout)
  return <>{children}</>;
}