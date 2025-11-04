-- Fix Dashboard Connection Issues
-- This migration ensures the database is properly configured for dashboard functionality

-- Ensure all tables exist and have proper structure
-- First, let's make sure the orders table has all necessary columns
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS order_number TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS file_name TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN IF NOT EXISTS material TEXT NOT NULL DEFAULT 'PLA',
ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS status order_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS priority order_priority DEFAULT 'normal',
ADD COLUMN IF NOT EXISTS estimated_delivery DATE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Ensure profiles table has proper structure
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS email TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Ensure user_roles table has proper structure
ALTER TABLE public.user_roles 
ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL CHECK (role IN ('admin', 'customer')) DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS assigned_by UUID REFERENCES auth.users(id);

-- Ensure materials table has proper structure
ALTER TABLE public.materials 
ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS name TEXT NOT NULL UNIQUE,
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL CHECK (type IN ('plastic', 'metal', 'composite', 'specialty')),
ADD COLUMN IF NOT EXISTS cost_per_gram DECIMAL(10,4) NOT NULL,
ADD COLUMN IF NOT EXISTS density DECIMAL(8,3) NOT NULL,
ADD COLUMN IF NOT EXISTS setup_cost DECIMAL(10,2) NOT NULL,
ADD COLUMN IF NOT EXISTS complexity_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS color_options TEXT[],
ADD COLUMN IF NOT EXISTS properties JSONB,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create order_number trigger if it doesn't exist
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate the trigger
DROP TRIGGER IF EXISTS set_order_number_trigger ON public.orders;
CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_order_number();

-- Ensure order_number function exists
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  counter INTEGER;
BEGIN
  -- Get the current date in YYYYMMDD format
  new_number := TO_CHAR(NOW(), 'YYYYMMDD');
  
  -- Get the count of orders for today
  SELECT COUNT(*) + 1 INTO counter
  FROM public.orders
  WHERE DATE(created_at) = CURRENT_DATE;
  
  -- Pad the counter with zeros to make it 4 digits
  new_number := new_number || LPAD(counter::TEXT, 4, '0');
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Ensure update_updated_at_column function exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create/update triggers for updated_at
DROP TRIGGER IF EXISTS update_orders_updated_at ON public.orders;
CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_materials_updated_at ON public.materials;
CREATE TRIGGER update_materials_updated_at 
  BEFORE UPDATE ON public.materials 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure all necessary indexes exist
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_id ON public.profiles(id);

-- Ensure materials have data
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

-- Grant all necessary permissions to authenticated users
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

-- Ensure storage bucket exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('order-files', 'order-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
DROP POLICY IF EXISTS "Users can upload files for their orders" ON storage.objects;
CREATE POLICY "Users can upload files for their orders" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'order-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can view files for their orders" ON storage.objects;
CREATE POLICY "Users can view files for their orders" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'order-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Admins can manage all order files" ON storage.objects;
CREATE POLICY "Admins can manage all order files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'order-files' 
    AND EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create a test order for debugging if no orders exist
DO $$
DECLARE
  test_user_id UUID;
  order_count INTEGER;
BEGIN
  -- Check if there are any orders
  SELECT COUNT(*) INTO order_count FROM public.orders;
  
  -- If no orders exist, create a test order
  IF order_count = 0 THEN
    -- Get the first user from auth.users (if any)
    SELECT id INTO test_user_id FROM auth.users LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
      INSERT INTO public.orders (
        user_id, 
        file_name, 
        material, 
        quantity, 
        price, 
        notes, 
        status
      ) VALUES (
        test_user_id,
        'test-order.stl',
        'PLA',
        1,
        25.00,
        'Test order for debugging',
        'pending'
      );
      
      -- Also create a profile for the test user if it doesn't exist
      INSERT INTO public.profiles (id, email, full_name)
      VALUES (test_user_id, 'test@example.com', 'Test User')
      ON CONFLICT (id) DO NOTHING;
      
      -- Create a user role for the test user
      INSERT INTO public.user_roles (user_id, role)
      VALUES (test_user_id, 'customer')
      ON CONFLICT (user_id) DO NOTHING;
    END IF;
  END IF;
END $$;



