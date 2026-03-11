-- Función para crear tabla de productos
create or replace function create_products_if_not_exists()
returns text
language plpgsql
as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'products') then
    create table public.products (
      id uuid default uuid_generate_v4() primary key,
      title text not null,
      description text,
      price decimal(10,2) not null,
      weight text,
      category_id uuid references public.categories(id),
      stock integer default 0,
      images text[],
      is_active boolean default true,
      available_days jsonb,
      translations jsonb,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Políticas de seguridad para products
    alter table public.products enable row level security;

    create policy "Productos visibles para todos"
      on public.products for select
      using (true);

    create policy "Solo administradores pueden modificar productos"
      on public.products for all
      using (auth.role() = 'authenticated');

    -- Insertar algunos productos de ejemplo
    insert into public.products (title, description, price, category_id)
    select 
      'Pastel de Chocolate',
      'Delicioso pastel de chocolate con cobertura de ganache',
      25000,
      id
    from public.categories
    where name = 'Pasteles'
    limit 1;

    return 'Tabla products creada con datos de ejemplo';
  end if;
  return 'Tabla products ya existe';
end;
$$;