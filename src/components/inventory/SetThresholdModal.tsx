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
import { useUpdateInventoryItem } from "@/hooks/useInventory";
import { InventoryItem } from "@/types/database";
import { Loader2, AlertTriangle } from "lucide-react";

const formSchema = z.object({
  threshold: z.number().min(0, "Threshold must be 0 or greater"),
});

interface SetThresholdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

export function SetThresholdModal({ open, onOpenChange, item }: SetThresholdModalProps) {
  const updateItem = useUpdateInventoryItem();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      threshold: item?.threshold || 10,
    },
  });

  useEffect(() => {
    if (item) {
      form.reset({
        threshold: item.threshold,
      });
    }
  }, [item, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!item) return;
    
    await updateItem.mutateAsync({
      id: item.id,
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
        
        {item && (
          <div className="p-3 bg-muted/50 rounded-lg mb-4">
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-muted-foreground">
              Current stock: {item.quantity} {item.unit}
            </p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <Button type="submit" disabled={updateItem.isPending}>
                {updateItem.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Threshold
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
