-- Script para corregir problemas de permisos en el blog
-- Ejecutar este script en el panel SQL de Supabase

-- 1. Función para actualizar posts (con SECURITY DEFINER para eludir RLS)
CREATE OR REPLACE FUNCTION public.update_blog_post(
    p_id UUID,
    p_title TEXT,
    p_content TEXT,
    p_excerpt TEXT DEFAULT NULL,
    p_image_url TEXT DEFAULT NULL,
    p_is_published BOOLEAN DEFAULT FALSE,
    p_featured BOOLEAN DEFAULT FALSE,
    p_tags TEXT[] DEFAULT '{}'
)
RETURNS boolean AS $$
BEGIN
    -- Actualizar el post (con SECURITY DEFINER, esta función ignora RLS)
    UPDATE public.blog_posts
    SET 
        title = p_title,
        content = p_content,
        excerpt = COALESCE(p_excerpt, substring(p_content from 1 for 150) || '...'),
        image_url = p_image_url,
        is_published = p_is_published,
        featured = p_featured,
        tags = p_tags,
        updated_at = now(),
        published_at = CASE 
            WHEN p_is_published AND published_at IS NULL THEN now() 
            ELSE published_at 
        END
    WHERE id = p_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Función para crear políticas específicas para posts problemáticos
CREATE OR REPLACE FUNCTION public.create_policy_for_post(post_id UUID)
RETURNS boolean AS $$
BEGIN
    -- Crear una política específica para este post
    EXECUTE format('
        DROP POLICY IF EXISTS "Política especial para post %s" ON public.blog_posts;
        CREATE POLICY "Política especial para post %s"
        ON public.blog_posts
        FOR ALL
        USING (id = %L)
        WITH CHECK (id = %L);
    ', post_id, post_id, post_id, post_id);
    
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Función para corregir políticas RLS
CREATE OR REPLACE FUNCTION public.fix_blog_posts_rls(post_id UUID DEFAULT NULL)
RETURNS boolean AS $$
BEGIN
    -- Asegurarnos de que RLS está habilitado
    ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
    
    -- Eliminar políticas existentes que puedan estar causando conflictos
    DROP POLICY IF EXISTS "Cualquiera puede leer posts publicados" ON public.blog_posts;
    DROP POLICY IF EXISTS "Autores pueden modificar sus posts" ON public.blog_posts;
    DROP POLICY IF EXISTS "Administradores pueden hacer todo" ON public.blog_posts;
    DROP POLICY IF EXISTS "Solo administradores pueden crear/editar/eliminar posts" ON public.blog_posts;
    
    -- Crear políticas nuevas más permisivas
    
    -- 1. Política para lectura pública
    CREATE POLICY "Cualquiera puede leer posts publicados"
    ON public.blog_posts FOR SELECT
    USING (is_published = true OR auth.uid() = author_id);
    
    -- 2. Política para que los autores modifiquen sus posts
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
    
    -- 3. Política para administradores (más permisiva)
    CREATE POLICY "Administradores pueden hacer todo"
    ON public.blog_posts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Función para crear la relación entre blog_posts y auth.users
CREATE OR REPLACE FUNCTION public.create_blog_author_relation()
RETURNS void AS $$
BEGIN
    -- Comprobar si ya existe la restricción
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'blog_posts_author_id_fkey'
    ) THEN
        -- Crear la relación foreign key si no existe
        BEGIN
            -- Intentar crear la relación directamente con auth.users
            ALTER TABLE public.blog_posts 
            ADD CONSTRAINT blog_posts_author_id_fkey 
            FOREIGN KEY (author_id) 
            REFERENCES auth.users(id) ON DELETE SET NULL;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error al crear relación: %', SQLERRM;
        END;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Ejecutar las funciones para aplicar los cambios
SELECT public.fix_blog_posts_rls();
SELECT public.create_blog_author_relation();

-- Permitir temporalmente todas las operaciones en blog_posts (solo para depuración)
CREATE OR REPLACE FUNCTION public.allow_all_blog_operations()
RETURNS boolean AS $$
BEGIN
    -- Crear una política que permita todas las operaciones
    DROP POLICY IF EXISTS "Permitir todas las operaciones temporalmente" ON public.blog_posts;
    CREATE POLICY "Permitir todas las operaciones temporalmente"
    ON public.blog_posts
    FOR ALL
    USING (true)
    WITH CHECK (true);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ejecutar la función para permitir temporalmente todas las operaciones
SELECT public.allow_all_blog_operations(); 