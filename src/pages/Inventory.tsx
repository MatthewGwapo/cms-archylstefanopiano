import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  History,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// Sample inventory data
const inventoryItems = [
  {
    id: 1,
    name: "Portland Cement",
    unit: "bags",
    quantity: 450,
    threshold: 100,
    value: "₱112,500",
    lastUpdated: "Jan 15, 2026",
    status: "normal",
  },
  {
    id: 2,
    name: "Steel Reinforcement Bar (10mm)",
    unit: "pcs",
    quantity: 45,
    threshold: 50,
    value: "₱67,500",
    lastUpdated: "Jan 14, 2026",
    status: "low",
  },
  {
    id: 3,
    name: "Steel Reinforcement Bar (16mm)",
    unit: "pcs",
    quantity: 120,
    threshold: 40,
    value: "₱240,000",
    lastUpdated: "Jan 14, 2026",
    status: "normal",
  },
  {
    id: 4,
    name: "Hollow Blocks (4\")",
    unit: "pcs",
    quantity: 2500,
    threshold: 500,
    value: "₱37,500",
    lastUpdated: "Jan 12, 2026",
    status: "normal",
  },
  {
    id: 5,
    name: "Plywood (1/2\")",
    unit: "sheets",
    quantity: 35,
    threshold: 50,
    value: "₱21,000",
    lastUpdated: "Jan 10, 2026",
    status: "low",
  },
  {
    id: 6,
    name: "Electrical Wire (THHN #12)",
    unit: "rolls",
    quantity: 22,
    threshold: 30,
    value: "₱44,000",
    lastUpdated: "Jan 8, 2026",
    status: "low",
  },
  {
    id: 7,
    name: "Sand (Washed)",
    unit: "cu.m",
    quantity: 85,
    threshold: 20,
    value: "₱127,500",
    lastUpdated: "Jan 6, 2026",
    status: "normal",
  },
  {
    id: 8,
    name: "Gravel (3/4\")",
    unit: "cu.m",
    quantity: 60,
    threshold: 15,
    value: "₱90,000",
    lastUpdated: "Jan 6, 2026",
    status: "normal",
  },
];

const recentMovements = [
  {
    id: 1,
    material: "Portland Cement",
    type: "out",
    quantity: 50,
    project: "SM Lanang Premier",
    date: "Jan 15, 2026",
  },
  {
    id: 2,
    material: "Steel Bar (16mm)",
    type: "in",
    quantity: 80,
    project: "Warehouse Delivery",
    date: "Jan 14, 2026",
  },
  {
    id: 3,
    material: "Hollow Blocks",
    type: "out",
    quantity: 300,
    project: "Residential Complex",
    date: "Jan 12, 2026",
  },
  {
    id: 4,
    material: "Plywood",
    type: "out",
    quantity: 15,
    project: "IT Park Tower 3",
    date: "Jan 10, 2026",
  },
];

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = inventoryItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = inventoryItems.filter((i) => i.status === "low").length;
  const totalValue = "₱740,000";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">
            Track material stock levels and movements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            View History
          </Button>
          <Button className="bg-gradient-orange hover:opacity-90 text-accent-foreground gap-2">
            <Plus className="h-4 w-4" />
            Add Stock
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <Package className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inventoryItems.length}</p>
                <p className="text-sm text-muted-foreground">Total Materials</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card border-warning/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{lowStockCount}</p>
                <p className="text-sm text-muted-foreground">Low Stock Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalValue}</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <ArrowDownRight className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Movements Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Inventory Table */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Stock Overview</CardTitle>
            <div className="flex gap-2">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const stockPercent = Math.min(
                    (item.quantity / (item.threshold * 3)) * 100,
                    100
                  );
                  return (
                    <TableRow key={item.id} className="table-row-hover">
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="w-32">
                          <Progress
                            value={stockPercent}
                            className={cn(
                              "h-2",
                              item.status === "low" && "[&>div]:bg-warning"
                            )}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Threshold: {item.threshold}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {item.value}
                      </TableCell>
                      <TableCell>
                        {item.status === "low" ? (
                          <Badge className="badge-warning border">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge className="badge-success border">Normal</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Movements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border"
                >
                  <div
                    className={cn(
                      "shrink-0 rounded-full p-1.5",
                      movement.type === "in"
                        ? "bg-success/10 text-success"
                        : "bg-accent/10 text-accent"
                    )}
                  >
                    {movement.type === "in" ? (
                      <ArrowDownRight className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{movement.material}</p>
                    <p className="text-xs text-muted-foreground">
                      {movement.type === "in" ? "+" : "-"}{movement.quantity} •{" "}
                      {movement.project}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {movement.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
