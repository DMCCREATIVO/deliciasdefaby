import { supabase } from "@/lib/supabase";
import { initializeSettingsTable } from "./init-settings";

export interface BusinessSettings {
  id?: string;
  business_name: string;
  business_address: string;
  logo?: string;
  whatsapp_number: string;
  email: string;
  phone: string;
  currency: "CLP" | "USD" | "EUR" | "BRL" | "ARS" | "MXN" | "COP" | "PEN";
  language: "es" | "en" | "pt";
  timezone: string;
  enable_online_payments: boolean;
  mercadopago_public_key: string;
  mercadopago_access_token: string;
  delivery_schedule_text: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
  footer_text: string;
  maintenance_mode: boolean;
  allow_registration: boolean;
  min_order_amount: number;
  delivery_fee: number;
  free_delivery_threshold: number;
  created_at?: string;
  updated_at?: string;
}

class SettingsService {
  /**
   * Verifica que la tabla settings exista y la inicializa si es necesario
   */
  async ensureSettingsTable(): Promise<void> {
    try {
      await initializeSettingsTable();
    } catch (error) {
      console.error('Error al inicializar tabla settings:', error);
      // No propagar el error para permitir que la aplicación continúe
    }
  }

  /**
   * Obtiene la configuración actual del sistema
   */
  async getSettings(): Promise<BusinessSettings | null> {
    try {
      console.log("🔍 Obteniendo configuración...");
      
      // Primero intentar obtener con limit para evitar errores de múltiples filas
      const { data: settingsArray, error } = await supabase
        .from('settings')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Error al obtener configuración:', error);
        
        // Si la tabla no existe, la inicializamos
        if (error.code === '42P01') {
          console.log("📋 Tabla no existe, inicializando...");
          await this.ensureSettingsTable();
          return await this.getSettings(); // Reintentar
        }
        
        throw error;
      }

      // Si no hay resultados
      if (!settingsArray || settingsArray.length === 0) {
        console.log("📝 No hay configuración, retornando null");
        return null;
      }

      const data = settingsArray[0];
      console.log("✅ Configuración obtenida:", data?.business_name);
      return data;
    } catch (error) {
      console.error('Error en getSettings:', error);
      return null; // Retornar null en lugar de propagar el error
    }
  }

  /**
   * Crea la configuración inicial del sistema
   */
  async createInitialSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    try {
      console.log("📝 Creando configuración inicial...");
      
      // Asegurar que la tabla existe
      await this.ensureSettingsTable();
      
      const { data, error } = await supabase
        .from('settings')
        .insert([{
          ...settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select('*')
        .single();

      if (error) {
        console.error('Error al crear configuración inicial:', error);
        throw error;
      }

      console.log("✅ Configuración inicial creada:", data?.business_name);
      return data;
    } catch (error) {
      console.error('Error en createInitialSettings:', error);
      throw error;
    }
  }

  /**
   * Actualiza la configuración existente
   */
  async updateSettings(id: string, settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    try {
      console.log("🔄 Actualizando configuración...", id);
      
      const { data, error } = await supabase
        .from('settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        console.error('Error al actualizar configuración:', error);
        throw error;
      }

      console.log("✅ Configuración actualizada:", data?.business_name);
      return data;
    } catch (error) {
      console.error('Error en updateSettings:', error);
      throw error;
    }
  }

  /**
   * Guarda o actualiza la configuración
   */
  async saveSettings(settings: Partial<BusinessSettings>): Promise<BusinessSettings> {
    try {
      console.log("💾 Guardando configuración...");
      console.log("📊 Datos a guardar:", settings);
      
      // Verificar autenticación
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log("👤 Usuario actual:", user?.id);
      
      if (authError) {
        console.error("❌ Error de autenticación:", authError);
        throw new Error(`Error de autenticación: ${authError.message}`);
      }
      
      if (!user) {
        console.error("❌ Usuario no autenticado");
        throw new Error("Usuario no autenticado");
      }

      // Estrategia simplificada: intentar obtener la configuración existente
      console.log("🔍 Buscando configuración existente...");
      const { data: existingSettings, error: selectError } = await supabase
        .from('settings')
        .select('*');

      if (selectError) {
        console.error("❌ Error al buscar configuración:", selectError);
        throw new Error(`Error al buscar configuración: ${selectError.message}`);
      }

      console.log("📊 Configuraciones encontradas:", existingSettings?.length || 0);

      if (!existingSettings || existingSettings.length === 0) {
        // No hay configuración, crear una nueva
        console.log("📝 Creando configuración nueva...");
        
        const { data, error } = await supabase
          .from('settings')
          .insert([{
            ...settings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select('*')
          .single();

        if (error) {
          console.error("❌ Error al crear configuración:", error);
          throw new Error(`Error al crear: ${error.message}`);
        }

        console.log("✅ Configuración creada exitosamente");
        return data;
        
      } else if (existingSettings.length === 1) {
        // Hay exactamente una configuración, actualizarla
        console.log("🔄 Actualizando configuración existente...");
        const existing = existingSettings[0];
        console.log("📋 ID a actualizar:", existing.id);
        console.log("📝 Datos a actualizar:", {
          ...settings,
          updated_at: new Date().toISOString()
        });
        
        const { data, error } = await supabase
          .from('settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select('*');

        console.log("🔍 Resultado del UPDATE:");
        console.log("  - Error:", error);
        console.log("  - Data:", data);
        console.log("  - Data length:", data?.length);

        if (error) {
          console.error("❌ Error al actualizar configuración:", error);
          throw new Error(`Error al actualizar: ${error.message}`);
        }

        // Verificar que se haya actualizado algo
        if (!data || data.length === 0) {
          console.error("❌ No se actualizó ningún registro");
          console.error("❌ Esto puede ser un problema de políticas RLS");
          
          // Intentar hacer un SELECT para verificar si el registro aún existe
          console.log("🔍 Verificando si el registro aún existe...");
          const { data: checkData, error: checkError } = await supabase
            .from('settings')
            .select('*')
            .eq('id', existing.id);
            
          console.log("🔍 Resultado de verificación:");
          console.log("  - Error:", checkError);
          console.log("  - Data:", checkData);
          
          throw new Error("No se pudo actualizar la configuración - posible problema de permisos RLS");
        }

        const updatedConfig = data[0];
        console.log("✅ Configuración actualizada exitosamente");
        return updatedConfig;
        
      } else {
        // Múltiples configuraciones - limpiar automáticamente
        console.warn("⚠️ Múltiples configuraciones encontradas, limpiando...");
        const firstConfig = existingSettings[0];
        
        // Eliminar todas excepto la primera
        const idsToDelete = existingSettings.slice(1).map(config => config.id);
        
        if (idsToDelete.length > 0) {
          console.log("🗑️ Eliminando configuraciones duplicadas:", idsToDelete);
          const { error: deleteError } = await supabase
            .from('settings')
            .delete()
            .in('id', idsToDelete);
            
          if (deleteError) {
            console.error("❌ Error al eliminar duplicados:", deleteError);
          } else {
            console.log("✅ Duplicados eliminados");
          }
        }
        
        // Actualizar la configuración restante
        console.log("🔄 Actualizando configuración limpia...");
        const { data, error } = await supabase
          .from('settings')
          .update({
            ...settings,
            updated_at: new Date().toISOString()
          })
          .eq('id', firstConfig.id)
          .select('*');

        if (error) {
          console.error("❌ Error al actualizar después de limpiar:", error);
          throw new Error(`Error al actualizar: ${error.message}`);
        }

        // Verificar que se haya actualizado
        if (!data || data.length === 0) {
          console.error("❌ No se actualizó ningún registro después de limpiar");
          throw new Error("No se pudo actualizar la configuración después de limpiar");
        }

        const updatedConfig = data[0];
        console.log("✅ Configuración limpiada y actualizada exitosamente");
        return updatedConfig;
      }
    } catch (error) {
      console.error('❌ Error completo en saveSettings:', error);
      throw error;
    }
  }

  /**
   * Sube un archivo de logo al storage
   */
  async uploadLogo(file: File): Promise<string> {
    try {
      console.log("📤 Subiendo logo...");
      
      const fileExt = file.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `business/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error al subir logo:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      console.log("✅ Logo subido:", publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error en uploadLogo:', error);
      throw error;
    }
  }

  /**
   * Elimina un logo del storage
   */
  async deleteLogo(logoUrl: string): Promise<void> {
    try {
      // Extraer el path del archivo de la URL
      const urlParts = logoUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `business/${fileName}`;

      const { error } = await supabase.storage
        .from('products')
        .remove([filePath]);

      if (error) {
        console.error('Error al eliminar logo:', error);
        throw error;
      }

      console.log("✅ Logo eliminado");
    } catch (error) {
      console.error('Error en deleteLogo:', error);
      throw error;
    }
  }
}

export const settingsService = new SettingsService(); 