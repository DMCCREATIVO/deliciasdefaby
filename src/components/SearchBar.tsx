import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { categoryService, productService } from "@/lib/database/index";

export interface SearchFilters {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: undefined
  });

  // Inicializar con un rango más amplio
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await categoryService.getAll();
    }
  });

  // Obtener el rango de precios máximo y mínimo de los productos
  const { data: priceStats } = useQuery({
    queryKey: ['price-stats'],
    queryFn: async () => {
      const allProducts = await productService.getAll();
      if (allProducts.length === 0) return { min: 0, max: 1000000 };

      const prices = allProducts.map(p => p.price);
      return {
        min: Math.min(...prices),
        max: Math.max(...prices)
      };
    }
  });

  // Actualizar el rango de precios cuando se obtengan los stats
  useEffect(() => {
    if (priceStats) {
      setPriceRange([priceStats.min, priceStats.max]);
    }
  }, [priceStats]);

  const handleSearch = () => {
    onSearch({
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    });
  };

  // Ejecutar búsqueda cuando cambie el texto
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [filters.query]);

  return (
    <div className="flex gap-2 w-full max-w-3xl mx-auto">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          className="pl-10"
          placeholder="Buscar productos..."
        />
      </div>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filtros de Búsqueda</SheetTitle>
            <SheetDescription>
              Ajusta los filtros para encontrar exactamente lo que buscas
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select
                value={filters.category}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rango de Precio</label>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={priceStats?.min || 0}
                max={priceStats?.max || 1000000}
                step={1000}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>${priceRange[0].toLocaleString()}</span>
                <span>${priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar por</label>
              <Select
                value={filters.sortBy}
                onValueChange={(value: SearchFilters['sortBy']) =>
                  setFilters({ ...filters, sortBy: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar orden" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="name-asc">Nombre: A-Z</SelectItem>
                  <SelectItem value="name-desc">Nombre: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" onClick={handleSearch}>
              Aplicar Filtros
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};