import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { pb } from "@/lib/pocketbase/client";
import { productService, categoryService } from "@/lib/database/index";
import { Product } from "@/lib/database/types";
import { useQuery } from "@tanstack/react-query";

interface ProductFormData {
  title: string;
  description: string;
  short_description: string;
  price: number;
  weight: string;
  image_url: string;
  category_id: string;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  slug: string;
}

interface ProductFormProps {
  product?: Product;
  onClose: () => void;
}

export const ProductForm = ({ product, onClose }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    title: product?.title || '',
    description: product?.description || '',
    short_description: product?.short_description || '',
    price: product?.price || 0,
    weight: product?.weight ? String(product.weight) : '',
    image_url: product?.image_url || '',
    category_id: product?.category_id || '',
    stock: product?.stock || 0,
    is_active: product?.is_active ?? true,
    is_featured: product?.is_featured ?? false,
    slug: product?.slug || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        short_description: product.short_description || '',
        price: product.price || 0,
        weight: product.weight ? String(product.weight) : '',
        image_url: product.image_url || '',
        category_id: product.category_id || '',
        stock: product.stock || 0,
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        slug: product.slug || '',
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.price || !formData.category_id) {
      toast.error("Por favor complete los campos requeridos (Título, Precio, Categoría)");
      return;
    }

    setIsSubmitting(true);

    try {
      if (product?.id) {
        await productService.update(product.id, formData);
        toast.success("Producto actualizado exitosamente");
      } else {
        await productService.create(formData);
        toast.success("Producto creado exitosamente");
      }
      onClose();
    } catch (error) {
      console.error('Error:', error);
      toast.error("Hubo un error al guardar el producto");
    } finally {
      setIsSubmitting(false);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-white">
        {product ? "Editar Producto" : "Nuevo Producto"}
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="is_active">Estado del Producto</Label>
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_active: checked }))
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="is_featured">Destacado</Label>
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_featured: checked }))
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="title">Nombre del Producto</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="short_description">Descripción Corta</Label>
          <Textarea
            id="short_description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Breve descripción para mostrar en las tarjetas de productos"
          />
        </div>

        <div>
          <Label htmlFor="description">Descripción (Detalle)</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Descripción detallada del producto"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug (URL amigable)</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="e-g: torta-chocolate"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Peso (g / kg)</Label>
            <Input
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div>
            <Label htmlFor="category_id">Categoría</Label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full rounded-md bg-zinc-800 border-zinc-700 text-white"
              required
            >
              <option value="">Seleccionar categoría</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="image_url">URL de la Imagen Principal</Label>
          <Input
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="border-zinc-700 text-zinc-400 hover:bg-zinc-800"
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-brand-pink hover:bg-brand-pink/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Guardando..." : product ? "Guardar Cambios" : "Crear Producto"}
        </Button>
      </div>
    </form >
  );
};