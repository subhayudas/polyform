-- Verification Script for Orders Table Schema
-- Run this after the migration to verify everything is set up correctly

\echo '==========================================';
\echo 'ORDERS TABLE SCHEMA VERIFICATION';
\echo '==========================================';
\echo '';

-- 1. Check if orders table exists
\echo '1. Checking if orders table exists...';
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'orders'
    ) 
    THEN '✅ Orders table exists'
    ELSE '❌ Orders table NOT found'
  END AS result;
\echo '';

-- 2. Count columns
\echo '2. Counting columns (expected: 55)...';
SELECT 
  COUNT(*) as column_count,
  CASE 
    WHEN COUNT(*) = 55 THEN '✅ All columns present'
    WHEN COUNT(*) > 55 THEN '⚠️  Extra columns found'
    ELSE '❌ Missing columns'
  END AS status
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'orders';
\echo '';

-- 3. List all columns
\echo '3. Listing all columns...';
SELECT 
  ordinal_position as "#",
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'orders'
ORDER BY ordinal_position;
\echo '';

-- 4. Check foreign keys
\echo '4. Checking foreign keys (expected: 9)...';
SELECT 
  COUNT(*) as fk_count,
  CASE 
    WHEN COUNT(*) >= 9 THEN '✅ All foreign keys present'
    ELSE '⚠️  Some foreign keys missing (dependent tables may not exist)'
  END AS status
FROM information_schema.table_constraints
WHERE table_schema = 'public' 
  AND table_name = 'orders' 
  AND constraint_type = 'FOREIGN KEY';
\echo '';

-- 5. List all foreign keys
\echo '5. Listing all foreign keys...';
SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'orders' 
  AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.constraint_name;
\echo '';

-- 6. Check indexes
\echo '6. Checking indexes (expected: at least 8)...';
SELECT 
  COUNT(*) as index_count,
  CASE 
    WHEN COUNT(*) >= 8 THEN '✅ All indexes present'
    ELSE '⚠️  Some indexes missing'
  END AS status
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'orders';
\echo '';

-- 7. List all indexes
\echo '7. Listing all indexes...';
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'orders'
ORDER BY indexname;
\echo '';

-- 8. Check triggers
\echo '8. Checking triggers (expected: 3)...';
SELECT 
  COUNT(*) as trigger_count,
  CASE 
    WHEN COUNT(*) = 3 THEN '✅ All triggers present'
    ELSE '❌ Missing triggers'
  END AS status
FROM information_schema.triggers
WHERE event_object_schema = 'public' AND event_object_table = 'orders';
\echo '';

-- 9. List all triggers
\echo '9. Listing all triggers...';
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'public' AND event_object_table = 'orders'
ORDER BY trigger_name;
\echo '';

-- 10. Check constraints
\echo '10. Checking check constraints (expected: 5)...';
SELECT 
  COUNT(*) as constraint_count,
  CASE 
    WHEN COUNT(*) >= 5 THEN '✅ All check constraints present'
    ELSE '⚠️  Some check constraints missing'
  END AS status
FROM information_schema.check_constraints
WHERE constraint_schema = 'public'
  AND constraint_name LIKE 'orders_%_check';
\echo '';

-- 11. List all check constraints
\echo '11. Listing all check constraints...';
SELECT 
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_schema = 'public'
  AND constraint_name LIKE 'orders_%'
ORDER BY constraint_name;
\echo '';

-- 12. Check if order_status_history table exists (for trigger)
\echo '12. Checking if order_status_history table exists...';
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'order_status_history'
    ) 
    THEN '✅ order_status_history table exists (required for status change logging)'
    ELSE '⚠️  order_status_history table NOT found (status change logging will fail)'
  END AS result;
\echo '';

-- 13. Count existing orders
\echo '13. Counting existing orders...';
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
  COUNT(CASE WHEN status = 'in_production' THEN 1 END) as in_production_orders,
  COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
  COUNT(CASE WHEN manufacturing_process_id IS NOT NULL THEN 1 END) as orders_with_process
FROM public.orders;
\echo '';

-- 14. Check permissions
\echo '14. Checking table permissions...';
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_schema = 'public' 
  AND table_name = 'orders'
  AND grantee IN ('authenticated', 'service_role', 'anon')
ORDER BY grantee, privilege_type;
\echo '';

-- 15. Sample order (if any exist)
\echo '15. Showing sample order (if any exist)...';
SELECT 
  id,
  order_number,
  file_name,
  material,
  status,
  manufacturing_process_id IS NOT NULL as has_manufacturing_process,
  material_type_id IS NOT NULL as has_material_type,
  created_at
FROM public.orders
ORDER BY created_at DESC
LIMIT 1;
\echo '';

\echo '==========================================';
\echo 'VERIFICATION COMPLETE';
\echo '==========================================';
\echo '';
\echo 'Review the results above:';
\echo '- All ✅ marks indicate successful setup';
\echo '- ⚠️  marks indicate optional features or dependent tables';
\echo '- ❌ marks indicate missing required components';
\echo '';

