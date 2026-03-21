import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { orderService, productService, categoryService } from "@/lib/database/index";
import { Users, UserCheck, DollarSign, Package } from "lucide-react";

export const DashboardStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // Obtener datos en paralelo
      const [orders, products, categories] = await Promise.all([
        orderService.getAll(),
        productService.getAllAdmin(),
        categoryService.getAll()
      ]);

      // Separar pedidos de invitados y usuarios registrados
      // En PocketBase, si no hay user_id (o customer_id mapeado a user_id) es invitado
      const guestOrders = orders.filter(order => !order.user_id);
      const registeredOrders = orders.filter(order => order.user_id);

      // Calcular estadísticas
      const totalProducts = products.length;

      // Estadísticas de invitados
      const totalGuestOrders = guestOrders.length;
      const totalGuestRevenue = guestOrders.reduce((acc, order) => acc + Number(order.total_amount || 0), 0);
      const averageGuestOrderValue = totalGuestOrders > 0 ? totalGuestRevenue / totalGuestOrders : 0;

      // Estadísticas de usuarios registrados
      const totalRegisteredOrders = registeredOrders.length;
      const totalRegisteredRevenue = registeredOrders.reduce((acc, order) => acc + Number(order.total_amount || 0), 0);
      const averageRegisteredOrderValue = totalRegisteredOrders > 0 ? totalRegisteredRevenue / totalRegisteredOrders : 0;

      // Agrupar productos por categoría
      // Mapeamos category_id a name usando la lista de categorías
      const categoryMap = categories.reduce((acc: Record<string, string>, cat) => {
        acc[cat.id] = cat.name;
        return acc;
      }, {});

      const salesByCategory = products.reduce((acc: Record<string, number>, product) => {
        const categoryName = categoryMap[product.category_id as string] || 'Sin categoría';
        acc[categoryName] = (acc[categoryName] || 0) + 1;
        return acc;
      }, {});

      return {
        totalGuestOrders,
        totalRegisteredOrders,
        totalGuestRevenue,
        totalRegisteredRevenue,
        averageGuestOrderValue,
        averageRegisteredOrderValue,
        totalProducts,
        salesByCategory
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-gray-100 border-gray-200">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const chartData = stats ? Object.entries(stats.salesByCategory).map(([name, value]) => ({
    name,
    value
  })) : [];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Estadísticas de Invitados */}
      <Card className="p-4 admin-card shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--theme-accent-secondary)' }}>Pedidos de Invitados</p>
            <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent-secondary)' }}>{stats?.totalGuestOrders}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--theme-accent-secondary)' }}>Promedio: ${stats?.averageGuestOrderValue.toFixed(0)}</p>
          </div>
          <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--theme-accent-secondary)' }}>
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-4 admin-card shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--theme-accent-secondary)' }}>Ingresos de Invitados</p>
            <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent-secondary)' }}>${stats?.totalGuestRevenue.toFixed(0)}</p>
          </div>
          <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--theme-accent-secondary)' }}>
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      {/* Estadísticas de Usuarios Registrados */}
      <Card className="p-4 admin-card shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>Pedidos de Clientes</p>
            <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent)' }}>{stats?.totalRegisteredOrders}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--theme-accent)' }}>Promedio: ${stats?.averageRegisteredOrderValue.toFixed(0)}</p>
          </div>
          <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--theme-accent)' }}>
            <UserCheck className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-4 admin-card shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>Ingresos de Clientes</p>
            <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent)' }}>${stats?.totalRegisteredRevenue.toFixed(0)}</p>
          </div>
          <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--theme-accent)' }}>
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      {/* Productos */}
      <Card className="p-4 admin-card shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>Productos Activos</p>
            <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent)' }}>{stats?.totalProducts}</p>
          </div>
          <div className="p-3 rounded-full" style={{ backgroundColor: 'var(--theme-accent)' }}>
            <Package className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      {/* Gráfico de Productos por Categoría */}
      <Card className="col-span-full admin-card shadow-none">
        <CardHeader className="admin-card-header">
          <CardTitle className="admin-text-accent flex items-center gap-2">
            <Package className="w-5 h-5" />
            Productos por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="color-mix(in srgb, var(--theme-text-secondary) 45%, transparent)"
              />
              <XAxis
                dataKey="name"
                stroke="color-mix(in srgb, var(--theme-text-secondary) 55%, transparent)"
              />
              <YAxis stroke="color-mix(in srgb, var(--theme-text-secondary) 55%, transparent)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--theme-card-bg)',
                  border: `1px solid color-mix(in srgb, var(--theme-card-border) 80%, transparent)`,
                  borderRadius: '8px',
                  color: 'var(--theme-text-primary)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="value" fill="var(--theme-accent-secondary, #C71585)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};