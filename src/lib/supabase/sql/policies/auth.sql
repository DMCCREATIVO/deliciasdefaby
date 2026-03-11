-- Habilitar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Políticas para productos
CREATE POLICY "Productos visibles para todos" ON products
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar productos" ON products
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Políticas para categorías
CREATE POLICY "Categorías visibles para todos" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar categorías" ON categories
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Políticas para pedidos
CREATE POLICY "Usuarios ven sus propios pedidos" ON orders
  FOR SELECT USING (
    auth.uid() = user_id
  );

CREATE POLICY "Admins ven todos los pedidos" ON orders
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Usuarios pueden crear pedidos" ON orders
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );

-- Políticas para configuración
CREATE POLICY "Configuración visible para todos" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Solo admins pueden modificar configuración" ON settings
  FOR ALL USING (
    auth.jwt() ->> 'role' = 'admin'
  );