import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Wallet,
  Receipt,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useExpenses, usePayroll, useUpdatePayrollStatus } from "@/hooks/useFinance";
import { ExpenseFormModal } from "@/components/finance/ExpenseFormModal";
import { format } from "date-fns";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; class: string }> = {
  completed: { label: "Completed", class: "badge-success" },
  pending: { label: "Pending", class: "badge-warning" },
  paid: { label: "Paid", class: "badge-success" },
};

export default function Finance() {
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: payroll, isLoading: payrollLoading } = usePayroll();
  const updatePayrollStatus = useUpdatePayrollStatus();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredExpenses = (expenses || []).filter((expense) =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPayroll = (payroll || []).filter((record) =>
    record.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.period.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompletePayroll = async (id: string) => {
    await updatePayrollStatus.mutateAsync({ id, status: "paid" });
  };

  const handleExportReport = () => {
    const expenseData = (expenses || []).map((e) => ({
      description: e.description,
      category: e.category,
      amount: e.amount,
      project: e.project?.name || "All Projects",
      date: e.date,
    }));

    const report = `
FINANCE REPORT
==============
Generated: ${format(new Date(), "MMMM dd, yyyy 'at' h:mm a")}

EXPENSE SUMMARY
---------------
Total Expenses: ${formatCurrency((expenses || []).reduce((sum, e) => sum + e.amount, 0))}
Number of Records: ${expenses?.length || 0}

EXPENSE DETAILS
---------------
${expenseData.map((e) => `${e.date} | ${e.category} | ${e.description} | ${formatCurrency(e.amount)} | ${e.project}`).join("\n")}

PAYROLL SUMMARY
---------------
Total Payroll: ${formatCurrency((payroll || []).reduce((sum, p) => sum + p.net_pay, 0))}
Pending: ${(payroll || []).filter((p) => p.status === "pending").length} records
Paid: ${(payroll || []).filter((p) => p.status === "paid").length} records
    `.trim();

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Finance_Report_${format(new Date(), "yyyy-MM-dd")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Report exported successfully");
  };

  // Calculate stats
  const totalExpenses = (expenses || []).reduce((sum, e) => sum + e.amount, 0);
  const totalPayroll = (payroll || []).reduce((sum, p) => sum + p.net_pay, 0);
  const pendingCount = (payroll || []).filter((p) => p.status === "pending").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Finance Management</h1>
          <p className="text-muted-foreground mt-1">
            Track expenses, payroll, and financial reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button 
            className="bg-gradient-orange hover:opacity-90 text-accent-foreground gap-2"
            onClick={() => setExpenseModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalExpenses)}</p>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                  <Receipt className="h-3.5 w-3.5" />
                  <span>{expenses?.length || 0} records</span>
                </div>
              </div>
              <div className="rounded-lg bg-accent/10 p-3">
                <Wallet className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold mt-1">{formatCurrency(totalPayroll)}</p>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{payroll?.length || 0} records</span>
                </div>
              </div>
              <div className="rounded-lg bg-info/10 p-3">
                <DollarSign className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Materials Cost</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency((expenses || []).filter((e) => e.category === "Materials").reduce((sum, e) => sum + e.amount, 0))}
                </p>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>Materials category</span>
                </div>
              </div>
              <div className="rounded-lg bg-warning/10 p-3">
                <Receipt className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payroll</p>
                <p className="text-2xl font-bold mt-1">{pendingCount}</p>
                <div className="flex items-center gap-1 mt-1 text-warning text-sm">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Needs attention</span>
                </div>
              </div>
              <div className="rounded-lg bg-destructive/10 p-3">
                <Clock className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="expenses" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Expense Records</CardTitle>
            </CardHeader>
            <CardContent>
              {expensesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
              ) : filteredExpenses.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {searchQuery ? "No expenses match your search." : "No expense records yet."}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.map((record) => (
                      <TableRow key={record.id} className="table-row-hover">
                        <TableCell className="font-medium">
                          {record.description}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {record.project?.name || "All Projects"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{record.category}</Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(record.date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(record.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Records</CardTitle>
            </CardHeader>
            <CardContent>
              {payrollLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
              ) : filteredPayroll.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {searchQuery ? "No payroll records match your search." : "No payroll records yet."}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayroll.map((record) => {
                      const payStatus = statusConfig[record.status] || statusConfig.pending;
                      return (
                        <TableRow key={record.id} className="table-row-hover">
                          <TableCell className="font-medium">
                            {record.employee?.name || "Unknown"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {record.employee?.role || "-"}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {record.period}
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(record.net_pay)}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("border", payStatus.class)}>
                              {payStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {record.status === "pending" && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCompletePayroll(record.id)}
                                disabled={updatePayrollStatus.isPending}
                              >
                                Mark Paid
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <ExpenseFormModal 
        open={expenseModalOpen} 
        onOpenChange={setExpenseModalOpen}
      />
    </div>
  );
}
