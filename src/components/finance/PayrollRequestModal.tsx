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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePayroll } from "@/hooks/useFinance";
import { useEmployees } from "@/hooks/useEmployees";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  employee_id: z.string().min(1, "Please select an employee"),
  period: z.string().min(1, "Please enter a pay period"),
  base_salary: z.number().min(0),
  overtime: z.number().min(0),
  deductions: z.number().min(0),
});

interface PayrollRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PayrollRequestModal({ open, onOpenChange }: PayrollRequestModalProps) {
  const createPayroll = useCreatePayroll();
  const { data: employees } = useEmployees();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: "",
      period: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      base_salary: 0,
      overtime: 0,
      deductions: 0,
    },
  });

  const baseSalary = form.watch("base_salary");
  const overtime = form.watch("overtime");
  const deductions = form.watch("deductions");
  const netPay = (baseSalary || 0) + (overtime || 0) - (deductions || 0);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createPayroll.mutateAsync({
      employee_id: values.employee_id,
      period: values.period,
      base_salary: values.base_salary,
      overtime: values.overtime,
      deductions: values.deductions,
      net_pay: netPay,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Create Payroll Record</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="employee_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees?.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} - {employee.role}
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
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pay Period</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., January 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="base_salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Salary</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="overtime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overtime</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deductions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deductions</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={0}
                        {...field} 
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Net Pay:</span>
                <span className="text-lg font-bold text-accent">
                  ₱{netPay.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPayroll.isPending}>
                {createPayroll.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Payroll
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
