import { db } from "@/lib/db";
import { players, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PlayerTable } from "@/components/admin/PlayerTable";
import { AddPlayerDialog } from "@/components/admin/AddPlayerDialog";
import { BackToDashboard } from "@/components/admin/BackToDashboard";

// Allowed age groups (must match schema)
const allowedAgeGroups = ['U13', 'U14', 'U15', 'U17', 'U19'] as const;
// Allowed statuses (must match schema)
const allowedStatuses = ['active', 'archived', 'transferred'] as const;

export default async function AdminPlayersPage({
  searchParams,
}: {
  searchParams: { ageGroup?: string; status?: string };
}) {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  // Build base query
  let query = db
    .select({
      id: players.id,
      firstName: players.firstName,
      lastName: players.lastName,
      dateOfBirth: players.dateOfBirth,
      ageGroup: players.ageGroup,
      status: players.status,
      parentName: users.fullName,
      parentEmail: users.email,
    })
    .from(players)
    .leftJoin(users, eq(players.parentId, users.id));

  // Apply filters conditionally with validation
  let conditions: any[] = [];

  // Validate and add ageGroup filter
  if (searchParams.ageGroup && allowedAgeGroups.includes(searchParams.ageGroup as any)) {
    conditions.push(eq(players.ageGroup, searchParams.ageGroup as typeof allowedAgeGroups[number]));
  }

  // Validate and add status filter
  if (searchParams.status && allowedStatuses.includes(searchParams.status as any)) {
    conditions.push(eq(players.status, searchParams.status as typeof allowedStatuses[number]));
  }

  if (conditions.length > 0) {
    // TypeScript workaround: cast to the same type after applying where
    query = query.where(and(...conditions)) as typeof query;
  }

  const allPlayers = await query.orderBy(players.createdAt);

  return (
    <div className="space-y-6">
      <BackToDashboard />
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Player Management</h1>
        <AddPlayerDialog />
      </div>
      <PlayerTable players={allPlayers} />
    </div>
  );
}
