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
          <h2 className="text-2xl font-bold text-zinc-200">Productos</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Button
          onClick={handleCreateProduct}
          className="bg-orange-500 hover:bg-orange-600 text-white"
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
            className="pl-9 bg-zinc-800/50 border-zinc-700 text-white focus-visible:ring-orange-500"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Productos</p>
              <p className="text-2xl font-bold mt-1 text-blue-800">{products.length}</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">Bajo Stock</p>
              <p className="text-2xl font-bold mt-1 text-amber-800">
                {products.filter(p => p.stock > 0 && p.stock < 10).length}
              </p>
            </div>
            <div className="p-3 bg-amber-500 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Sin Stock</p>
              <p className="text-2xl font-bold mt-1 text-red-800">
                {products.filter(p => p.stock === 0).length}
              </p>
            </div>
            <div className="p-3 bg-red-500 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-emerald-600 font-medium">Categorías</p>
              <p className="text-2xl font-bold mt-1 text-emerald-800">
                {new Set(products.map(p => p.category_id)).size}
              </p>
            </div>
            <div className="p-3 bg-emerald-500 rounded-full">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabla de productos */}
      <div className="rounded-lg border border-zinc-800 overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
                <TableHead className="text-zinc-400">Producto</TableHead>
                <TableHead className="text-zinc-400">Categoría</TableHead>
                <TableHead className="text-zinc-400">Precio</TableHead>
                <TableHead className="text-zinc-400">Stock</TableHead>
                <TableHead className="text-zinc-400">Estado</TableHead>
                <TableHead className="text-zinc-400 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-zinc-400 py-8"
                  >
                    No se encontraron productos
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="hover:bg-zinc-800/50 border-zinc-800"
                  >
                    <TableCell className="font-medium text-zinc-200">
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
                          <p className="text-sm text-zinc-400">
                            {product.short_description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      {product.categories?.name || "Sin categoría"}
                    </TableCell>
                    <TableCell className="text-zinc-400">
                      <span className="font-bold text-green-600">
                        {formatCLP(product.price)}
                      </span>
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
                      <Badge
                        variant={product.is_active ? "success" : "secondary"}
                      >
                        {product.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditProduct(product)}
                          className="hover:bg-zinc-800 hover:text-orange-500"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteClick(product.id)}
                          className="hover:bg-zinc-800 hover:text-red-500"
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
        )}
      </div>

      {/* Modal de formulario */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-white text-gray-900 border border-gray-200 w-[95vw] max-w-[900px] h-[95vh] max-h-[95vh] flex flex-col p-0 gap-0">
          <DialogHeader className="border-b border-gray-200 p-4 sm:p-6 flex-shrink-0">
            <DialogTitle className="text-gray-900 text-lg sm:text-xl font-semibold">
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
        <AlertDialogContent className="bg-zinc-900 text-zinc-200 border border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar este producto?</AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              El producto será eliminado permanentemente.
              Si tiene pedidos asociados, verás un mensaje de error.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              onClick={() => setDeleteProductId(null)}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
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