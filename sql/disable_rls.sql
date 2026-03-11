-- Script para desactivar temporalmente RLS en la tabla blog_posts
-- ADVERTENCIA: Solo usar en desarrollo, no en producción

-- Desactivar RLS para la tabla blog_posts
ALTER TABLE public.blog_posts DISABLE ROW LEVEL SECURITY;

-- Crear una política que permita todas las operaciones
DROP POLICY IF EXISTS "Permitir todas las operaciones temporalmente" ON public.blog_posts;
CREATE POLICY "Permitir todas las operaciones temporalmente"
ON public.blog_posts
FOR ALL
USING (true)
WITH CHECK (true);

-- Asignar posts problemáticos al usuario actual
DO $$
DECLARE
    current_user_id UUID;
BEGIN
    -- Obtener el ID del usuario actual
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE NOTICE 'No hay usuario autenticado';
        RETURN;
    END IF;
    
    -- Actualizar los posts problemáticos conocidos
    UPDATE public.blog_posts
    SET author_id = current_user_id
    WHERE id IN (
        'a174359f-d8b6-4ada-8a70-756861426029',
        '6c4120a8-38b1-4e77-9939-1c833bf5bc81'
    );
    
    -- Actualizar el rol del usuario a admin
    UPDATE profiles
    SET role = 'admin'
    WHERE user_id = current_user_id;
    
    RAISE NOTICE 'Usuario % actualizado a rol admin y posts problemáticos asignados', current_user_id;
END;
$$; 