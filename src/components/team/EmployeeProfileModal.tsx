import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Phone, Mail, Calendar, Briefcase, MapPin } from "lucide-react";
import { Employee } from "@/types/database";
import { useEmployeeAttendance, useEmployeePayroll } from "@/hooks/useAttendance";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface EmployeeProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  defaultTab?: "profile" | "attendance" | "payroll";
}

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: "Active", class: "badge-success" },
  "on-site": { label: "On-Site", class: "badge-info" },
  leave: { label: "On Leave", class: "badge-warning" },
  inactive: { label: "Inactive", class: "bg-muted text-muted-foreground" },
};

const attendanceStatusConfig: Record<string, { label: string; class: string }> = {
  present: { label: "Present", class: "badge-success" },
  absent: { label: "Absent", class: "bg-destructive text-destructive-foreground" },
  late: { label: "Late", class: "badge-warning" },
};

const paymentStatusConfig: Record<string, { label: string; class: string }> = {
  paid: { label: "Paid", class: "badge-success" },
  pending: { label: "Pending", class: "badge-warning" },
};

export function EmployeeProfileModal({ 
  open, 
  onOpenChange, 
  employee, 
  defaultTab = "profile" 
}: EmployeeProfileModalProps) {
  const { data: attendance, isLoading: attendanceLoading } = useEmployeeAttendance(employee?.id || "");
  const { data: payroll, isLoading: payrollLoading } = useEmployeePayroll(employee?.id || "");

  if (!employee) return null;

  const statusInfo = statusConfig[employee.status] || statusConfig.active;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-accent/10 text-accent">
                <AvatarFallback className="bg-accent/10 text-accent text-xl font-semibold">
                  {employee.avatar_initials || employee.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{employee.name}</h3>
                <p className="text-muted-foreground">{employee.role}</p>
                <Badge className={cn("mt-1 border", statusInfo.class)}>
                  {statusInfo.label}
                </Badge>
              </div>
            </div>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {employee.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined: {format(new Date(employee.join_date), "MMMM dd, yyyy")}</span>
                </div>
                {employee.project && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Assigned to: {employee.project.name}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Attendance Records (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                {attendanceLoading ? (
                  <p className="text-muted-foreground">Loading attendance...</p>
                ) : attendance && attendance.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time In</TableHead>
                        <TableHead>Time Out</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendance.map((record) => {
                        const attStatus = attendanceStatusConfig[record.status] || attendanceStatusConfig.present;
                        return (
                          <TableRow key={record.id}>
                            <TableCell>{format(new Date(record.date), "MMM dd, yyyy")}</TableCell>
                            <TableCell>{record.time_in || "-"}</TableCell>
                            <TableCell>{record.time_out || "-"}</TableCell>
                            <TableCell>
                              <Badge className={cn("border", attStatus.class)}>
                                {attStatus.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No attendance records found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payroll" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payroll History</CardTitle>
              </CardHeader>
              <CardContent>
                {payrollLoading ? (
                  <p className="text-muted-foreground">Loading payroll...</p>
                ) : payroll && payroll.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead className="text-right">Base Salary</TableHead>
                        <TableHead className="text-right">Overtime</TableHead>
                        <TableHead className="text-right">Deductions</TableHead>
                        <TableHead className="text-right">Net Pay</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payroll.map((record) => {
                        const payStatus = paymentStatusConfig[record.status] || paymentStatusConfig.pending;
                        return (
                          <TableRow key={record.id}>
                            <TableCell>{record.period}</TableCell>
                            <TableCell className="text-right">{formatCurrency(record.base_salary)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(record.overtime)}</TableCell>
                            <TableCell className="text-right text-destructive">{formatCurrency(record.deductions)}</TableCell>
                            <TableCell className="text-right font-semibold">{formatCurrency(record.net_pay)}</TableCell>
                            <TableCell>
                              <Badge className={cn("border", payStatus.class)}>
                                {payStatus.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground">No payroll records found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
