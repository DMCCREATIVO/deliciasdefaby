-- Función para agregar un administrador por email
create or replace function add_admin_by_email(admin_email text)
returns text
language plpgsql
security definer
as $$
declare
    user_id uuid;
begin
    -- Obtener el ID del usuario por email
    select id into user_id
    from auth.users
    where email = admin_email;

    -- Verificar si el usuario existe
    if user_id is null then
        return 'Usuario no encontrado con el email proporcionado';
    end if;

    -- Insertar en la tabla de admins si no existe
    insert into public.admins (user_id)
    values (user_id)
    on conflict (user_id) do nothing;

    -- Actualizar el rol del usuario en auth.users
    update auth.users
    set raw_user_meta_data = jsonb_set(
        coalesce(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"admin"'
    )
    where id = user_id;

    return 'Administrador agregado exitosamente';
end;
$$; 