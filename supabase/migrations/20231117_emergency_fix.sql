-- Migración de emergencia para resolver problemas con el post específico
-- Fecha: 17/11/2023

-- Función para arreglar de emergencia un post específico
CREATE OR REPLACE FUNCTION public.emergency_fix_blog_post(
    post_id UUID DEFAULT 'a174359f-d8b6-4ada-8a70-756861426029'
)
RETURNS boolean AS $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Obtener el ID del usuario actual
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no autenticado';
        RETURN FALSE;
    END IF;
    
    -- Asegurar que el post esté asignado al usuario actual (FUERZA la autoría)
    UPDATE public.blog_posts
    SET author_id = current_user_id
    WHERE id = post_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejecutar la función directamente en la migración para arreglar el post
SELECT public.emergency_fix_blog_post();

-- Agregar una política especial para este post (ID específico) que permita su edición
DO $$
BEGIN
    -- Eliminar política existente si hay una con este nombre
    DROP POLICY IF EXISTS "Política de emergencia para post específico" ON public.blog_posts;
    
    -- Crear nueva política que permita acceso completo a este post específico
    CREATE POLICY "Política de emergencia para post específico"
    ON public.blog_posts
    FOR ALL
    USING (id = 'a174359f-d8b6-4ada-8a70-756861426029')
    WITH CHECK (id = 'a174359f-d8b6-4ada-8a70-756861426029');
    
    RAISE NOTICE 'Política de emergencia creada para post específico';
END $$; 