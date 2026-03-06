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

const registrationSchema = z.object({
  // Player fields
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  ageGroup: z.enum(['U13', 'U14', 'U15', 'U17', 'U19']),
  phone: z.string().optional(),
  address: z.string().optional(),
  placeOfBirth: z.string().optional(),
  mysafaId: z.string().optional(),
  nationalId: z.string().optional(),
  nationality: z.string().optional(),
  previousClub: z.string().optional(),
  position: z.string().optional(),
  season: z.string().default('2026'),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  medicalNotes: z.string().optional(),
  // Consent fields
  consentPhotos: z.boolean().default(false),
  consentVideos: z.boolean().default(false),
  consentTravel: z.boolean().default(false),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  // Parent signature (just the name, but we'll store as text)
  parentSignature: z.string().min(1, 'Parent signature is required'),
  // Optionally, parent address update (if they want to change it)
  parentAddress: z.string().optional(),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

export function ParentRegistrationForm({ parent }: { parent: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      season: '2026',
      parentAddress: parent.address || '',
    },
  });

  const onSubmit = async (data: RegistrationForm) => {
    setLoading(true);
    try {
      const res = await fetch('/api/parent/register-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Registration failed');
      }
      router.push('/dashboard/parent/players'); // we'll create this later
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Player's Phone</Label>
              <Input id="phone" {...register('phone')} />
            </div>
            <div>
              <Label htmlFor="address">Player's Address (if different from parent)</Label>
              <Input id="address" {...register('address')} />
            </div>
          </div>

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
          <CardTitle>Parent Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Your contact details are already on file: {parent.email}, {parent.phone || 'no phone'}. You can update your address below.
          </p>
          <div>
            <Label htmlFor="parentAddress">Parent's Address</Label>
            <Input id="parentAddress" {...register('parentAddress')} placeholder="Street, City, Postal Code" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consent & Agreements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="consentPhotos" onCheckedChange={(checked) => setValue('consentPhotos', checked as boolean)} />
            <Label htmlFor="consentPhotos">I consent to the use of my child's photos in club publications and media</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="consentVideos" onCheckedChange={(checked) => setValue('consentVideos', checked as boolean)} />
            <Label htmlFor="consentVideos">I consent to the use of my child's videos in club publications and media</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="consentTravel" onCheckedChange={(checked) => setValue('consentTravel', checked as boolean)} />
            <Label htmlFor="consentTravel">I consent to my child traveling with the team for away fixtures</Label>
          </div>

          <div className="mt-4 p-4 border rounded bg-muted/30">
            <h3 className="font-semibold mb-2">Terms and Conditions</h3>
            <p className="text-sm text-muted-foreground mb-4">
              By checking this box, I acknowledge that I have read, understood, and agree to all the terms and conditions outlined in the Rockefvs FC Junior Football Membership Agreement, including the financial obligations, code of conduct, and all other clauses.
            </p>
            <div className="flex items-center space-x-2">
              <Checkbox id="termsAccepted" onCheckedChange={(checked) => setValue('termsAccepted', checked as boolean)} />
              <Label htmlFor="termsAccepted" className="font-medium">I accept the terms and conditions *</Label>
            </div>
            {errors.termsAccepted && <p className="text-sm text-destructive">{errors.termsAccepted.message}</p>}
          </div>

          <div>
            <Label htmlFor="parentSignature">Parent/Legal Guardian Signature *</Label>
            <Input id="parentSignature" {...register('parentSignature')} placeholder="Type your full name as signature" />
            <p className="text-xs text-muted-foreground mt-1">Typing your name constitutes an electronic signature</p>
            {errors.parentSignature && <p className="text-sm text-destructive">{errors.parentSignature.message}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Register Player'}
        </Button>
      </div>
    </form>
  );
}