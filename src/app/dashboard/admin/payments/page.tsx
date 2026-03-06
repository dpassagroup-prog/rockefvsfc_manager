import { db } from "@/lib/db";
import { payments, invoices, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { PaymentReviewTable } from "@/components/admin/PaymentReviewTable";
import { BackToDashboard } from "@/components/admin/BackToDashboard";

export default async function AdminPaymentsPage() {
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  if (!kindeUser) redirect('/api/auth/login');

  const pendingPayments = await db
    .select({
      id: payments.id,
      invoiceId: payments.invoiceId,
      amount: payments.amount,
      paymentDate: payments.paymentDate,
      proofUrl: payments.proofUrl,
      status: payments.status,
      parentName: users.fullName,
      parentEmail: users.email,
    })
    .from(payments)
    .leftJoin(invoices, eq(payments.invoiceId, invoices.id))
    .leftJoin(users, eq(invoices.parentId, users.id))
    .where(eq(payments.status, 'pending'))
    .orderBy(payments.createdAt);

  return (
    <div className="space-y-6">
      <BackToDashboard />
      <h1 className="text-3xl font-bold">Pending Payment Reviews</h1>
      <PaymentReviewTable payments={pendingPayments} />
    </div>
  );
}