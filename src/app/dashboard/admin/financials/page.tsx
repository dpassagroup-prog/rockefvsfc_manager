import { db } from "@/lib/db";
import { invoices } from "@/lib/db/schema";
import { and, eq, lt, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function FinancialsPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  // Aggregate queries
  const totalPending = await db
    .select({ total: sql<number>`sum(${invoices.amount})` })
    .from(invoices)
    .where(eq(invoices.status, 'pending'));

  const totalPaid = await db
    .select({ total: sql<number>`sum(${invoices.amount})` })
    .from(invoices)
    .where(eq(invoices.status, 'paid'));

  const overdue = await db
    .select({ count: sql<number>`count(*)`, total: sql<number>`sum(${invoices.amount})` })
    .from(invoices)
    .where(and(eq(invoices.status, 'pending'), lt(invoices.dueDate, new Date())));

  const totalPendingAmount = totalPending[0]?.total || 0;
  const totalPaidAmount = totalPaid[0]?.total || 0;
  const overdueCount = overdue[0]?.count || 0;
  const overdueAmount = overdue[0]?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Financial Overview</h1>
        <Badge variant="outline">Updated in real-time</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Pending</CardTitle>
            <CardDescription>Invoices awaiting payment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">R {totalPendingAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Paid</CardTitle>
            <CardDescription>Amounts received</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">R {totalPaidAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Overdue Invoices</CardTitle>
            <CardDescription>Past due and pending</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
            <p className="text-sm text-muted-foreground mt-1">R {overdueAmount.toLocaleString()}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Expected Total</CardTitle>
            <CardDescription>Pending + Paid</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">R {(totalPendingAmount + totalPaidAmount).toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Paid vs Expected</span>
                <span className="font-medium">
                  {totalPaidAmount + totalPendingAmount > 0 
                    ? Math.round((totalPaidAmount / (totalPaidAmount + totalPendingAmount)) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${totalPaidAmount + totalPendingAmount > 0 ? (totalPaidAmount / (totalPaidAmount + totalPendingAmount)) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Overdue vs Pending</span>
                <span className="font-medium text-red-600">
                  {totalPendingAmount > 0 
                    ? Math.round((overdueAmount / totalPendingAmount) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${totalPendingAmount > 0 ? (overdueAmount / totalPendingAmount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}