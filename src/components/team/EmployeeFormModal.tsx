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
import { useCreateEmployee, useUpdateEmployee } from "@/hooks/useEmployees";
import { useProjects } from "@/hooks/useProjects";
import { Employee, EmployeeStatus } from "@/types/database";

const employeeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().min(1, "Role is required").max(50),
  department: z.string().min(1, "Department is required").max(50),
  status: z.enum(["active", "on-site", "leave", "inactive"]).default("active"),
  project_id: z.string().optional().nullable(),
  phone: z.string().max(20).optional(),
  email: z.string().email("Invalid email").max(100).optional().or(z.literal("")),
  join_date: z.string().optional(),
});

type EmployeeFormValues = z.infer<typeof employeeSchema>;

interface EmployeeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee | null;
}

const departments = [
  "Engineering",
  "Management",
  "Construction",
  "Electrical",
  "Finance",
  "Operations",
  "Design",
  "Administration",
];

export function EmployeeFormModal({ open, onOpenChange, employee }: EmployeeFormModalProps) {
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const { data: projects } = useProjects();
  const isEditing = !!employee;

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: employee?.name || "",
      role: employee?.role || "",
      department: employee?.department || "",
      status: (employee?.status as EmployeeStatus) || "active",
      project_id: employee?.project_id || "__none__",
      phone: employee?.phone || "",
      email: employee?.email || "",
      join_date: employee?.join_date || new Date().toISOString().split("T")[0],
    },
  });

  // Reset form when employee changes or modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        name: employee?.name || "",
        role: employee?.role || "",
        department: employee?.department || "",
        status: (employee?.status as EmployeeStatus) || "active",
        project_id: employee?.project_id || "__none__",
        phone: employee?.phone || "",
        email: employee?.email || "",
        join_date: employee?.join_date || new Date().toISOString().split("T")[0],
      });
    }
  }, [open, employee, form]);

  const onSubmit = async (values: EmployeeFormValues) => {
    try {
      const submitData = {
        name: values.name,
        role: values.role,
        department: values.department,
        status: values.status,
        project_id: values.project_id === "__none__" ? null : values.project_id || null,
        phone: values.phone,
        email: values.email || undefined,
        join_date: values.join_date,
      };
      
      if (isEditing && employee) {
        await updateEmployee.mutateAsync({ id: employee.id, ...submitData });
      } else {
        await createEmployee.mutateAsync(submitData);
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
          <DialogTitle>{isEditing ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update employee details" : "Add a new team member"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Juan Dela Cruz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Site Engineer" {...field} />
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
                    <FormLabel>Department *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="on-site">On-Site</SelectItem>
                        <SelectItem value="leave">On Leave</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="join_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="project_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned Project</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="__none__">No project assigned</SelectItem>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+63 917 123 4567" {...field} />
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
                      <Input type="email" placeholder="email@metalift.ph" {...field} />
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
                disabled={createEmployee.isPending || updateEmployee.isPending}
              >
                {createEmployee.isPending || updateEmployee.isPending 
                  ? "Saving..." 
                  : isEditing ? "Update Employee" : "Add Employee"
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
