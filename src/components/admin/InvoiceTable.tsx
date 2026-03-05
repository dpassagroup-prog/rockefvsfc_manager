'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

interface Invoice {
  id: string;
  parentName: string | null;
  parentEmail: string | null;
  amount: number;
  dueDate: Date;
  status: string;
  description: string | null;
}

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Parent</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>
                {invoice.parentName || 'Unknown'}
                <span className="text-xs block text-muted-foreground">{invoice.parentEmail}</span>
              </TableCell>
              <TableCell>R {invoice.amount}</TableCell>
              <TableCell>{format(new Date(invoice.dueDate), 'dd MMM yyyy')}</TableCell>
              <TableCell>
                <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{invoice.description}</TableCell>
              <TableCell>
                {/* Add actions later: view payments, mark as paid, etc. */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}