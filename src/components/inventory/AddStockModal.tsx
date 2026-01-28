import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddStock } from "@/hooks/useInventory";
import { useInventory } from "@/hooks/useInventory";
import { useProjects } from "@/hooks/useProjects";

const stockSchema = z.object({
  inventory_id: z.string().min(1, "Select an item"),
  type: z.enum(["in", "out"]),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  project: z.string().optional(),
});

type StockFormValues = z.infer<typeof stockSchema>;

interface AddStockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultInventoryId?: string;
  defaultType?: "in" | "out";
}

export function AddStockModal({ 
  open, 
  onOpenChange, 
  defaultInventoryId,
  defaultType = "in" 
}: AddStockModalProps) {
  const addStock = useAddStock();
  const { data: inventory } = useInventory();
  const { data: projects } = useProjects();

  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      inventory_id: defaultInventoryId || "",
      type: defaultType,
      quantity: 1,
      project: "",
    },
  });

  const onSubmit = async (values: StockFormValues) => {
    try {
      await addStock.mutateAsync({
        inventory_id: values.inventory_id,
        type: values.type,
        quantity: values.quantity,
        project: values.project || undefined,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Stock Movement</DialogTitle>
          <DialogDescription>
            Record stock in or out movement
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="inventory_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {inventory?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} (Current: {item.quantity} {item.unit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Movement Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="in">Stock In (Received)</SelectItem>
                        <SelectItem value="out">Stock Out (Used)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity *</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project/Purpose</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">General / Warehouse</SelectItem>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.name}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-orange"
                disabled={addStock.isPending}
              >
                {addStock.isPending ? "Processing..." : "Record Movement"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
