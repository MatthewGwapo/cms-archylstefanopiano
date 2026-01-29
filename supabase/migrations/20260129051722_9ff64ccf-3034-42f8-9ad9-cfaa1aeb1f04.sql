-- Create suppliers table
CREATE TABLE public.suppliers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT,
  email TEXT,
  address TEXT,
  products TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create progress_reports table
CREATE TABLE public.progress_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  report_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  hours_worked NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'submitted',
  reviewed_by TEXT,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create employee_documents table
CREATE TABLE public.employee_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_url TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profile_update_requests table
CREATE TABLE public.profile_update_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE NOT NULL,
  requested_changes JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create material_history table for tracking material changes
CREATE TABLE public.material_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID REFERENCES public.materials(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  changed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all new tables
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_update_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_history ENABLE ROW LEVEL SECURITY;

-- Create policies for suppliers (public access for now, no auth)
CREATE POLICY "Public read access for suppliers" ON public.suppliers FOR SELECT USING (true);
CREATE POLICY "Public insert access for suppliers" ON public.suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for suppliers" ON public.suppliers FOR UPDATE USING (true);
CREATE POLICY "Public delete access for suppliers" ON public.suppliers FOR DELETE USING (true);

-- Create policies for notifications
CREATE POLICY "Public read access for notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public insert access for notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for notifications" ON public.notifications FOR UPDATE USING (true);
CREATE POLICY "Public delete access for notifications" ON public.notifications FOR DELETE USING (true);

-- Create policies for progress_reports
CREATE POLICY "Public read access for progress_reports" ON public.progress_reports FOR SELECT USING (true);
CREATE POLICY "Public insert access for progress_reports" ON public.progress_reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for progress_reports" ON public.progress_reports FOR UPDATE USING (true);
CREATE POLICY "Public delete access for progress_reports" ON public.progress_reports FOR DELETE USING (true);

-- Create policies for employee_documents
CREATE POLICY "Public read access for employee_documents" ON public.employee_documents FOR SELECT USING (true);
CREATE POLICY "Public insert access for employee_documents" ON public.employee_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for employee_documents" ON public.employee_documents FOR UPDATE USING (true);
CREATE POLICY "Public delete access for employee_documents" ON public.employee_documents FOR DELETE USING (true);

-- Create policies for profile_update_requests
CREATE POLICY "Public read access for profile_update_requests" ON public.profile_update_requests FOR SELECT USING (true);
CREATE POLICY "Public insert access for profile_update_requests" ON public.profile_update_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for profile_update_requests" ON public.profile_update_requests FOR UPDATE USING (true);
CREATE POLICY "Public delete access for profile_update_requests" ON public.profile_update_requests FOR DELETE USING (true);

-- Create policies for material_history
CREATE POLICY "Public read access for material_history" ON public.material_history FOR SELECT USING (true);
CREATE POLICY "Public insert access for material_history" ON public.material_history FOR INSERT WITH CHECK (true);

-- Create trigger for suppliers updated_at
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to log material changes
CREATE OR REPLACE FUNCTION public.log_material_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.material_history (material_id, action, old_values, new_values)
    VALUES (NEW.id, 'update', to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.material_history (material_id, action, new_values)
    VALUES (NEW.id, 'create', to_jsonb(NEW));
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for material history logging
CREATE TRIGGER log_material_changes
  AFTER INSERT OR UPDATE ON public.materials
  FOR EACH ROW
  EXECUTE FUNCTION public.log_material_change();