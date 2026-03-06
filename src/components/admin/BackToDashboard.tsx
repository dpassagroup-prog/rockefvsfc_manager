'use client';

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackToDashboard() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push('/dashboard/admin')}
      className="mb-4"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Dashboard
    </Button>
  );
}