import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { orderService, settingsService } from "@/lib/database/index";
import { formatCLP, formatCLPForWhatsApp } from "@/utils/currency";

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

export const CheckoutForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { items, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [businessPhone, setBusinessPhone] = useState("56996509811");
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const allSettings = await settingsService.getAll();
        const setting = allSettings.find(s => s.key === 'whatsapp_number');
        if (setting?.value) setBusinessPhone(setting.value.replace(/\D/g, ""));
      } catch (error) {
        console.error("Error fetching whatsapp number:", error);
      }
    };
    fetchSettings();
  }, []);

  const sendToWhatsApp = (orderId: string) => {
    const message = `
🛍️ *Nuevo Pedido - #${orderId.slice(0, 8)}*
━━━━━━━━━━━━━━━━━━
👤 *Cliente:* ${formData.name}
📞 *Teléfono:* ${formData.phone}
📧 *Email:* ${formData.email}
📍 *Dirección:* ${formData.address}

🛒 *Productos:*
${items.map((item: any) => `• ${item.title} (x${item.quantity}) - $${formatCLPForWhatsApp(item.price * item.quantity)}`).join('\n')}

💰 *Total:* $${formatCLPForWhatsApp(total)}

${formData.notes ? `📝 *Notas:* ${formData.notes}` : ''}
━━━━━━━━━━━━━━━━━━
*¡Hola! 👋 Me gustaría confirmar este pedido de Delicias de Faby*

🔗 *Pedido #${orderId.slice(0, 8)} registrado en el sistema*
    `.trim();

    const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const saveOrderToDatabase = async () => {
    try {
      console.log('💾 Guardando pedido usando servicio especializado (PocketBase)...');

      const orderItemsData = items.map(item => ({
        product_id: item.id,
        product_title: item.title,
        unit_price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }));

      const orderData = {
        total_amount: total,
        status: 'pending' as const,
        shipping_address: formData.address,
        contact_phone: formData.phone,
        notes: formData.notes,
        customer_name: formData.name,
        customer_email: formData.email,
        payment_method: 'efectivo',
        payment_status: 'pending'
      };

      const result = await orderService.create(orderData, orderItemsData);

      if (result && result.id) {
        console.log('✅ Pedido guardado exitosamente:', result.id);
        return { id: result.id, isTemporary: false };
      } else {
        const tempOrderId = `TEMP-${Date.now().toString(36).toUpperCase()}`;
        return { id: tempOrderId, isTemporary: true };
      }

    } catch (error) {
      console.error('💥 Error al guardar pedido:', error);
      const tempOrderId = `TEMP-${Date.now().toString(36).toUpperCase()}`;
      return { id: tempOrderId, isTemporary: true };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    if (items.length === 0) {
      toast.error("El carrito está vacío");
      return;
    }

    setIsLoading(true);

    try {
      // Intentar guardar en base de datos
      const orderResult = await saveOrderToDatabase();

      if (orderResult.isTemporary) {
        toast.warning("Pedido enviado por WhatsApp (registro temporal)");
      } else {
        toast.success("¡Pedido registrado y enviado por WhatsApp!");
      }

      // Enviar por WhatsApp independientemente del resultado de la BD
      sendToWhatsApp(orderResult.id);

      clearCart();
      onSuccess();

    } catch (error) {
      console.error('💥 Error general:', error);

      // Aún así enviar por WhatsApp con ID temporal
      const tempOrderId = `TEMP-${Date.now().toString(36).toUpperCase()}`;
      toast.error("Error del sistema, pero enviando por WhatsApp");
      sendToWhatsApp(tempOrderId);
      clearCart();
      onSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-xl">
            <p className="text-emerald-300 text-center text-sm">
              💾 Tu pedido se guardará en nuestro sistema para seguimiento
              <br />
              📱 Y se enviará por WhatsApp para confirmación
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="name" className="text-emerald-300 font-medium text-sm">Nombre completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-10"
                placeholder="Ej: María González"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-emerald-300 font-medium text-sm">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-10"
                placeholder="Ej: maria@email.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-emerald-300 font-medium text-sm">Teléfono *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg h-10"
                placeholder="Ej: +56 9 1234 5678"
                required
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-emerald-300 font-medium text-sm">Dirección de entrega *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg min-h-[60px] resize-none"
                placeholder="Ej: Av. Providencia 123, Providencia, Santiago"
                required
              />
            </div>

            <div>
              <Label htmlFor="notes" className="text-emerald-300 font-medium text-sm">Notas adicionales (opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg min-h-[60px] resize-none"
                placeholder="Instrucciones especiales, preferencias de horario, etc."
              />
            </div>
          </div>
        </form>
      </div>

      {/* Footer fijo con total y botón */}
      <div className="flex-shrink-0 border-t border-slate-700 pt-3 pb-2 space-y-3 bg-gradient-to-b from-slate-900 to-slate-800 mt-4">
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl border border-slate-600">
          <span className="text-emerald-400 font-semibold text-base">Total del pedido:</span>
          <span className="text-emerald-300 font-bold text-lg">{formatCLP(total)}</span>
        </div>

        <Button
          type="submit"
          form="checkout-form"
          disabled={isLoading}
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-h-[48px] touch-manipulation"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Procesando pedido...</span>
            </div>
          ) : (
            <span className="text-base">🚀 Confirmar Pedido</span>
          )}
        </Button>
      </div>
    </div>
  );
};