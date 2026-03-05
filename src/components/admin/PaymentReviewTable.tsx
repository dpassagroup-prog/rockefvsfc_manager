'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

interface Payment {
  id: string;
  invoiceId: string | null;
  amount: number;
  paymentDate: Date;
  proofUrl: string | null;
  status: string;
  parentName: string | null;
  parentEmail: string | null;
}

export function PaymentReviewTable({ payments }: { payments: Payment[] }) {
  const router = useRouter();

  const handleConfirm = async (paymentId: string) => {
    if (!confirm('Confirm this payment?')) return;
    try {
      await fetch(`/api/admin/payments/${paymentId}/confirm`, { method: 'POST' });
      router.refresh();
    } catch (error) {
      alert('Failed to confirm payment');
    }
  };

  const handleReject = async (paymentId: string) => {
    if (!confirm('Reject this payment? The parent will be notified.')) return;
    try {
      await fetch(`/api/admin/payments/${paymentId}/reject`, { method: 'POST' });
      router.refresh();
    } catch (error) {
      alert('Failed to reject payment');
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parent</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Proof</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                {payment.parentName || 'Unknown'}
                <span className="text-xs block text-muted-foreground">{payment.parentEmail}</span>
              </TableCell>
              <TableCell>R {payment.amount}</TableCell>
              <TableCell>{format(new Date(payment.paymentDate), 'dd MMM yyyy')}</TableCell>
              <TableCell>
                {payment.proofUrl ? (
                  <a href={payment.proofUrl} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                    View Proof
                  </a>
                ) : (
                  <span className="text-muted-foreground">No proof</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleConfirm(payment.id)}>Confirm</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleReject(payment.id)}>Reject</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}