-- Esta migración crea la relación entre la tabla blog_posts y profiles
-- Asumiendo que ya existen ambas tablas y que blog_posts tiene una columna author_id

-- Verificar si la columna author_id existe
DO $$
BEGIN
    -- Comprobar si la columna author_id existe en blog_posts
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'blog_posts' AND column_name = 'author_id'
    ) THEN
        -- Si no existe, la añadimos
        ALTER TABLE blog_posts ADD COLUMN author_id UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Crear o reemplazar la función para establecer la relación
CREATE OR REPLACE FUNCTION create_blog_author_relation()
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
            ALTER TABLE blog_posts 
            ADD CONSTRAINT blog_posts_author_id_fkey 
            FOREIGN KEY (author_id) 
            REFERENCES profiles(id) ON DELETE SET NULL;
            
            RAISE NOTICE 'Relación creada exitosamente con la tabla profiles';
        EXCEPTION WHEN OTHERS THEN
            -- Si falla, puede ser porque profiles usa auth.users como clave
            BEGIN
                -- Verificar si existe la tabla profiles
                IF EXISTS (
                    SELECT 1
                    FROM information_schema.tables
                    WHERE table_name = 'profiles'
                ) THEN
                    -- Crear una relación indirecta a través de una función
                    RAISE NOTICE 'Creando relación a profiles a través de RLS';
                    
                    -- Opcional: Crear políticas RLS para permitir el acceso
                    ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
                    
                    -- Crear una política que permita leer todos los posts
                    CREATE POLICY "Cualquiera puede leer posts"
                    ON blog_posts FOR SELECT
                    USING (true);
                    
                    -- Crear una política que permita a los autores gestionar sus posts
                    CREATE POLICY "Los autores pueden gestionar sus posts"
                    ON blog_posts FOR ALL
                    USING (auth.uid() = author_id);
                    
                    RAISE NOTICE 'RLS configurado para blog_posts';
                ELSE
                    RAISE NOTICE 'La tabla profiles no existe';
                END IF;
            END;
        END;
    ELSE
        RAISE NOTICE 'La restricción blog_posts_author_id_fkey ya existe';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para crear la estructura completa del blog si no existe
CREATE OR REPLACE FUNCTION create_blog_structure()
RETURNS void AS $$
BEGIN
    -- Crear tabla blog_posts si no existe
    CREATE TABLE IF NOT EXISTS blog_posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        image_url TEXT,
        author_id UUID REFERENCES auth.users(id),
        tags TEXT[] DEFAULT '{}',
        is_published BOOLEAN DEFAULT false,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        published_at TIMESTAMPTZ
    );
    
    -- Habilitar RLS y crear políticas básicas
    ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
    
    -- Cualquiera puede leer posts publicados
    CREATE POLICY "Cualquiera puede leer posts publicados"
    ON blog_posts FOR SELECT
    USING (is_published = true OR auth.uid() = author_id);
    
    -- Solo los autores o administradores pueden modificar
    CREATE POLICY "Autores pueden modificar sus posts"
    ON blog_posts FOR ALL
    USING (auth.uid() = author_id);
    
    RAISE NOTICE 'Estructura del blog creada correctamente';
END;
$$ LANGUAGE plpgsql; 