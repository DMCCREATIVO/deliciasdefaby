-- ===================================================================
-- SCRIPT PARA CREAR/ACTUALIZAR TABLA DE CONFIGURACIÓN
-- ===================================================================

-- Crear tabla de configuración del sistema (solo si no existe)
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL DEFAULT 'Mi Catálogo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agregar columnas que podrían faltar (estas líneas no fallan si la columna ya existe)
DO $$ 
BEGIN
  -- Agregar business_address si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='business_address') THEN
    ALTER TABLE public.settings ADD COLUMN business_address TEXT DEFAULT '';
  END IF;
  
  -- Agregar logo si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='logo') THEN
    ALTER TABLE public.settings ADD COLUMN logo TEXT;
  END IF;
  
  -- Agregar whatsapp_number si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='whatsapp_number') THEN
    ALTER TABLE public.settings ADD COLUMN whatsapp_number TEXT DEFAULT '';
  END IF;
  
  -- Agregar email si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='email') THEN
    ALTER TABLE public.settings ADD COLUMN email TEXT DEFAULT '';
  END IF;
  
  -- Agregar phone si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='phone') THEN
    ALTER TABLE public.settings ADD COLUMN phone TEXT DEFAULT '';
  END IF;
  
  -- Agregar currency si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='currency') THEN
    ALTER TABLE public.settings ADD COLUMN currency TEXT NOT NULL DEFAULT 'CLP';
  END IF;
  
  -- Agregar language si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='language') THEN
    ALTER TABLE public.settings ADD COLUMN language TEXT NOT NULL DEFAULT 'es';
  END IF;
  
  -- Agregar timezone si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='timezone') THEN
    ALTER TABLE public.settings ADD COLUMN timezone TEXT DEFAULT 'America/Santiago';
  END IF;
  
  -- Agregar enable_online_payments si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='enable_online_payments') THEN
    ALTER TABLE public.settings ADD COLUMN enable_online_payments BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Agregar mercadopago_public_key si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='mercadopago_public_key') THEN
    ALTER TABLE public.settings ADD COLUMN mercadopago_public_key TEXT DEFAULT '';
  END IF;
  
  -- Agregar mercadopago_access_token si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='mercadopago_access_token') THEN
    ALTER TABLE public.settings ADD COLUMN mercadopago_access_token TEXT DEFAULT '';
  END IF;
  
  -- Agregar delivery_schedule_text si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='delivery_schedule_text') THEN
    ALTER TABLE public.settings ADD COLUMN delivery_schedule_text TEXT DEFAULT '';
  END IF;
  
  -- Agregar facebook_url si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='facebook_url') THEN
    ALTER TABLE public.settings ADD COLUMN facebook_url TEXT DEFAULT '';
  END IF;
  
  -- Agregar instagram_url si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='instagram_url') THEN
    ALTER TABLE public.settings ADD COLUMN instagram_url TEXT DEFAULT '';
  END IF;
  
  -- Agregar twitter_url si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='twitter_url') THEN
    ALTER TABLE public.settings ADD COLUMN twitter_url TEXT DEFAULT '';
  END IF;
  
  -- Agregar youtube_url si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='youtube_url') THEN
    ALTER TABLE public.settings ADD COLUMN youtube_url TEXT DEFAULT '';
  END IF;
  
  -- Agregar footer_text si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='footer_text') THEN
    ALTER TABLE public.settings ADD COLUMN footer_text TEXT DEFAULT '';
  END IF;
  
  -- Agregar maintenance_mode si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='maintenance_mode') THEN
    ALTER TABLE public.settings ADD COLUMN maintenance_mode BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Agregar allow_registration si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='allow_registration') THEN
    ALTER TABLE public.settings ADD COLUMN allow_registration BOOLEAN DEFAULT TRUE;
  END IF;
  
  -- Agregar min_order_amount si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='min_order_amount') THEN
    ALTER TABLE public.settings ADD COLUMN min_order_amount NUMERIC DEFAULT 0;
  END IF;
  
  -- Agregar delivery_fee si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='delivery_fee') THEN
    ALTER TABLE public.settings ADD COLUMN delivery_fee NUMERIC DEFAULT 0;
  END IF;
  
  -- Agregar free_delivery_threshold si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='free_delivery_threshold') THEN
    ALTER TABLE public.settings ADD COLUMN free_delivery_threshold NUMERIC DEFAULT 0;
  END IF;
  
END $$;

-- Agregar constraints después de que todas las columnas existan
DO $$
BEGIN
  -- Agregar constraint para currency si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name='settings_currency_check') THEN
    ALTER TABLE public.settings ADD CONSTRAINT settings_currency_check 
    CHECK (currency IN ('CLP', 'USD', 'EUR', 'BRL', 'ARS', 'MXN', 'COP', 'PEN'));
  END IF;
  
  -- Agregar constraint para language si no existe
  IF NOT EXISTS (SELECT 1 FROM information_schema.check_constraints WHERE constraint_name='settings_language_check') THEN
    ALTER TABLE public.settings ADD CONSTRAINT settings_language_check 
    CHECK (language IN ('es', 'en', 'pt'));
  END IF;
END $$;

-- Habilitar Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Configuración visible para todos" ON public.settings;
DROP POLICY IF EXISTS "Solo administradores pueden modificar configuración" ON public.settings;

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

-- Insertar configuración inicial si no existe ningún registro
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
)
SELECT 
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
WHERE NOT EXISTS (SELECT 1 FROM public.settings);

-- Comentarios para documentación
COMMENT ON TABLE public.settings IS 'Configuración general del sistema';
COMMENT ON COLUMN public.settings.business_name IS 'Nombre del negocio';
COMMENT ON COLUMN public.settings.currency IS 'Moneda utilizada en el sistema';
COMMENT ON COLUMN public.settings.language IS 'Idioma del sistema';
COMMENT ON COLUMN public.settings.timezone IS 'Zona horaria del sistema';
COMMENT ON COLUMN public.settings.maintenance_mode IS 'Modo de mantenimiento activado/desactivado';
COMMENT ON COLUMN public.settings.allow_registration IS 'Permitir registro de nuevos usuarios';

-- Mensaje de confirmación
DO $$
BEGIN
  RAISE NOTICE '✅ Tabla settings creada/actualizada correctamente';
  RAISE NOTICE '📊 Total de registros: %', (SELECT COUNT(*) FROM public.settings);
END $$; 