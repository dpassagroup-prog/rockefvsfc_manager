'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function PlayerFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-4 mb-4">
      <Select
        onValueChange={(value) => handleFilterChange('ageGroup', value)}
        defaultValue={searchParams.get('ageGroup') || ''}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Age Group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          <SelectItem value="U13">U13</SelectItem>
          <SelectItem value="U14">U14</SelectItem>
          <SelectItem value="U15">U15</SelectItem>
          <SelectItem value="U17">U17</SelectItem>
          <SelectItem value="U19">U19</SelectItem>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => handleFilterChange('status', value)}
        defaultValue={searchParams.get('status') || ''}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
          <SelectItem value="transferred">Transferred</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={() => router.push('?')}>
        Clear Filters
      </Button>
    </div>
  );
}