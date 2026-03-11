import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { settingsService } from "@/lib/database/index";
import { toast } from "sonner";
import { formatCLPForWhatsApp } from "@/utils/currency";

export const CartButton = () => {
  const { items, total, itemCount } = useCart();

  const shareOnWhatsApp = async () => {
    if (items.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    try {
      const allSettings = await settingsService.getAll();
      const whatsappSetting = allSettings.find(s => s.key === 'whatsapp_number');
      const businessPhone = whatsappSetting?.value || "569XXXXXXXX"; // Fallback

      const message = encodeURIComponent(
        `🛒 *Resumen del Pedido*\n\n${items
          .map(item => `• ${item.title} (x${item.quantity}) - $${formatCLPForWhatsApp(item.price * item.quantity)}`)
          .join('\n')}\n\n*Total: $${formatCLPForWhatsApp(total)}*`
      );

      const cleanPhone = businessPhone.replace(/\D/g, "");
      window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');

      toast.success("Abriendo WhatsApp...", {
        description: "Se abrirá una nueva ventana para continuar con tu pedido"
      });
    } catch (error) {
      console.error('Error getting WhatsApp number:', error);
      toast.error("Error al abrir WhatsApp");
    }
  };

  return (
    <Button
      onClick={shareOnWhatsApp}
      className="relative bg-green-600 hover:bg-green-700"
      disabled={items.length === 0}
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  );
};