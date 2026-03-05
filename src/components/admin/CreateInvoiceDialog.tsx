'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const invoiceSchema = z.object({
  parentId: z.string().min(1, 'Parent is required'),
  amount: z.number().min(1, 'Amount is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  description: z.string().optional(),
});

type InvoiceForm = z.infer<typeof invoiceSchema>;

// This would need a list of parents fetched from an API
// We'll use a simple select for now; later we can search

export function CreateInvoiceDialog() {
  const [open, setOpen] = useState(false);
  const [parents, setParents] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<InvoiceForm>({
    resolver: zodResolver(invoiceSchema),
  });

  // Load parents when dialog opens
  const loadParents = async () => {
    const res = await fetch('/api/admin/parents');
    if (res.ok) {
      const data = await res.json();
      setParents(data);
    }
  };

  const onSubmit = async (data: InvoiceForm) => {
    try {
      const res = await fetch('/api/admin/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create invoice');
      setOpen(false);
      reset();
      router.refresh();
    } catch (error) {
      alert('Failed to create invoice');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      setOpen(open);
      if (open) loadParents();
    }}>
      <DialogTrigger asChild>
        <Button>Create Invoice</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="parentId">Parent</Label>
            <Select onValueChange={(value) => setValue('parentId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select parent" />
              </SelectTrigger>
              <SelectContent>
                {parents.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.parentId && <p className="text-sm text-destructive">{errors.parentId.message}</p>}
          </div>
          <div>
            <Label htmlFor="amount">Amount (R)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Input id="dueDate" type="date" {...register('dueDate')} />
            {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input id="description" {...register('description')} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}