import { db } from "@/lib/db";
import { invoices, payments, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { ParentInvoiceList } from "@/components/parent/ParentInvoiceList";

export default async function ParentInvoicesPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  // Get the parent's database user
  const parent = await db.query.users.findFirst({
    where: eq(users.kindeId, kindeUser.id),
  });
  if (!parent) redirect('/dashboard');

  const userInvoices = await db
    .select({
      id: invoices.id,
      amount: invoices.amount,
      dueDate: invoices.dueDate,
      status: invoices.status,
      description: invoices.description,
    })
    .from(invoices)
    .where(eq(invoices.parentId, parent.id))
    .orderBy(invoices.createdAt);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Invoices</h1>
      <ParentInvoiceList invoices={userInvoices} />
    </div>
  );
}