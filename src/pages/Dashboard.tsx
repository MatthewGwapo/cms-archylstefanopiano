import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  Users,
  Wallet,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useProjects } from "@/hooks/useProjects";
import { useEmployees } from "@/hooks/useEmployees";
import { useExpenses } from "@/hooks/useFinance";
import { useInventory } from "@/hooks/useInventory";
import { useNotifications } from "@/hooks/useNotifications";
import { format } from "date-fns";

// Quick Actions
const quickActions = [
  {
    title: "Create Project",
    description: "Start a new construction project",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Add Stock",
    description: "Record material delivery",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Record Expense",
    description: "Log project expense",
    href: "/finance",
    icon: Wallet,
  },
  {
    title: "View Reports",
    description: "Generate summary reports",
    href: "/projects",
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

function getNotificationIcon(type: string) {
  switch (type) {
    case "success":
      return { icon: CheckCircle2, color: "text-success" };
    case "warning":
      return { icon: AlertTriangle, color: "text-warning" };
    case "error":
      return { icon: AlertTriangle, color: "text-destructive" };
    default:
      return { icon: CheckCircle2, color: "text-info" };
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: employees, isLoading: employeesLoading } = useEmployees();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const { data: inventory, isLoading: inventoryLoading } = useInventory();
  const { data: notifications } = useNotifications();

  const isLoading = projectsLoading || employeesLoading || expensesLoading || inventoryLoading;

  // Calculate stats from real data
  const activeProjects = projects?.filter(p => p.status === "in-progress" || p.status === "planning") || [];
  const totalEmployees = employees?.length || 0;
  const onSiteCount = employees?.filter(e => e.status === "on-site").length || 0;
  const lowStockItems = inventory?.filter(i => i.status === "low").length || 0;
  const monthlyExpenses = expenses?.reduce((sum, e) => sum + e.amount, 0) || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Overview stats using real data
  const overviewStats = [
    {
      title: "Active Projects",
      value: activeProjects.length.toString(),
      change: `${projects?.filter(p => p.status === "in-progress").length || 0} in progress`,
      changeType: "positive",
      icon: FolderKanban,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Team Members",
      value: totalEmployees.toString(),
      change: `${onSiteCount} on-site`,
      changeType: "neutral",
      icon: Users,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(monthlyExpenses),
      change: `${expenses?.length || 0} records`,
      changeType: "neutral",
      icon: Wallet,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Low Stock Items",
      value: lowStockItems.toString(),
      change: lowStockItems > 0 ? "Needs attention" : "All stocked",
      changeType: lowStockItems > 0 ? "warning" : "positive",
      icon: Package,
      color: lowStockItems > 0 ? "text-warning" : "text-success",
      bgColor: lowStockItems > 0 ? "bg-warning/10" : "bg-success/10",
    },
  ];

  // Recent notifications as activities
  const recentActivities = (notifications || []).slice(0, 4).map(notification => {
    const iconInfo = getNotificationIcon(notification.type);
    return {
      id: notification.id,
      message: notification.message,
      time: format(new Date(notification.created_at), "MMM dd, h:mm a"),
      icon: iconInfo.icon,
      iconColor: iconInfo.color,
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

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
            {activeProjects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No active projects. Create your first project!
              </p>
            ) : (
              <div className="space-y-4">
                {activeProjects.slice(0, 4).map((project) => {
                  const teamCount = employees?.filter(e => e.project_id === project.id).length || 0;
                  return (
                    <div
                      key={project.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/projects`)}
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
                        {project.end_date && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {format(new Date(project.end_date), "MMM yyyy")}
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                          <Users className="h-3.5 w-3.5" />
                          {teamCount} members
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
              {recentActivities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No recent activity.
                </p>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}