-- Create enum types for statuses
CREATE TYPE public.project_status AS ENUM ('planning', 'in-progress', 'on-hold', 'completed');
CREATE TYPE public.employee_status AS ENUM ('active', 'on-site', 'leave', 'inactive');
CREATE TYPE public.payment_status AS ENUM ('pending', 'paid');
CREATE TYPE public.inventory_status AS ENUM ('normal', 'low');
CREATE TYPE public.movement_type AS ENUM ('in', 'out');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late');

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  location TEXT,
  status project_status NOT NULL DEFAULT 'planning',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  budget NUMERIC(15, 2) NOT NULL DEFAULT 0,
  spent NUMERIC(15, 2) NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Employees table
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  status employee_status NOT NULL DEFAULT 'active',
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  phone TEXT,
  email TEXT UNIQUE,
  join_date DATE NOT NULL DEFAULT CURRENT_DATE,
  avatar_initials TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payroll table
CREATE TABLE public.payroll (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  base_salary NUMERIC(15, 2) NOT NULL DEFAULT 0,
  overtime NUMERIC(15, 2) NOT NULL DEFAULT 0,
  deductions NUMERIC(15, 2) NOT NULL DEFAULT 0,
  net_pay NUMERIC(15, 2) NOT NULL DEFAULT 0,
  status payment_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inventory table
CREATE TABLE public.inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  unit TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  threshold INTEGER NOT NULL DEFAULT 10,
  unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  status inventory_status NOT NULL DEFAULT 'normal',
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inventory movements table
CREATE TABLE public.inventory_movements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
  type movement_type NOT NULL,
  quantity INTEGER NOT NULL,
  project TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Materials table
CREATE TABLE public.materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  supplier TEXT NOT NULL,
  unit_price NUMERIC(15, 2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  unit TEXT NOT NULL,
  last_order DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_in TIME,
  time_out TIME,
  status attendance_status NOT NULL DEFAULT 'present',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Enable Row Level Security on all tables (public access for now since no auth)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create public access policies (for now, will restrict with auth later)
CREATE POLICY "Public read access for projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public insert access for projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Public delete access for projects" ON public.projects FOR DELETE USING (true);

CREATE POLICY "Public read access for employees" ON public.employees FOR SELECT USING (true);
CREATE POLICY "Public insert access for employees" ON public.employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for employees" ON public.employees FOR UPDATE USING (true);
CREATE POLICY "Public delete access for employees" ON public.employees FOR DELETE USING (true);

CREATE POLICY "Public read access for expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Public insert access for expenses" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for expenses" ON public.expenses FOR UPDATE USING (true);
CREATE POLICY "Public delete access for expenses" ON public.expenses FOR DELETE USING (true);

CREATE POLICY "Public read access for payroll" ON public.payroll FOR SELECT USING (true);
CREATE POLICY "Public insert access for payroll" ON public.payroll FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for payroll" ON public.payroll FOR UPDATE USING (true);
CREATE POLICY "Public delete access for payroll" ON public.payroll FOR DELETE USING (true);

CREATE POLICY "Public read access for inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Public insert access for inventory" ON public.inventory FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for inventory" ON public.inventory FOR UPDATE USING (true);
CREATE POLICY "Public delete access for inventory" ON public.inventory FOR DELETE USING (true);

CREATE POLICY "Public read access for inventory_movements" ON public.inventory_movements FOR SELECT USING (true);
CREATE POLICY "Public insert access for inventory_movements" ON public.inventory_movements FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for inventory_movements" ON public.inventory_movements FOR UPDATE USING (true);
CREATE POLICY "Public delete access for inventory_movements" ON public.inventory_movements FOR DELETE USING (true);

CREATE POLICY "Public read access for materials" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Public insert access for materials" ON public.materials FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for materials" ON public.materials FOR UPDATE USING (true);
CREATE POLICY "Public delete access for materials" ON public.materials FOR DELETE USING (true);

CREATE POLICY "Public read access for attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Public insert access for attendance" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access for attendance" ON public.attendance FOR UPDATE USING (true);
CREATE POLICY "Public delete access for attendance" ON public.attendance FOR DELETE USING (true);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON public.materials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-update inventory status based on quantity vs threshold
CREATE OR REPLACE FUNCTION public.update_inventory_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quantity <= NEW.threshold THEN
    NEW.status = 'low';
  ELSE
    NEW.status = 'normal';
  END IF;
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_inventory_status_trigger BEFORE INSERT OR UPDATE ON public.inventory FOR EACH ROW EXECUTE FUNCTION public.update_inventory_status();