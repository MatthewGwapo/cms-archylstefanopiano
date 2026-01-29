import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAllMaterialHistory } from "@/hooks/useMaterialHistory";
import { format } from "date-fns";
import { Loader2, FileEdit, FilePlus } from "lucide-react";

interface MaterialHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MaterialHistoryModal({ open, onOpenChange }: MaterialHistoryModalProps) {
  const { data: history, isLoading } = useAllMaterialHistory();

  const formatChanges = (oldValues: Record<string, unknown> | null, newValues: Record<string, unknown> | null) => {
    if (!oldValues || !newValues) return null;
    
    const changes: { field: string; old: string; new: string }[] = [];
    
    for (const key of Object.keys(newValues)) {
      if (oldValues[key] !== newValues[key] && key !== "updated_at" && key !== "created_at") {
        changes.push({
          field: key,
          old: String(oldValues[key] ?? "-"),
          new: String(newValues[key] ?? "-"),
        });
      }
    }
    
    return changes;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Material History</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : !history?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No material history recorded yet
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => {
                const changes = formatChanges(item.old_values, item.new_values);
                const isCreate = item.action === "create";
                
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`shrink-0 rounded-full p-2 ${isCreate ? "bg-success/10 text-success" : "bg-info/10 text-info"}`}>
                        {isCreate ? <FilePlus className="h-4 w-4" /> : <FileEdit className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{item.material?.name || "Unknown Material"}</span>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {item.action}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {format(new Date(item.created_at), "MMM dd, yyyy 'at' h:mm a")}
                        </p>
                        
                        {isCreate && item.new_values && (
                          <div className="text-sm text-muted-foreground">
                            Created with: {String((item.new_values as Record<string, unknown>).name)} - {String((item.new_values as Record<string, unknown>).stock)} {String((item.new_values as Record<string, unknown>).unit)}
                          </div>
                        )}
                        
                        {!isCreate && changes && changes.length > 0 && (
                          <div className="space-y-1">
                            {changes.slice(0, 5).map((change) => (
                              <div key={change.field} className="text-sm">
                                <span className="text-muted-foreground capitalize">{change.field}:</span>{" "}
                                <span className="text-destructive line-through">{change.old}</span>{" "}
                                <span className="text-success">→ {change.new}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
