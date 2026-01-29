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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProgressReports, useReviewProgressReport } from "@/hooks/useProgressReports";
import { format } from "date-fns";
import { Loader2, Search, CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  submitted: { label: "Pending Review", class: "badge-warning", icon: Clock },
  reviewed: { label: "Reviewed", class: "badge-info", icon: FileText },
  approved: { label: "Approved", class: "badge-success", icon: CheckCircle2 },
  rejected: { label: "Rejected", class: "bg-destructive/10 text-destructive", icon: XCircle },
};

interface ViewProgressReportsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewProgressReportsModal({ open, onOpenChange }: ViewProgressReportsModalProps) {
  const { data: reports, isLoading } = useProgressReports();
  const reviewReport = useReviewProgressReport();
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("pending");

  const filteredReports = (reports || []).filter((report) => {
    const matchesSearch = 
      report.employee?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (tab === "pending") {
      return matchesSearch && report.status === "submitted";
    } else if (tab === "reviewed") {
      return matchesSearch && report.status !== "submitted";
    }
    return matchesSearch;
  });

  const handleApprove = async (id: string) => {
    await reviewReport.mutateAsync({
      id,
      status: "approved",
      reviewed_by: "Manager",
    });
  };

  const handleReject = async (id: string) => {
    await reviewReport.mutateAsync({
      id,
      status: "rejected",
      reviewed_by: "Manager",
      review_notes: "Please provide more details",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Progress Reports</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="pending">Pending Review</TabsTrigger>
              <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <TabsContent value={tab}>
              <ScrollArea className="h-[400px] pr-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No reports found
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredReports.map((report) => {
                      const status = statusConfig[report.status] || statusConfig.submitted;
                      const StatusIcon = status.icon;
                      return (
                        <div
                          key={report.id}
                          className="p-4 rounded-lg border border-border hover:border-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">{report.employee?.name}</span>
                                <Badge className={cn("border text-xs", status.class)}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {report.employee?.role} • {format(new Date(report.report_date), "MMM dd, yyyy")} • {report.hours_worked}h
                              </p>
                              {report.project && (
                                <p className="text-xs text-muted-foreground mb-2">
                                  Project: {report.project.name}
                                </p>
                              )}
                              <p className="text-sm">{report.description}</p>
                              {report.review_notes && (
                                <p className="text-sm text-muted-foreground mt-2 italic">
                                  Review: {report.review_notes}
                                </p>
                              )}
                            </div>
                            {report.status === "submitted" && (
                              <div className="flex gap-2 shrink-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-success border-success/50 hover:bg-success/10"
                                  onClick={() => handleApprove(report.id)}
                                  disabled={reviewReport.isPending}
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-destructive border-destructive/50 hover:bg-destructive/10"
                                  onClick={() => handleReject(report.id)}
                                  disabled={reviewReport.isPending}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
