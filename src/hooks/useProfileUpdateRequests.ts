import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileUpdateRequest } from "@/types/database";
import { toast } from "sonner";

export function useProfileUpdateRequests() {
  return useQuery({
    queryKey: ["profile_update_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_update_requests")
        .select("*, employee:employees(name, role)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as (ProfileUpdateRequest & { employee: { name: string; role: string } })[];
    },
  });
}

export function useEmployeeProfileUpdateRequests(employeeId: string) {
  return useQuery({
    queryKey: ["profile_update_requests", "employee", employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profile_update_requests")
        .select("*")
        .eq("employee_id", employeeId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as ProfileUpdateRequest[];
    },
    enabled: !!employeeId,
  });
}

export function useCreateProfileUpdateRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: { employee_id: string; requested_changes: Record<string, unknown> }) => {
      const { data, error } = await supabase
        .from("profile_update_requests")
        .insert([{
          employee_id: request.employee_id,
          requested_changes: request.requested_changes as unknown as import("@/integrations/supabase/types").Json
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data as ProfileUpdateRequest;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile_update_requests"] });
      toast.success("Profile update request submitted");
    },
    onError: (error) => {
      toast.error("Failed to submit request: " + error.message);
    },
  });
}

export function useReviewProfileUpdateRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      reviewed_by,
      applyChanges 
    }: { 
      id: string; 
      status: string; 
      reviewed_by?: string;
      applyChanges?: { employeeId: string; changes: Record<string, unknown> };
    }) => {
      // Update the request status
      const { data, error } = await supabase
        .from("profile_update_requests")
        .update({ 
          status, 
          reviewed_by, 
          reviewed_at: new Date().toISOString() 
        })
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;

      // If approved, apply the changes to the employee
      if (status === "approved" && applyChanges) {
        const { error: updateError } = await supabase
          .from("employees")
          .update(applyChanges.changes)
          .eq("id", applyChanges.employeeId);
        
        if (updateError) throw updateError;
      }
      
      return data as ProfileUpdateRequest;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile_update_requests"] });
      if (variables.applyChanges) {
        queryClient.invalidateQueries({ queryKey: ["employees"] });
      }
      toast.success(`Request ${variables.status}`);
    },
    onError: (error) => {
      toast.error("Failed to review request: " + error.message);
    },
  });
}
