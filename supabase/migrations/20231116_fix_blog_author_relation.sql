-- Migración para corregir la relación entre blog_posts y profiles
-- Fecha: 16/11/2023

-- Crear la función para establecer la relación correctamente
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
            -- Intentar crear la relación directamente con profiles
            ALTER TABLE public.blog_posts 
            ADD CONSTRAINT blog_posts_author_id_fkey 
            FOREIGN KEY (author_id) 
            REFERENCES auth.users(id) ON DELETE SET NULL;
            
            RAISE NOTICE 'Relación creada exitosamente con la tabla auth.users';
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error al crear relación: %', SQLERRM;
        END;
    ELSE
        RAISE NOTICE 'La restricción blog_posts_author_id_fkey ya existe';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Ejecutar la función para crear o corregir la relación
SELECT public.create_blog_author_relation();

-- Asegurarnos de que la tabla blog_posts tenga RLS configurado
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Crear políticas RLS para permitir el acceso adecuado
DO $$
BEGIN
    -- Política para lectura pública de posts publicados
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' AND policyname = 'Cualquiera puede leer posts publicados'
    ) THEN
        CREATE POLICY "Cualquiera puede leer posts publicados"
        ON public.blog_posts FOR SELECT
        USING (is_published = true OR auth.uid() = author_id);
    END IF;

    -- Política para que los autores puedan editar sus propios posts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'blog_posts' AND policyname = 'Autores pueden modificar sus posts'
    ) THEN
        CREATE POLICY "Autores pueden modificar sus posts"
        ON public.blog_posts FOR ALL
        USING (auth.uid() = author_id);
    END IF;
END $$; 