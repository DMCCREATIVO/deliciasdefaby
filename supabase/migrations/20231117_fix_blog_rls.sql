-- Migración para corregir problemas de RLS para la tabla blog_posts
-- Fecha: 17/11/2023

-- Función para ajustar los permisos RLS para un post específico
CREATE OR REPLACE FUNCTION public.fix_blog_posts_rls(post_id UUID)
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
    
    -- Para fines de depuración, asignar este post al usuario actual si no tiene dueño
    UPDATE public.blog_posts
    SET author_id = current_user_id
    WHERE id = post_id 
    AND (author_id IS NULL OR author_id = '00000000-0000-0000-0000-000000000000');
    
    -- Verificar y arreglar las políticas RLS
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' AND policyname = 'Autores pueden modificar sus posts'
    ) THEN
        -- Recrear la política para permitir a los autores modificar sus posts
        ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Autores pueden modificar sus posts"
        ON public.blog_posts FOR ALL
        USING (
            auth.uid() = author_id 
            OR 
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE user_id = auth.uid() AND role = 'admin'
            )
        );
        
        RAISE NOTICE 'Política RLS recreada para blog_posts';
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Modificar la tabla blog_posts para garantizar que los autores puedan editar
DO $$
BEGIN
    -- Política para que cualquiera pueda ver posts publicados
    DROP POLICY IF EXISTS "Cualquiera puede leer posts publicados" ON public.blog_posts;
    CREATE POLICY "Cualquiera puede leer posts publicados"
    ON public.blog_posts FOR SELECT
    USING (is_published = true OR auth.uid() = author_id);
    
    -- Política para que los autores o administradores puedan modificar
    DROP POLICY IF EXISTS "Autores pueden modificar sus posts" ON public.blog_posts;
    CREATE POLICY "Autores pueden modificar sus posts"
    ON public.blog_posts FOR ALL
    USING (
        auth.uid() = author_id 
        OR 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
    
    -- Asegurarse de que RLS está habilitado
    ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
END $$; 