import { supabase } from "./client";

const BUCKET_NAME = "products";

export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Generar un nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Subir el archivo a Supabase Storage
    const { error: uploadError, data } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Obtener la URL pública del archivo
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw error;
  }
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extraer el nombre del archivo de la URL
    const fileName = imageUrl.split('/').pop();
    if (!fileName) return;

    // Eliminar el archivo de Supabase Storage
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error al eliminar la imagen:', error);
    throw error;
  }
}; 