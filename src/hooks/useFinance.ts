import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Expense, Payroll, PaymentStatus } from "@/types/database";
import { toast } from "sonner";

export interface ExpenseFormData {
  description: string;
  category: string;
  amount: number;
  project_id?: string | null;
  date?: string;
}

export interface PayrollFormData {
  employee_id: string;
  period: string;
  base_salary: number;
  overtime?: number;
  deductions?: number;
  net_pay: number;
  status?: PaymentStatus;
}

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*, project:projects(name)")
        .order("date", { ascending: false });
      
      if (error) throw error;
      return data as unknown as (Expense & { project: { name: string } | null })[];
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (expense: ExpenseFormData) => {
      const { data, error } = await supabase
        .from("expenses")
        .insert([expense])
        .select()
        .single();
      
      if (error) throw error;
      return data as Expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add expense: " + error.message);
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...expense }: Partial<Expense> & { id: string }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update(expense)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update expense: " + error.message);
    },
  });
}

export function useUpdateExpenseStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Expense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense status updated");
    },
    onError: (error) => {
      toast.error("Failed to update expense: " + error.message);
    },
  });
}

export function usePayroll() {
  return useQuery({
    queryKey: ["payroll"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payroll")
        .select("*, employee:employees(name, role)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as (Payroll & { employee: { name: string; role: string } })[];
    },
  });
}

export function useCreatePayroll() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (payroll: PayrollFormData) => {
      const { data, error } = await supabase
        .from("payroll")
        .insert([payroll])
        .select()
        .single();
      
      if (error) throw error;
      return data as Payroll;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast.success("Payroll record added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add payroll: " + error.message);
    },
  });
}

export function useUpdatePayrollStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: PaymentStatus }) => {
      const { data, error } = await supabase
        .from("payroll")
        .update({ status })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Payroll;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll"] });
      toast.success("Payroll status updated");
    },
    onError: (error) => {
      toast.error("Failed to update payroll: " + error.message);
    },
  });
}
