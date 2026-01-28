import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Material } from "@/types/database";
import { toast } from "sonner";

export interface MaterialFormData {
  name: string;
  category: string;
  supplier: string;
  unit_price?: number;
  stock?: number;
  unit: string;
  last_order?: string;
}

export function useMaterials() {
  return useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("materials")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as Material[];
    },
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (material: MaterialFormData) => {
      const { data, error } = await supabase
        .from("materials")
        .insert([material])
        .select()
        .single();
      
      if (error) throw error;
      return data as Material;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add material: " + error.message);
    },
  });
}

export function useUpdateMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...material }: Partial<Material> & { id: string }) => {
      const { data, error } = await supabase
        .from("materials")
        .update(material)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Material;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update material: " + error.message);
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("materials")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["materials"] });
      toast.success("Material deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete material: " + error.message);
    },
  });
}
