-- ===================================================================
-- SCRIPT PARA LIMPIAR REGISTROS DUPLICADOS EN SETTINGS
-- ===================================================================

-- Mostrar cuántos registros hay actualmente
SELECT 'Estado actual de la tabla settings:' as info;
SELECT COUNT(*) as total_registros FROM public.settings;

-- Mostrar todos los registros
SELECT 'Registros existentes:' as info;
SELECT id, business_name, created_at FROM public.settings ORDER BY created_at;

-- Eliminar registros duplicados, manteniendo el más antiguo
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.settings
)
DELETE FROM public.settings 
WHERE id IN (
  SELECT id 
  FROM duplicates 
  WHERE rn > 1
);

-- Mostrar el resultado
SELECT 'Resultado después de la limpieza:' as info;
SELECT COUNT(*) as registros_restantes FROM public.settings;

-- Mostrar el registro que quedó
SELECT 'Registro final:' as info;
SELECT id, business_name, created_at, updated_at FROM public.settings;

-- Mensaje de confirmación
SELECT '✅ Limpieza completada - Solo debe quedar 1 registro' as resultado; 