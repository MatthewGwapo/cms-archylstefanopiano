// Database types for the METALIFT Construction Management System

export type ProjectStatus = 'planning' | 'in-progress' | 'on-hold' | 'completed';
export type EmployeeStatus = 'active' | 'on-site' | 'leave' | 'inactive';
export type PaymentStatus = 'pending' | 'paid';
export type InventoryStatus = 'normal' | 'low';
export type MovementType = 'in' | 'out';
export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string | null;
  status: ProjectStatus;
  progress: number;
  budget: number;
  spent: number;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  status: EmployeeStatus;
  project_id: string | null;
  phone: string | null;
  email: string | null;
  join_date: string;
  avatar_initials: string | null;
  created_at: string;
  updated_at: string;
  project?: Project;
}

export interface Expense {
  id: string;
  description: string;
  category: string;
  amount: number;
  project_id: string | null;
  date: string;
  created_at: string;
  project?: Project;
}

export interface Payroll {
  id: string;
  employee_id: string;
  period: string;
  base_salary: number;
  overtime: number;
  deductions: number;
  net_pay: number;
  status: PaymentStatus;
  created_at: string;
  employee?: Employee;
}

export interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  threshold: number;
  unit_price: number;
  status: InventoryStatus;
  last_updated: string;
  created_at: string;
}

export interface InventoryMovement {
  id: string;
  inventory_id: string;
  type: MovementType;
  quantity: number;
  project: string | null;
  date: string;
  created_at: string;
  inventory?: InventoryItem;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  supplier: string;
  unit_price: number;
  stock: number;
  unit: string;
  last_order: string | null;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  employee_id: string;
  date: string;
  time_in: string | null;
  time_out: string | null;
  status: AttendanceStatus;
  created_at: string;
  employee?: Employee;
}
