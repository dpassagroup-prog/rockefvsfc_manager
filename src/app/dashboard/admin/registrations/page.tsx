import { db } from '@/lib/db';
import { players, users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PendingRegistrationsTable } from '@/components/admin/PendingRegistrationsTable';

export default async function AdminRegistrationsPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  const pendingPlayers = await db
    .select({
      id: players.id,
      firstName: players.firstName,
      lastName: players.lastName,
      dateOfBirth: players.dateOfBirth,
      ageGroup: players.ageGroup,
      parentName: users.fullName,
      parentEmail: users.email,
      registrationStatus: players.registrationStatus,
      createdAt: players.createdAt,
    })
    .from(players)
    .leftJoin(users, eq(players.parentId, users.id))
    .where(eq(players.registrationStatus, 'pending'))
    .orderBy(players.createdAt);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pending Registrations</h1>
      <PendingRegistrationsTable registrations={pendingPlayers} />
    </div>
  );
}