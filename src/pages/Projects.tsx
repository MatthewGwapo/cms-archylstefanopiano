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

// Sample project data
const projects = [
  {
    id: 1,
    name: "SM Lanang Premier Expansion",
    description: "Commercial mall expansion project including new wing construction and parking facility",
    client: "SM Prime Holdings",
    location: "Lanang, Davao City",
    status: "in-progress",
    progress: 68,
    startDate: "Jan 2025",
    dueDate: "Mar 2026",
    budget: "₱45,000,000",
    spent: "₱28,500,000",
    team: 15,
    milestones: { completed: 4, total: 7 },
  },
  {
    id: 2,
    name: "Davao IT Park Tower 3",
    description: "High-rise office building construction - 25 floors with basement parking",
    client: "Aboitiz Land",
    location: "JP Laurel Ave, Davao City",
    status: "in-progress",
    progress: 42,
    startDate: "Mar 2025",
    dueDate: "Jun 2026",
    budget: "₱120,000,000",
    spent: "₱48,000,000",
    team: 22,
    milestones: { completed: 2, total: 8 },
  },
  {
    id: 3,
    name: "Residential Complex - Toril",
    description: "Mid-rise residential development - 4 buildings, 200 units total",
    client: "Private Client",
    location: "Toril, Davao City",
    status: "planning",
    progress: 15,
    startDate: "Aug 2025",
    dueDate: "Dec 2026",
    budget: "₱85,000,000",
    spent: "₱5,000,000",
    team: 8,
    milestones: { completed: 1, total: 10 },
  },
  {
    id: 4,
    name: "Warehouse Renovation - DPWH",
    description: "Government warehouse renovation and structural reinforcement",
    client: "DPWH Region XI",
    location: "Panacan, Davao City",
    status: "in-progress",
    progress: 85,
    startDate: "Oct 2025",
    dueDate: "Feb 2026",
    budget: "₱12,000,000",
    spent: "₱10,200,000",
    team: 12,
    milestones: { completed: 5, total: 6 },
  },
  {
    id: 5,
    name: "Barangay Health Center",
    description: "Community health center construction - 2-storey building",
    client: "LGU Davao",
    location: "Catalunan Grande, Davao City",
    status: "completed",
    progress: 100,
    startDate: "Jun 2025",
    dueDate: "Nov 2025",
    budget: "₱8,500,000",
    spent: "₱8,200,000",
    team: 10,
    milestones: { completed: 5, total: 5 },
  },
];

const statusConfig: Record<string, { label: string; class: string; icon: React.ComponentType<{ className?: string }> }> = {
  "in-progress": {
    label: "In Progress",
    class: "badge-info",
    icon: Clock,
  },
  planning: {
    label: "Planning",
    class: "badge-warning",
    icon: AlertCircle,
  },
  completed: {
    label: "Completed",
    class: "badge-success",
    icon: CheckCircle2,
  },
};

export default function Projects() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Button className="bg-gradient-orange hover:opacity-90 text-accent-foreground gap-2">
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
                <p className="text-2xl font-bold">3</p>
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
                <p className="text-2xl font-bold">1</p>
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
                <p className="text-2xl font-bold">1</p>
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
                <p className="text-2xl font-bold">67</p>
                <p className="text-sm text-muted-foreground">Total Team</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project, index) => {
          const statusInfo = statusConfig[project.status];
          const StatusIcon = statusInfo.icon;

          return (
            <Card
              key={project.id}
              className="card-hover cursor-pointer overflow-hidden"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/projects/${project.id}`)}
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
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Project</DropdownMenuItem>
                      <DropdownMenuItem>Generate Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{project.location.split(",")[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{project.dueDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{project.team} members</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    <span>
                      {project.milestones.completed}/{project.milestones.total} milestones
                    </span>
                  </div>
                </div>

                {/* Budget */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-semibold">{project.budget}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
