import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CreditCard, Bell } from "lucide-react";

export default function AdminDashboard() {
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">R 45,000 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payments This Month</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R 12,500</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">3 unread</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-primary/5 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Add New Player</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Register a new player and assign them to a team.
              </p>
              <button className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                Add Player
              </button>
            </div>

            <div className="bg-secondary/5 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Generate Invoice</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create and send invoices to parents.
              </p>
              <button className="w-full bg-secondary text-white py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors">
                Create Invoice
              </button>
            </div>

            <div className="bg-green-500/5 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Review Payments</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check and verify payment uploads.
              </p>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                Review Payments
              </button>
            </div>

            <div className="bg-blue-500/5 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Send Notification</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Broadcast messages to parents and players.
              </p>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Send Message
              </button>
            </div>
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
              {[
                { name: "John Smith", ageGroup: "U15", date: "2 days ago" },
                { name: "Sarah Johnson", ageGroup: "U13", date: "3 days ago" },
                { name: "Michael Brown", ageGroup: "U17", date: "5 days ago" },
                { name: "Emily Davis", ageGroup: "U14", date: "1 week ago" },
                { name: "David Wilson", ageGroup: "U19", date: "2 weeks ago" }
              ].map((player, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
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
              {[
                { type: "Payment", amount: "R 1,200", status: "Confirmed", date: "Today" },
                { type: "Invoice", amount: "R 2,500", status: "Pending", date: "Yesterday" },
                { type: "Payment", amount: "R 800", status: "Pending", date: "2 days ago" },
                { type: "Invoice", amount: "R 1,800", status: "Paid", date: "3 days ago" },
                { type: "Payment", amount: "R 1,500", status: "Confirmed", date: "1 week ago" }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{activity.type}</div>
                    <div className="text-sm text-muted-foreground">{activity.amount}</div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.status === "Confirmed" ? "bg-green-100 text-green-800" :
                      activity.status === "Paid" ? "bg-green-100 text-green-800" :
                      activity.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
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