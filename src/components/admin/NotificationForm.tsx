'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const notificationSchema = z.object({
  recipientType: z.enum(['all', 'single', 'ageGroup']),
  parentId: z.string().optional(),
  ageGroup: z.enum(['U13', 'U14', 'U15', 'U17', 'U19']).optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

type NotificationForm = z.infer<typeof notificationSchema>;

export function NotificationForm({ parents }: { parents: { id: string; name: string; email: string }[] }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<NotificationForm>({
    resolver: zodResolver(notificationSchema),
    defaultValues: { recipientType: 'all' },
  });

  const recipientType = watch('recipientType');

  const onSubmit = async (data: NotificationForm) => {
    setSending(true);
    try {
      const res = await fetch('/api/admin/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to send');
      alert('Notification sent successfully!');
      reset();
      router.refresh();
    } catch (error) {
      alert('Failed to send notification');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compose Notification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Recipient Type</Label>
            <Select
              onValueChange={(value) => setValue('recipientType', value as any)}
              defaultValue="all"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipient type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parents</SelectItem>
                <SelectItem value="single">Single Parent</SelectItem>
                <SelectItem value="ageGroup">Age Group</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recipientType === 'single' && (
            <div>
              <Label>Select Parent</Label>
              <Select onValueChange={(value) => setValue('parentId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a parent" />
                </SelectTrigger>
                <SelectContent>
                  {parents.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {recipientType === 'ageGroup' && (
            <div>
              <Label>Select Age Group</Label>
              <Select onValueChange={(value) => setValue('ageGroup', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="U13">U13</SelectItem>
                  <SelectItem value="U14">U14</SelectItem>
                  <SelectItem value="U15">U15</SelectItem>
                  <SelectItem value="U17">U17</SelectItem>
                  <SelectItem value="U19">U19</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...register('subject')} />
            {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} {...register('message')} />
            {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={sending}>
              {sending ? 'Sending...' : 'Send Notification'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}