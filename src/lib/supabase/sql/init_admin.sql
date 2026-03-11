-- Función para insertar un administrador si no existe
create or replace function insert_admin_if_not_exists(p_user_id uuid)
returns text
language plpgsql
as $$
begin
  if not exists (select 1 from public.admins where user_id = p_user_id) then
    insert into public.admins (user_id)
    values (p_user_id);
    return 'Administrador creado correctamente';
  end if;
  return 'El usuario ya es administrador';
end;
$$; 