import { supabase } from "@/lib/supabase";

export async function initializeSettingsTable() {
  console.log("🔧 Inicializando tabla de configuración...");

  try {
    // Primero verificar si la tabla existe consultándola directamente
    const { data: existingData, error: checkError } = await supabase
      .from('settings')
      .select('id')
      .limit(1);

    if (checkError) {
      if (checkError.code === '42P01') {
        console.log("📋 Tabla settings no existe");
        console.log("⚠️ La tabla debe crearse manualmente en Supabase Dashboard");
        console.log("💡 Ve a tu proyecto en Supabase > SQL Editor y ejecuta:");
        console.log(`
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL DEFAULT 'Mi Catálogo',
  business_address TEXT DEFAULT '',
  logo TEXT,
  whatsapp_number TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  currency TEXT NOT NULL DEFAULT 'CLP',
  language TEXT NOT NULL DEFAULT 'es',
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

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

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
        `);
        
        throw new Error("Tabla settings no existe. Debe ser creada manualmente en Supabase.");
      } else {
        console.error("❌ Error verificando tabla:", checkError);
        throw checkError;
      }
    } else {
      console.log("✅ Tabla settings existe");
    }

    // Verificar que tenemos al menos una configuración
    const { data: settings, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .limit(1);

    if (settingsError) {
      console.error("❌ Error al obtener configuración:", settingsError);
      throw settingsError;
    }

    if (!settings || settings.length === 0) {
      console.log("📝 Creando configuración inicial...");
      
      const { error: insertError } = await supabase
        .from('settings')
        .insert([{
          business_name: 'Mi Catálogo',
          business_address: '',
          whatsapp_number: '',
          email: '',
          phone: '',
          currency: 'CLP',
          language: 'es',
          timezone: 'America/Santiago',
          enable_online_payments: false,
          mercadopago_public_key: '',
          mercadopago_access_token: '',
          delivery_schedule_text: '',
          facebook_url: '',
          instagram_url: '',
          twitter_url: '',
          youtube_url: '',
          footer_text: '',
          maintenance_mode: false,
          allow_registration: true,
          min_order_amount: 0,
          delivery_fee: 0,
          free_delivery_threshold: 0
        }]);

      if (insertError) {
        console.error("❌ Error al insertar configuración inicial:", insertError);
        throw insertError;
      }

      console.log("✅ Configuración inicial creada");
    } else {
      console.log("✅ Configuración existente encontrada");
    }

    return true;
  } catch (error) {
    console.error("❌ Error en initializeSettingsTable:", error);
    throw error;
  }
} 