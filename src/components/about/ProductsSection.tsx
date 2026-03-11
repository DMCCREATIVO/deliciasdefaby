import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { productService, categoryService } from "@/lib/database/index";
import { ProductCard } from "../ProductCard";
import { Star } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";

export const ProductsSection = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const limit = isMobile ? 6 : 12;
  const { data: products } = useQuery({
    queryKey: ['featured-products', limit],
    queryFn: async () => {
      const [allProducts, categories] = await Promise.all([
        productService.getAll(),
        categoryService.getAll()
      ]);

      const categoryMap = categories.reduce((acc: Record<string, string>, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {});

      return allProducts
        .filter(p => p.is_featured)
        .slice(0, limit)
        .map(p => ({
          ...p,
          category_name: categoryMap[p.category_id as string] || ''
        }));
    }
  });

  return (
    <section className="py-20 w-full bg-gradient-to-b from-white to-pink-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 relative"
        >
          {/* Background decoration */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-[120%] h-[120%] bg-gradient-radial from-brand-pink/10 via-transparent to-transparent" />
            </motion.div>
          )}

          <motion.h2
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand-pink via-brand-pink/80 to-brand-beige bg-clip-text text-transparent"
          >
            Nuestros Productos Destacados
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Descubre nuestra selección de productos más populares, elaborados con los mejores ingredientes.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {products?.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="absolute -top-4 -right-4 z-10">
                <Star className="w-10 h-10 text-yellow-400 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-full shadow-lg" />
              </div>
              <ProductCard
                id={product.id}
                title={product.title}
                description={product.description || ''}
                shortDescription={product.short_description}
                price={Number(product.price)}
                imageUrl={product.image_url || '/placeholder.svg'}
                weight={product.weight}
                category={product.category_name}
                isFeatured={product.is_featured}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
