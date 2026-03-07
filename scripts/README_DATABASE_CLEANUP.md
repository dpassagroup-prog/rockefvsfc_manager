# Database Cleanup Guide

This guide provides step-by-step instructions for safely removing dummy/test data from the Rockefvs FC Manager database.

## ⚠️ CRITICAL SAFETY REQUIREMENTS

**Before proceeding, you MUST:**

1. **Create a backup** using Neon Console or pg_dump
2. **Stop the application** to prevent new data from being created during cleanup
3. **Ensure you have admin access** to the database
4. **Have a rollback plan** in case something goes wrong

## 📋 Cleanup Criteria

The following patterns identify dummy/test data for deletion:

- **Users (parents)** with email containing: `test`, `example`, `dummy`, `fake`
- **Users (parents)** with fullName containing: `Test`, `Dummy`, `Fake`
- **Players** associated with dummy parents
- **Invoices** for dummy parents
- **Payments** for dummy parents

**IMPORTANT:** Admin users and real parent users will NOT be affected.

## 🚀 Execution Steps

### Step 1: Create Backup

**Option A: Using Neon Console (Recommended)**
1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Create a new branch or snapshot
4. Wait for the backup to complete

**Option B: Using pg_dump**
```bash
pg_dump "postgresql://neondb_owner:your_password@ep-tiny-morning.aws.neon.tech/rockefvs_manager2.0?sslmode=require" > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Run Dry-Run Script

Execute the dry-run script to see what will be deleted:

```bash
# Using psql
psql "your_connection_string" -f scripts/dry-run-cleanup.sql

# Or copy the SQL and run in Neon SQL Editor
```

**Review the output carefully:**
- ✅ Only dummy records should be listed
- ✅ No admin users should appear
- ✅ No real parent users should appear
- ✅ Counts should look reasonable

### Step 3: Execute Cleanup

**IMPORTANT:** Run this script inside a transaction!

```sql
-- Copy the entire content of scripts/cleanup-database.sql
-- Run it in Neon SQL Editor or via psql

BEGIN;
-- [All the DELETE statements from cleanup-database.sql]
COMMIT;
```

**OR using psql:**
```bash
psql "your_connection_string" -f scripts/cleanup-database.sql
```

**Before COMMIT, verify:**
- No errors occurred
- Row counts look correct
- Real data is still present

### Step 4: Verify Results

After successful cleanup, run these verification queries:

```sql
-- Verify no dummy users remain
SELECT COUNT(*) as remaining_dummy_users
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
  );

-- Verify admin users are still present
SELECT COUNT(*) as admin_users_count FROM users WHERE role = 'admin';

-- Verify real parent users are still present
SELECT COUNT(*) as real_parent_users_count
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
```

### Step 5: Test Application

1. **Restart the application**
2. **Log in as admin** - verify all admin functions work
3. **Log in as real parent** - verify parent dashboard shows correct data
4. **Test registration** - ensure new registrations work properly
5. **Test invoicing** - verify invoice generation still works

## 🔄 Rollback Plan

If something goes wrong:

### Option A: Restore from Neon Branch
1. Go to Neon Console
2. Switch to your backup branch
3. Copy data back to main branch

### Option B: Restore from pg_dump
```bash
psql "your_connection_string" < backup_filename.sql
```

### Option C: Manual Rollback (if transaction not committed)
```sql
ROLLBACK;
```

## 📊 Expected Results

After successful cleanup:

- **Dummy users**: 0 remaining
- **Admin users**: All preserved
- **Real parent users**: All preserved
- **Associated data**: Only dummy-related players, invoices, payments removed
- **Application functionality**: Fully preserved

## 🚨 Troubleshooting

### If you see errors during cleanup:
1. **STOP** - do not commit
2. **ROLLBACK** the transaction
3. **Review** the error message
4. **Check** foreign key constraints
5. **Adjust** the cleanup script if needed

### If real data was accidentally deleted:
1. **STOP** all application activity
2. **Restore** from backup immediately
3. **Investigate** what went wrong
4. **Adjust** criteria and try again

### If application breaks after cleanup:
1. **Check** for broken foreign key references
2. **Verify** all required data is present
3. **Restore** from backup if needed
4. **Test** thoroughly before going live

## 📝 Notes

- This cleanup only affects parent users and their associated data
- Admin users are completely safe
- The application will continue to work normally after cleanup
- New registrations will create fresh user records
- Always test thoroughly after any database operation

## 🆘 Emergency Contacts

If you encounter issues:
1. Stop all database operations
2. Restore from backup
3. Review this guide carefully
4. Consider seeking database administration assistance

---

**Remember: When in doubt, backup first and proceed slowly!**