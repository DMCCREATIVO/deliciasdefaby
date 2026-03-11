import { useQuery } from "@tanstack/react-query";
import { favoriteService } from "@/lib/database/index";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { formatCLP } from "@/utils/currency";

const Favorites = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const { data: favorites, isLoading, refetch } = useQuery({
    queryKey: ['user-favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return await favoriteService.getAll(user.id);
    },
    enabled: !!user?.id
  });

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const success = await favoriteService.remove(favoriteId);
      if (!success) throw new Error('Error al eliminar de favoritos');

      toast("El producto ha sido eliminado de tu lista de favoritos");
      refetch();
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast("No se pudo eliminar el producto de favoritos");
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-up space-y-6">
        <h1 className="text-3xl font-bold text-white">Mis Favoritos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full bg-zinc-800/50" />
          ))}
        </div>
      </div>
    );
  }

  if (!favorites?.length) {
    return (
      <div className="animate-fade-up space-y-6">
        <h1 className="text-3xl font-bold text-white">Mis Favoritos</h1>
        <div className="bg-zinc-800/50 backdrop-blur-xl rounded-lg border border-zinc-700/50 p-8 text-center">
          <p className="text-zinc-400">No tienes productos favoritos</p>
          <Button
            className="mt-4 bg-brand-pink hover:bg-brand-pink/90"
            onClick={() => window.location.href = '/productos'}
          >
            Ver Productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up space-y-6">
      <h1 className="text-3xl font-bold text-white">Mis Favoritos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => {
          if (!favorite.product) return null;
          const product = favorite.product;

          return (
            <div
              key={favorite.id}
              className="bg-zinc-800/50 backdrop-blur-xl rounded-lg border border-zinc-700/50 overflow-hidden hover:border-brand-pink/50 transition-colors group"
            >
              <div className="aspect-square relative">
                <img
                  src={product.image_url || '/placeholder.svg'}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="absolute top-2 right-2 h-8 w-8 bg-zinc-900/50 hover:bg-red-500/20 hover:text-red-400"
                >
                  <Heart className="h-4 w-4 fill-current text-brand-pink" />
                </Button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-white mb-1">{product.title}</h3>
                <p className="text-zinc-400 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">
                    {formatCLP(product.price)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      addToCart(product.id, product.title, product.price);
                      toast("El producto ha sido agregado al carrito");
                    }}
                    className="bg-brand-pink/10 text-brand-pink hover:bg-brand-pink/20"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Favorites;