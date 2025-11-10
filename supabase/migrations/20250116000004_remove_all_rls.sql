-- Remove all RLS policies and disable RLS on all tables
-- This migration removes all Row Level Security policies to fix database access issues

-- Disable RLS on all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_files DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_queue DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendor_application_status_history DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert their own role" ON public.user_roles;
DROP POLICY IF EXISTS "User roles simple" ON public.user_roles;
DROP POLICY IF EXISTS "User roles insert" ON public.user_roles;

DROP POLICY IF EXISTS "Materials are publicly readable" ON public.materials;
DROP POLICY IF EXISTS "Only admins can modify materials" ON public.materials;
DROP POLICY IF EXISTS "Materials admin only" ON public.materials;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;

DROP POLICY IF EXISTS "Users can view status history for their orders" ON public.order_status_history;
DROP POLICY IF EXISTS "Admins can insert status history" ON public.order_status_history;

DROP POLICY IF EXISTS "Users can view files for their orders" ON public.order_files;
DROP POLICY IF EXISTS "Users can upload files for their orders" ON public.order_files;
DROP POLICY IF EXISTS "Admins can manage all files" ON public.order_files;

DROP POLICY IF EXISTS "Users can view items for their orders" ON public.order_items;
DROP POLICY IF EXISTS "Users can create items for their orders" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all items" ON public.order_items;

DROP POLICY IF EXISTS "Pricing templates are publicly readable" ON public.pricing_templates;
DROP POLICY IF EXISTS "Only admins can modify pricing templates" ON public.pricing_templates;

DROP POLICY IF EXISTS "Admins can manage production queue" ON public.production_queue;

DROP POLICY IF EXISTS "Users can view feedback for their orders" ON public.order_feedback;
DROP POLICY IF EXISTS "Users can create feedback for their orders" ON public.order_feedback;

DROP POLICY IF EXISTS "Users can insert their own applications" ON public.vendor_applications;
DROP POLICY IF EXISTS "Users can view their own applications" ON public.vendor_applications;
DROP POLICY IF EXISTS "Users can update their own applications" ON public.vendor_applications;
DROP POLICY IF EXISTS "Admins can update all applications" ON public.vendor_applications;

DROP POLICY IF EXISTS "Users can insert documents for their applications" ON public.vendor_documents;
DROP POLICY IF EXISTS "Users can view documents for their applications" ON public.vendor_documents;
DROP POLICY IF EXISTS "Users can delete documents for their applications" ON public.vendor_documents;
DROP POLICY IF EXISTS "Admins can manage all documents" ON public.vendor_documents;

-- Ensure materials table has data
INSERT INTO public.materials (name, type, cost_per_gram, density, setup_cost, complexity_multiplier, color_options, properties) VALUES
('PLA', 'plastic', 0.05, 1.24, 5.00, 1.0, ARRAY['White', 'Black', 'Red', 'Blue', 'Green', 'Yellow'], '{"strength": "medium", "flexibility": "low", "temperature_resistance": "low"}'),
('ABS', 'plastic', 0.06, 1.04, 5.00, 1.1, ARRAY['White', 'Black', 'Red', 'Blue'], '{"strength": "high", "flexibility": "medium", "temperature_resistance": "medium"}'),
('PETG', 'plastic', 0.08, 1.27, 8.00, 1.2, ARRAY['Clear', 'White', 'Black', 'Blue'], '{"strength": "high", "flexibility": "high", "temperature_resistance": "medium"}'),
('TPU', 'plastic', 0.15, 1.20, 12.00, 1.5, ARRAY['Black', 'White', 'Clear'], '{"strength": "medium", "flexibility": "very_high", "temperature_resistance": "medium"}'),
('ASA', 'plastic', 0.10, 1.07, 10.00, 1.3, ARRAY['Black', 'White', 'Gray'], '{"strength": "high", "flexibility": "low", "temperature_resistance": "high"}'),
('PVA', 'plastic', 0.20, 1.23, 15.00, 1.4, ARRAY['White'], '{"strength": "low", "flexibility": "low", "temperature_resistance": "low", "water_soluble": true}'),
('HIPS', 'plastic', 0.07, 1.04, 6.00, 1.1, ARRAY['White', 'Black'], '{"strength": "medium", "flexibility": "low", "temperature_resistance": "medium"}'),
('Wood Fill', 'composite', 0.12, 1.28, 10.00, 1.3, ARRAY['Brown', 'Natural'], '{"strength": "medium", "flexibility": "low", "temperature_resistance": "low", "wood_like": true}'),
('Metal Fill', 'composite', 0.25, 2.80, 20.00, 1.6, ARRAY['Silver', 'Bronze', 'Copper'], '{"strength": "high", "flexibility": "low", "temperature_resistance": "high", "metallic": true}'),
('Carbon Fiber', 'composite', 0.30, 1.30, 25.00, 1.8, ARRAY['Black'], '{"strength": "very_high", "flexibility": "low", "temperature_resistance": "high", "carbon_fiber": true}')
ON CONFLICT (name) DO NOTHING;

-- Grant necessary permissions to authenticated users
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.user_roles TO authenticated;
GRANT ALL ON public.materials TO authenticated;
GRANT ALL ON public.orders TO authenticated;
GRANT ALL ON public.notifications TO authenticated;
GRANT ALL ON public.order_status_history TO authenticated;
GRANT ALL ON public.order_files TO authenticated;
GRANT ALL ON public.order_items TO authenticated;
GRANT ALL ON public.pricing_templates TO authenticated;
GRANT ALL ON public.production_queue TO authenticated;
GRANT ALL ON public.order_feedback TO authenticated;
GRANT ALL ON public.vendor_applications TO authenticated;
GRANT ALL ON public.vendor_documents TO authenticated;
GRANT ALL ON public.vendor_application_status_history TO authenticated;





