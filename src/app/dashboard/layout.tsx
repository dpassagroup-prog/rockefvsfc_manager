import { Sidebar } from "@/components/dashboard/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const kindeUser = await getUser();

  if (!kindeUser) {
    redirect("/api/auth/login");
  }

  // TypeScript now knows kindeUser is not null, but we use ! to be explicit
  const user = kindeUser!; // optional, but helps readability

  // Check if user exists in our database
  let dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, user.id),
  });

  if (!dbUser) {
    // New user – insert as parent
    const [newUser] = await db.insert(users).values({
      kindeId: user.id,
      email: user.email || '',
      fullName: `${user.given_name || ''} ${user.family_name || ''}`.trim(),
      role: 'parent',
    }).returning();
    dbUser = newUser;
  }

  // No role-based redirect here; that's handled by the root dashboard page.
  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <Sidebar 
          user={{
            given_name: user.given_name || "User",
            family_name: user.family_name || "",
            email: user.email || ""
          }} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
            <div>
              <h1 className="text-2xl font-bold">ROCKEFVSFC Manager</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user.given_name || "User"}!</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link href="/api/auth/logout">Logout</Link>
              </Button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
