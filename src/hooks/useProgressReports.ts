import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProgressReport } from "@/types/database";
import { toast } from "sonner";

export interface ProgressReportFormData {
  employee_id: string;
  project_id?: string | null;
  report_date?: string;
  description: string;
  hours_worked?: number;
}

export function useProgressReports() {
  return useQuery({
    queryKey: ["progress_reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress_reports")
        .select("*, employee:employees(name, role), project:projects(name)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as (ProgressReport & { employee: { name: string; role: string }; project: { name: string } | null })[];
    },
  });
}

export function useEmployeeProgressReports(employeeId: string) {
  return useQuery({
    queryKey: ["progress_reports", "employee", employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("progress_reports")
        .select("*, project:projects(name)")
        .eq("employee_id", employeeId)
        .order("report_date", { ascending: false });
      
      if (error) throw error;
      return data as (ProgressReport & { project: { name: string } | null })[];
    },
    enabled: !!employeeId,
  });
}

export function useCreateProgressReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (report: ProgressReportFormData) => {
      const { data, error } = await supabase
        .from("progress_reports")
        .insert([report])
        .select()
        .single();
      
      if (error) throw error;
      return data as ProgressReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress_reports"] });
      toast.success("Progress report submitted successfully");
    },
    onError: (error) => {
      toast.error("Failed to submit report: " + error.message);
    },
  });
}

export function useReviewProgressReport() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, reviewed_by, review_notes }: { 
      id: string; 
      status: string; 
      reviewed_by?: string;
      review_notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("progress_reports")
        .update({ status, reviewed_by, review_notes })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as ProgressReport;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress_reports"] });
      toast.success("Report reviewed successfully");
    },
    onError: (error) => {
      toast.error("Failed to review report: " + error.message);
    },
  });
}
