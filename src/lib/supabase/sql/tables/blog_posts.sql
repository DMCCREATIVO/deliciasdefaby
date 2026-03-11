-- Función para crear tabla de publicaciones del blog
create or replace function create_blog_posts_if_not_exists()
returns text
language plpgsql
as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'blog_posts') then
    create table public.blog_posts (
      id uuid default uuid_generate_v4() primary key,
      title text not null,
      slug text not null unique,
      content text not null,
      excerpt text,
      image_url text,
      is_published boolean default false,
      featured boolean default false,
      tags text[] default '{}',
      author_id uuid references auth.users(id),
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
      published_at timestamp with time zone
    );

    -- Políticas de seguridad para blog_posts
    alter table public.blog_posts enable row level security;

    create policy "Publicaciones públicas visibles para todos"
      on public.blog_posts for select
      using (is_published = true);

    create policy "Solo administradores pueden crear/editar/eliminar posts"
      on public.blog_posts for all
      using (auth.role() = 'authenticated');

    -- Crear índices para mejorar el rendimiento
    create index blog_posts_slug_idx on public.blog_posts(slug);
    create index blog_posts_published_idx on public.blog_posts(is_published);
    create index blog_posts_featured_idx on public.blog_posts(featured);
    create index blog_posts_author_idx on public.blog_posts(author_id);
    
    -- Insertar algunos posts de prueba
    insert into public.blog_posts (
      title, slug, content, excerpt, image_url, is_published, featured, tags
    ) values 
    (
      'Los mejores postres para la temporada otoñal',
      'los-mejores-postres-para-la-temporada-otonal',
      '<p>El otoño es la temporada perfecta para disfrutar de sabores cálidos y reconfortantes. En este artículo compartimos nuestras recetas favoritas para esta época del año.</p><p>Las tartas de manzana con canela, los pasteles de calabaza y los brownies con nueces son opciones deliciosas que no puedes dejar de probar. Además, te explicamos cómo conseguir la textura perfecta en cada una de estas preparaciones.</p>',
      'Descubre las mejores recetas de postres para disfrutar durante el otoño con ingredientes de temporada.',
      'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
      true,
      true,
      ARRAY['recetas', 'postres', 'otoño']
    ),
    (
      'Cómo decorar pasteles como un profesional',
      'como-decorar-pasteles-como-un-profesional',
      '<p>La decoración de pasteles es un arte que puedes dominar con práctica y las herramientas adecuadas. En este artículo te revelamos los secretos de los pasteleros profesionales.</p><p>Aprenderás técnicas para conseguir un glaseado perfecto, cómo hacer flores de fondant realistas y trucos para escribir con chocolate de manera impecable. Con estos consejos, tus creaciones lucirán como si vinieran de una pastelería profesional.</p>',
      'Técnicas y consejos de decoración para conseguir pasteles dignos de una pastelería profesional desde tu cocina.',
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80',
      true,
      false,
      ARRAY['decoración', 'técnicas', 'pasteles']
    ),
    (
      'Panes del mundo: un viaje gastronómico',
      'panes-del-mundo-un-viaje-gastronomico',
      '<p>El pan es un alimento universal con miles de variantes alrededor del mundo. Te invitamos a un recorrido por las recetas más emblemáticas de diferentes culturas.</p><p>Desde el baguette francés hasta el naan indio, pasando por el pan de muerto mexicano o el pretzel alemán, cada país tiene su propia tradición panadera. Exploraremos sus ingredientes, técnicas de elaboración y el papel cultural que desempeñan en sus lugares de origen.</p>',
      'Recorrido por las variedades de pan más famosas del mundo, sus ingredientes y técnicas tradicionales.',
      'https://images.unsplash.com/photo-1555951015-6da1e2452e10?auto=format&fit=crop&w=800&q=80',
      true,
      false,
      ARRAY['pan', 'internacional', 'tradiciones']
    );

    return 'Tabla blog_posts creada con datos de ejemplo';
  end if;
  return 'Tabla blog_posts ya existe';
end;
$$; 