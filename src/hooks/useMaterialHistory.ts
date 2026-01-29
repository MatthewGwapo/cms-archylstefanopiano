import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MaterialHistory } from "@/types/database";

export function useMaterialHistory(materialId?: string) {
  return useQuery({
    queryKey: ["material_history", materialId],
    queryFn: async () => {
      let query = supabase
        .from("material_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      
      if (materialId) {
        query = query.eq("material_id", materialId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as MaterialHistory[];
    },
  });
}

export function useAllMaterialHistory() {
  return useQuery({
    queryKey: ["material_history", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("material_history")
        .select("*, material:materials(name)")
        .order("created_at", { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as (MaterialHistory & { material: { name: string } | null })[];
    },
  });
}
