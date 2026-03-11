-- Verificar y actualizar la estructura de la tabla blog_posts
DO $$
BEGIN
  -- Verificar si existe la columna slug
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'slug'
  ) THEN
    -- Agregar la columna slug
    ALTER TABLE blog_posts ADD COLUMN slug TEXT;
    
    -- Actualizar los posts existentes para generar un slug basado en el título
    UPDATE blog_posts 
    SET slug = LOWER(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          title, 
          '[^a-zA-Z0-9\s]', 
          '', 
          'g'
        ),
        '\s+', 
        '-', 
        'g'
      )
    );
    
    -- Hacer la columna NOT NULL y crear un índice
    ALTER TABLE blog_posts ALTER COLUMN slug SET NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS blog_posts_slug_idx ON blog_posts(slug);
  END IF;
  
  -- Verificar si existe la columna tags
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'tags'
  ) THEN
    -- Agregar la columna tags como array de texto
    ALTER TABLE blog_posts ADD COLUMN tags TEXT[] DEFAULT '{}';
  END IF;
  
  -- Verificar si existe la columna featured
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'blog_posts' AND column_name = 'featured'
  ) THEN
    -- Agregar la columna featured
    ALTER TABLE blog_posts ADD COLUMN featured BOOLEAN DEFAULT FALSE;
  END IF;
  
  -- Actualizar cualquier post existente que no tenga slug para asignarle uno
  UPDATE blog_posts
  SET slug = LOWER(
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        title, 
        '[^a-zA-Z0-9\s]', 
        '', 
        'g'
      ),
      '\s+', 
      '-', 
      'g'
    )
  )
  WHERE slug IS NULL OR slug = '';
END $$;

-- Asegurarse de que no hay slugs duplicados
DO $$
DECLARE
  duplicate_record RECORD;
BEGIN
  FOR duplicate_record IN 
    SELECT
      id,
      slug,
      ROW_NUMBER() OVER(PARTITION BY slug ORDER BY created_at) as row_num
    FROM
      blog_posts
    WHERE
      slug IN (
        SELECT slug FROM blog_posts GROUP BY slug HAVING COUNT(*) > 1
      )
  LOOP
    IF duplicate_record.row_num > 1 THEN
      UPDATE blog_posts
      SET slug = duplicate_record.slug || '-' || duplicate_record.row_num
      WHERE id = duplicate_record.id;
    END IF;
  END LOOP;
END $$; 