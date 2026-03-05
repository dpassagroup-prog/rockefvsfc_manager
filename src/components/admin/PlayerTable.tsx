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
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Archive } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Player {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  ageGroup: string;
  status: string;
  parentName: string | null;
  parentEmail: string | null;
}

export function PlayerTable({ players }: { players: Player[] }) {
  const router = useRouter();

  const handleArchive = async (playerId: string) => {
    if (!confirm('Archive this player? They can be restored later.')) return;
    try {
      await fetch(`/api/admin/players/${playerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'archived' }),
      });
      router.refresh();
    } catch (error) {
      alert('Failed to archive player');
    }
  };

  const handleDelete = async (playerId: string) => {
    if (!confirm('Permanently delete this player? This action cannot be undone.')) return;
    try {
      await fetch(`/api/admin/players/${playerId}`, { method: 'DELETE' });
      router.refresh();
    } catch (error) {
      alert('Failed to delete player');
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Age Group</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id}>
              <TableCell className="font-medium">
                {player.firstName} {player.lastName}
              </TableCell>
              <TableCell>{player.ageGroup}</TableCell>
              <TableCell>
                <Badge variant={player.status === 'active' ? 'default' : 'secondary'}>
                  {player.status}
                </Badge>
              </TableCell>
              <TableCell>
                {player.parentName || 'No parent'}
                {player.parentEmail && <span className="text-xs block text-muted-foreground">{player.parentEmail}</span>}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleArchive(player.id)}>
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(player.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}