import { db } from "@/lib/db";
import { invoices, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { InvoiceTable } from "@/components/admin/InvoiceTable";
import { CreateInvoiceDialog } from "@/components/admin/CreateInvoiceDialog";

export default async function AdminInvoicesPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  const allInvoices = await db
    .select({
      id: invoices.id,
      parentId: invoices.parentId,
      parentName: users.fullName,
      parentEmail: users.email,
      amount: invoices.amount,
      dueDate: invoices.dueDate,
      status: invoices.status,
      description: invoices.description,
      createdAt: invoices.createdAt,
    })
    .from(invoices)
    .leftJoin(users, eq(invoices.parentId, users.id))
    .orderBy(invoices.createdAt);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <CreateInvoiceDialog />
      </div>
      <InvoiceTable invoices={allInvoices} />
    </div>
  );
}