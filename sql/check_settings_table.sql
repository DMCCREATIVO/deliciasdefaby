-- ===================================================================
-- SCRIPT PARA VERIFICAR EL ESTADO DE LA TABLA SETTINGS
-- ===================================================================

-- Verificar si la tabla existe
SELECT 
  table_name, 
  table_schema,
  table_type
FROM information_schema.tables 
WHERE table_name = 'settings';

-- Verificar la estructura de la tabla
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'settings'
ORDER BY ordinal_position;

-- Verificar las políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'settings';

-- Verificar si RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  forcerowsecurity
FROM pg_tables 
WHERE tablename = 'settings';

-- Contar registros existentes
SELECT COUNT(*) as total_registros FROM public.settings;

-- Ver registros existentes (si los hay)
SELECT * FROM public.settings LIMIT 5;

-- Verificar permisos del usuario actual
SELECT 
  current_user as usuario_actual,
  session_user as usuario_sesion;

-- Verificar si el usuario tiene perfil de admin
SELECT 
  p.id,
  p.role,
  p.email
FROM public.profiles p
WHERE p.id = auth.uid();

-- Mensaje final
SELECT '✅ Verificación completa de la tabla settings' as resultado; 