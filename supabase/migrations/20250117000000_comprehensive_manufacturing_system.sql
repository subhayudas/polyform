-- Comprehensive Manufacturing System Migration
-- This migration creates tables for manufacturing processes, materials, and order configurations

-- Manufacturing Process Types
CREATE TABLE IF NOT EXISTS public.manufacturing_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  sub_processes TEXT[],
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Materials Table with Material Types
CREATE TABLE IF NOT EXISTS public.material_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL, -- metal, plastic, composite, specialty
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Material Variants (e.g., Aluminum 6061, Aluminum 7075)
CREATE TABLE IF NOT EXISTS public.material_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_type_id UUID REFERENCES public.material_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color_options TEXT[],
  cost_per_unit DECIMAL(10,4) NOT NULL,
  density DECIMAL(8,3),
  setup_cost DECIMAL(10,2) NOT NULL,
  properties JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(material_type_id, name)
);

-- Surface Finish Options
CREATE TABLE IF NOT EXISTS public.surface_finishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  roughness_value TEXT, -- e.g., "250uin/6.3um Ra"
  description TEXT,
  cost_multiplier DECIMAL(4,2) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Part Marking Options
CREATE TABLE IF NOT EXISTS public.part_marking_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- e.g., "Silkscreen", "Laser engraving"
  description TEXT,
  cost_multiplier DECIMAL(4,2) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inspection Types
CREATE TABLE IF NOT EXISTS public.inspection_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- e.g., "Standard Inspection (No report)", "CMM Inspection with Formal Report"
  requires_drawing BOOLEAN DEFAULT false,
  has_extra_fee BOOLEAN DEFAULT false,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced Orders Table with all configuration fields
ALTER TABLE public.orders 
  ADD COLUMN IF NOT EXISTS manufacturing_process_id UUID REFERENCES public.manufacturing_processes(id),
  ADD COLUMN IF NOT EXISTS sub_process TEXT,
  ADD COLUMN IF NOT EXISTS design_units TEXT CHECK (design_units IN ('mm', 'inch', 'cm')) DEFAULT 'mm',
  ADD COLUMN IF NOT EXISTS material_type_id UUID REFERENCES public.material_types(id),
  ADD COLUMN IF NOT EXISTS material_variant_id UUID REFERENCES public.material_variants(id),
  ADD COLUMN IF NOT EXISTS selected_color TEXT,
  ADD COLUMN IF NOT EXISTS surface_finish_id UUID REFERENCES public.surface_finishes(id),
  ADD COLUMN IF NOT EXISTS technical_drawing_path TEXT,
  ADD COLUMN IF NOT EXISTS has_threads BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS threads_description TEXT,
  ADD COLUMN IF NOT EXISTS has_inserts BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS inserts_description TEXT,
  ADD COLUMN IF NOT EXISTS tolerance_type TEXT CHECK (tolerance_type IN ('standard', 'tighter')) DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS tolerance_description TEXT,
  ADD COLUMN IF NOT EXISTS surface_roughness TEXT,
  ADD COLUMN IF NOT EXISTS part_marking_id UUID REFERENCES public.part_marking_types(id),
  ADD COLUMN IF NOT EXISTS has_assembly BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS assembly_type TEXT CHECK (assembly_type IN ('no_assembly', 'assembly_test', 'ship_in_assembly')),
  ADD COLUMN IF NOT EXISTS finished_appearance TEXT CHECK (finished_appearance IN ('standard', 'premium')) DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS inspection_type_id UUID REFERENCES public.inspection_types(id),
  ADD COLUMN IF NOT EXISTS itar_compliance BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS nda_acknowledged BOOLEAN DEFAULT false;

