import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { AdminRegistrationForm } from '@/components/admin/AdminRegistrationForm';

export default async function AdminRegisterPlayerPage() {
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  // Fetch all parents for dropdown
  const parents = await db.query.users.findMany({
    where: eq(users.role, 'parent'),
    orderBy: (users, { asc }) => [asc(users.fullName)],
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Register New Player (Admin)</h1>
      <AdminRegistrationForm parents={parents} />
    </div>
  );
}