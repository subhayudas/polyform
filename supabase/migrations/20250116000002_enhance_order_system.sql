-- Enhanced Order Management System Migration
-- This migration adds advanced features to the existing order system

-- Enhance the existing orders table with additional columns
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS infill_percentage INTEGER DEFAULT 20 CHECK (infill_percentage >= 0 AND infill_percentage <= 100),
ADD COLUMN IF NOT EXISTS layer_height DECIMAL(4,3) DEFAULT 0.2,
ADD COLUMN IF NOT EXISTS support_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS post_processing TEXT[],
ADD COLUMN IF NOT EXISTS estimated_weight DECIMAL(8,3),
ADD COLUMN IF NOT EXISTS estimated_volume DECIMAL(10,3),
ADD COLUMN IF NOT EXISTS estimated_print_time INTEGER, -- in minutes
ADD COLUMN IF NOT EXISTS production_notes TEXT,
ADD COLUMN IF NOT EXISTS shipping_address JSONB,
ADD COLUMN IF NOT EXISTS billing_address JSONB,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancelled_reason TEXT,
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES auth.users(id);

-- Create order status history table
CREATE TABLE IF NOT EXISTS public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order files table for storing uploaded files
CREATE TABLE IF NOT EXISTS public.order_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  file_category TEXT CHECK (file_category IN ('model', 'reference', 'instruction', 'result')),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table for multi-item orders
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  material_id UUID REFERENCES public.materials(id) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  specifications JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pricing templates table
CREATE TABLE IF NOT EXISTS public.pricing_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  material_id UUID REFERENCES public.materials(id),
  base_cost DECIMAL(10,2) NOT NULL,
  complexity_multiplier DECIMAL(4,2) DEFAULT 1.0,
  quantity_discounts JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create production queue table
CREATE TABLE IF NOT EXISTS public.production_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  priority INTEGER DEFAULT 0,
  estimated_start TIMESTAMP WITH TIME ZONE,
  estimated_completion TIMESTAMP WITH TIME ZONE,
  assigned_machine TEXT,
  assigned_operator UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'queued' CHECK (status IN ('queued', 'in_progress', 'completed', 'failed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer feedback table
CREATE TABLE IF NOT EXISTS public.order_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all new tables
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for order_status_history
CREATE POLICY "Users can view status history for their orders" ON public.order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    ) OR public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can insert status history" ON public.order_status_history
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for order_files
CREATE POLICY "Users can view files for their orders" ON public.order_files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    ) OR public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can upload files for their orders" ON public.order_files
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all files" ON public.order_files
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for order_items
CREATE POLICY "Users can view items for their orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    ) OR public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can create items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all items" ON public.order_items
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for pricing_templates
CREATE POLICY "Pricing templates are publicly readable" ON public.pricing_templates
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify pricing templates" ON public.pricing_templates
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for production_queue
CREATE POLICY "Admins can manage production queue" ON public.production_queue
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for order_feedback
CREATE POLICY "Users can view feedback for their orders" ON public.order_feedback
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    ) OR public.get_user_role(auth.uid()) = 'admin'
  );

CREATE POLICY "Users can create feedback for their orders" ON public.order_feedback
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE id = order_id AND user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON public.order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_files_order_id ON public.order_files(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_production_queue_status ON public.production_queue(status);
CREATE INDEX IF NOT EXISTS idx_production_queue_priority ON public.production_queue(priority);

-- Create functions for order management
CREATE OR REPLACE FUNCTION public.update_order_status(
  order_id UUID,
  new_status TEXT,
  changed_by UUID DEFAULT NULL,
  change_reason TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  old_status TEXT;
BEGIN
  -- Get current status
  SELECT status::TEXT INTO old_status FROM public.orders WHERE id = order_id;
  
  -- Update the order status
  UPDATE public.orders 
  SET status = new_status::order_status, updated_at = NOW()
  WHERE id = order_id;
  
  -- Insert into status history
  INSERT INTO public.order_status_history (order_id, old_status, new_status, changed_by, change_reason)
  VALUES (order_id, old_status, new_status, changed_by, change_reason);
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate order total
CREATE OR REPLACE FUNCTION public.calculate_order_total(order_id UUID)
RETURNS DECIMAL(10,2) AS $$
DECLARE
  total DECIMAL(10,2);
BEGIN
  SELECT COALESCE(SUM(total_price), 0) INTO total
  FROM public.order_items
  WHERE order_id = calculate_order_total.order_id;
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to tables that need updated_at
CREATE TRIGGER update_pricing_templates_updated_at 
  BEFORE UPDATE ON public.pricing_templates 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_production_queue_updated_at 
  BEFORE UPDATE ON public.production_queue 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to log status changes
CREATE OR REPLACE FUNCTION public.log_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.order_status_history (order_id, old_status, new_status, changed_by)
    VALUES (NEW.id, OLD.status::TEXT, NEW.status::TEXT, auth.uid());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER log_order_status_change_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.log_order_status_change();

-- Create storage bucket for order files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('order-files', 'order-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for order files
CREATE POLICY "Users can upload files for their orders" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'order-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view files for their orders" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'order-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can manage all order files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'order-files' 
    AND public.get_user_role(auth.uid()) = 'admin'
  );

-- Create view for order summary
CREATE OR REPLACE VIEW public.order_summary AS
SELECT 
  o.id,
  o.order_number,
  o.status,
  o.priority,
  o.created_at,
  o.estimated_delivery,
  o.price,
  o.quantity,
  o.file_name,
  o.material,
  m.name as material_name,
  m.type as material_type,
  p.full_name as customer_name,
  p.email as customer_email,
  p.company as customer_company,
  COUNT(oi.id) as item_count,
  COALESCE(SUM(oi.total_price), o.price) as calculated_total
FROM public.orders o
LEFT JOIN public.materials m ON o.material_id = m.id
LEFT JOIN public.profiles p ON o.user_id = p.id
LEFT JOIN public.order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.order_number, o.status, o.priority, o.created_at, o.estimated_delivery, 
         o.price, o.quantity, o.file_name, o.material, m.name, m.type, p.full_name, p.email, p.company;

-- Grant necessary permissions
GRANT SELECT ON public.order_summary TO authenticated;
GRANT SELECT ON public.materials TO authenticated;
GRANT SELECT ON public.pricing_templates TO authenticated;
