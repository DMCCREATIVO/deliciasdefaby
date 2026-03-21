import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { formatCLP } from "@/utils/currency";

interface ProductCardProps {
  id: string | number;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  imageUrl: string;
  weight?: string;
  category?: string;
  isFeatured?: boolean;
  loading?: "lazy" | "eager";
  decoding?: "async" | "sync" | "auto";
}

export const ProductCard = ({
  id,
  title,
  description,
  shortDescription,
  price,
  imageUrl,
  weight,
  category,
  isFeatured,
  loading = "lazy",
  decoding = "async",
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart, updateQuantity, items } = useCart();
  const cartItem = items.find(item => item.id === id);
  const quantity = cartItem?.quantity || 0;

  return (
    <Card
      className="themed-card group w-full bg-white/95 backdrop-blur-sm border transition-all duration-500 hover:shadow-xl cursor-pointer rounded-lg overflow-hidden"
      onClick={() => navigate(`/product/${id}`)}
    >
      <CardHeader className="relative overflow-hidden p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            loading={loading}
            decoding={decoding}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        {category && (
          <Badge
            variant="secondary"
            className="themed-card-badge absolute top-3 left-3 border-none text-xs uppercase tracking-wider font-medium px-3 py-1 shadow-md transform transition-transform duration-300 group-hover:scale-105"
          >
            {category}
          </Badge>
        )}
        {isFeatured && (
          <Badge
            variant="secondary"
            className="themed-featured-badge absolute bottom-2 right-2 sm:bottom-3 sm:right-3 border-none text-[10px] sm:text-xs uppercase tracking-wider font-medium px-2 py-0.5 sm:px-3 sm:py-1 shadow-md"
          >
            Destacado
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3 p-4 sm:p-6">
        <div className="flex flex-col gap-2">
          <CardTitle className="themed-card-title text-lg sm:text-xl font-bold transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base line-clamp-2 opacity-70">
            {shortDescription || description}
          </CardDescription>
          <div className="flex items-center justify-between mt-2">
            <span className="themed-card-price text-xl sm:text-2xl font-bold transition-colors duration-300">
              {formatCLP(price)}
            </span>
            {weight && <p className="text-xs sm:text-sm italic opacity-60">{weight}</p>}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 sm:p-6 pt-0">
        {quantity === 0 ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(id, title, price);
            }}
            className="themed-card-btn w-full text-base sm:text-lg py-5 sm:py-6 shadow-lg rounded-md font-semibold border-0"
          >
            Agregar al carrito
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="icon"
              className="themed-card-btn-outline h-11 w-11 sm:h-12 sm:w-12 rounded-full transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(id, quantity - 1);
              }}
            >
              <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
            <span className="mx-3 sm:mx-4 font-medium text-lg sm:text-xl themed-card-price">
              {quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="themed-card-btn-outline h-11 w-11 sm:h-12 sm:w-12 rounded-full transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(id, quantity + 1);
              }}
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};