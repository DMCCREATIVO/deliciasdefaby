import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categoryService } from "@/lib/database/index";
import { Category } from "@/lib/database/types";
import { type CategoryFormValues } from "@/lib/validations/category";
import { CategoryForm } from "@/components/admin/CategoryForm";

const Categorias = () => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: async (newCategory: CategoryFormValues) => {
      try {
        const result = await categoryService.create(newCategory);
        return result;
      } catch (error: any) {
        console.error("Error detallado:", error);
        if (error?.message?.includes("duplicate key")) {
          throw new Error("Ya existe una categoría con este slug");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría creada exitosamente");
      handleCloseDialog();
    },
    onError: (error: Error) => {
      console.error("Error creating category:", error);
      toast.error(error.message || "Error al crear la categoría");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryFormValues }) => {
      try {
        const result = await categoryService.update(id, data);
        return result;
      } catch (error: any) {
        console.error("Error detallado:", error);
        if (error?.message?.includes("duplicate key")) {
          throw new Error("Ya existe una categoría con este slug");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría actualizada exitosamente");
      handleCloseDialog();
    },
    onError: (error: Error) => {
      console.error("Error updating category:", error);
      toast.error(error.message || "Error al actualizar la categoría");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Categoría eliminada exitosamente");
    },
    onError: (error: Error) => {
      console.error("Error deleting category:", error);
      toast.error("Error al eliminar la categoría");
    },
  });

  const handleSubmit = async (data: CategoryFormValues) => {
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({ id: selectedCategory.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
      // El error ya será manejado por las mutaciones
    }
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-zinc-200">Categorías</h2>
          <p className="text-sm text-zinc-400 mt-1">
            Gestiona las categorías de tus productos
          </p>
        </div>
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Buscar categorías..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm bg-zinc-800/50 border-zinc-700 text-white focus-visible:ring-orange-500"
          />
        </div>

        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-zinc-800/50 border-zinc-800">
                  <TableHead className="text-zinc-400">Nombre</TableHead>
                  <TableHead className="text-zinc-400">Descripción</TableHead>
                  <TableHead className="text-zinc-400">Slug</TableHead>
                  <TableHead className="text-zinc-400 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-zinc-400 py-8"
                    >
                      No se encontraron categorías
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow
                      key={category.id}
                      className="hover:bg-zinc-800/50 border-zinc-800"
                    >
                      <TableCell className="font-medium text-zinc-200">
                        {category.name}
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {category.description || "—"}
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {category.slug}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(category)}
                            className="hover:bg-zinc-800 hover:text-orange-500"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(category.id)}
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
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-zinc-900 text-zinc-200 border border-zinc-800 sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCategory ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm
            category={selectedCategory}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categorias;