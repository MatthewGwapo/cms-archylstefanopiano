import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, MapPin, Users, Wallet, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Project } from "@/types/database";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ProjectDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

const statusConfig: Record<string, { label: string; class: string; icon: React.ComponentType<{ className?: string }> }> = {
  "in-progress": { label: "In Progress", class: "badge-info", icon: Clock },
  planning: { label: "Planning", class: "badge-warning", icon: AlertCircle },
  "on-hold": { label: "On Hold", class: "badge-warning", icon: AlertCircle },
  completed: { label: "Completed", class: "badge-success", icon: CheckCircle2 },
};

export function ProjectDetailsModal({ open, onOpenChange, project }: ProjectDetailsModalProps) {
  if (!project) return null;

  const statusInfo = statusConfig[project.status] || statusConfig.planning;
  const StatusIcon = statusInfo.icon;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not set";
    return format(new Date(dateStr), "MMM dd, yyyy");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{project.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status & Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className={cn("border", statusInfo.class)}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo.label}
              </Badge>
              <span className="text-lg font-bold">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
          </div>

          {/* Description */}
          {project.description && (
            <div>
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Client:</span>
                <span className="font-medium">{project.client}</span>
              </div>
              
              {project.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{project.location}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Start:</span>
                <span className="font-medium">{formatDate(project.start_date)}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">End:</span>
                <span className="font-medium">{formatDate(project.end_date)}</span>
              </div>
            </div>
          </div>

          {/* Budget Section */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Budget Overview
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-accent">{formatCurrency(project.budget)}</p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(project.spent)}</p>
                <p className="text-sm text-muted-foreground">Spent</p>
              </div>
              <div>
                <p className={cn(
                  "text-2xl font-bold",
                  project.budget - project.spent >= 0 ? "text-success" : "text-destructive"
                )}>
                  {formatCurrency(project.budget - project.spent)}
                </p>
                <p className="text-sm text-muted-foreground">Remaining</p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>Created: {format(new Date(project.created_at), "MMM dd, yyyy 'at' h:mm a")}</p>
            <p>Last Updated: {format(new Date(project.updated_at), "MMM dd, yyyy 'at' h:mm a")}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
