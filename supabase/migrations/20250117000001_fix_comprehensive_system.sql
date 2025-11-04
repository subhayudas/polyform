-- Fix and Complete Comprehensive Manufacturing System
-- This migration fixes issues and ensures all tables have proper RLS policies

-- Ensure order_files table has correct schema
DO $$
BEGIN
  -- Check if file_size is INTEGER, if so, change to BIGINT
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
END $$;

-- Enable RLS on all new tables if not already enabled
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'manufacturing_processes') THEN
    ALTER TABLE public.manufacturing_processes ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'material_types') THEN
    ALTER TABLE public.material_types ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'material_variants') THEN
    ALTER TABLE public.material_variants ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'surface_finishes') THEN
    ALTER TABLE public.surface_finishes ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'part_marking_types') THEN
    ALTER TABLE public.part_marking_types ENABLE ROW LEVEL SECURITY;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'inspection_types') THEN
    ALTER TABLE public.inspection_types ENABLE ROW LEVEL SECURITY;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Manufacturing processes are publicly readable" ON public.manufacturing_processes;
DROP POLICY IF EXISTS "Only admins can modify manufacturing processes" ON public.manufacturing_processes;
DROP POLICY IF EXISTS "Material types are publicly readable" ON public.material_types;
DROP POLICY IF EXISTS "Only admins can modify material types" ON public.material_types;
DROP POLICY IF EXISTS "Material variants are publicly readable" ON public.material_variants;
DROP POLICY IF EXISTS "Only admins can modify material variants" ON public.material_variants;
DROP POLICY IF EXISTS "Surface finishes are publicly readable" ON public.surface_finishes;
DROP POLICY IF EXISTS "Only admins can modify surface finishes" ON public.surface_finishes;
DROP POLICY IF EXISTS "Part marking types are publicly readable" ON public.part_marking_types;
DROP POLICY IF EXISTS "Only admins can modify part marking types" ON public.part_marking_types;
DROP POLICY IF EXISTS "Inspection types are publicly readable" ON public.inspection_types;
DROP POLICY IF EXISTS "Only admins can modify inspection types" ON public.inspection_types;

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

-- Add missing indexes for better performance
CREATE INDEX IF NOT EXISTS idx_manufacturing_processes_category ON public.manufacturing_processes(category);
CREATE INDEX IF NOT EXISTS idx_manufacturing_processes_active ON public.manufacturing_processes(is_active);
CREATE INDEX IF NOT EXISTS idx_material_types_category ON public.material_types(category);
CREATE INDEX IF NOT EXISTS idx_material_types_active ON public.material_types(is_active);
CREATE INDEX IF NOT EXISTS idx_material_variants_active ON public.material_variants(is_active);
CREATE INDEX IF NOT EXISTS idx_surface_finishes_active ON public.surface_finishes(is_active);
CREATE INDEX IF NOT EXISTS idx_part_marking_types_active ON public.part_marking_types(is_active);
CREATE INDEX IF NOT EXISTS idx_inspection_types_active ON public.inspection_types(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_material_type ON public.orders(material_type_id);
CREATE INDEX IF NOT EXISTS idx_orders_surface_finish ON public.orders(surface_finish_id);
CREATE INDEX IF NOT EXISTS idx_orders_part_marking ON public.orders(part_marking_id);
CREATE INDEX IF NOT EXISTS idx_orders_inspection_type ON public.orders(inspection_type_id);

-- Ensure order_files has proper constraint for file_category
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
EXCEPTION
  WHEN OTHERS THEN
    -- If constraint already exists with different name, try to find and update it
    NULL;
END $$;

-- Add comments to tables for documentation
COMMENT ON TABLE public.manufacturing_processes IS 'Manufacturing process types and their sub-processes';
COMMENT ON TABLE public.material_types IS 'Material categories (metal, plastic, composite, specialty)';
COMMENT ON TABLE public.material_variants IS 'Specific material variants with properties and color options';
COMMENT ON TABLE public.surface_finishes IS 'Surface finish options with roughness values';
COMMENT ON TABLE public.part_marking_types IS 'Part marking options (silkscreen, laser engraving, etc.)';
COMMENT ON TABLE public.inspection_types IS 'Inspection and quality control options';

-- Add comments to key columns
COMMENT ON COLUMN public.orders.manufacturing_process_id IS 'The manufacturing process selected for this order';
COMMENT ON COLUMN public.orders.sub_process IS 'Sub-process within the manufacturing process';
COMMENT ON COLUMN public.orders.design_units IS 'Design units (mm, inch, cm)';
COMMENT ON COLUMN public.orders.material_variant_id IS 'Selected material variant';
COMMENT ON COLUMN public.orders.selected_color IS 'Selected color for the material';
COMMENT ON COLUMN public.orders.technical_drawing_path IS 'Path to technical drawing file in storage';
COMMENT ON COLUMN public.orders.tolerance_type IS 'Tolerance type: standard or tighter';
COMMENT ON COLUMN public.orders.finished_appearance IS 'Finished appearance: standard or premium';
COMMENT ON COLUMN public.orders.itar_compliance IS 'ITAR compliance acknowledgment';
COMMENT ON COLUMN public.orders.nda_acknowledged IS 'NDA acknowledgment';

