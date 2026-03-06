import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AdminSidebar } from "@/components/dashboard/sidebar";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar 
          user={{
            given_name: kindeUser?.given_name || '',
            family_name: kindeUser?.family_name || '',
            email: kindeUser?.email || ''
          }}
        />
        <div className="flex-1">
          <header className="flex items-center justify-between px-6 py-4 border-b bg-card">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" asChild>
                <Link href="/api/auth/logout">Logout</Link>
              </Button>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
