-- ===================================================================
-- SCRIPT PARA RESETEAR TABLA DE CONFIGURACIÓN (USAR CON CUIDADO)
-- ===================================================================

-- ⚠️ ATENCIÓN: Este script eliminará TODOS los datos de configuración existentes
-- Solo úsalo si quieres empezar desde cero

-- Eliminar tabla existente (si existe)
DROP TABLE IF EXISTS public.settings CASCADE;

-- Crear tabla desde cero
CREATE TABLE public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL DEFAULT 'Mi Catálogo',
  business_address TEXT DEFAULT '',
  logo TEXT,
  whatsapp_number TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  currency TEXT NOT NULL DEFAULT 'CLP' CHECK (currency IN ('CLP', 'USD', 'EUR', 'BRL', 'ARS', 'MXN', 'COP', 'PEN')),
  language TEXT NOT NULL DEFAULT 'es' CHECK (language IN ('es', 'en', 'pt')),
  timezone TEXT DEFAULT 'America/Santiago',
  enable_online_payments BOOLEAN DEFAULT FALSE,
  mercadopago_public_key TEXT DEFAULT '',
  mercadopago_access_token TEXT DEFAULT '',
  delivery_schedule_text TEXT DEFAULT '',
  facebook_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  footer_text TEXT DEFAULT '',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  allow_registration BOOLEAN DEFAULT TRUE,
  min_order_amount NUMERIC DEFAULT 0,
  delivery_fee NUMERIC DEFAULT 0,
  free_delivery_threshold NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
CREATE POLICY "Configuración visible para todos"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "Solo administradores pueden modificar configuración"
  ON public.settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Insertar configuración inicial
INSERT INTO public.settings (
  business_name,
  business_address,
  whatsapp_number,
  email,
  phone,
  currency,
  language,
  timezone,
  enable_online_payments,
  mercadopago_public_key,
  mercadopago_access_token,
  delivery_schedule_text,
  facebook_url,
  instagram_url,
  twitter_url,
  youtube_url,
  footer_text,
  maintenance_mode,
  allow_registration,
  min_order_amount,
  delivery_fee,
  free_delivery_threshold
) VALUES (
  'Mi Catálogo',
  '',
  '',
  '',
  '',
  'CLP',
  'es',
  'America/Santiago',
  FALSE,
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  FALSE,
  TRUE,
  0,
  0,
  0
);

-- Comentarios para documentación
COMMENT ON TABLE public.settings IS 'Configuración general del sistema';
COMMENT ON COLUMN public.settings.business_name IS 'Nombre del negocio';
COMMENT ON COLUMN public.settings.currency IS 'Moneda utilizada en el sistema';
COMMENT ON COLUMN public.settings.language IS 'Idioma del sistema';
COMMENT ON COLUMN public.settings.timezone IS 'Zona horaria del sistema';
COMMENT ON COLUMN public.settings.maintenance_mode IS 'Modo de mantenimiento activado/desactivado';
COMMENT ON COLUMN public.settings.allow_registration IS 'Permitir registro de nuevos usuarios';

-- Mensaje de confirmación
SELECT 'Tabla settings reseteada correctamente' as resultado; 