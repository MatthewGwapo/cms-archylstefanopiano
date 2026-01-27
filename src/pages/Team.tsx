import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

// Sample team data
const teamMembers = [
  {
    id: 1,
    name: "Engr. Roberto Santos",
    role: "Site Engineer",
    department: "Engineering",
    status: "active",
    project: "SM Lanang Premier Expansion",
    phone: "+63 917 123 4567",
    email: "r.santos@metalift.ph",
    joinDate: "Jan 2020",
    avatar: "RS",
  },
  {
    id: 2,
    name: "Maria Clara Reyes",
    role: "Project Manager",
    department: "Management",
    status: "active",
    project: "Davao IT Park Tower 3",
    phone: "+63 918 234 5678",
    email: "mc.reyes@metalift.ph",
    joinDate: "Mar 2019",
    avatar: "MR",
  },
  {
    id: 3,
    name: "Juan Dela Cruz",
    role: "Mason",
    department: "Construction",
    status: "on-site",
    project: "SM Lanang Premier Expansion",
    phone: "+63 919 345 6789",
    email: "j.delacruz@metalift.ph",
    joinDate: "Aug 2022",
    avatar: "JD",
  },
  {
    id: 4,
    name: "Pedro Aquino",
    role: "Electrician",
    department: "Electrical",
    status: "on-site",
    project: "Warehouse Renovation - DPWH",
    phone: "+63 920 456 7890",
    email: "p.aquino@metalift.ph",
    joinDate: "Feb 2021",
    avatar: "PA",
  },
  {
    id: 5,
    name: "Elena Villanueva",
    role: "Finance Officer",
    department: "Finance",
    status: "active",
    project: "Admin Office",
    phone: "+63 921 567 8901",
    email: "e.villanueva@metalift.ph",
    joinDate: "Jun 2018",
    avatar: "EV",
  },
  {
    id: 6,
    name: "Antonio Garcia",
    role: "Heavy Equipment Operator",
    department: "Operations",
    status: "on-site",
    project: "Davao IT Park Tower 3",
    phone: "+63 922 678 9012",
    email: "a.garcia@metalift.ph",
    joinDate: "Oct 2020",
    avatar: "AG",
  },
  {
    id: 7,
    name: "Rosa Martinez",
    role: "Architect",
    department: "Design",
    status: "active",
    project: "Residential Complex - Toril",
    phone: "+63 923 789 0123",
    email: "r.martinez@metalift.ph",
    joinDate: "Apr 2019",
    avatar: "RM",
  },
  {
    id: 8,
    name: "Carlos Mendoza",
    role: "Foreman",
    department: "Construction",
    status: "on-site",
    project: "Warehouse Renovation - DPWH",
    phone: "+63 924 890 1234",
    email: "c.mendoza@metalift.ph",
    joinDate: "Dec 2017",
    avatar: "CM",
  },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  active: { label: "Active", class: "badge-success" },
  "on-site": { label: "On-Site", class: "badge-info" },
  leave: { label: "On Leave", class: "badge-warning" },
  inactive: { label: "Inactive", class: "bg-muted text-muted-foreground" },
};

const departments = ["All", "Engineering", "Management", "Construction", "Electrical", "Finance", "Operations", "Design"];

export default function Team() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      selectedDepartment === "All" || member.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

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
        <Button className="bg-gradient-orange hover:opacity-90 text-accent-foreground gap-2">
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
                <p className="text-2xl font-bold">47</p>
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
                <p className="text-2xl font-bold">35</p>
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
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Briefcase className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">5</p>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredMembers.map((member, index) => {
          const statusInfo = statusConfig[member.status];
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
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>View Attendance</DropdownMenuItem>
                      <DropdownMenuItem>View Payroll</DropdownMenuItem>
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
                      <span className="truncate">{member.project}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>Since {member.joinDate}</span>
                    </div>
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
