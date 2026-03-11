-- Migración para crear una función RPC para actualizar blog posts
-- Fecha: 17/11/2023

-- Función RPC para actualizar un post esquivando las restricciones RLS
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
DECLARE
    current_user_id UUID;
    post_author_id UUID;
    is_admin BOOLEAN;
BEGIN
    -- Obtener el ID del usuario actual
    current_user_id := auth.uid();
    
    IF current_user_id IS NULL THEN
        RAISE EXCEPTION 'Usuario no autenticado';
        RETURN FALSE;
    END IF;
    
    -- Verificar si el usuario es administrador
    SELECT EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = current_user_id AND role = 'admin'
    ) INTO is_admin;
    
    -- Obtener el autor actual del post
    SELECT author_id INTO post_author_id 
    FROM public.blog_posts 
    WHERE id = p_id;
    
    -- Verificar permisos: el usuario debe ser admin o el autor del post
    IF NOT (is_admin OR current_user_id = post_author_id) THEN
        RAISE EXCEPTION 'No tienes permisos para editar este post';
        RETURN FALSE;
    END IF;
    
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