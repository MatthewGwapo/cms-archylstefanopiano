import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Unit } from "@/types/database";

export function useUnits() {
  return useQuery({
    queryKey: ["units"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as Unit[];
    },
  });
}
