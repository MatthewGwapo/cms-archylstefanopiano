import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Supplier } from "@/types/database";
import { toast } from "sonner";

export interface SupplierFormData {
  name: string;
  contact?: string;
  email?: string;
  address?: string;
  products?: string[];
}

export function useSuppliers() {
  return useQuery({
    queryKey: ["suppliers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as Supplier[];
    },
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (supplier: SupplierFormData) => {
      const { data, error } = await supabase
        .from("suppliers")
        .insert([supplier])
        .select()
        .single();
      
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier registered successfully");
    },
    onError: (error) => {
      toast.error("Failed to register supplier: " + error.message);
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...supplier }: Partial<Supplier> & { id: string }) => {
      const { data, error } = await supabase
        .from("suppliers")
        .update(supplier)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update supplier: " + error.message);
    },
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete supplier: " + error.message);
    },
  });
}
