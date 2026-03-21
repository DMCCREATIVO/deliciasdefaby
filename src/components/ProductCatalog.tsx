import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/lib/database';

type SearchFilters = {
  query: string;
  category: string | undefined;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  sortBy: string | undefined;
};

export const ProductCatalog = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: undefined
  });

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      try {
        // Obtener todos los productos de PocketBase
        const allProducts = await productService.getAll();

        // Aplicar filtros manualmente
        let filtered = allProducts;

        // Filtrar por búsqueda
        if (filters.query) {
          filtered = filtered.filter(p =>
            p.title.toLowerCase().includes(filters.query.toLowerCase())
          );
        }

        // Filtrar por categoría
        if (filters.category && filtered[0]?.categories) {
          filtered = filtered.filter(p =>
            p.categories?.name === filters.category
          );
        }

        // Filtrar por precio mínimo
        if (filters.minPrice !== undefined) {
          filtered = filtered.filter(p => p.price >= filters.minPrice!);
        }

        // Filtrar por precio máximo
        if (filters.maxPrice !== undefined) {
          filtered = filtered.filter(p => p.price <= filters.maxPrice!);
        }

        // Ordenar
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'price-asc':
              filtered.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filtered.sort((a, b) => b.price - a.price);
              break;
            case 'name-asc':
              filtered.sort((a, b) => a.title.localeCompare(b.title));
              break;
            case 'name-desc':
              filtered.sort((a, b) => b.title.localeCompare(a.title));
              break;
          }
        }

        return filtered;
      } catch (error) {
        console.error('Error loading products:', error);
        return [];
      }
    }
  });

  const ProductSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-10 w-full" />
    </div>
  );

  const featuredProducts = products?.filter(product => product.is_featured) || [];
  const regularProducts = products?.filter(product => !product.is_featured) || [];

  return (
    <div className="w-full -mt-20 sm:-mt-28 lg:-mt-32 relative z-10 animate-fade-in" id="productos">
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="themed-catalog-section w-full backdrop-blur-xl rounded-xl shadow-2xl border p-4 sm:p-6 lg:p-8 transition-all duration-500">
          <section className="mb-8 lg:mb-12">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="themed-section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                Productos Destacados
              </h2>
              <p className="themed-section-subtitle text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
                Descubre nuestra selección especial de panes artesanales
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
                {[...Array(10)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {featuredProducts.length > 0 && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-center gap-2 text-brand-cafe">
                      <Sparkles className="w-5 h-5 animate-pulse text-brand-accent" />
                      <h3 className="text-lg font-medium animate-fade-right text-brand-cafe">Destacados</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 animate-fade-up">
                      {featuredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="animate-fade-up hover:scale-[1.02] transition-all duration-300"
                        >
                          <ProductCard
                            id={product.id}
                            title={product.title}
                            description={product.description || ''}
                            shortDescription={product.short_description}
                            price={Number(product.price)}
                            imageUrl={product.image_url || '/placeholder.svg'}
                            weight={product.weight}
                            category={product.categories?.name}
                            isFeatured={product.is_featured}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {regularProducts.length > 0 && (
                  <div className="space-y-4 sm:space-y-6">
                    <h3 className="text-lg font-medium text-brand-cafe/80 animate-fade-right">Todos los productos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 animate-fade-up">
                      {regularProducts.map((product) => (
                        <div
                          key={product.id}
                          className="animate-fade-up hover:scale-[1.02] transition-all duration-300"
                        >
                          <ProductCard
                            id={product.id}
                            title={product.title}
                            description={product.description || ''}
                            shortDescription={product.short_description}
                            price={Number(product.price)}
                            imageUrl={product.image_url || '/placeholder.svg'}
                            weight={product.weight}
                            category={product.categories?.name}
                            isFeatured={product.is_featured}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!featuredProducts.length && !regularProducts.length) && (
                  <div className="text-center py-12 text-brand-cafe/60">
                    No se encontraron productos
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-center mt-6 sm:mt-8 lg:mt-12">
              <Button
                size="lg"
                className="themed-catalog-btn border-0 font-medium px-8 sm:px-10 py-5 sm:py-7 text-base sm:text-lg shadow-xl transition-all duration-300 group rounded-full hover:scale-105"
                onClick={() => navigate('/productos')}
              >
                Ver catálogo completo
                <ChevronRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-2 transition-transform duration-300 ease-out" />
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};