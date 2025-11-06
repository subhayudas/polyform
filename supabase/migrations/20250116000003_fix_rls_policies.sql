-- Fix RLS policies to prevent infinite recursion
-- This migration fixes the RLS policy issues that are preventing database queries

-- Drop problematic policies first
DROP POLICY IF EXISTS "Materials are publicly readable" ON public.materials;
DROP POLICY IF EXISTS "Only admins can modify materials" ON public.materials;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Fix user_roles policies to prevent recursion
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own role" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix materials policies
CREATE POLICY "Materials are publicly readable" ON public.materials
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify materials" ON public.materials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

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




