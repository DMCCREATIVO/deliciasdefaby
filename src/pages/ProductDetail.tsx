import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { pocketbaseProductService as productService } from "@/lib/database/products.pocketbase";
import { Product } from "@/lib/database/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Package,
  Scale,
  Tag,
  AlertCircle,
  Heart,
  Share2,
  TruckIcon
} from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, items } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const cartItem = items.find(item => item.id === id);
  const quantity = cartItem?.quantity || 0;

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      console.log('Fetching product details for id:', id);
      if (!id) throw new Error("Product ID is required");

      try {
        const data = await productService.getById(id);
        if (!data) {
          throw new Error("Product not found");
        }
        console.log('Product data:', data);
        return data;
      } catch (err: any) {
        console.error('Error fetching product:', err);
        throw err;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });

  const handleAddToCart = () => {
    if (!product) {
      toast.error("No se puede agregar el producto al carrito");
      return;
    }

    console.log('Adding to cart:', { id: product.id, title: product.title, price: product.price });
    addToCart(product.id, product.title, Number(product.price));
    toast.success(`¡${product.title} agregado al carrito!`, {
      description: "El producto se ha agregado correctamente",
      action: {
        label: "Ver carrito",
        onClick: () => {
          const cartButton = document.querySelector('[aria-label="Open cart"]');
          if (cartButton instanceof HTMLElement) {
            cartButton.click();
          }
        },
      },
    });
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (!product?.id) {
      toast.error("Error al actualizar la cantidad");
      return;
    }
    console.log('Updating quantity:', { id: product.id, quantity: newQuantity });
    updateQuantity(product.id, newQuantity);
    if (newQuantity === 0) {
      toast.info(`${product.title} eliminado del carrito`);
    } else {
      toast.success(`Cantidad actualizada: ${newQuantity} ${product.title}`);
    }
  };

  if (error) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen bg-gradient-to-b from-brand-beige/20 via-background to-brand-beige/10 py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <Alert variant="destructive" className="mb-6 bg-white/95 backdrop-blur-sm border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  No se pudo cargar el producto. Por favor, intente nuevamente.
                </AlertDescription>
              </Alert>
              <Link to="/productos">
                <Button className="bg-brand-cafe hover:bg-brand-brown text-white w-full">
                  Volver a productos
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen bg-gradient-to-b from-brand-beige/20 via-background to-brand-beige/10 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
              <div className="space-y-4">
                <Skeleton className="h-80 md:h-96 w-full rounded-2xl" />
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-20 md:h-24 w-full rounded-lg" />
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <Skeleton className="h-8 md:h-12 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-20 md:h-24 w-full" />
                <Skeleton className="h-12 w-1/3" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen bg-gradient-to-b from-brand-beige/20 via-background to-brand-beige/10 py-12">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto"
            >
              <Alert variant="destructive" className="mb-6 bg-white/95 backdrop-blur-sm border border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Producto no encontrado</AlertTitle>
                <AlertDescription>
                  El producto que busca no existe o ha sido eliminado.
                </AlertDescription>
              </Alert>
              <Link to="/productos">
                <Button className="bg-brand-cafe hover:bg-brand-brown text-white w-full">
                  Volver a productos
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </Layout>
    );
  }

  // Construir galería completa: imagen principal + galería adicional (sin duplicados)
  const mainImage = product?.image_url || null;
  const galleryImages: string[] = Array.isArray(product?.images)
    ? (product.images as string[]).filter(Boolean)
    : [];

  // Unir imagen principal + galería, eliminando duplicados
  const allImages: string[] = [];
  if (mainImage) allImages.push(mainImage);
  for (const img of galleryImages) {
    if (img && img !== mainImage) allImages.push(img);
  }
  // Si no hay ninguna imagen, usar placeholder
  if (allImages.length === 0) allImages.push('/placeholder.svg');


  return (
    <Layout showFooter={false}>
      <div className="min-h-screen bg-gradient-to-b from-brand-beige/20 via-background to-brand-beige/10">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Breadcrumb mejorado */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/productos"
              className="inline-flex items-center text-brand-cafe hover:text-brand-brown transition-colors text-base md:text-lg group"
            >
              <ChevronLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Volver a productos
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
            {/* Galería de imágenes mejorada */}
            <motion.div
              className="space-y-4 md:space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-sm border border-brand-cafe/20 shadow-xl hover:shadow-2xl transition-all duration-500 p-4">
                <img
                  src={allImages[selectedImage] || '/placeholder.svg'}
                  alt={product?.title}
                  className="w-full h-auto max-h-80 md:max-h-96 object-contain hover:scale-105 transition-transform duration-500 rounded-xl"
                  loading="eager"
                />
                {product.is_featured && (
                  <Badge className="absolute top-6 left-6 bg-brand-accent text-brand-cafe font-medium">
                    ⭐ Destacado
                  </Badge>
                )}
              </div>

              {allImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3 md:gap-4">
                  {allImages.map((image, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 shadow-md transition-all duration-300 ${selectedImage === index
                        ? 'border-brand-cafe shadow-brand-cafe/20 scale-105'
                        : 'border-brand-beige hover:border-brand-cafe/50'
                        }`}
                      whileHover={{ scale: selectedImage === index ? 1.05 : 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image}
                        alt={`${product?.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Información del producto mejorada */}
            <motion.div
              className="space-y-6 md:space-y-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Header del producto */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-brand-cafe/20 shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {product.categories?.name && (
                      <Badge variant="outline" className="mb-3 border-brand-cafe text-brand-cafe">
                        <Tag className="w-3 h-3 mr-1" />
                        {product.categories.name}
                      </Badge>
                    )}
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-brand-cafe mb-2">
                      {product?.title}
                    </h1>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className={`border-brand-cafe/20 hover:border-brand-cafe ${isFavorite ? 'bg-brand-cafe text-white' : 'text-brand-cafe'
                        }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-brand-cafe/20 hover:border-brand-cafe text-brand-cafe"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-brand-cafe">
                    ${Number(product?.price).toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4 ? 'text-brand-accent fill-current' : 'text-gray-300'
                          }`}
                      />
                    ))}
                    <span className="text-sm text-brand-cafe/70 ml-2">(4.5)</span>
                  </div>
                </div>

                <p className="text-brand-cafe/80 text-base md:text-lg leading-relaxed mb-6">
                  {product?.description || 'Delicioso producto artesanal hecho con los mejores ingredientes.'}
                </p>

                {/* Información adicional */}
                <div className="flex items-center gap-2 text-brand-cafe/70 mb-6">
                  <Package className="w-4 h-4" />
                  <span className="text-sm">En stock</span>
                </div>
              </div>

              {/* Controles de cantidad y carrito */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-brand-cafe/20 shadow-lg">
                {quantity > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-brand-cafe font-medium">Cantidad en carrito:</span>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(quantity - 1)}
                          className="border-brand-cafe/20 hover:border-brand-cafe text-brand-cafe h-10 w-10"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-xl font-bold text-brand-cafe min-w-[3rem] text-center">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(quantity + 1)}
                          className="border-brand-cafe/20 hover:border-brand-cafe text-brand-cafe h-10 w-10"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full border-brand-cafe text-brand-cafe hover:bg-brand-cafe hover:text-white"
                      onClick={() => handleUpdateQuantity(0)}
                    >
                      Eliminar del carrito
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-brand-cafe hover:bg-brand-brown text-white py-4 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Agregar al carrito
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;