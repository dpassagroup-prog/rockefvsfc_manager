import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { ProfileForm } from "@/components/parent/ProfileForm";

export default async function ParentProfilePage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, kindeUser.id),
  });

  if (!dbUser) redirect('/dashboard');

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Profile</h1>
      <ProfileForm user={dbUser} />
    </div>
  );
}