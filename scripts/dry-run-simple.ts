import { neon } from '@neondatabase/serverless';

async function runDryRun() {
  console.log("🔍 Starting Database Dry-Run Analysis...");
  console.log("==========================================");

  // Database connection string
  const connectionString = "postgresql://neondb_owner:npg_cPN7a2rKAUBH@ep-tiny-morning-abdhhora-pooler.eu-west-2.aws.neon.tech/rockefvs_manager2.0?sslmode=require&channel_binding=require";
  const sql = neon(connectionString);

  try {
    // Step 1: Identify Dummy Users (Parents)
    console.log("\n📋 STEP 1: Identifying Dummy Users (Parents)");
    console.log("==========================================");
    
    const dummyUsers = await sql`
      SELECT id, email, full_name, role, created_at, kinde_id
      FROM users 
      WHERE role = 'parent' 
        AND (
          email ILIKE '%test%' 
          OR email ILIKE '%example%' 
          OR email ILIKE '%dummy%' 
          OR email ILIKE '%fake%'
          OR full_name ILIKE '%test%'
          OR full_name ILIKE '%dummy%'
          OR full_name ILIKE '%fake%'
        )
      ORDER BY created_at;
    `;
    console.log(`Found ${dummyUsers.length} dummy users:`);
    dummyUsers.forEach(user => {
      console.log(`  - ID: ${user.id}, Email: ${user.email}, Name: ${user.full_name}`);
    });

    // Step 2: Identify Players Associated with Dummy Parents
    console.log("\n⚽ STEP 2: Identifying Players Associated with Dummy Parents");
    console.log("===========================================================");
    
    const dummyPlayers = await sql`
      SELECT p.id as player_id, p.first_name, p.last_name, p.age_group, p.status, p.registration_status,
             u.email as parent_email, u.full_name as parent_name
      FROM players p 
      JOIN users u ON p.parent_id = u.id 
      WHERE u.role = 'parent' 
        AND (
          u.email ILIKE '%test%' 
          OR u.email ILIKE '%example%' 
          OR u.email ILIKE '%dummy%' 
          OR u.email ILIKE '%fake%'
          OR u.full_name ILIKE '%test%'
          OR u.full_name ILIKE '%dummy%'
          OR u.full_name ILIKE '%fake%'
        )
      ORDER BY u.created_at, p.created_at;
    `;
    console.log(`Found ${dummyPlayers.length} players associated with dummy parents:`);
    dummyPlayers.forEach(player => {
      console.log(`  - Player: ${player.first_name} ${player.last_name} (${player.age_group}), Parent: ${player.parent_name} (${player.parent_email})`);
    });

    // Step 3: Identify Invoices for Dummy Parents
    console.log("\n💰 STEP 3: Identifying Invoices for Dummy Parents");
    console.log("===============================================");
    
    const dummyInvoices = await sql`
      SELECT i.id as invoice_id, i.parent_id, i.amount, i.status, i.due_date, i.created_at,
             u.email as parent_email, u.full_name as parent_name
      FROM invoices i 
      JOIN users u ON i.parent_id = u.id
      WHERE u.role = 'parent' 
        AND (
          u.email ILIKE '%test%' 
          OR u.email ILIKE '%example%' 
          OR u.email ILIKE '%dummy%' 
          OR u.email ILIKE '%fake%'
          OR u.full_name ILIKE '%test%'
          OR u.full_name ILIKE '%dummy%'
          OR u.full_name ILIKE '%fake%'
        )
      ORDER BY u.created_at, i.created_at;
    `;
    console.log(`Found ${dummyInvoices.length} invoices for dummy parents:`);
    dummyInvoices.forEach(invoice => {
      console.log(`  - Invoice ID: ${invoice.invoice_id}, Amount: R${invoice.amount}, Parent: ${invoice.parent_name} (${invoice.parent_email})`);
    });

    // Step 4: Identify Payments for Dummy Parents
    console.log("\n💳 STEP 4: Identifying Payments for Dummy Parents");
    console.log("=================================================");
    
    const dummyPayments = await sql`
      SELECT p.id as payment_id, p.invoice_id, p.amount, p.status, p.proof_url, p.created_at,
             i.parent_id, u.email as parent_email, u.full_name as parent_name
      FROM payments p 
      JOIN invoices i ON p.invoice_id = i.id
      JOIN users u ON i.parent_id = u.id
      WHERE u.role = 'parent' 
        AND (
          u.email ILIKE '%test%' 
          OR u.email ILIKE '%example%' 
          OR u.email ILIKE '%dummy%' 
          OR u.email ILIKE '%fake%'
          OR u.full_name ILIKE '%test%'
          OR u.full_name ILIKE '%dummy%'
          OR u.full_name ILIKE '%fake%'
        )
      ORDER BY u.created_at, i.created_at, p.created_at;
    `;
    console.log(`Found ${dummyPayments.length} payments for dummy parents:`);
    dummyPayments.forEach(payment => {
      console.log(`  - Payment ID: ${payment.payment_id}, Amount: R${payment.amount}, Invoice: ${payment.invoice_id}, Parent: ${payment.parent_name} (${payment.parent_email})`);
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
    
    const adminUsers = await sql`
      SELECT COUNT(*) as count
      FROM users 
      WHERE role = 'admin';
    `;
    
    const realParents = await sql`
      SELECT COUNT(*) as count
      FROM users 
      WHERE role = 'parent' 
        AND NOT (
          email ILIKE '%test%' 
          OR email ILIKE '%example%' 
          OR email ILIKE '%dummy%' 
          OR email ILIKE '%fake%'
          OR full_name ILIKE '%test%'
          OR full_name ILIKE '%dummy%'
          OR full_name ILIKE '%fake%'
        );
    `;
    
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