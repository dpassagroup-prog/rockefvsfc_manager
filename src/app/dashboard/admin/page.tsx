import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, FileText, CreditCard, Bell } from "lucide-react";

export default function AdminDashboard() {
  // Stats (mock data – replace with real data from an API later if needed)
  const stats = {
    totalPlayers: 150,
    newPlayersThisMonth: 12,
    pendingInvoices: 23,
    pendingInvoicesTotal: 45000,
    paymentsThisMonth: 12500,
    paymentsGrowth: 8,
    notifications: 5,
    unreadNotifications: 3,
  };

  const recentPlayers = [
    { name: "John Smith", ageGroup: "U15", date: "2 days ago" },
    { name: "Sarah Johnson", ageGroup: "U13", date: "3 days ago" },
    { name: "Michael Brown", ageGroup: "U17", date: "5 days ago" },
    { name: "Emily Davis", ageGroup: "U14", date: "1 week ago" },
    { name: "David Wilson", ageGroup: "U19", date: "2 weeks ago" },
  ];

  const recentFinancial = [
    { type: "Payment", amount: "R 1,200", status: "Confirmed", date: "Today" },
    { type: "Invoice", amount: "R 2,500", status: "Pending", date: "Yesterday" },
    { type: "Payment", amount: "R 800", status: "Pending", date: "2 days ago" },
    { type: "Invoice", amount: "R 1,800", status: "Paid", date: "3 days ago" },
    { type: "Payment", amount: "R 1,500", status: "Confirmed", date: "1 week ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the ROCKEFVSFC Management System</p>
        </div>
        <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg">
          <h2 className="font-semibold">Administrator Access</h2>
          <p className="text-sm opacity-90">Full system control</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          title="Total Players"
          value={stats.totalPlayers}
          subtitle={`+${stats.newPlayersThisMonth} this month`}
        />
        <StatCard
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          title="Pending Invoices"
          value={stats.pendingInvoices}
          subtitle={`R ${stats.pendingInvoicesTotal.toLocaleString()} total`}
        />
        <StatCard
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
          title="Payments This Month"
          value={`R ${stats.paymentsThisMonth.toLocaleString()}`}
          subtitle={`+${stats.paymentsGrowth}% from last month`}
        />
        <StatCard
          icon={<Bell className="h-4 w-4 text-muted-foreground" />}
          title="Notifications"
          value={stats.notifications}
          subtitle={`${stats.unreadNotifications} unread`}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title="Add New Player"
              description="Register a new player and assign them to a team."
              buttonText="Add Player"
              href="/dashboard/admin/players"
            />
            <ActionCard
              title="Generate Invoice"
              description="Create and send invoices to parents."
              buttonText="Create Invoice"
              href="/dashboard/admin/invoices"
            />
            <ActionCard
              title="Review Payments"
              description="Check and verify payment uploads."
              buttonText="Review Payments"
              href="/dashboard/admin/payments"
            />
            <ActionCard
              title="Send Notification"
              description="Broadcast messages to parents and players."
              buttonText="Send Message"
              href="/dashboard/admin/notifications"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Player Registrations</CardTitle>
            <CardDescription>Last 5 new players</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPlayers.map((player, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{player.name}</div>
                    <div className="text-sm text-muted-foreground">{player.ageGroup}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{player.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Financial Activity</CardTitle>
            <CardDescription>Latest payments and invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentFinancial.map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{activity.type}</div>
                    <div className="text-sm text-muted-foreground">{activity.amount}</div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.status === "Confirmed" || activity.status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {activity.status}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{activity.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper components (can be moved to separate files later, but fine here)
function StatCard({ icon, title, value, subtitle }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function ActionCard({ title, description, buttonText, href }: any) {
  return (
    <div className="bg-primary/5 p-4 rounded-lg border">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <Link href={href} passHref>
        <Button className="w-full" size="sm">
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}