-- Update order_files table to support technical_drawing category
-- Note: order_files table already exists from previous migration
DO $$
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'order_files_file_category_check'
  ) THEN
    ALTER TABLE public.order_files 
    DROP CONSTRAINT order_files_file_category_check;
  END IF;
  
  -- Add new constraint with all categories
  ALTER TABLE public.order_files 
  ADD CONSTRAINT order_files_file_category_check 
  CHECK (file_category IN ('model', 'reference', 'instruction', 'result', 'technical_drawing', 'other'));
  
  -- Ensure file_size is BIGINT to handle large files
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'order_files' 
    AND column_name = 'file_size' 
    AND data_type = 'integer'
  ) THEN
    ALTER TABLE public.order_files 
    ALTER COLUMN file_size TYPE BIGINT;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    -- If table doesn't exist, create it (shouldn't happen but safe)
    NULL;
END $$;

-- Insert Manufacturing Processes
INSERT INTO public.manufacturing_processes (name, category, sub_processes, description) VALUES
('CNC Machining', 'cnc', ARRAY['Milling (3-axis)', 'Milling (5-axis)', 'Turning'], 'Computer Numerical Control machining for precision parts'),
('Sheet Metal', 'sheet_metal', ARRAY['Laser cutting', 'Bending'], 'Sheet metal fabrication and forming'),
('3D Printing', '3d_printing', ARRAY['FDM', 'SLA', 'SLS', 'MJF', 'DMLS', 'Polyjet'], 'Additive manufacturing technologies'),
('Injection Molding', 'injection_molding', ARRAY[]::TEXT[], 'Plastic injection molding for high-volume production'),
('Vacuum Casting', 'vacuum_casting', ARRAY[]::TEXT[], 'Vacuum casting for prototypes and small batches')
ON CONFLICT (name) DO NOTHING;

-- Insert Material Types
INSERT INTO public.material_types (name, category, description) VALUES
('Aluminum', 'metal', 'Lightweight aluminum alloys'),
('Stainless steel', 'metal', 'Corrosion-resistant stainless steel'),
('Brass', 'metal', 'Copper-zinc alloy'),
('Copper', 'metal', 'Pure copper'),
('Titanium', 'metal', 'High-strength titanium'),
('Mild steel', 'metal', 'Low-carbon steel'),
('Alloy steel', 'metal', 'Steel with alloying elements'),
('Tool steel', 'metal', 'High-carbon steel for tooling'),
('Spring steel', 'metal', 'High-elasticity steel'),
('ABS', 'plastic', 'Acrylonitrile Butadiene Styrene'),
('Polycarbonate (PC)', 'plastic', 'High-impact polycarbonate'),
('Nylon', 'plastic', 'Polyamide plastic'),
('Polypropylene (PP)', 'plastic', 'Polypropylene thermoplastic'),
('POM', 'plastic', 'Polyoxymethylene'),
('PTFE (Teflon)', 'plastic', 'Polytetrafluoroethylene'),
('PMMA (Acrylic)', 'plastic', 'Polymethyl methacrylate'),
('Polyethylene (PE)', 'plastic', 'Polyethylene thermoplastic'),
('PEEK', 'plastic', 'Polyether ether ketone'),
('Bakelite', 'plastic', 'Phenolic resin'),
('FR4', 'composite', 'Glass-reinforced epoxy laminate'),
('Rubber', 'specialty', 'Elastomeric materials'),
('Carbon Fiber', 'composite', 'Carbon fiber composite')
ON CONFLICT (name) DO NOTHING;

-- Insert Material Variants (example: Aluminum types)
INSERT INTO public.material_variants (material_type_id, name, color_options, cost_per_unit, density, setup_cost, properties)
SELECT 
  mt.id,
  'Aluminum 6061',
  ARRAY['Silver white'],
  0.05,
  2.70,
  10.00,
  '{"yield_strength": 276, "tensile_strength": 310}'::jsonb
FROM public.material_types mt WHERE mt.name = 'Aluminum'
ON CONFLICT (material_type_id, name) DO NOTHING;

INSERT INTO public.material_variants (material_type_id, name, color_options, cost_per_unit, density, setup_cost, properties)
SELECT 
  mt.id,
  'Aluminum 7075',
  ARRAY['Silver white'],
  0.08,
  2.81,
  12.00,
  '{"yield_strength": 503, "tensile_strength": 572}'::jsonb
