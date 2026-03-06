'use client';

import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Check, X, Eye } from 'lucide-react';
import Link from 'next/link';

interface Registration {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  ageGroup: string;
  parentName: string | null;
  parentEmail: string | null;
  registrationStatus: string;
  createdAt: Date;
}

export function PendingRegistrationsTable({ registrations }: { registrations: Registration[] }) {
  const router = useRouter();

  const handleAccept = async (id: string) => {
    if (!confirm('Accept this registration?')) return;
    try {
      await fetch(`/api/admin/players/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      router.refresh();
    } catch (error) {
      alert('Failed to accept registration');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Reason for rejection (optional):');
    if (reason === null) return; // cancelled
    try {
      await fetch(`/api/admin/players/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', reason }),
      });
      router.refresh();
    } catch (error) {
      alert('Failed to reject registration');
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Age Group</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations.map((reg) => (
            <TableRow key={reg.id}>
              <TableCell className="font-medium">
                {reg.firstName} {reg.lastName}
                <span className="text-xs block text-muted-foreground">
                  DOB: {format(new Date(reg.dateOfBirth), 'dd MMM yyyy')}
                </span>
              </TableCell>
              <TableCell>{reg.ageGroup}</TableCell>
              <TableCell>
                {reg.parentName || 'Unknown'}
                <span className="text-xs block text-muted-foreground">{reg.parentEmail}</span>
              </TableCell>
              <TableCell>{format(new Date(reg.createdAt), 'dd MMM yyyy')}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" asChild>
                    <Link href={`/dashboard/admin/players/${reg.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleAccept(reg.id)}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReject(reg.id)}>
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {registrations.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No pending registrations
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}