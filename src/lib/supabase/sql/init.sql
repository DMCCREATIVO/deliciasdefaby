-- Habilitar la extensión uuid-ossp si no está habilitada
create extension if not exists "uuid-ossp";

-- Importar y ejecutar los scripts de creación de tablas
\i src/lib/supabase/sql/tables/admins.sql
\i src/lib/supabase/sql/add_admin.sql
\i src/lib/supabase/sql/tables/categories.sql
\i src/lib/supabase/sql/tables/products.sql
\i src/lib/supabase/sql/tables/orders.sql
\i src/lib/supabase/sql/tables/settings.sql
\i src/lib/supabase/sql/tables/blog_posts.sql

-- Ejecutar las funciones para crear las tablas
select create_admins_if_not_exists();
select create_categories_if_not_exists();
select create_products_if_not_exists();
select create_orders_if_not_exists();
select create_settings_if_not_exists();
select create_blog_posts_if_not_exists();

-- Agregar el administrador inicial
select add_admin_by_email('admin1@admin.com');

-- Crear tabla de blog_posts si no existe
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

    return 'Tabla blog_posts creada';
  end if;
  return 'Tabla blog_posts ya existe';
end;
$$;

-- Ejecutar función para crear tabla de blog_posts
select create_blog_posts_if_not_exists();

-- Consultas para verificar las tablas creadas
select * from public.admins;
select * from public.categories;
select * from public.products;
select * from public.orders;
select * from public.settings;
select * from public.blog_posts;