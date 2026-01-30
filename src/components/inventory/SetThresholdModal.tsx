import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
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
  FormDescription,
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
import { Material } from "@/types/database";
import { Loader2, AlertTriangle } from "lucide-react";

const formSchema = z.object({
  material_id: z.string().min(1, "Select a material"),
  threshold: z.number().min(0, "Threshold must be 0 or greater"),
});

interface SetThresholdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Material | null;
}

export function SetThresholdModal({ open, onOpenChange, item }: SetThresholdModalProps) {
  const { data: materials } = useMaterials();
  const updateMaterial = useUpdateMaterial();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      material_id: item?.id || "",
      threshold: 10,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        material_id: item.id,
        threshold: 10,
      });
    } else {
      form.reset({
        material_id: "",
        threshold: 10,
      });
    }
  }, [item, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateMaterial.mutateAsync({
      id: values.material_id,
      threshold: values.threshold,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Set Stock Threshold</DialogTitle>
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
                      {materials?.map((mat) => (
                        <SelectItem key={mat.id} value={mat.id}>
                          {mat.name} (Stock: {mat.stock} {mat.unit})
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
              name="threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Low Stock Threshold</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min={0}
                      {...field} 
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription className="flex items-center gap-2">
                    <AlertTriangle className="h-3 w-3 text-warning" />
                    Alert will trigger when stock falls below this level
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMaterial.isPending}>
                {updateMaterial.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Threshold
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
