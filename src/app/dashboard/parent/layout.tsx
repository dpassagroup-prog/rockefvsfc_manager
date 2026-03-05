import { ParentSidebar } from "@/components/parent/ParentSidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  const user = {
    given_name: kindeUser?.given_name || "User",
    family_name: kindeUser?.family_name || "",
    email: kindeUser?.email || ""
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <ParentSidebar user={user} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
            <div>
              <h1 className="text-2xl font-bold">Parent Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user.given_name}!</p>
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
