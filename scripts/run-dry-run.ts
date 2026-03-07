import { db } from "@/lib/db";
import { users, players, invoices, payments } from "@/lib/db/schema";
import { eq, ilike, sql } from "drizzle-orm";

async function runDryRun() {
  console.log("🔍 Starting Database Dry-Run Analysis...");
  console.log("==========================================");

  try {
    // Step 1: Identify Dummy Users (Parents)
    console.log("\n📋 STEP 1: Identifying Dummy Users (Parents)");
    console.log("==========================================");
    
    const dummyUsers = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
        createdAt: users.createdAt,
        kindeId: users.kindeId
      })
      .from(users)
      .where(
        sql`${users.role} = 'parent' AND (
          ${ilike(users.email, '%test%')} OR 
          ${ilike(users.email, '%example%')} OR 
          ${ilike(users.email, '%dummy%')} OR 
          ${ilike(users.email, '%fake%')} OR
          ${ilike(users.fullName, '%test%')} OR 
          ${ilike(users.fullName, '%dummy%')} OR 
          ${ilike(users.fullName, '%fake%')}
        )`
      );

    console.log(`Found ${dummyUsers.length} dummy users:`);
    dummyUsers.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, Name: ${user.fullName}`);
    });

    // Step 2: Identify Players Associated with Dummy Parents
    console.log("\n⚽ STEP 2: Identifying Players Associated with Dummy Parents");
    console.log("===========================================================");
    
    const dummyPlayers = await db
      .select({
        playerId: players.id,
        firstName: players.firstName,
        lastName: players.lastName,
        ageGroup: players.ageGroup,
        status: players.status,
        registrationStatus: players.registrationStatus,
        parentEmail: users.email,
        parentName: users.fullName
      })
      .from(players)
      .innerJoin(users, eq(players.parentId, users.id))
      .where(
        sql`${users.role} = 'parent' AND (
          ${ilike(users.email, '%test%')} OR 
          ${ilike(users.email, '%example%')} OR 
          ${ilike(users.email, '%dummy%')} OR 
          ${ilike(users.email, '%fake%')} OR
          ${ilike(users.fullName, '%test%')} OR 
          ${ilike(users.fullName, '%dummy%')} OR 
          ${ilike(users.fullName, '%fake%')}
        )`
      );

    console.log(`Found ${dummyPlayers.length} players associated with dummy parents:`);
    dummyPlayers.forEach(player => {
      console.log(`  - Player: ${player.firstName} ${player.lastName} (${player.ageGroup}), Parent: ${player.parentName} (${player.parentEmail})`);
    });

    // Step 3: Identify Invoices for Dummy Parents
    console.log("\n💰 STEP 3: Identifying Invoices for Dummy Parents");
    console.log("===============================================");
    
    const dummyInvoices = await db
      .select({
        invoiceId: invoices.id,
        parentId: invoices.parentId,
        amount: invoices.amount,
        status: invoices.status,
        dueDate: invoices.dueDate,
        createdAt: invoices.createdAt,
        parentEmail: users.email,
        parentName: users.fullName
      })
      .from(invoices)
      .innerJoin(users, eq(invoices.parentId, users.id))
      .where(
        sql`${users.role} = 'parent' AND (
          ${ilike(users.email, '%test%')} OR 
          ${ilike(users.email, '%example%')} OR 
          ${ilike(users.email, '%dummy%')} OR 
          ${ilike(users.email, '%fake%')} OR
          ${ilike(users.fullName, '%test%')} OR 
          ${ilike(users.fullName, '%dummy%')} OR 
          ${ilike(users.fullName, '%fake%')}
        )`
      );

    console.log(`Found ${dummyInvoices.length} invoices for dummy parents:`);
    dummyInvoices.forEach(invoice => {
      console.log(`  - Invoice ID: ${invoice.invoiceId}, Amount: R${invoice.amount}, Parent: ${invoice.parentName} (${invoice.parentEmail})`);
    });

    // Step 4: Identify Payments for Dummy Parents
    console.log("\n💳 STEP 4: Identifying Payments for Dummy Parents");
    console.log("=================================================");
    
    const dummyPayments = await db
      .select({
        paymentId: payments.id,
        invoiceId: payments.invoiceId,
        amount: payments.amount,
        status: payments.status,
        proofUrl: payments.proofUrl,
        createdAt: payments.createdAt,
        parentEmail: users.email,
        parentName: users.fullName
      })
      .from(payments)
      .innerJoin(invoices, eq(payments.invoiceId, invoices.id))
      .innerJoin(users, eq(invoices.parentId, users.id))
      .where(
        sql`${users.role} = 'parent' AND (
          ${ilike(users.email, '%test%')} OR 
          ${ilike(users.email, '%example%')} OR 
          ${ilike(users.email, '%dummy%')} OR 
          ${ilike(users.email, '%fake%')} OR
          ${ilike(users.fullName, '%test%')} OR 
          ${ilike(users.fullName, '%dummy%')} OR 
          ${ilike(users.fullName, '%fake%')}
        )`
      );

    console.log(`Found ${dummyPayments.length} payments for dummy parents:`);
    dummyPayments.forEach(payment => {
      console.log(`  - Payment ID: ${payment.paymentId}, Amount: R${payment.amount}, Invoice: ${payment.invoiceId}, Parent: ${payment.parentName} (${payment.parentEmail})`);
    });

    // Step 5: Summary
    console.log("\n📊 SUMMARY");
    console.log("===========");
    console.log(`Dummy Users (Parents): ${dummyUsers.length}`);
    console.log(`Players (associated with dummy parents): ${dummyPlayers.length}`);
    console.log(`Invoices (for dummy parents): ${dummyInvoices.length}`);
    console.log(`Payments (for dummy parents): ${dummyPayments.length}`);

    // Step 6: Verify Real Data is NOT Affected
    console.log("\n✅ VERIFICATION: Real Data Safety Check");
    console.log("========================================");
    
    const adminUsers = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(eq(users.role, 'admin'));

    const realParents = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(
        sql`${users.role} = 'parent' AND NOT (
          ${ilike(users.email, '%test%')} OR 
          ${ilike(users.email, '%example%')} OR 
          ${ilike(users.email, '%dummy%')} OR 
          ${ilike(users.email, '%fake%')} OR
          ${ilike(users.fullName, '%test%')} OR 
          ${ilike(users.fullName, '%dummy%')} OR 
          ${ilike(users.fullName, '%fake%')}
        )`
      );

    console.log(`Admin Users (protected): ${adminUsers[0]?.count || 0}`);
    console.log(`Real Parent Users (protected): ${realParents[0]?.count || 0}`);

    // Final verification
    console.log("\n🔍 FINAL VERIFICATION");
    console.log("====================");
    if (dummyUsers.length === 0 && dummyPlayers.length === 0 && dummyInvoices.length === 0 && dummyPayments.length === 0) {
      console.log("✅ No dummy data found! Database appears clean.");
    } else {
      console.log("⚠️  Dummy data identified. Review the lists above before proceeding with cleanup.");
      console.log("📝 To proceed with cleanup, run the cleanup-database.sql script inside a transaction.");
    }

    console.log("\n🎯 Dry-run completed successfully!");
    console.log("================================");

  } catch (error) {
    console.error("❌ Error during dry-run:", error);
    process.exit(1);
  }
}

// Run the dry-run
runDryRun();