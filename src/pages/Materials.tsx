import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Boxes,
  Building2,
  Edit,
  Trash2,
  History,
  MoreHorizontal,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample materials data
const materials = [
  {
    id: 1,
    name: "Portland Cement Type 1",
    unit: "bag (40kg)",
    supplier: "Holcim Philippines",
    category: "Concrete",
    createdAt: "Mar 2024",
  },
  {
    id: 2,
    name: "Steel Reinforcement Bar 10mm",
    unit: "piece (6m)",
    supplier: "Steel Asia",
    category: "Steel",
    createdAt: "Mar 2024",
  },
  {
    id: 3,
    name: "Steel Reinforcement Bar 16mm",
    unit: "piece (6m)",
    supplier: "Steel Asia",
    category: "Steel",
    createdAt: "Mar 2024",
  },
  {
    id: 4,
    name: "Hollow Blocks 4\"",
    unit: "piece",
    supplier: "Metro Block Manufacturing",
    category: "Masonry",
    createdAt: "Apr 2024",
  },
  {
    id: 5,
    name: "Plywood 1/2\"",
    unit: "sheet (4x8)",
    supplier: "Filply Corporation",
    category: "Wood",
    createdAt: "Apr 2024",
  },
  {
    id: 6,
    name: "THHN Wire #12",
    unit: "roll (150m)",
    supplier: "Phelps Dodge",
    category: "Electrical",
    createdAt: "May 2024",
  },
  {
    id: 7,
    name: "Washed Sand",
    unit: "cubic meter",
    supplier: "Davao Sand & Gravel",
    category: "Aggregates",
    createdAt: "Mar 2024",
  },
  {
    id: 8,
    name: "Gravel 3/4\"",
    unit: "cubic meter",
    supplier: "Davao Sand & Gravel",
    category: "Aggregates",
    createdAt: "Mar 2024",
  },
];

const suppliers = [
  {
    id: 1,
    name: "Holcim Philippines",
    contact: "+63 2 8459 8888",
    email: "orders@holcim.ph",
    address: "Makati City",
    products: ["Cement", "Ready-mix Concrete"],
    materials: 3,
  },
  {
    id: 2,
    name: "Steel Asia",
    contact: "+63 2 8818 2821",
    email: "sales@steelasia.com",
    address: "Valenzuela City",
    products: ["Steel Bars", "Steel Sheets"],
    materials: 5,
  },
  {
    id: 3,
    name: "Metro Block Manufacturing",
    contact: "+63 82 234 5678",
    email: "info@metroblocks.ph",
    address: "Davao City",
    products: ["Hollow Blocks", "Pavers"],
    materials: 2,
  },
  {
    id: 4,
    name: "Phelps Dodge",
    contact: "+63 2 8856 3888",
    email: "order@pdic.com.ph",
    address: "Laguna",
    products: ["Electrical Wires", "Cables"],
    materials: 4,
  },
  {
    id: 5,
    name: "Davao Sand & Gravel",
    contact: "+63 82 321 9876",
    email: "supply@dsg.ph",
    address: "Davao City",
    products: ["Sand", "Gravel", "Aggregates"],
    materials: 3,
  },
];

const materialHistory = [
  {
    id: 1,
    action: "Created",
    material: "Portland Cement Type 1",
    user: "Maria Clara Reyes",
    date: "Mar 15, 2024",
  },
  {
    id: 2,
    action: "Updated",
    material: "Steel Reinforcement Bar 10mm",
    user: "Engr. Roberto Santos",
    date: "Jan 10, 2026",
  },
  {
    id: 3,
    action: "Created",
    material: "THHN Wire #12",
    user: "Maria Clara Reyes",
    date: "May 20, 2024",
  },
];

const categories = ["All", "Concrete", "Steel", "Masonry", "Wood", "Electrical", "Aggregates"];

export default function Materials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Material Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage material catalog and suppliers
          </p>
        </div>
        <Button className="bg-gradient-orange hover:opacity-90 text-accent-foreground gap-2">
          <Plus className="h-4 w-4" />
          Add Material
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/10 p-2">
                <Boxes className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">{materials.length}</p>
                <p className="text-sm text-muted-foreground">Total Materials</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2">
                <Building2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{suppliers.length}</p>
                <p className="text-sm text-muted-foreground">Suppliers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-accent/10 p-2">
                <Package className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.length - 1}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2">
                <History className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Changes (30d)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="materials" className="space-y-4">
        <TabsList>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.slice(0, 5).map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={selectedCategory === cat ? "bg-accent hover:bg-accent/90" : ""}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material Name</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMaterials.map((material) => (
                    <TableRow key={material.id} className="table-row-hover">
                      <TableCell className="font-medium">{material.name}</TableCell>
                      <TableCell className="text-muted-foreground">{material.unit}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{material.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{material.supplier}</TableCell>
                      <TableCell className="text-muted-foreground">{material.createdAt}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-accent/10 p-2">
                        <Building2 className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{supplier.name}</h3>
                        <p className="text-sm text-muted-foreground">{supplier.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{supplier.contact}</p>
                    <p className="text-muted-foreground">{supplier.email}</p>
                    <div className="flex flex-wrap gap-1 pt-2">
                      {supplier.products.map((product) => (
                        <Badge key={product} variant="secondary" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3 mt-3 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      {supplier.materials} materials linked
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Change History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialHistory.map((entry) => (
                    <TableRow key={entry.id} className="table-row-hover">
                      <TableCell>
                        <Badge variant="secondary">{entry.action}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{entry.material}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.user}</TableCell>
                      <TableCell className="text-muted-foreground">{entry.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
