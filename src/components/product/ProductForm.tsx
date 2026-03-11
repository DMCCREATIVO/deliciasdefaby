import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { productService, categoryService } from "@/lib/database/index";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductFormHeader } from "./ProductFormHeader";
import { ProductFormFields } from "./ProductFormFields";
import { ProductFormActions } from "./ProductFormActions";
import type { Product, ProductFormData } from "./types";

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

export const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProductFormData>({
    title: product?.title || "",
    description: product?.description || "",
    price: product?.price || 0,
    weight: product?.weight || "",
    category_id: product?.category_id || "",
    stock: product?.stock || 0,
    image_url: product?.image_url || "",
    is_active: product?.is_active ?? true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await categoryService.getAll();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (product?.id) {
        await productService.update(product.id, formData);

        toast({
          title: "Producto actualizado",
          description: "El producto ha sido actualizado exitosamente",
        });
      } else {
        await productService.create(formData);

        toast({
          title: "Producto creado",
          description: "El producto ha sido creado exitosamente",
        });
      }

      // Invalidate queries to refresh lists
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });

      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Hubo un error al guardar el producto",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900 p-6 rounded-lg border border-zinc-800">
      <ProductFormHeader
        isEditing={!!product}
        isActive={formData.is_active}
        onActiveChange={(checked) =>
          setFormData((prev) => ({ ...prev, is_active: checked }))
        }
      />

      <ProductFormFields
        formData={formData}
        categories={categories || []}
        onChange={handleChange}
      />

      <ProductFormActions
        isLoading={isLoading}
        isEditing={!!product}
        onClose={onClose}
      />
    </form>
  );
};