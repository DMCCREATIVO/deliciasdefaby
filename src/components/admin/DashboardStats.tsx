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
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Pedidos de Invitados</p>
            <p className="text-2xl font-bold mt-1 text-purple-800">{stats?.totalGuestOrders}</p>
            <p className="text-xs text-purple-600 mt-1">Promedio: ${stats?.averageGuestOrderValue.toFixed(0)}</p>
          </div>
          <div className="p-3 bg-purple-500 rounded-full">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-indigo-600 font-medium">Ingresos de Invitados</p>
            <p className="text-2xl font-bold mt-1 text-indigo-800">
              ${stats?.totalGuestRevenue.toFixed(0)}
            </p>
          </div>
          <div className="p-3 bg-indigo-500 rounded-full">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      {/* Estadísticas de Usuarios Registrados */}
      <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600 font-medium">Pedidos de Clientes</p>
            <p className="text-2xl font-bold mt-1 text-emerald-800">{stats?.totalRegisteredOrders}</p>
            <p className="text-xs text-emerald-600 mt-1">Promedio: ${stats?.averageRegisteredOrderValue.toFixed(0)}</p>
          </div>
          <div className="p-3 bg-emerald-500 rounded-full">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 font-medium">Ingresos de Clientes</p>
            <p className="text-2xl font-bold mt-1 text-green-800">
              ${stats?.totalRegisteredRevenue.toFixed(0)}
            </p>
          </div>
          <div className="p-3 bg-green-500 rounded-full">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      {/* Productos */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Productos Activos</p>
            <p className="text-2xl font-bold mt-1 text-blue-800">{stats?.totalProducts}</p>
          </div>
          <div className="p-3 bg-blue-500 rounded-full">
            <Package className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      {/* Gráfico de Productos por Categoría */}
      <Card className="col-span-full bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-slate-700 flex items-center gap-2">
            <Package className="w-5 h-5 text-slate-600" />
            Productos por Categoría
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  color: '#1e293b',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};