-- Database Cleanup Script: Remove Dummy/Test Data
-- This script deletes all dummy/test records in the correct order
-- CRITICAL: Run this ONLY after:
-- 1. Creating a backup (use Neon Console or pg_dump)
-- 2. Running the dry-run script and verifying results
-- 3. Confirming that only dummy data will be deleted

-- IMPORTANT: This script MUST be run inside a transaction
-- If anything goes wrong, you can ROLLBACK before COMMIT

-- ========================================
-- TRANSACTION START
-- ========================================
BEGIN;

-- ========================================
-- STEP 1: Delete Payments (they reference invoices)
-- ========================================
DELETE FROM payments 
WHERE invoice_id IN (
  SELECT i.id FROM invoices i 
  WHERE i.parent_id IN (
    SELECT u.id FROM users u 
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
  )
);

-- ========================================
-- STEP 2: Delete Invoices (they reference parents)
-- ========================================
DELETE FROM invoices 
WHERE parent_id IN (
  SELECT u.id FROM users u 
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
);

-- ========================================
-- STEP 3: Delete Players (they reference parents)
-- ========================================
DELETE FROM players 
WHERE parent_id IN (
  SELECT u.id FROM users u 
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
);

-- ========================================
-- STEP 4: Delete Dummy Parent Users (they are the root)
-- ========================================
DELETE FROM users 
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

-- ========================================
-- TRANSACTION END
-- ========================================
-- IMPORTANT: Before running COMMIT, verify:
-- 1. No errors occurred during deletion
-- 2. Check row counts to ensure correct number of records were deleted
-- 3. Verify that real data (admins, real parents) still exists

-- If everything looks good, run:
-- COMMIT;

-- If something went wrong, run:
-- ROLLBACK;

-- ========================================
-- VERIFICATION QUERIES (run after COMMIT)
-- ========================================
-- These queries should be run AFTER the transaction is committed
-- to verify the cleanup was successful

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
SELECT COUNT(*) as admin_users_count
FROM users 
WHERE role = 'admin';

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

-- ========================================
-- CRITICAL SAFETY NOTES
-- ========================================
-- 1. ALWAYS backup first using Neon Console or pg_dump
-- 2. ALWAYS run the dry-run script first to see what will be deleted
-- 3. ALWAYS run this script inside a transaction (BEGIN; ... COMMIT;)
-- 4. ALWAYS verify results before committing
-- 5. If in doubt, ROLLBACK and restore from backup
-- 6. Test the application thoroughly after cleanup