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
  Loader2,
  Eye,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMaterials, useDeleteMaterial } from "@/hooks/useMaterials";
import { useSuppliers, useDeleteSupplier } from "@/hooks/useSuppliers";
import { MaterialFormModal } from "@/components/materials/MaterialFormModal";
import { SupplierFormModal } from "@/components/materials/SupplierFormModal";
import { MaterialHistoryModal } from "@/components/materials/MaterialHistoryModal";
import { Material, Supplier } from "@/types/database";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const categories = ["All", "Concrete", "Steel", "Masonry", "Wood", "Electrical", "Aggregates", "Plumbing", "Finishes", "Hardware", "Safety"];

export default function Materials() {
  const { data: materials, isLoading: materialsLoading } = useMaterials();
  const { data: suppliers, isLoading: suppliersLoading } = useSuppliers();
  const deleteMaterial = useDeleteMaterial();
  const deleteSupplier = useDeleteSupplier();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(null);
  
  // Supplier states
  const [supplierFormOpen, setSupplierFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [supplierDeleteOpen, setSupplierDeleteOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  
  // History modal
  const [historyOpen, setHistoryOpen] = useState(false);

  const filteredMaterials = (materials || []).filter((material) => {
    const matchesSearch = 
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredSuppliers = (suppliers || []).filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (supplier.address && supplier.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormOpen(true);
  };

  const handleDelete = (material: Material) => {
    setMaterialToDelete(material);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (materialToDelete) {
      await deleteMaterial.mutateAsync(materialToDelete.id);
      setDeleteDialogOpen(false);
      setMaterialToDelete(null);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingMaterial(null);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setSupplierFormOpen(true);
  };

  const handleDeleteSupplier = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setSupplierDeleteOpen(true);
  };

  const confirmDeleteSupplier = async () => {
    if (supplierToDelete) {
      await deleteSupplier.mutateAsync(supplierToDelete.id);
      setSupplierDeleteOpen(false);
      setSupplierToDelete(null);
    }
  };

  const handleCloseSupplierForm = () => {
    setSupplierFormOpen(false);
    setEditingSupplier(null);
  };

  // Calculate unique categories count
  const uniqueCategories = new Set(materials?.map((m) => m.category) || []).size;
  const totalStock = (materials || []).reduce((sum, m) => sum + m.stock, 0);

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
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setHistoryOpen(true)}>
            <History className="h-4 w-4" />
            View History
          </Button>
          <Button 
            className="bg-gradient-orange hover:opacity-90 text-accent-foreground gap-2"
            onClick={() => setFormOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Material
          </Button>
        </div>
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
                <p className="text-2xl font-bold">{materials?.length || 0}</p>
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
                <p className="text-2xl font-bold">{suppliers?.length || 0}</p>
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
                <p className="text-2xl font-bold">{uniqueCategories}</p>
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
                <p className="text-2xl font-bold">{totalStock.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Stock</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="materials" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          </TabsList>
          <Button variant="outline" className="gap-2" onClick={() => setSupplierFormOpen(true)}>
            <Building2 className="h-4 w-4" />
            Register Supplier
          </Button>
        </div>

        <TabsContent value="materials" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search materials or suppliers..."
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.slice(5).map((cat) => (
                    <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)}>
                      {cat}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {materialsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
              ) : filteredMaterials.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {searchQuery || selectedCategory !== "All" 
                    ? "No materials match your search." 
                    : "No materials yet. Add your first material!"}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material Name</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Stock</TableHead>
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
                        <TableCell className="text-right">
                          ₱{material.unit_price.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-semibold">{material.stock}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(material)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => handleDelete(material)}
                              >
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suppliers">
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {suppliersLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                {searchQuery ? "No suppliers match your search." : "No suppliers yet. Register your first supplier!"}
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-accent/10 p-2">
                          <Building2 className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{supplier.name}</h3>
                          <p className="text-sm text-muted-foreground">{supplier.address || "No address"}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDeleteSupplier(supplier)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">{supplier.contact || "No contact"}</p>
                      <p className="text-muted-foreground">{supplier.email || "No email"}</p>
                      {supplier.products && supplier.products.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-2">
                          {supplier.products.map((product) => (
                            <Badge key={product} variant="secondary" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <MaterialFormModal 
        open={formOpen} 
        onOpenChange={handleCloseForm}
        material={editingMaterial}
      />
      
      <SupplierFormModal
        open={supplierFormOpen}
        onOpenChange={handleCloseSupplierForm}
        supplier={editingSupplier}
      />
      
      <MaterialHistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{materialToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={supplierDeleteOpen} onOpenChange={setSupplierDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{supplierToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteSupplier}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
