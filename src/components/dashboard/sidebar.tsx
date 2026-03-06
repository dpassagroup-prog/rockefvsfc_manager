"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  CreditCard, 
  Bell, 
  Settings, 
  Home,
  Shield,
  Users,
  ClipboardList,
  UserPlus,
  LogOut 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  user: {
    given_name: string;
    family_name: string;
    email: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  
  const navigationItems = [
    {
      title: "Dashboard",
      href: "/dashboard/admin",
      icon: Home,
      description: "Overview and quick stats"
    },
    {
      title: "Players",
      href: "/dashboard/admin/players",
      icon: Users,
      description: "Manage all players"
    },
    {
      title: "Pending Registrations",
      href: "/dashboard/admin/registrations",
      icon: ClipboardList,
      description: "Review pending player registrations"
    },
    {
      title: "Register Player",
      href: "/dashboard/admin/register",
      icon: UserPlus,
      description: "Register a new player manually"
    },
    {
      title: "Invoices",
      href: "/dashboard/admin/invoices",
      icon: FileText,
      description: "View and manage invoices"
    },
    {
      title: "Payments",
      href: "/dashboard/admin/payments",
      icon: CreditCard,
      description: "Track payments and uploads"
    },
    {
      title: "Notifications",
      href: "/dashboard/admin/notifications",
      icon: Bell,
      description: "System notifications"
    },
    {
      title: "Financials",
      href: "/dashboard/admin/financials",
      icon: CreditCard,
      description: "Financial overview and summaries"
    },
    {
      title: "Settings",
      href: "/dashboard/admin/settings",
      icon: Settings,
      description: "Account and preferences"
    }
  ];

  return (
    <div className="w-64 bg-card border-r flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-lg">ROCKEFVSFC</h2>
            <p className="text-xs text-muted-foreground">Manager</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b">
        <Card>
          <CardHeader className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {user.given_name.charAt(0)}{user.family_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-sm">{user.given_name} {user.family_name}</CardTitle>
                  <CardDescription className="text-xs">{user.email}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start text-left h-auto p-3 ${
                isActive ? "bg-primary/10" : ""
              }`}
              asChild
            >
              <Link href={item.href}>
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </div>
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-2">
        <Button variant="outline" className="w-full justify-start" asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        
        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive/90" asChild>
          <Link href="/api/auth/logout">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Link>
        </Button>
      </div>
    </div>
  );
}