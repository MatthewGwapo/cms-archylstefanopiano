import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useInventoryMovements } from "@/hooks/useInventory";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface InventoryHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InventoryHistoryModal({ open, onOpenChange }: InventoryHistoryModalProps) {
  const { data: movements, isLoading } = useInventoryMovements();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inventory Movement History</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <p className="text-muted-foreground">Loading history...</p>
        ) : movements && movements.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                        movement.type === "in"
                          ? "bg-success/10 text-success"
                          : "bg-accent/10 text-accent"
                      )}
                    >
                      {movement.type === "in" ? (
                        <ArrowDownRight className="h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                      {movement.type === "in" ? "Stock In" : "Stock Out"}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {movement.inventory?.name || "Unknown"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={cn(
                      "font-semibold",
                      movement.type === "in" ? "text-success" : "text-accent"
                    )}>
                      {movement.type === "in" ? "+" : "-"}{movement.quantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {movement.project || "General"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(movement.date), "MMM dd, yyyy h:mm a")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No movement history found.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
