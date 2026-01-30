import { useEffect } from "react";
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
import { useMaterials, useUpdateMaterial } from "@/hooks/useMaterials";
import { useProjects } from "@/hooks/useProjects";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

const stockSchema = z.object({
  material_id: z.string().min(1, "Select a material"),
  type: z.enum(["in", "out"]),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  project: z.string().optional(),
});

type StockFormValues = z.infer<typeof stockSchema>;

interface AddStockModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMaterialId?: string;
  defaultType?: "in" | "out";
}

export function AddStockModal({ 
  open, 
  onOpenChange, 
  defaultMaterialId,
  defaultType = "in" 
}: AddStockModalProps) {
  const { data: materials } = useMaterials();
  const updateMaterial = useUpdateMaterial();
  const { data: projects } = useProjects();

  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      material_id: defaultMaterialId || "",
      type: defaultType,
      quantity: 1,
      project: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        material_id: defaultMaterialId || "",
        type: defaultType,
        quantity: 1,
        project: "",
      });
    }
  }, [open, defaultType, defaultMaterialId, form]);

  const onSubmit = async (values: StockFormValues) => {
    try {
      const selectedMaterial = materials?.find(m => m.id === values.material_id);
      if (!selectedMaterial) {
        toast.error("Material not found");
        return;
      }

      // Validate stock out
      if (values.type === "out" && selectedMaterial.stock < values.quantity) {
        toast.error(`Insufficient stock. Available: ${selectedMaterial.stock}, Requested: ${values.quantity}`);
        return;
      }

      // Calculate new stock
      const newStock = values.type === "in" 
        ? selectedMaterial.stock + values.quantity
        : selectedMaterial.stock - values.quantity;

      // Update material stock
      await updateMaterial.mutateAsync({
        id: values.material_id,
        stock: newStock,
      });

      toast.success(`Stock ${values.type === "in" ? "added" : "removed"} successfully`);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update stock: " + (error as Error).message);
    }
  };

  const isStockIn = form.watch("type") === "in";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isStockIn ? (
              <ArrowDownRight className="h-5 w-5 text-success" />
            ) : (
              <ArrowUpRight className="h-5 w-5 text-accent" />
            )}
            {isStockIn ? "Stock In (Receive)" : "Stock Out (Use)"}
          </DialogTitle>
          <DialogDescription>
            {isStockIn ? "Record materials received into inventory" : "Record materials used from inventory"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="material_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {materials?.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} (Current: {item.stock} {item.unit})
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
                      <SelectItem value="__general__">General / Warehouse</SelectItem>
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
                disabled={updateMaterial.isPending}
              >
                {updateMaterial.isPending ? "Processing..." : "Record Movement"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
