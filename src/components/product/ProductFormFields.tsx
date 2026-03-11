import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProductFormData, Category } from "./types";

interface ProductFormFieldsProps {
  formData: ProductFormData;
  categories: Category[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export const ProductFormFields = ({
  formData,
  categories,
  onChange,
}: ProductFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title" className="text-white font-medium">Nombre del Producto</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={onChange}
          className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
          required
        />
      </div>

      <div>
        <Label htmlFor="description" className="text-white font-medium">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
          required
        />
      </div>

      <div>
        <Label htmlFor="price" className="text-white font-medium">Precio</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={onChange}
          className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="weight" className="text-white font-medium">Peso</Label>
          <Input
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={onChange}
            className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
            required
          />
        </div>
        <div>
          <Label htmlFor="category_id" className="text-white font-medium">Categoría</Label>
          <select
            id="category_id"
            name="category_id"
            value={formData.category_id}
            onChange={onChange}
            className="w-full rounded-md bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
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
        <Label htmlFor="stock" className="text-white font-medium">Stock</Label>
        <Input
          id="stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={onChange}
          className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
          required
        />
      </div>

      <div>
        <Label htmlFor="image_url" className="text-white font-medium">URL de la Imagen</Label>
        <Input
          id="image_url"
          name="image_url"
          value={formData.image_url}
          onChange={onChange}
          className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
          required
        />
      </div>
    </div>
  );
};