import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
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

// Sample finance data
const payrollRecords = [
  {
    id: 1,
    employee: "Juan Dela Cruz",
    position: "Mason",
    project: "SM Lanang Premier",
    amount: "₱18,500",
    period: "Jan 1-15, 2026",
    status: "completed",
  },
  {
    id: 2,
    employee: "Pedro Aquino",
    position: "Electrician",
    project: "Warehouse Renovation",
    amount: "₱22,000",
    period: "Jan 1-15, 2026",
    status: "completed",
  },
  {
    id: 3,
    employee: "Carlos Mendoza",
    position: "Foreman",
    project: "Warehouse Renovation",
    amount: "₱28,500",
    period: "Jan 1-15, 2026",
    status: "pending",
  },
  {
    id: 4,
    employee: "Antonio Garcia",
    position: "HE Operator",
    project: "IT Park Tower 3",
    amount: "₱25,000",
    period: "Jan 1-15, 2026",
    status: "pending",
  },
];

const expenseRecords = [
  {
    id: 1,
    description: "Cement delivery (500 bags)",
    project: "SM Lanang Premier",
    category: "Materials",
    amount: "₱125,000",
    date: "Jan 15, 2026",
    status: "completed",
  },
  {
    id: 2,
    description: "Steel reinforcement bars",
    project: "IT Park Tower 3",
    category: "Materials",
    amount: "₱285,000",
    date: "Jan 14, 2026",
    status: "completed",
  },
  {
    id: 3,
    description: "Equipment rental - Crane",
    project: "IT Park Tower 3",
    category: "Equipment",
    amount: "₱75,000",
    date: "Jan 12, 2026",
    status: "pending",
  },
  {
    id: 4,
    description: "Safety equipment",
    project: "All Projects",
    category: "Safety",
    amount: "₱45,000",
    date: "Jan 10, 2026",
    status: "completed",
  },
  {
    id: 5,
    description: "Electrical supplies",
    project: "Warehouse Renovation",
    category: "Materials",
    amount: "₱62,000",
    date: "Jan 8, 2026",
    status: "completed",
  },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  completed: { label: "Completed", class: "badge-success" },
  pending: { label: "Pending", class: "badge-warning" },
};

export default function Finance() {
  const [searchQuery, setSearchQuery] = useState("");

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
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="bg-gradient-orange hover:opacity-90 text-accent-foreground gap-2">
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
                <p className="text-2xl font-bold mt-1">₱2.4M</p>
                <div className="flex items-center gap-1 mt-1 text-success text-sm">
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  <span>-8% vs last month</span>
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
                <p className="text-sm text-muted-foreground">Payroll (MTD)</p>
                <p className="text-2xl font-bold mt-1">₱892K</p>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>47 employees</span>
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
                <p className="text-2xl font-bold mt-1">₱1.2M</p>
                <div className="flex items-center gap-1 mt-1 text-destructive text-sm">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span>+15% vs budget</span>
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
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-2xl font-bold mt-1">5</p>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expenseRecords.map((record) => (
                    <TableRow key={record.id} className="table-row-hover">
                      <TableCell className="font-medium">
                        {record.description}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.project}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{record.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.date}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {record.amount}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border", statusConfig[record.status].class)}>
                          {statusConfig[record.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.status === "pending" && (
                          <Button size="sm" variant="outline">
                            Complete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollRecords.map((record) => (
                    <TableRow key={record.id} className="table-row-hover">
                      <TableCell className="font-medium">
                        {record.employee}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.position}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.project}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {record.period}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {record.amount}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border", statusConfig[record.status].class)}>
                          {statusConfig[record.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.status === "pending" && (
                          <Button size="sm" variant="outline">
                            Complete
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
