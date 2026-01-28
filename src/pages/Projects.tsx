import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Calendar,
  Users,
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import { ProjectFormModal } from "@/components/projects/ProjectFormModal";
import { ProjectDetailsModal } from "@/components/projects/ProjectDetailsModal";
import { Project } from "@/types/database";
import { format } from "date-fns";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; class: string; icon: React.ComponentType<{ className?: string }> }> = {
  "in-progress": { label: "In Progress", class: "badge-info", icon: Clock },
  planning: { label: "Planning", class: "badge-warning", icon: AlertCircle },
  "on-hold": { label: "On Hold", class: "badge-warning", icon: AlertCircle },
  completed: { label: "Completed", class: "badge-success", icon: CheckCircle2 },
};

export default function Projects() {
  const navigate = useNavigate();
  const { data: projects, isLoading, error } = useProjects();
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filteredProjects = (projects || []).filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleViewDetails = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProject(project);
    setDetailsOpen(true);
  };

  const handleEditProject = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(project);
    setFormOpen(true);
  };

  const handleGenerateReport = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    // Create a simple text report
    const report = `
PROJECT REPORT
==============
Project: ${project.name}
Client: ${project.client}
Location: ${project.location || "N/A"}
Status: ${project.status}
Progress: ${project.progress}%

BUDGET SUMMARY
--------------
Total Budget: ${formatCurrency(project.budget)}
Amount Spent: ${formatCurrency(project.spent)}
Remaining: ${formatCurrency(project.budget - project.spent)}

Dates: ${project.start_date ? format(new Date(project.start_date), "MMM dd, yyyy") : "N/A"} - ${project.end_date ? format(new Date(project.end_date), "MMM dd, yyyy") : "N/A"}

Description:
${project.description || "No description available."}

Generated on: ${format(new Date(), "MMMM dd, yyyy 'at' h:mm a")}
    `.trim();
    
    // Create and download the report
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "_")}_Report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Report generated successfully");
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingProject(null);
  };

  // Stats calculation
  const inProgressCount = filteredProjects.filter((p) => p.status === "in-progress").length;
  const planningCount = filteredProjects.filter((p) => p.status === "planning").length;
  const completedCount = filteredProjects.filter((p) => p.status === "completed").length;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading projects: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all construction projects
          </p>
        </div>
        <Button 
          className="bg-gradient-orange hover:opacity-90 text-accent-foreground gap-2"
          onClick={() => setFormOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <Clock className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProgressCount}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <AlertCircle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{planningCount}</p>
                <p className="text-sm text-muted-foreground">Planning</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedCount}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Users className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{filteredProjects.length}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery ? "No projects match your search." : "No projects yet. Create your first project!"}
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project, index) => {
            const statusInfo = statusConfig[project.status] || statusConfig.planning;
            const StatusIcon = statusInfo.icon;

            return (
              <Card
                key={project.id}
                className="card-hover cursor-pointer overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  setSelectedProject(project);
                  setDetailsOpen(true);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1">
                        {project.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.client}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => handleViewDetails(project, e)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleEditProject(project, e)}>
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleGenerateReport(project, e)}>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description || "No description available."}
                  </p>

                  {/* Status & Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={cn("border", statusInfo.class)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                    {project.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{project.location.split(",")[0]}</span>
                      </div>
                    )}
                    {project.end_date && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{format(new Date(project.end_date), "MMM yyyy")}</span>
                      </div>
                    )}
                  </div>

                  {/* Budget */}
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-semibold">{formatCurrency(project.budget)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <ProjectFormModal 
        open={formOpen} 
        onOpenChange={handleCloseForm}
        project={editingProject}
      />
      <ProjectDetailsModal 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen}
        project={selectedProject}
      />
    </div>
  );
}
