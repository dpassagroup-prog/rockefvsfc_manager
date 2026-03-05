'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { UploadPaymentDialog } from './UploadPaymentDialog';

interface Invoice {
  id: string;
  amount: number;
  dueDate: Date;
  status: string;
  description: string | null;
}

export function ParentInvoiceList({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  return (
    <div className="grid gap-4">
      {invoices.map((invoice) => (
        <Card key={invoice.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Invoice #{invoice.id.slice(0, 8)}</span>
              <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                {invoice.status}
              </Badge>
            </CardTitle>
            <CardDescription>Due: {format(new Date(invoice.dueDate), 'dd MMM yyyy')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R {invoice.amount}</p>
            {invoice.description && <p className="text-sm text-muted-foreground mt-2">{invoice.description}</p>}
          </CardContent>
          <CardFooter className="justify-end">
            {invoice.status !== 'paid' && (
              <Button onClick={() => setSelectedInvoice(invoice)}>Upload Payment Proof</Button>
            )}
          </CardFooter>
        </Card>
      ))}
      {selectedInvoice && (
        <UploadPaymentDialog
          invoice={selectedInvoice}
          open={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onSuccess={() => router.refresh()}
        />
      )}
    </div>
  );
}