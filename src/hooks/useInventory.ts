import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InventoryItem, InventoryMovement, MovementType } from "@/types/database";
import { toast } from "sonner";

export interface InventoryFormData {
  name: string;
  unit: string;
  quantity: number;
  threshold?: number;
  unit_price?: number;
}

export interface StockMovementData {
  inventory_id: string;
  type: MovementType;
  quantity: number;
  project?: string;
}

export function useInventory() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as InventoryItem[];
    },
  });
}

export function useInventoryMovements() {
  return useQuery({
    queryKey: ["inventory_movements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_movements")
        .select("*, inventory:inventory(name)")
        .order("date", { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as (InventoryMovement & { inventory: { name: string } })[];
    },
  });
}

export function useCreateInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (item: InventoryFormData) => {
      const { data, error } = await supabase
        .from("inventory")
        .insert([item])
        .select()
        .single();
      
      if (error) throw error;
      return data as InventoryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Inventory item added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add item: " + error.message);
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<InventoryItem> & { id: string }) => {
      const { data, error } = await supabase
        .from("inventory")
        .update(item)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data as InventoryItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Inventory item updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update item: " + error.message);
    },
  });
}

export function useAddStock() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ inventory_id, type, quantity, project }: StockMovementData) => {
      // First, get current inventory
      const { data: currentItem, error: fetchError } = await supabase
        .from("inventory")
        .select("quantity, name")
        .eq("id", inventory_id)
        .single();
      
      if (fetchError) throw fetchError;
      
      // Validate stock out - prevent negative stock
      if (type === "out" && currentItem.quantity < quantity) {
        throw new Error(`Insufficient stock. Available: ${currentItem.quantity}, Requested: ${quantity}`);
      }
      
      // Calculate new quantity
      const newQuantity = type === "in" 
        ? currentItem.quantity + quantity
        : currentItem.quantity - quantity;
      
      // Update inventory
      const { error: updateError } = await supabase
        .from("inventory")
        .update({ quantity: newQuantity })
        .eq("id", inventory_id);
      
      if (updateError) throw updateError;
      
      // Record movement
      const { data: movement, error: movementError } = await supabase
        .from("inventory_movements")
        .insert([{ inventory_id, type, quantity, project }])
        .select()
        .single();
      
      if (movementError) throw movementError;
      
      return movement as InventoryMovement;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["inventory_movements"] });
      toast.success(`Stock ${variables.type === "in" ? "added" : "removed"} successfully`);
    },
    onError: (error) => {
      toast.error("Failed to update stock: " + error.message);
    },
  });
}
