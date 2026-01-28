import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Briefcase,
  Calendar,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useEmployees } from "@/hooks/useEmployees";
import { EmployeeFormModal } from "@/components/team/EmployeeFormModal";
import { EmployeeProfileModal } from "@/components/team/EmployeeProfileModal";
import { Employee } from "@/types/database";
import { format } from "date-fns";
import { User, CheckCircle2, Clock, Users as UsersIcon } from "lucide-react";

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: "Active", class: "badge-success" },
  "on-site": { label: "On-Site", class: "badge-info" },
  leave: { label: "On Leave", class: "badge-warning" },
  inactive: { label: "Inactive", class: "bg-muted text-muted-foreground" },
};

const departments = ["All", "Engineering", "Management", "Construction", "Electrical", "Finance", "Operations", "Design", "Administration"];

export default function Team() {
  const { data: employees, isLoading, error } = useEmployees();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [profileTab, setProfileTab] = useState<"profile" | "attendance" | "payroll">("profile");

  const filteredMembers = (employees || []).filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    setProfileTab("profile");
    setProfileOpen(true);
  };

  const handleEditDetails = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  };

  const handleViewAttendance = (employee: Employee) => {
    setSelectedEmployee(employee);
    setProfileTab("attendance");
    setProfileOpen(true);
  };

  const handleViewPayroll = (employee: Employee) => {
    setSelectedEmployee(employee);
    setProfileTab("payroll");
    setProfileOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingEmployee(null);
  };

  // Stats calculation
  const totalEmployees = employees?.length || 0;
  const onSiteCount = filteredMembers.filter((m) => m.status === "on-site").length;
  const onLeaveCount = filteredMembers.filter((m) => m.status === "leave").length;
  const uniqueDepartments = new Set(employees?.map((e) => e.department) || []).size;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading employees: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage employees, attendance, and assignments
          </p>
        </div>
        <Button 
          className="bg-gradient-orange hover:opacity-90 text-accent-foreground gap-2"
          onClick={() => setFormOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <User className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalEmployees}</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <CheckCircle2 className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{onSiteCount}</p>
                <p className="text-sm text-muted-foreground">On-Site Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{onLeaveCount}</p>
                <p className="text-sm text-muted-foreground">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <UsersIcon className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{uniqueDepartments}</p>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {departments.slice(0, 5).map((dept) => (
            <Button
              key={dept}
              variant={selectedDepartment === dept ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDepartment(dept)}
              className={cn(
                selectedDepartment === dept && "bg-accent hover:bg-accent/90"
              )}
            >
              {dept}
            </Button>
          ))}
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            More
          </Button>
        </div>
      </div>

      {/* Team Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      ) : filteredMembers.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {searchQuery || selectedDepartment !== "All" 
              ? "No employees match your search." 
              : "No employees yet. Add your first team member!"}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMembers.map((member, index) => {
            const statusInfo = statusConfig[member.status] || statusConfig.active;
            return (
              <Card
                key={member.id}
                className="card-hover"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <Avatar className="h-12 w-12 bg-accent/10 text-accent">
                      <AvatarFallback className="bg-accent/10 text-accent font-semibold">
                        {member.avatar_initials || member.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfile(member)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditDetails(member)}>
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewAttendance(member)}>
                          View Attendance
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewPayroll(member)}>
                          View Payroll
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>

                    <Badge className={cn("border text-xs", statusInfo.class)}>
                      {statusInfo.label}
                    </Badge>

                    <div className="space-y-2 pt-2 border-t border-border">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">
                          {member.project?.name || "No project assigned"}
                        </span>
                      </div>
                      {member.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span>{member.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        <span>Since {format(new Date(member.join_date), "MMM yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <EmployeeFormModal 
        open={formOpen} 
        onOpenChange={handleCloseForm}
        employee={editingEmployee}
      />
      <EmployeeProfileModal 
        open={profileOpen} 
        onOpenChange={setProfileOpen}
        employee={selectedEmployee}
        defaultTab={profileTab}
      />
    </div>
  );
}
