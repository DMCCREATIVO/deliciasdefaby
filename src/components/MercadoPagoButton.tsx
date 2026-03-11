import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import { settingsService } from '@/lib/database/index';

export const MercadoPagoButton = () => {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const { items, total } = useCart();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeMP = async () => {
      try {
        const settings = await settingsService.getSettings();

        if (settings?.enable_online_payments && settings?.mercadopago_public_key) {
          setIsEnabled(true);
          initMercadoPago(settings.mercadopago_public_key);
        }
      } catch (error) {
        console.error('Error initializing MercadoPago:', error);
      }
    };

    initializeMP();
  }, []);

  const createPreference = async () => {
    if (items.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setIsLoading(true);
    try {
      const settings = await settingsService.getSettings();

      if (!settings?.mercadopago_access_token) {
        toast.error('Error: Configuración de Mercado Pago incompleta');
        return;
      }

      const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.mercadopago_access_token}`
        },
        body: JSON.stringify({
          items: items.map(item => ({
            title: item.title,
            quantity: item.quantity,
            currency_id: "CLP",
            unit_price: item.price
          })),
          back_urls: {
            success: `${window.location.origin}/success`,
            failure: `${window.location.origin}/failure`,
            pending: `${window.location.origin}/pending`
          },
          auto_return: "approved"
        }),
      });

      const data = await response.json();
      setPreferenceId(data.id);
    } catch (error) {
      console.error('Error creating preference:', error);
      toast.error('Error al crear la preferencia de pago');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEnabled) return null;

  return (
    <div className="w-full">
      {!preferenceId ? (
        <Button
          onClick={createPreference}
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : 'Pagar con Mercado Pago'}
        </Button>
      ) : (
        <Wallet initialization={{ preferenceId }} />
      )}
    </div>
  );
};