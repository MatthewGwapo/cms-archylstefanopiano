import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  History,
  Loader2,
  Settings,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useInventory, useInventoryMovements } from "@/hooks/useInventory";
import { AddStockModal } from "@/components/inventory/AddStockModal";
import { InventoryHistoryModal } from "@/components/inventory/InventoryHistoryModal";
import { SetThresholdModal } from "@/components/inventory/SetThresholdModal";
import { format } from "date-fns";
import { InventoryItem } from "@/types/database";

export default function Inventory() {
  const { data: inventory, isLoading: inventoryLoading } = useInventory();
  const { data: movements } = useInventoryMovements();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [thresholdOpen, setThresholdOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [stockType, setStockType] = useState<"in" | "out">("in");

  const filteredItems = (inventory || []).filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddStock = (type: "in" | "out") => {
    setStockType(type);
    setAddStockOpen(true);
  };

  const handleSetThreshold = (item: InventoryItem) => {
    setSelectedItem(item);
    setThresholdOpen(true);
  };

  // Calculate stats
  const lowStockCount = (inventory || []).filter((i) => i.status === "low").length;
  const totalValue = (inventory || []).reduce((sum, i) => sum + i.quantity * i.unit_price, 0);
  const recentMovements = movements?.slice(0, 4) || [];

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
          <Button variant="outline" className="gap-2" onClick={() => setHistoryOpen(true)}>
            <History className="h-4 w-4" />
            View History
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-orange hover:opacity-90 text-accent-foreground gap-2">
                <Plus className="h-4 w-4" />
                Stock Movement
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleAddStock("in")}>
                <ArrowDownRight className="h-4 w-4 mr-2 text-success" />
                Stock In (Receive)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddStock("out")}>
                <ArrowUpRight className="h-4 w-4 mr-2 text-accent" />
                Stock Out (Use)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
                <p className="text-2xl font-bold">{inventory?.length || 0}</p>
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
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
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
                <p className="text-2xl font-bold">{movements?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Movements</p>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {inventoryLoading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-accent" />
              </div>
            ) : filteredItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {searchQuery || statusFilter !== "all" ? "No items match your search." : "No inventory items yet."}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Stock Level</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => {
                    const stockPercent = Math.min(
                      (item.quantity / (item.threshold * 3)) * 100,
                      100
                    );
                    const itemValue = item.quantity * item.unit_price;
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
                          {formatCurrency(itemValue)}
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
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleSetThreshold(item)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Movements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Movements</CardTitle>
          </CardHeader>
          <CardContent>
            {recentMovements.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No movements recorded yet.
              </p>
            ) : (
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
                      <p className="font-medium text-sm">{movement.inventory?.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">
                        {movement.type === "in" ? "+" : "-"}{movement.quantity} •{" "}
                        {movement.project || "General"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(movement.date), "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddStockModal 
        open={addStockOpen} 
        onOpenChange={setAddStockOpen}
        defaultType={stockType}
      />
      <InventoryHistoryModal 
        open={historyOpen} 
        onOpenChange={setHistoryOpen}
      />
      <SetThresholdModal
        open={thresholdOpen}
        onOpenChange={setThresholdOpen}
        item={selectedItem}
      />
    </div>
  );
}
