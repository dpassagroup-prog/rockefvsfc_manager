import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function DashboardRootPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, kindeUser.id),
  });

  if (!dbUser) {
    // should have been created on first login, but just in case
    redirect('/api/auth/login');
  }

  if (dbUser.role === 'admin') {
    redirect('/dashboard/admin');
  } else {
    redirect('/dashboard/parent');
  }
}