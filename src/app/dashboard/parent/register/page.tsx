import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { ParentRegistrationForm } from '@/components/parent/ParentRegistrationForm';

export default async function RegisterPlayerPage() {
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  // Get the parent's database record
  const parent = await db.query.users.findFirst({
    where: eq(users.kindeId, kindeUser.id),
  });

  if (!parent) redirect('/dashboard/parent'); // shouldn't happen, but safety

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Register a New Player</h1>
      <ParentRegistrationForm parent={parent} />
    </div>
  );
}