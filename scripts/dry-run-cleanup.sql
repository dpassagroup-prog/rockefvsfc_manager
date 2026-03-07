-- Dry-Run Script: Identify Dummy/Test Data for Deletion
-- This script lists all records that match dummy data criteria
-- Run this FIRST to see what will be deleted

-- CRITERIA FOR DUMMY DATA:
-- 1. Users (parents) with email containing 'test', 'example', 'dummy', 'fake'
-- 2. Users with fullName containing 'Test', 'Dummy', 'Fake'
-- 3. Players associated with dummy parents
-- 4. Invoices and payments for dummy parents

-- IMPORTANT: Review this output carefully before proceeding with deletion

-- ========================================
-- STEP 1: Identify Dummy Users (Parents)
-- ========================================
SELECT 
    'DUMMY USERS (PARENTS)' as category,
    id,
    email,
    full_name,
    role,
    created_at,
    kinde_id
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

-- ========================================
-- STEP 2: Identify Players Associated with Dummy Parents
-- ========================================
SELECT 
    'PLAYERS (ASSOCIATED WITH DUMMY PARENTS)' as category,
    p.id,
    p.first_name,
    p.last_name,
    p.age_group,
    p.status,
    p.registration_status,
    u.email as parent_email,
    u.full_name as parent_name
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

-- ========================================
-- STEP 3: Identify Invoices for Dummy Parents
-- ========================================
SELECT 
    'INVOICES (FOR DUMMY PARENTS)' as category,
    i.id,
    i.parent_id,
    i.amount,
    i.status,
    i.season,
    i.created_at,
    u.email as parent_email,
    u.full_name as parent_name
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

-- ========================================
-- STEP 4: Identify Payments for Dummy Parents
-- ========================================
SELECT 
    'PAYMENTS (FOR DUMMY PARENTS)' as category,
    p.id,
    p.invoice_id,
    p.amount,
    p.status,
    p.payment_method,
    p.created_at,
    i.parent_id,
    u.email as parent_email,
    u.full_name as parent_name
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

-- ========================================
-- STEP 5: Count Summary
-- ========================================
SELECT 
    'SUMMARY' as category,
    'Dummy Users (Parents)' as item,
    COUNT(*) as count
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

UNION ALL

SELECT 
    'SUMMARY' as category,
    'Players (associated with dummy parents)' as item,
    COUNT(*) as count
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

UNION ALL

SELECT 
    'SUMMARY' as category,
    'Invoices (for dummy parents)' as item,
    COUNT(*) as count
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

UNION ALL

SELECT 
    'SUMMARY' as category,
    'Payments (for dummy parents)' as item,
    COUNT(*) as count
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
  );

-- ========================================
-- STEP 6: Verify Real Data is NOT Affected
-- ========================================
-- This shows that admin users and real parents are NOT included
SELECT 
    'VERIFICATION' as category,
    role,
    COUNT(*) as count
FROM users 
WHERE role = 'admin' 
   OR (role = 'parent' AND NOT (
    email ILIKE '%test%' 
    OR email ILIKE '%example%' 
    OR email ILIKE '%dummy%' 
    OR email ILIKE '%fake%'
    OR full_name ILIKE '%test%'
    OR full_name ILIKE '%dummy%'
    OR full_name ILIKE '%fake%'
  ))
GROUP BY role;

-- ========================================
-- CRITICAL: Before proceeding, verify:
-- 1. Only dummy/test records are listed above
-- 2. No real admin users are included
-- 3. No real parent users are included
-- 4. The counts look reasonable
-- ========================================