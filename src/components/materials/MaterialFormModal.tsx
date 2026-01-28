import { useState, useEffect } from "react";
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
import { useCreateMaterial, useUpdateMaterial } from "@/hooks/useMaterials";
import { Material } from "@/types/database";

const materialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  category: z.string().min(1, "Category is required"),
  supplier: z.string().min(1, "Supplier is required").max(100),
  unit: z.string().min(1, "Unit is required").max(50),
  unit_price: z.coerce.number().min(0, "Price must be positive").default(0),
  stock: z.coerce.number().min(0, "Stock must be positive").default(0),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

interface MaterialFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material?: Material | null;
}

const categories = [
  "Concrete",
  "Steel",
  "Masonry",
  "Wood",
  "Electrical",
  "Plumbing",
  "Aggregates",
  "Finishes",
  "Hardware",
  "Safety",
];

const suppliers = [
  "Holcim Philippines",
  "Steel Asia",
  "Metro Block Manufacturing",
  "Phelps Dodge",
  "Davao Sand & Gravel",
  "Filply Corporation",
  "Other",
];

export function MaterialFormModal({ open, onOpenChange, material }: MaterialFormModalProps) {
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const isEditing = !!material;

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      name: material?.name || "",
      category: material?.category || "",
      supplier: material?.supplier || "",
      unit: material?.unit || "",
      unit_price: material?.unit_price || 0,
      stock: material?.stock || 0,
    },
  });

  // Reset form when material changes
  useEffect(() => {
    if (material) {
      form.reset({
        name: material.name,
        category: material.category,
        supplier: material.supplier,
        unit: material.unit,
        unit_price: material.unit_price,
        stock: material.stock,
      });
    } else {
      form.reset({
        name: "",
        category: "",
        supplier: "",
        unit: "",
        unit_price: 0,
        stock: 0,
      });
    }
  }, [material, form]);

  const onSubmit = async (values: MaterialFormValues) => {
    try {
      const submitData = {
        name: values.name,
        category: values.category,
        supplier: values.supplier,
        unit: values.unit,
        unit_price: values.unit_price,
        stock: values.stock,
      };
      
      if (isEditing && material) {
        await updateMaterial.mutateAsync({ id: material.id, ...submitData });
      } else {
        await createMaterial.mutateAsync(submitData);
      }
      form.reset();
      onOpenChange(false);
    } catch (error) {
      // Error handled in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Material" : "Add Material"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update material details" : "Add a new material to the catalog"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Portland Cement Type 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. bag (40kg)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select supplier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((sup) => (
                        <SelectItem key={sup} value={sup}>
                          {sup}
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
                name="unit_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Price (₱)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Stock</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-orange"
                disabled={createMaterial.isPending || updateMaterial.isPending}
              >
                {createMaterial.isPending || updateMaterial.isPending 
                  ? "Saving..." 
                  : isEditing ? "Update Material" : "Add Material"
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
