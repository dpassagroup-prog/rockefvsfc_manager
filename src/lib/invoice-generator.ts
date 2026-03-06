import { db } from '@/lib/db';
import { invoices } from '@/lib/db/schema';

/**
 * Generate invoices for a player based on the contract.
 * @param playerId - The ID of the player
 * @param parentId - The ID of the parent
 * @param season - The season year (e.g., "2026")
 */
export async function generatePlayerInvoices(playerId: string, parentId: string, season: string) {
  const registrationFee = 2700; // R2700
  const monthlyFee = 750; // R750
  const startMonth = 2; // February (1 = January, 2 = February)
  const endMonth = 12; // December

  const invoicesToCreate = [];

  // Registration fee invoice (due immediately)
  invoicesToCreate.push({
    parentId,
    amount: registrationFee,
    dueDate: new Date(), // due now
    status: 'pending' as const,
    description: `Registration fee for player ${playerId} (Season ${season})`,
  });

  // Monthly invoices from February to December
  const year = parseInt(season);
  for (let month = startMonth; month <= endMonth; month++) {
    // Due date: first day of the month at 00:00
    const dueDate = new Date(year, month - 1, 1); // month is 0-indexed in JS
    invoicesToCreate.push({
      parentId,
      amount: monthlyFee,
      dueDate,
      status: 'pending' as const,
      description: `Monthly fee for player ${playerId} (${new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' })} ${season})`,
    });
  }

  // Insert all invoices in a transaction
  await db.insert(invoices).values(invoicesToCreate);
}