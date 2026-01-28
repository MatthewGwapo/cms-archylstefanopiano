import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Attendance, AttendanceStatus } from "@/types/database";
import { toast } from "sonner";

export interface AttendanceFormData {
  employee_id: string;
  date: string;
  time_in?: string;
  time_out?: string;
  status?: AttendanceStatus;
}

export function useEmployeeAttendance(employeeId: string) {
  return useQuery({
    queryKey: ["attendance", employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("employee_id", employeeId)
        .order("date", { ascending: false })
        .limit(30);
      
      if (error) throw error;
      return data as Attendance[];
    },
    enabled: !!employeeId,
  });
}

export function useEmployeePayroll(employeeId: string) {
  return useQuery({
    queryKey: ["payroll", "employee", employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payroll")
        .select("*")
        .eq("employee_id", employeeId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!employeeId,
  });
}

export function useCreateAttendance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (attendance: AttendanceFormData) => {
      const { data, error } = await supabase
        .from("attendance")
        .insert([attendance])
        .select()
        .single();
      
      if (error) throw error;
      return data as Attendance;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attendance", data.employee_id] });
      toast.success("Attendance recorded successfully");
    },
    onError: (error) => {
      toast.error("Failed to record attendance: " + error.message);
    },
  });
}
