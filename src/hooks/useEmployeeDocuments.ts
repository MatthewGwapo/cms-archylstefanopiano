import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeDocument } from "@/types/database";
import { toast } from "sonner";

export function useEmployeeDocuments(employeeId: string) {
  return useQuery({
    queryKey: ["employee_documents", employeeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee_documents")
        .select("*")
        .eq("employee_id", employeeId)
        .order("uploaded_at", { ascending: false });
      
      if (error) throw error;
      return data as EmployeeDocument[];
    },
    enabled: !!employeeId,
  });
}

export function useCreateEmployeeDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (document: Omit<EmployeeDocument, "id" | "uploaded_at">) => {
      const { data, error } = await supabase
        .from("employee_documents")
        .insert([document])
        .select()
        .single();
      
      if (error) throw error;
      return data as EmployeeDocument;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["employee_documents", data.employee_id] });
      toast.success("Document added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add document: " + error.message);
    },
  });
}

export function useDeleteEmployeeDocument() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, employeeId }: { id: string; employeeId: string }) => {
      const { error } = await supabase
        .from("employee_documents")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      return { employeeId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["employee_documents", data.employeeId] });
      toast.success("Document deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete document: " + error.message);
    },
  });
}
