import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users, players } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function ParentPlayersPage() {
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  const parent = await db.query.users.findFirst({
    where: eq(users.kindeId, kindeUser.id),
  });
  if (!parent) redirect('/dashboard/parent');

  const playerList = await db.query.players.findMany({
    where: eq(players.parentId, parent.id),
    orderBy: (players, { desc }) => [desc(players.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Registered Players</h1>
        <Button asChild>
          <Link href="/dashboard/parent/register">Register New Player</Link>
        </Button>
      </div>

      {playerList.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            You haven't registered any players yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {playerList.map((player) => (
            <Card key={player.id}>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span>{player.firstName} {player.lastName}</span>
                  <Badge variant={
                    player.registrationStatus === 'accepted' ? 'default' :
                    player.registrationStatus === 'rejected' ? 'destructive' : 'secondary'
                  }>
                    {player.registrationStatus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Age Group: {player.ageGroup}</div>
                  <div>Date of Birth: {player.dateOfBirth.toLocaleDateString()}</div>
                  {player.position && <div>Position: {player.position}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}