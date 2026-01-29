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
  FileText,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useExpenses, usePayroll, useUpdatePayrollStatus } from "@/hooks/useFinance";
import { ExpenseFormModal } from "@/components/finance/ExpenseFormModal";
import { PayrollRequestModal } from "@/components/finance/PayrollRequestModal";
import { format, subDays, subMonths, isAfter } from "date-fns";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; class: string }> = {
  completed: { label: "Completed", class: "badge-success" },
  pending: { label: "Pending", class: "badge-warning" },
  paid: { label: "Paid", class: "badge-success" },
};

const categories = ["All", "Materials", "Labor", "Equipment", "Utilities", "Transportation", "Subcontractor", "Administrative", "Other"];

export default function Finance() {
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: payroll, isLoading: payrollLoading } = usePayroll();
  const updatePayrollStatus = useUpdatePayrollStatus();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dateFilter, setDateFilter] = useState("all");
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [payrollModalOpen, setPayrollModalOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDateFilterStart = () => {
    switch (dateFilter) {
      case "7days":
        return subDays(new Date(), 7);
      case "30days":
        return subDays(new Date(), 30);
      case "3months":
        return subMonths(new Date(), 3);
      default:
        return null;
    }
  };

  const filteredExpenses = (expenses || []).filter((expense) => {
    const matchesSearch = 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (expense.project?.name && expense.project.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory;
    
    const dateStart = getDateFilterStart();
    const matchesDate = !dateStart || isAfter(new Date(expense.date), dateStart);
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const filteredPayroll = (payroll || []).filter((record) =>
    record.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.period.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompletePayroll = async (id: string) => {
    await updatePayrollStatus.mutateAsync({ id, status: "paid" });
  };

  const handleExportReport = () => {
    const expenseData = filteredExpenses.map((e) => ({
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
Filter: ${selectedCategory !== "All" ? selectedCategory : "All Categories"} | ${dateFilter !== "all" ? dateFilter : "All Time"}

EXPENSE SUMMARY
---------------
Total Expenses: ${formatCurrency(filteredExpenses.reduce((sum, e) => sum + e.amount, 0))}
Number of Records: ${filteredExpenses.length}

EXPENSE BREAKDOWN BY CATEGORY
-----------------------------
${Object.entries(
  filteredExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>)
)
  .map(([cat, amount]) => `${cat}: ${formatCurrency(amount)}`)
  .join("\n")}

EXPENSE DETAILS
---------------
${expenseData.map((e) => `${e.date} | ${e.category} | ${e.description} | ${formatCurrency(e.amount)} | ${e.project}`).join("\n")}

PAYROLL SUMMARY
---------------
Total Payroll: ${formatCurrency((payroll || []).reduce((sum, p) => sum + p.net_pay, 0))}
Pending: ${(payroll || []).filter((p) => p.status === "pending").length} records
Paid: ${(payroll || []).filter((p) => p.status === "paid").length} records

PAYROLL DETAILS
---------------
${(payroll || []).map((p) => `${p.period} | ${p.employee?.name} | ${formatCurrency(p.net_pay)} | ${p.status}`).join("\n")}
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
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalPayroll = (payroll || []).reduce((sum, p) => sum + p.net_pay, 0);
  const pendingCount = (payroll || []).filter((p) => p.status === "pending").length;
  const materialsCost = filteredExpenses.filter((e) => e.category === "Materials").reduce((sum, e) => sum + e.amount, 0);

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
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" className="gap-2" onClick={handleExportReport}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setPayrollModalOpen(true)}>
            <FileText className="h-4 w-4" />
            Payroll Request
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
                  <span>{filteredExpenses.length} records</span>
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
                <p className="text-2xl font-bold mt-1">{formatCurrency(materialsCost)}</p>
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
          <div className="flex gap-2 flex-wrap">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
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
                  {searchQuery || selectedCategory !== "All" || dateFilter !== "all" 
                    ? "No expenses match your filters." 
                    : "No expense records yet."}
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
      <PayrollRequestModal
        open={payrollModalOpen}
        onOpenChange={setPayrollModalOpen}
      />
    </div>
  );
}
