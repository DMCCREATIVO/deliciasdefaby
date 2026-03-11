import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Copy, Pencil, Trash2, AlertTriangle } from "lucide-react";
import type { Product } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleActive: (productId: string, currentState: boolean) => void;
  onDuplicate?: (product: Product) => void;
}

type SortField = "title" | "price" | "stock" | "created_at";
type SortOrder = "asc" | "desc";

export const ProductList = ({
  products,
  onEdit,
  onDelete,
  onToggleActive,
  onDuplicate,
}: ProductListProps) => {
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(price);
  };

  const sortProducts = (products: Product[]) => {
    return [...products].sort((a, b) => {
      if (sortField === "price") {
        return sortOrder === "asc" ? Number(a.price) - Number(b.price) : Number(b.price) - Number(a.price);
      }
      if (sortField === "stock") {
        return sortOrder === "asc" ? (a.stock || 0) - (b.stock || 0) : (b.stock || 0) - (a.stock || 0);
      }
      if (sortField === "created_at") {
        return sortOrder === "asc" 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return sortOrder === "asc" 
        ? a[sortField].localeCompare(b[sortField])
        : b[sortField].localeCompare(a[sortField]);
    });
  };

  const sortedProducts = sortProducts(products);

  const isLowStock = (stock: number | null | undefined) => {
    return stock !== null && stock !== undefined && stock < 5;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select
          value={sortField}
          onValueChange={(value) => setSortField(value as SortField)}
        >
          <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="title" className="text-white hover:bg-zinc-700">Nombre</SelectItem>
            <SelectItem value="price" className="text-white hover:bg-zinc-700">Precio</SelectItem>
            <SelectItem value="stock" className="text-white hover:bg-zinc-700">Stock</SelectItem>
            <SelectItem value="created_at" className="text-white hover:bg-zinc-700">Fecha de creación</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortOrder}
          onValueChange={(value) => setSortOrder(value as SortOrder)}
        >
          <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Orden" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="asc" className="text-white hover:bg-zinc-700">Ascendente</SelectItem>
            <SelectItem value="desc" className="text-white hover:bg-zinc-700">Descendente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-zinc-700">
            <TableHead className="text-zinc-100">Estado</TableHead>
            <TableHead className="text-zinc-100">Imagen</TableHead>
            <TableHead className="text-zinc-100">Nombre</TableHead>
            <TableHead className="text-zinc-100">Categoría</TableHead>
            <TableHead className="text-zinc-100">Precio</TableHead>
            <TableHead className="text-zinc-100">Stock</TableHead>
            <TableHead className="text-zinc-100">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProducts.map((product) => (
            <TableRow key={product.id} className="border-zinc-700">
              <TableCell>
                <Switch
                  checked={product.is_active}
                  onCheckedChange={() => onToggleActive(product.id, product.is_active)}
                  className="data-[state=checked]:bg-green-500"
                />
              </TableCell>
              <TableCell>
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded"
                />
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-white font-medium">{product.title}</p>
                  <p className="text-sm text-zinc-300">{product.description}</p>
                </div>
              </TableCell>
              <TableCell className="text-zinc-100">
                {(product as any).categories?.name || 'Sin categoría'}
              </TableCell>
              <TableCell className="text-white font-medium">{formatPrice(Number(product.price))}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-zinc-100">{product.stock}</span>
                  {isLowStock(product.stock) && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Stock bajo
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                    onClick={() => onEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  {onDuplicate && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-zinc-300 hover:text-white hover:bg-zinc-800"
                      onClick={() => onDuplicate(product)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-500 hover:bg-zinc-800"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};