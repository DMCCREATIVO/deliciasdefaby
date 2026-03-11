import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { PackageOpen, Search, Filter } from "lucide-react";
import type { SearchFilters } from "@/components/SearchBar";
import { toast } from "@/components/ui/use-toast";
import { ProductGrid } from "@/components/product/ProductGrid";
import { db } from "@/lib/database";

const Products = () => {
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
        // Intentar obtener productos de PocketBase
        const allProducts = await db.products.getAll();
        console.log('PRODUCTOS DESDE POCKETBASE:', allProducts);
        
        let filteredProducts = allProducts;

        // Filtrar por query
        if (filters.query) {
          filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(filters.query.toLowerCase())
          );
        }

        // Filtrar por categoría
        if (filters.category) {
          filteredProducts = filteredProducts.filter(product => 
            product.categories?.name === filters.category
          );
        }

        // Filtrar por precio
        if (filters.minPrice !== undefined) {
          filteredProducts = filteredProducts.filter(product => 
            product.price >= filters.minPrice!
          );
        }
        if (filters.maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter(product => 
            product.price <= filters.maxPrice!
          );
        }

        // Ordenar
        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'price-asc':
              filteredProducts.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filteredProducts.sort((a, b) => b.price - a.price);
              break;
            case 'name-asc':
              filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
              break;
            case 'name-desc':
              filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
              break;
          }
        }

        return filteredProducts;
      } catch (error: any) {
        console.log('🔄 PocketBase no disponible temporalmente, mostrando productos de ejemplo...');
        
        // Productos de ejemplo completos
        const sampleProducts = [
          {
            id: 'sample-1',
            title: 'Pastel de Chocolate',
            description: 'Delicioso pastel de chocolate con tres leches, perfecto para celebraciones especiales',
            short_description: 'Pastel de chocolate tradicional',
            price: 8500,
            compare_at_price: null,
            weight: null,
            stock: 10,
            category_id: null,
            image_url: null,
            images: null,
            is_active: true,
            is_featured: true,
            available_days: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categories: undefined
          },
          {
            id: 'sample-2',
            title: 'Torta de Merengue',
            description: 'Ligera torta de merengue con frutas frescas de temporada',
            short_description: 'Torta de merengue',
            price: 7200,
            compare_at_price: null,
            weight: null,
            stock: 8,
            category_id: null,
            image_url: null,
            images: null,
            is_active: true,
            is_featured: false,
            available_days: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categories: undefined
          },
          {
            id: 'sample-3',
            title: 'Cheesecake de Frutos Rojos',
            description: 'Clásico cheesecake con salsa de frutos rojos, postre ideal para cualquier ocasión',
            short_description: 'Cheesecake',
            price: 9200,
            compare_at_price: null,
            weight: null,
            stock: 6,
            category_id: null,
            image_url: null,
            images: null,
            is_active: true,
            is_featured: true,
            available_days: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categories: undefined
          },
          {
            id: 'sample-4',
            title: 'Brownie con Nueces',
            description: 'Húmedo brownie de chocolate con nueces, acompañado de helado',
            short_description: 'Brownie de chocolate',
            price: 4500,
            compare_at_price: null,
            weight: null,
            stock: 15,
            category_id: null,
            image_url: null,
            images: null,
            is_active: true,
            is_featured: false,
            available_days: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categories: undefined
          },
          {
            id: 'sample-5',
            title: 'Tiramisú Clásico',
            description: 'Auténtico tiramisú italiano con café y mascarpone',
            short_description: 'Tiramisú',
            price: 6800,
            compare_at_price: null,
            weight: null,
            stock: 12,
            category_id: null,
            image_url: null,
            images: null,
            is_active: true,
            is_featured: true,
            available_days: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categories: undefined
          }
        ];

        let filteredProducts = sampleProducts;

        // Aplicar mismos filtros a productos de ejemplo
        if (filters.query) {
          filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(filters.query.toLowerCase())
          );
        }

        if (filters.minPrice !== undefined) {
          filteredProducts = filteredProducts.filter(product => 
            product.price >= filters.minPrice!
          );
        }
        if (filters.maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter(product => 
            product.price <= filters.maxPrice!
          );
        }

        if (filters.sortBy) {
          switch (filters.sortBy) {
            case 'price-asc':
              filteredProducts.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              filteredProducts.sort((a, b) => b.price - a.price);
              break;
            case 'name-asc':
              filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
              break;
            case 'name-desc':
              filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
              break;
          }
        }

        return filteredProducts;
      }
    },
  });

  const handleSearch = (newFilters: SearchFilters) => {
    console.log('Applying new filters:', newFilters);
    setFilters(newFilters);
  };

  const featuredProducts = products?.filter(product => product.is_featured) || [];
  const regularProducts = products?.filter(product => !product.is_featured) || [];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-brand-beige/20 via-background to-brand-beige/10">
        {/* Hero Section */}
        <div className="relative py-16 md:py-20 bg-gradient-to-br from-brand-cafe via-brand-brown to-brand-cafe overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-cafe/50 to-transparent" />
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <PackageOpen className="w-10 h-10 md:w-12 md:h-12 text-white" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Nuestros Productos
              </h1>
            </motion.div>
            
            <motion.p 
              className="text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explora nuestra selección de productos artesanales hechos con amor y dedicación
            </motion.p>

            {/* Estadísticas rápidas */}
            <motion.div
              className="flex flex-wrap justify-center gap-4 md:gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 md:px-6 md:py-3">
                <div className="text-white font-bold text-xl md:text-2xl">
                  {products?.length || 0}
                </div>
                <div className="text-white/80 text-xs md:text-sm">
                  Productos
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 md:px-6 md:py-3">
                <div className="text-white font-bold text-xl md:text-2xl">
                  {featuredProducts.length}
                </div>
                <div className="text-white/80 text-xs md:text-sm">
                  Destacados
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            {/* Barra de búsqueda mejorada */}
            <motion.section 
              className="mb-8 md:mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-brand-cafe/20 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="w-5 h-5 text-brand-cafe" />
                  <h2 className="text-lg md:text-xl font-semibold text-brand-cafe">
                    Buscar y Filtrar
                  </h2>
                </div>
                <SearchBar onSearch={handleSearch} />
              </div>
            </motion.section>

            {/* Resultados */}
            <motion.section 
              className="space-y-8 md:space-y-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {featuredProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <ProductGrid 
                    products={featuredProducts} 
                    title="🌟 Productos Destacados" 
                    isLoading={isLoading} 
                  />
                </motion.div>
              )}

              {regularProducts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <ProductGrid 
                    products={regularProducts} 
                    title="📦 Todos los Productos" 
                    isLoading={isLoading} 
                  />
                </motion.div>
              )}

              {/* Estado vacío mejorado */}
              {(!featuredProducts.length && !regularProducts.length && !isLoading) && (
                <motion.div 
                  className="text-center py-16 md:py-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-brand-cafe/20 max-w-md mx-auto">
                    <PackageOpen className="w-16 h-16 md:w-20 md:h-20 text-brand-cafe/40 mx-auto mb-6" />
                    <h3 className="text-xl md:text-2xl font-bold text-brand-cafe mb-3">
                      No se encontraron productos
                    </h3>
                    <p className="text-brand-cafe/70 mb-6">
                      Intenta ajustar tus filtros de búsqueda o explora todas nuestras categorías
                    </p>
                    <button
                      onClick={() => setFilters({
                        query: '',
                        category: undefined,
                        minPrice: undefined,
                        maxPrice: undefined,
                        sortBy: undefined
                      })}
                      className="bg-brand-cafe hover:bg-brand-brown text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;