FROM public.material_types mt WHERE mt.name = 'Aluminum'
ON CONFLICT (material_type_id, name) DO NOTHING;

INSERT INTO public.material_variants (material_type_id, name, color_options, cost_per_unit, density, setup_cost, properties)
SELECT 
  mt.id,
  'Aluminum 5052',
  ARRAY['Silver white'],
  0.06,
  2.68,
  11.00,
  '{"yield_strength": 193, "tensile_strength": 228}'::jsonb
FROM public.material_types mt WHERE mt.name = 'Aluminum'
ON CONFLICT (material_type_id, name) DO NOTHING;

INSERT INTO public.material_variants (material_type_id, name, color_options, cost_per_unit, density, setup_cost, properties)
SELECT 
  mt.id,
  'Aluminum 2A12',
  ARRAY['Silver white'],
  0.07,
  2.78,
  11.50,
  '{"yield_strength": 324, "tensile_strength": 469}'::jsonb
FROM public.material_types mt WHERE mt.name = 'Aluminum'
ON CONFLICT (material_type_id, name) DO NOTHING;

-- Insert Surface Finishes
INSERT INTO public.surface_finishes (name, roughness_value, description, cost_multiplier) VALUES
('Standard', '250uin/6.3um Ra', 'Standard surface roughness', 1.0),
('Fine', '125uin/3.2um Ra', 'Fine surface finish', 1.2),
('Very Fine', '63uin/1.6um Ra', 'Very fine surface finish', 1.5),
('Ultra Fine', '32uin/0.8um Ra', 'Ultra fine surface finish', 2.0)
ON CONFLICT (name) DO NOTHING;

-- Insert Part Marking Types
INSERT INTO public.part_marking_types (name, description, cost_multiplier) VALUES
('Silkscreen', 'Screen printing for text and logos', 1.1),
('Laser engraving', 'Laser-etched markings', 1.15)
ON CONFLICT (name) DO NOTHING;

-- Insert Inspection Types
INSERT INTO public.inspection_types (name, requires_drawing, has_extra_fee, description) VALUES
('Standard Inspection (No report)', false, false, 'Standard dimensional and surface inspection without report'),
('Standard Inspection with Formal Report', true, true, 'Standard inspection with formal documentation'),
('CMM Inspection with Formal Report', true, true, 'Coordinate Measuring Machine inspection with detailed report'),
('Source Material Certification', true, true, 'Material certification documentation')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_manufacturing_process ON public.orders(manufacturing_process_id);
CREATE INDEX IF NOT EXISTS idx_orders_material_variant ON public.orders(material_variant_id);
CREATE INDEX IF NOT EXISTS idx_order_files_order_id ON public.order_files(order_id);
CREATE INDEX IF NOT EXISTS idx_material_variants_type ON public.material_variants(material_type_id);

-- Enable RLS on all new tables
ALTER TABLE public.manufacturing_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surface_finishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.part_marking_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_types ENABLE ROW LEVEL SECURITY;

-- RLS Policies for manufacturing_processes
CREATE POLICY "Manufacturing processes are publicly readable" ON public.manufacturing_processes
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify manufacturing processes" ON public.manufacturing_processes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for material_types
CREATE POLICY "Material types are publicly readable" ON public.material_types
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify material types" ON public.material_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for material_variants
CREATE POLICY "Material variants are publicly readable" ON public.material_variants
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify material variants" ON public.material_variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for surface_finishes
CREATE POLICY "Surface finishes are publicly readable" ON public.surface_finishes
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify surface finishes" ON public.surface_finishes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for part_marking_types
CREATE POLICY "Part marking types are publicly readable" ON public.part_marking_types
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify part marking types" ON public.part_marking_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for inspection_types
CREATE POLICY "Inspection types are publicly readable" ON public.inspection_types
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify inspection types" ON public.inspection_types
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_manufacturing_processes_updated_at 
  BEFORE UPDATE ON public.manufacturing_processes 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_material_variants_updated_at 
  BEFORE UPDATE ON public.material_variants 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

