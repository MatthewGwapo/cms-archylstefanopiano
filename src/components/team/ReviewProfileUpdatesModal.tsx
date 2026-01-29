import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProfileUpdateRequests, useReviewProfileUpdateRequest } from "@/hooks/useProfileUpdateRequests";
import { format } from "date-fns";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: "Pending", class: "badge-warning" },
  approved: { label: "Approved", class: "badge-success" },
  rejected: { label: "Rejected", class: "bg-destructive/10 text-destructive" },
};

interface ReviewProfileUpdatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReviewProfileUpdatesModal({ open, onOpenChange }: ReviewProfileUpdatesModalProps) {
  const { data: requests, isLoading } = useProfileUpdateRequests();
  const reviewRequest = useReviewProfileUpdateRequest();

  const pendingRequests = (requests || []).filter((r) => r.status === "pending");
  const processedRequests = (requests || []).filter((r) => r.status !== "pending");

  const handleApprove = async (request: typeof requests[0]) => {
    await reviewRequest.mutateAsync({
      id: request.id,
      status: "approved",
      reviewed_by: "Manager",
      applyChanges: {
        employeeId: request.employee_id,
        changes: request.requested_changes as Record<string, unknown>,
      },
    });
  };

  const handleReject = async (id: string) => {
    await reviewRequest.mutateAsync({
      id,
      status: "rejected",
      reviewed_by: "Manager",
    });
  };

  const renderChanges = (changes: Record<string, unknown>) => {
    return Object.entries(changes).map(([key, value]) => (
      <div key={key} className="text-sm">
        <span className="text-muted-foreground capitalize">{key}:</span>{" "}
        <span className="font-medium">{String(value)}</span>
      </div>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Profile Update Requests</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : (
            <div className="space-y-6">
              {pendingRequests.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-warning" />
                    Pending Requests ({pendingRequests.length})
                  </h4>
                  <div className="space-y-3">
                    {pendingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 rounded-lg border border-warning/30 bg-warning/5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{request.employee?.name}</span>
                              <span className="text-sm text-muted-foreground">({request.employee?.role})</span>
                            </div>
                            <div className="bg-background rounded p-2 mb-2">
                              {renderChanges(request.requested_changes as Record<string, unknown>)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Requested: {format(new Date(request.created_at), "MMM dd, yyyy 'at' h:mm a")}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Button
                              size="sm"
                              className="bg-success hover:bg-success/90"
                              onClick={() => handleApprove(request)}
                              disabled={reviewRequest.isPending}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request.id)}
                              disabled={reviewRequest.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {processedRequests.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">Previous Requests</h4>
                  <div className="space-y-2">
                    {processedRequests.slice(0, 10).map((request) => {
                      const status = statusConfig[request.status] || statusConfig.pending;
                      return (
                        <div
                          key={request.id}
                          className="p-3 rounded-lg border border-border"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium text-sm">{request.employee?.name}</span>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(request.created_at), "MMM dd, yyyy")}
                              </p>
                            </div>
                            <Badge className={cn("border text-xs", status.class)}>
                              {status.label}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!pendingRequests.length && !processedRequests.length && (
                <div className="text-center py-8 text-muted-foreground">
                  No profile update requests
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
