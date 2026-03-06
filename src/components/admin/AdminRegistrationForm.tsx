'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const adminRegistrationSchema = z.object({
  // Player fields
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  ageGroup: z.enum(['U13', 'U14', 'U15', 'U17', 'U19']),
  parentId: z.string().min(1, 'Parent is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  placeOfBirth: z.string().optional(),
  mysafaId: z.string().optional(),
  nationalId: z.string().optional(),
  nationality: z.string().optional(),
  previousClub: z.string().optional(),
  position: z.string().optional(),
  season: z.string(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  medicalNotes: z.string().optional(),
  // Consent fields
  consentPhotos: z.boolean().default(false),
  consentVideos: z.boolean().default(false),
  consentTravel: z.boolean().default(false),
  termsAccepted: z.boolean().default(true),
  parentSignature: z.string().optional(),
  playerSignature: z.string().optional(),
  // Registration status – admin can set directly
  registrationStatus: z.enum(['pending', 'accepted', 'rejected']),
});

type AdminRegistrationForm = z.infer<typeof adminRegistrationSchema>;

export function AdminRegistrationForm({ parents }: { parents: { id: string; fullName: string; email: string }[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminRegistrationSchema),
    defaultValues: {
      season: '2026',
      registrationStatus: 'pending',
      consentPhotos: false,
      consentVideos: false,
      consentTravel: false,
      termsAccepted: true,
    },
  });

  const onSubmit = async (data: AdminRegistrationForm) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
      }
      router.push('/dashboard/admin/players');
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Player Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" {...register('firstName')} />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" {...register('lastName')} />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
              {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
            </div>
            <div>
              <Label htmlFor="ageGroup">Age Group *</Label>
              <Select onValueChange={(value) => setValue('ageGroup', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="U13">U13</SelectItem>
                  <SelectItem value="U14">U14</SelectItem>
                  <SelectItem value="U15">U15</SelectItem>
                  <SelectItem value="U17">U17</SelectItem>
                  <SelectItem value="U19">U19</SelectItem>
                </SelectContent>
              </Select>
              {errors.ageGroup && <p className="text-sm text-destructive">{errors.ageGroup.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="parentId">Parent *</Label>
            <Select onValueChange={(value) => setValue('parentId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select parent" />
              </SelectTrigger>
              <SelectContent>
                {parents.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.fullName} ({p.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.parentId && <p className="text-sm text-destructive">{errors.parentId.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Player's Phone</Label>
              <Input id="phone" {...register('phone')} />
            </div>
            <div>
              <Label htmlFor="address">Player's Address</Label>
              <Input id="address" {...register('address')} />
            </div>
          </div>

          {/* Additional bio fields (similar to parent form) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="placeOfBirth">Place of Birth</Label>
              <Input id="placeOfBirth" {...register('placeOfBirth')} />
            </div>
            <div>
              <Label htmlFor="nationality">Nationality</Label>
              <Input id="nationality" {...register('nationality')} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mysafaId">MySAFA ID</Label>
              <Input id="mysafaId" {...register('mysafaId')} />
            </div>
            <div>
              <Label htmlFor="nationalId">National ID / Passport</Label>
              <Input id="nationalId" {...register('nationalId')} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="previousClub">Previous Club</Label>
              <Input id="previousClub" {...register('previousClub')} />
            </div>
            <div>
              <Label htmlFor="position">Preferred Position</Label>
              <Input id="position" {...register('position')} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
              <Input id="emergencyContactName" {...register('emergencyContactName')} />
            </div>
            <div>
              <Label htmlFor="emergencyContactPhone">Emergency Contact Phone</Label>
              <Input id="emergencyContactPhone" {...register('emergencyContactPhone')} />
            </div>
          </div>

          <div>
            <Label htmlFor="medicalNotes">Medical Notes / Allergies</Label>
            <Textarea id="medicalNotes" rows={3} {...register('medicalNotes')} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consent & Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="consentPhotos" onCheckedChange={(checked) => setValue('consentPhotos', checked as boolean)} />
            <Label htmlFor="consentPhotos">Consent for photos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="consentVideos" onCheckedChange={(checked) => setValue('consentVideos', checked as boolean)} />
            <Label htmlFor="consentVideos">Consent for videos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="consentTravel" onCheckedChange={(checked) => setValue('consentTravel', checked as boolean)} />
            <Label htmlFor="consentTravel">Consent for travel</Label>
          </div>

          <div>
            <Label htmlFor="registrationStatus">Registration Status</Label>
            <Select onValueChange={(value) => setValue('registrationStatus', value as any)} defaultValue="pending">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="parentSignature">Parent Signature (optional)</Label>
            <Input id="parentSignature" {...register('parentSignature')} placeholder="Parent name" />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register Player'}
        </Button>
      </div>
    </form>
  );
}