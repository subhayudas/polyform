-- Create basic tables first
-- This migration creates the foundational tables for the order management system

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'customer')) DEFAULT 'customer',
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id)
);

-- Create materials table
CREATE TABLE IF NOT EXISTS public.materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('plastic', 'metal', 'composite', 'specialty')),
  cost_per_gram DECIMAL(10,4) NOT NULL,
  density DECIMAL(8,3) NOT NULL, -- g/cm³
  setup_cost DECIMAL(10,2) NOT NULL,
  complexity_multiplier DECIMAL(4,2) NOT NULL DEFAULT 1.0,
  color_options TEXT[],
  properties JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order status and priority enums
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending', 
    'confirmed', 
    'in_production', 
    'quality_check', 
    'shipped', 
    'delivered', 
    'cancelled', 
    'on_hold'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_priority AS ENUM (
    'low', 
    'normal', 
    'high', 
    'urgent'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  material TEXT NOT NULL,
  material_id UUID REFERENCES public.materials(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2),
  notes TEXT,
  status order_status DEFAULT 'pending',
  priority order_priority DEFAULT 'normal',
  estimated_delivery DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  related_type TEXT,
  related_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for materials
CREATE POLICY "Materials are publicly readable" ON public.materials
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify materials" ON public.materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all orders" ON public.orders
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);

-- Create functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.user_roles
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(user_role, 'customer');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.get_user_role(user_uuid) = 'admin';
END;
$$ LANGUAGE plpgsql;

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

-- Create triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
  BEFORE UPDATE ON public.orders 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_materials_updated_at 
  BEFORE UPDATE ON public.materials 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to automatically generate order number
CREATE OR REPLACE FUNCTION public.set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := public.generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_order_number();

-- Insert default materials
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





