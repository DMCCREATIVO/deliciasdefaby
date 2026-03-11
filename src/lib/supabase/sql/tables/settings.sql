-- Función para crear tabla de configuración
create or replace function create_settings_if_not_exists()
returns text
language plpgsql
as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'settings') then
    create table public.settings (
      id uuid default uuid_generate_v4() primary key,
      currency text not null check (currency in ('CLP', 'USD', 'EUR', 'BRL', 'ARS', 'MXN', 'COP', 'PEN')),
      language text not null check (language in ('es', 'en', 'pt')),
      business_name text not null,
      logo text,
      whatsapp_number text default '',
      enable_online_payments boolean default false,
      mercadopago_public_key text default '',
      mercadopago_access_token text default '',
      translations jsonb,
      business_address text default '',
      delivery_schedule_text text default '',
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Políticas de seguridad para settings
    alter table public.settings enable row level security;

    create policy "Configuración visible para todos"
      on public.settings for select
      using (true);

    create policy "Solo administradores pueden modificar configuración"
      on public.settings for all
      using (auth.jwt() ->> 'role' = 'admin');

    -- Insertar configuración inicial
    insert into public.settings (
      currency,
      language,
      business_name,
      translations,
      business_address
    ) values (
      'CLP',
      'es',
      'Mi Catálogo',
      '{"es": {"business_name": "Mi Catálogo"}, "en": {"business_name": "My Catalog"}, "pt": {"business_name": "Meu Catálogo"}}',
      ''
    );

    return 'Tabla settings creada con datos iniciales';
  end if;
  return 'Tabla settings ya existe';
end;
$$;