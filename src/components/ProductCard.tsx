import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Info } from "lucide-react";
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
  isFeatured 
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { addToCart, updateQuantity, items } = useCart();
  const cartItem = items.find(item => item.id === id);
  const quantity = cartItem?.quantity || 0;

  return (
    <Card 
      className="group w-full bg-white/95 backdrop-blur-sm border border-brand-beige hover:border-brand-cafe/50 transition-all duration-500 hover:shadow-xl hover:shadow-brand-cafe/10 cursor-pointer rounded-lg overflow-hidden" 
      onClick={() => navigate(`/product/${id}`)}
    >
      <CardHeader className="relative overflow-hidden p-0">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        {category && (
          <Badge variant="secondary" className="absolute top-3 left-3 bg-brand-cafe/90 hover:bg-brand-cafe text-white border-none text-xs uppercase tracking-wider font-medium px-3 py-1 shadow-md transform transition-transform duration-300 group-hover:scale-105">
            {category}
          </Badge>
        )}
        {isFeatured && (
          <Badge variant="secondary" className="absolute bottom-3 right-3 bg-brand-accent/90 hover:bg-brand-accent text-brand-cafe border-none text-xs uppercase tracking-wider font-medium px-3 py-1 shadow-md transform transition-transform duration-300 group-hover:scale-105">
            Destacado
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-3 p-6">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-xl font-bold text-brand-cafe group-hover:text-brand-brown transition-colors duration-300">
            {title}
          </CardTitle>
          <CardDescription className="text-brand-cafe/70 line-clamp-2 text-base">
            {shortDescription || description}
          </CardDescription>
          <div className="flex items-center justify-between mt-3">
            <span className="text-2xl font-bold text-brand-cafe group-hover:text-brand-brown transition-colors duration-300">{formatCLP(price)}</span>
            {weight && <p className="text-sm text-brand-cafe/60 italic">{weight}</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        {quantity === 0 ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(id, title, price);
            }}
            className="w-full bg-brand-cafe hover:bg-brand-brown text-white transition-all duration-500 text-lg py-6 shadow-lg hover:shadow-xl hover:shadow-brand-cafe/20 transform hover:-translate-y-1 rounded-md font-semibold"
          >
            Agregar al carrito
          </Button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <Button
              variant="outline"
              size="icon"
              className="border-brand-cafe/30 hover:bg-brand-cafe/10 hover:border-brand-cafe h-12 w-12 rounded-full transition-all duration-300 hover:shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(id, quantity - 1);
              }}
            >
              <Minus className="w-5 h-5 text-brand-cafe" />
            </Button>
            <span className="mx-4 font-medium text-xl text-brand-cafe">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="border-brand-cafe/30 hover:bg-brand-cafe/10 hover:border-brand-cafe h-12 w-12 rounded-full transition-all duration-300 hover:shadow-md"
              onClick={(e) => {
                e.stopPropagation();
                updateQuantity(id, quantity + 1);
              }}
            >
              <Plus className="w-5 h-5 text-brand-cafe" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};