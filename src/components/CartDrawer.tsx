import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { CheckoutForm } from "./CheckoutForm";
import { toast } from "sonner";
import { MercadoPagoButton } from "./MercadoPagoButton";
import { formatCLP } from "@/utils/currency";

export const CartDrawer = () => {
  const { items, updateQuantity, removeFromCart, total, itemCount, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [enableOnlinePayments] = useState(
    localStorage.getItem('enableOnlinePayments') === 'true'
  );

  const handleCheckoutSuccess = () => {
    setIsOpen(false);
    setShowCheckout(false);
    clearCart();
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      toast.error("Agregue productos al carrito antes de continuar");
      return;
    }
    setShowCheckout(true);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-none shadow-lg transition-all duration-300 min-h-[44px] min-w-[44px]"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-semibold shadow-md animate-pulse">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg bg-gradient-to-b from-slate-900 to-slate-800 border-slate-700 flex flex-col h-full">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="text-xl font-bold text-emerald-400 flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            {showCheckout ? "Finalizar Compra" : "Mi Carrito"}
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 flex flex-col min-h-0 pt-4">
          {showCheckout ? (
            <div className="flex-1 overflow-auto">
              <CheckoutForm onSuccess={handleCheckoutSuccess} />
            </div>
          ) : (
            <>
              {items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 px-4">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-slate-500" />
                  <p className="text-lg">Tu carrito está vacío</p>
                  <p className="text-sm text-slate-500">¡Agrega algunos productos deliciosos!</p>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-0">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl border border-slate-600 hover:border-emerald-500 transition-all duration-300 animate-fade-up shadow-lg"
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="font-semibold text-white mb-1 truncate text-sm">{item.title}</h3>
                          <p className="text-xs text-emerald-400 font-medium">
                            {formatCLP(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-7 text-center text-white font-semibold bg-slate-700 rounded px-1 py-1 text-xs">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Footer fijo con total y botones */}
                  <div className="flex-shrink-0 border-t border-slate-700 pt-3 pb-2 space-y-3 bg-gradient-to-b from-slate-900 to-slate-800">
                    <div className="flex justify-between items-center font-bold text-lg bg-gradient-to-r from-slate-800 to-slate-700 p-3 rounded-xl border border-slate-600">
                      <span className="text-emerald-400">Total:</span>
                      <span className="text-emerald-300 text-xl">{formatCLP(total)}</span>
                    </div>
                    
                    {/* Botones de pago */}
                    <div className="space-y-2">
                      {enableOnlinePayments ? (
                        <>
                          <MercadoPagoButton />
                          <Button
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 min-h-[48px]"
                            onClick={handleProceedToCheckout}
                          >
                            💰 Pagar en Efectivo
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 min-h-[48px]"
                          onClick={handleProceedToCheckout}
                        >
                          🛒 Proceder al Checkout
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};