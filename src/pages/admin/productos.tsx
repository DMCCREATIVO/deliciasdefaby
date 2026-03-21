import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  ArrowUpDown,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductForm } from "@/components/admin/ProductForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db, type Product } from "@/lib/database";
import type { ProductFormValues } from "@/lib/validations/product";
import { formatCLP } from "@/utils/currency";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products-admin"],
    queryFn: () => db.products.getAllAdmin(),
  });

  const createMutation = useMutation({
    mutationFn: async (newProduct: ProductFormValues) => {
      console.log('🏗️ Iniciando creación de producto:', newProduct);
      try {
        const result = await db.products.create(newProduct);
        console.log('✅ Producto creado exitosamente:', result);
        return result;
      } catch (error: any) {
        console.error("💥 Error detallado al crear producto:", error);
        console.error("📋 Stack trace:", error.stack);
        throw new Error(error.message || "Error al crear el producto");
      }
    },
    onSuccess: (data) => {
      console.log('🎉 Mutación de creación exitosa:', data);
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      toast.success("Producto creado exitosamente");
      handleCloseDialog();
    },
    onError: (error: Error) => {
      console.error("🚨 Error en mutación de creación:", error);
      toast.error(`Error al crear producto: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProductFormValues }) => {
      console.log('🔄 Iniciando actualización de producto:', { id, data });
      try {
        const result = await db.products.update(id, data);
        console.log('✅ Producto actualizado exitosamente:', result);
        return result;
      } catch (error: any) {
        console.error("💥 Error detallado al actualizar producto:", error);
        console.error("📋 Stack trace:", error.stack);
        throw new Error(error.message || "Error al actualizar el producto");
      }
    },
    onSuccess: (data) => {
      console.log('🎉 Mutación de actualización exitosa:', data);
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      toast.success("Producto actualizado exitosamente");
      handleCloseDialog();
    },
    onError: (error: Error) => {
      console.error("🚨 Error en mutación de actualización:", error);
      toast.error(`Error al actualizar producto: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await db.products.hardDelete(id);
      } catch (error: any) {
        console.error("Error detallado:", error);
        throw new Error(error.message || "Error al eliminar el producto");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products-admin"] });
      toast.success("Producto eliminado exitosamente");
      setDeleteProductId(null);
    },
    onError: (error: Error) => {
      console.error("Error deleting product:", error);
      toast.error(error.message);
    },
  });

  const handleCreateProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteProductId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteProductId) return;
    await deleteMutation.mutateAsync(deleteProductId);
  };

  const handleSubmit = async (data: ProductFormValues) => {
    console.log('📝 handleSubmit llamado con:', data);
    console.log('🔍 selectedProduct:', selectedProduct);

    try {
      if (selectedProduct) {
        console.log('🔄 Actualizando producto existente...');
        await updateMutation.mutateAsync({ id: selectedProduct.id, data });
      } else {
        console.log('🆕 Creando nuevo producto...');
        await createMutation.mutateAsync(data);
      }
      console.log('✅ handleSubmit completado exitosamente');
    } catch (error) {
      console.error("💥 Error en handleSubmit:", error);
      // El error ya será manejado por las mutaciones
    }
  };

  const handleCloseDialog = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  // Filtrar productos según el término de búsqueda
  const filteredProducts = products.filter(product =>
    (product?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (product?.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      {/* Header con acciones */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold admin-text-primary">Productos</h2>
          <p className="text-sm admin-text-muted mt-1">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Button
          onClick={handleCreateProduct}
          className="admin-button-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-input pl-9 focus-visible:ring-[color-mix(in_srgb,var(--theme-accent-secondary)_35%,_transparent)]"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="admin-button-secondary"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 admin-card shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--theme-accent-secondary)' }}>
                Total Productos
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent-secondary)' }}>
                {products.length}
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--theme-accent-secondary)' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 admin-card shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>
                Bajo Stock
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent)' }}>
                {products.filter(p => p.stock > 0 && p.stock < 10).length}
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--theme-accent)' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 admin-card shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--theme-accent-secondary)' }}>
                Sin Stock
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent-secondary)' }}>
                {products.filter(p => p.stock === 0).length}
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--theme-accent-secondary)' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 admin-card shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>
                Categorías
              </p>
              <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent)' }}>
                {new Set(products.map(p => p.category_id)).size}
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--theme-accent)' }}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de productos */}
      <div className="rounded-lg border overflow-hidden admin-table-container">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--theme-accent)' }} />
          </div>
        ) : (
          <>
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow className="admin-table-row">
                    <TableHead className="admin-table-head">Producto</TableHead>
                    <TableHead className="admin-table-head">Categoría</TableHead>
                    <TableHead className="admin-table-head">Precio</TableHead>
                    <TableHead className="admin-table-head">Stock</TableHead>
                    <TableHead className="admin-table-head">Estado</TableHead>
                    <TableHead className="admin-table-head text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center admin-text-muted py-8">
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} className="admin-table-row">
                        <TableCell className="font-medium admin-text-primary">
                          <div className="flex items-center gap-3">
                            {product.image_url && (
                              <img
                                src={product.image_url}
                                alt={product.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{product.title}</p>
                              <p className="text-sm admin-text-muted">{product.short_description}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="admin-table-cell-muted">
                          {product.categories?.name || "Sin categoría"}
                        </TableCell>
                        <TableCell className="admin-table-cell-muted">
                          <span className="font-bold admin-text-accent">{formatCLP(product.price)}</span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.stock === 0
                                ? "destructive"
                                : product.stock < 10
                                  ? "warning"
                                  : "default"
                            }
                          >
                            {product.stock} unidades
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.is_active ? "success" : "secondary"}>
                            {product.is_active ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleEditProduct(product)}
                              className="hover:bg-[color-mix(in_srgb,var(--theme-accent)_18%,transparent)] hover:text-[var(--theme-accent)]"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteClick(product.id)}
                              className="hover:bg-[color-mix(in_srgb,var(--admin-error)_18%,transparent)] hover:text-[var(--admin-error)]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="sm:hidden p-3 space-y-3">
              {filteredProducts.length === 0 ? (
                <div className="p-8 text-center admin-text-muted">No se encontraron productos</div>
              ) : (
                filteredProducts.map((product) => (
                  <div key={product.id} className="admin-card shadow-none p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex items-center gap-3">
                        {product.image_url && (
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-10 h-10 rounded-lg object-cover border border-[var(--theme-card-border)]"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-medium admin-text-primary truncate">{product.title}</p>
                          <p className="text-sm admin-text-muted line-clamp-2">{product.short_description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            product.stock === 0
                              ? "destructive"
                              : product.stock < 10
                                ? "warning"
                                : "default"
                          }
                        >
                          {product.stock} u
                        </Badge>
                        <Badge variant={product.is_active ? "success" : "secondary"}>
                          {product.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <p className="text-xs admin-text-muted">Categoría</p>
                        <p className="text-sm admin-text-primary">{product.categories?.name || "Sin categoría"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs admin-text-muted">Precio</p>
                        <p className="text-sm font-bold admin-text-accent">{formatCLP(product.price)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditProduct(product)}
                        className="hover:bg-[color-mix(in_srgb,var(--theme-accent)_18%,transparent)] hover:text-[var(--theme-accent)]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteClick(product.id)}
                        className="hover:bg-[color-mix(in_srgb,var(--admin-error)_18%,transparent)] hover:text-[var(--admin-error)]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal de formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[95vw] max-w-[900px] h-[95vh] max-h-[95vh] flex flex-col p-0 gap-0">
          <DialogHeader className="border-b border-[var(--theme-card-border)] p-4 sm:p-6 flex-shrink-0">
            <DialogTitle className="admin-dialog-title text-lg sm:text-xl font-semibold">
              {selectedProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0 p-4 sm:p-6">
            <ProductForm
              product={selectedProduct}
              onSubmit={handleSubmit}
              onCancel={handleCloseDialog}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={!!deleteProductId} onOpenChange={(open) => !open && setDeleteProductId(null)}>
        <AlertDialogContent className="admin-dialog-content">
          <AlertDialogHeader>
            <AlertDialogTitle className="admin-dialog-title">¿Eliminar este producto?</AlertDialogTitle>
            <AlertDialogDescription className="admin-text-muted">
              El producto será eliminado permanentemente.
              Si tiene pedidos asociados, verás un mensaje de error.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="admin-alert-action-cancel"
              onClick={() => setDeleteProductId(null)}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="admin-alert-action-primary"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}