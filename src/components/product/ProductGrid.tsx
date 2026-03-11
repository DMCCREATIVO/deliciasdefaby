import { ProductCard } from "@/components/ProductCard";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: any[];
  title: string;
  isLoading?: boolean;
}

export const ProductGrid = ({ products, title, isLoading }: ProductGridProps) => {
  if (isLoading) {
    return (
      <motion.section 
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-brand-cafe/20">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-brand-cafe/20">
              <Skeleton className="aspect-square rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          ))}
        </div>
      </motion.section>
    );
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <motion.section 
      className="space-y-6 md:space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header de la sección */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-brand-cafe/20 shadow-lg">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-brand-cafe mb-2">
          {title}
        </h2>
        <p className="text-brand-cafe/70 text-sm md:text-base">
          {products.length} producto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ y: -5 }}
            className="h-full"
          >
            <div className="h-full bg-white/95 backdrop-blur-sm rounded-xl border border-brand-cafe/20 hover:border-brand-cafe/40 hover:shadow-xl hover:shadow-brand-cafe/10 transition-all duration-300 p-2">
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
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Indicador de más productos */}
      {products.length > 12 && (
        <motion.div 
          className="text-center pt-6 border-t border-brand-cafe/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <p className="text-brand-cafe/70 text-sm">
            Mostrando {Math.min(12, products.length)} de {products.length} productos
          </p>
        </motion.div>
      )}
    </motion.section>
  );
};