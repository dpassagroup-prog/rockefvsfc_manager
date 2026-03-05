import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NotificationForm } from "@/components/admin/NotificationForm";

export default async function AdminNotificationsPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  // Fetch all parents for the recipient selection dropdown
  const parents = await db
    .select({
      id: users.id,
      name: users.fullName,
      email: users.email,
    })
    .from(users)
    .where(eq(users.role, 'parent'));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Send Notifications</h1>
      <NotificationForm parents={parents} />
    </div>
  );
}