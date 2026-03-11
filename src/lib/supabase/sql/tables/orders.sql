-- Función para crear tabla de pedidos
create or replace function create_orders_if_not_exists()
returns text
language plpgsql
as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'orders') then
    create table public.orders (
      id uuid default uuid_generate_v4() primary key,
      user_id uuid references auth.users(id),
      items jsonb not null,
      total decimal(10,2) not null,
      status text not null check (status in ('pending', 'completed', 'cancelled')),
      customer_name text not null,
      customer_email text not null,
      customer_phone text,
      notes text,
      payment_method text not null check (payment_method in ('cash', 'mercadopago')),
      payment_status text not null check (payment_status in ('pending', 'paid', 'failed')),
      delivery_date timestamp with time zone,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Políticas de seguridad para orders
    alter table public.orders enable row level security;

    create policy "Usuarios pueden ver sus propios pedidos"
      on public.orders for select
      using (auth.uid() = user_id);

    create policy "Usuarios pueden crear pedidos"
      on public.orders for insert
      with check (auth.uid() = user_id);

    create policy "Solo administradores pueden modificar pedidos"
      on public.orders for update
      using (auth.role() = 'authenticated');

    return 'Tabla orders creada';
  end if;
  return 'Tabla orders ya existe';
end;
$$;