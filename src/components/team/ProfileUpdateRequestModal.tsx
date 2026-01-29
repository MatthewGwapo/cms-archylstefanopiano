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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateProfileUpdateRequest } from "@/hooks/useProfileUpdateRequests";
import { Employee } from "@/types/database";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  role: z.string().optional(),
  department: z.string().optional(),
});

interface ProfileUpdateRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export function ProfileUpdateRequestModal({ open, onOpenChange, employee }: ProfileUpdateRequestModalProps) {
  const createRequest = useCreateProfileUpdateRequest();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: employee?.name || "",
      phone: employee?.phone || "",
      email: employee?.email || "",
      role: employee?.role || "",
      department: employee?.department || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!employee) return;
    
    // Filter out unchanged values
    const changes: Record<string, string> = {};
    if (values.name && values.name !== employee.name) changes.name = values.name;
    if (values.phone && values.phone !== employee.phone) changes.phone = values.phone;
    if (values.email && values.email !== employee.email) changes.email = values.email;
    if (values.role && values.role !== employee.role) changes.role = values.role;
    if (values.department && values.department !== employee.department) changes.department = values.department;

    if (Object.keys(changes).length === 0) {
      onOpenChange(false);
      return;
    }

    await createRequest.mutateAsync({
      employee_id: employee.id,
      requested_changes: changes,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Request Profile Update</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Request changes to profile for: <span className="font-medium text-foreground">{employee?.name}</span>
            </p>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder={employee?.name} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder={employee?.phone || "Phone number"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={employee?.email || "Email"} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder={employee?.role} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder={employee?.department} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRequest.isPending}>
                {createRequest.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
