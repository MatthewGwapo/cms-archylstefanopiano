import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Users,
  Wallet,
  Package,
  Boxes,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Stats Data
const overviewStats = [
  {
    title: "Active Projects",
    value: "5",
    change: "+2 this month",
    changeType: "positive",
    icon: FolderKanban,
    color: "text-info",
    bgColor: "bg-info/10",
  },
  {
    title: "Team Members",
    value: "47",
    change: "12 on-site",
    changeType: "neutral",
    icon: Users,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Monthly Expenses",
    value: "₱2.4M",
    change: "+15% vs budget",
    changeType: "negative",
    icon: Wallet,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    title: "Low Stock Items",
    value: "3",
    change: "Needs attention",
    changeType: "warning",
    icon: Package,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
];

// Active Projects
const activeProjects = [
  {
    id: 1,
    name: "SM Lanang Premier Expansion",
    client: "SM Prime Holdings",
    status: "in-progress",
    progress: 68,
    dueDate: "Mar 2026",
    team: 15,
  },
  {
    id: 2,
    name: "Davao IT Park Tower 3",
    client: "Aboitiz Land",
    status: "in-progress",
    progress: 42,
    dueDate: "Jun 2026",
    team: 22,
  },
  {
    id: 3,
    name: "Residential Complex - Toril",
    client: "Private Client",
    status: "planning",
    progress: 15,
    dueDate: "Dec 2026",
    team: 8,
  },
  {
    id: 4,
    name: "Warehouse Renovation - DPWH",
    client: "DPWH Region XI",
    status: "in-progress",
    progress: 85,
    dueDate: "Feb 2026",
    team: 12,
  },
];

// Recent Activities
const recentActivities = [
  {
    id: 1,
    type: "project",
    message: "Milestone completed: Foundation work for IT Park Tower 3",
    time: "2 hours ago",
    icon: CheckCircle2,
    iconColor: "text-success",
  },
  {
    id: 2,
    type: "inventory",
    message: "Low stock alert: Steel reinforcement bars (10mm)",
    time: "4 hours ago",
    icon: AlertTriangle,
    iconColor: "text-warning",
  },
  {
    id: 3,
    type: "finance",
    message: "Payroll processed for 47 employees",
    time: "1 day ago",
    icon: Wallet,
    iconColor: "text-accent",
  },
  {
    id: 4,
    type: "team",
    message: "New employee added: Juan Dela Cruz (Mason)",
    time: "2 days ago",
    icon: Users,
    iconColor: "text-info",
  },
];

// Quick Actions
const quickActions = [
  {
    title: "Create Project",
    description: "Start a new construction project",
    href: "/projects/new",
    icon: FolderKanban,
  },
  {
    title: "Add Stock",
    description: "Record material delivery",
    href: "/inventory/add",
    icon: Package,
  },
  {
    title: "Record Expense",
    description: "Log project expense",
    href: "/finance/expense",
    icon: Wallet,
  },
  {
    title: "View Reports",
    description: "Generate summary reports",
    href: "/reports",
    icon: BarChart3,
  },
];

function getStatusBadge(status: string) {
  switch (status) {
    case "in-progress":
      return <Badge className="badge-info border">In Progress</Badge>;
    case "planning":
      return <Badge className="badge-warning border">Planning</Badge>;
    case "completed":
      return <Badge className="badge-success border">Completed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's what's happening at MetaLift Construction.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat, index) => (
          <Card
            key={stat.title}
            className="stat-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p
                    className={cn(
                      "text-xs",
                      stat.changeType === "positive" && "text-success",
                      stat.changeType === "negative" && "text-destructive",
                      stat.changeType === "warning" && "text-warning",
                      stat.changeType === "neutral" && "text-muted-foreground"
                    )}
                  >
                    {stat.change}
                  </p>
                </div>
                <div className={cn("rounded-xl p-3", stat.bgColor)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Projects */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Active Projects</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-accent hover:text-accent"
              onClick={() => navigate("/projects")}
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">{project.name}</h4>
                      {getStatusBadge(project.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.client}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {project.dueDate}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Users className="h-3.5 w-3.5" />
                      {project.team} members
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto flex-col items-start gap-2 p-4 hover:border-accent hover:bg-accent/5"
                  onClick={() => navigate(action.href)}
                >
                  <action.icon className="h-5 w-5 text-accent" />
                  <div className="text-left">
                    <p className="font-medium text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {action.description}
                    </p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div
                      className={cn(
                        "shrink-0 mt-0.5",
                        activity.iconColor
                      )}
                    >
                      <activity.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-tight">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
