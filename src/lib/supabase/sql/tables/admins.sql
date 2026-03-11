-- Función para crear tabla de administradores
create or replace function create_admins_if_not_exists()
returns text
language plpgsql
as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'admins') then
    create table public.admins (
      id uuid default uuid_generate_v4() primary key,
      user_id uuid references auth.users(id) not null unique,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Políticas de seguridad para admins
    alter table public.admins enable row level security;

    -- Cualquiera puede consultar la tabla de admins
    create policy "Admins visibles para todos"
      on public.admins for select
      using (true);

    -- Solo superadmins pueden modificar la tabla de admins
    create policy "Solo superadmins pueden modificar admins"
      on public.admins for all
      using (auth.uid() in (select user_id from public.admins));

    return 'Tabla admins creada';
  end if;
  return 'Tabla admins ya existe';
end;
$$; 