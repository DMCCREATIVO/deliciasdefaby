-- Función para crear tabla de categorías
create or replace function create_categories_if_not_exists()
returns text
language plpgsql
as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'categories') then
    create table public.categories (
      id uuid default uuid_generate_v4() primary key,
      name text not null,
      description text,
      is_active boolean default true,
      translations jsonb,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Políticas de seguridad para categories
    alter table public.categories enable row level security;

    create policy "Categorías visibles para todos"
      on public.categories for select
      using (true);

    create policy "Solo administradores pueden modificar categorías"
      on public.categories for all
      using (auth.role() = 'authenticated');

    -- Insertar algunas categorías de ejemplo
    insert into public.categories (name, description) values
      ('Pasteles', 'Deliciosos pasteles para toda ocasión'),
      ('Cupcakes', 'Pequeños pasteles decorados'),
      ('Galletas', 'Galletas artesanales');

    return 'Tabla categories creada con datos de ejemplo';
  end if;
  return 'Tabla categories ya existe';
end;
$$;