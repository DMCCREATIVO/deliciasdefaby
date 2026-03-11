import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  Package,
  Clock,
  DollarSign,
  ShoppingCart,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import {
  orderService,
  productService,
  userService,
  categoryService
} from "@/lib/database/index";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingFallback, QuickLoadingState } from "@/components/ui/loading-fallback";
import { usePerformanceMonitor } from "@/lib/utils/performance";
import { formatCLP } from "@/utils/currency";

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  activeProducts: number;
  pendingOrders: number;
  completedOrders: number;
  todayOrders: number;
  averageOrderValue: number;
  recentOrders: Array<{
    id: string;
    contact_name: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  categoryStats: Array<{
    name: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  salesTrend: Array<{
    date: string;
    amount: number;
    orders: number;
    fullDate?: string;
  }>;
  revenueGrowth?: string;
  ordersGrowth?: string;
  revenueGrowthDirection?: 'up' | 'down';
  ordersGrowthDirection?: 'up' | 'down';
  thisMonthRevenue?: number;
  lastMonthRevenue?: number;
  thisMonthOrders?: number;
  lastMonthOrders?: number;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastLoadTime, setLastLoadTime] = useState<number>(0);
  const loadingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const perfMonitor = usePerformanceMonitor('Dashboard');

  const getCategoryColor = useCallback((categoryName: string) => {
    const colors = ['#E75480', '#8B4513', '#D4A574', '#A0522D', '#F5E6D3'];
    return colors[categoryName.length % colors.length];
  }, []);

  const generateRealSalesTrend = useCallback((orders: any[]) => {
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayOrders = orders.filter(o =>
        o.created_at && o.created_at.split('T')[0] === dateStr
      );

      const dayRevenue = dayOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

      last7Days.push({
        date: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
        amount: dayRevenue,
        orders: dayOrders.length,
        fullDate: dateStr
      });
    }

    return last7Days;
  }, []);

  const loadDashboardData = useCallback(async (showRefreshLoader = false) => {
    if (!perfMonitor.canLoad('dashboard')) {
      return;
    }

    if (loadingRef.current) {
      return;
    }

    const nowTime = Date.now();
    if (nowTime - lastLoadTime < 2000) {
      return;
    }

    loadingRef.current = true;
    setLastLoadTime(nowTime);
    perfMonitor.recordLoad('dashboard');

    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const dataPromise = Promise.all([
        orderService.getAll(),
        productService.getAll(),
        userService.getAll(),
        categoryService.getAll()
      ]);

      const [orders, products, users, categories] = await dataPromise;

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

      // Estadísticas básicas
      const totalOrders = orders?.length || 0;
      const totalProducts = products?.length || 0;
      const totalUsers = users?.length || 0;
      const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total || 0), 0) || 0;
      const activeProducts = products?.filter(p => p.is_active)?.length || 0;

      // Estados de pedidos
      const pendingOrders = orders?.filter(o => o.status === 'pendiente' || o.status === 'pending')?.length || 0;
      const completedOrders = orders?.filter(o => o.status === 'entregado' || o.status === 'delivered')?.length || 0;

      // Comparaciones temporales
      const todayOrders = orders?.filter(o =>
        o.created_at && o.created_at.split('T')[0] === today
      )?.length || 0;

      const yesterdayOrders = orders?.filter(o =>
        o.created_at && o.created_at.split('T')[0] === yesterday
      )?.length || 0;

      const thisMonthOrders = orders?.filter(o =>
        o.created_at && o.created_at >= thisMonthStart
      ) || [];

      const lastMonthOrders = orders?.filter(o => {
        const orderDate = o.created_at?.split('T')[0];
        return orderDate && orderDate >= lastMonthStart && orderDate < thisMonthStart;
      }) || [];

      const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);

      // Calcular crecimientos
      const revenueGrowthNum = lastMonthRevenue > 0
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
        : thisMonthRevenue > 0 ? 100 : 0;

      const ordersGrowthNum = yesterdayOrders > 0
        ? ((todayOrders - yesterdayOrders) / yesterdayOrders * 100)
        : todayOrders > 0 ? 100 : 0;

      const revenueGrowth = `${revenueGrowthNum >= 0 ? '+' : ''}${revenueGrowthNum.toFixed(1)}`;
      const ordersGrowth = `${ordersGrowthNum >= 0 ? '+' : ''}${ordersGrowthNum.toFixed(1)}`;

      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Estadísticas por categoría
      const categoryStats = categories?.map(category => {
        const categoryProducts = products?.filter(p => p.category_id === category.id)?.length || 0;
        const percentage = totalProducts > 0 ? (categoryProducts / totalProducts) * 100 : 0;
        return {
          name: category.name,
          count: categoryProducts,
          percentage: Math.round(percentage),
          color: getCategoryColor(category.name)
        };
      }) || [];

      // Pedidos recientes
      const recentOrders = orders
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        ?.slice(0, 5)
        ?.map(order => ({
          id: order.id,
          contact_name: order.contact_name || 'Cliente',
          total: Number(order.total || 0),
          status: order.status,
          created_at: order.created_at
        })) || [];

      // Tendencia de ventas
      const salesTrend = generateRealSalesTrend(orders || []);

      const newStats = {
        totalOrders,
        totalProducts,
        totalUsers,
        totalRevenue,
        activeProducts,
        pendingOrders,
        completedOrders,
        todayOrders,
        averageOrderValue,
        recentOrders,
        categoryStats,
        salesTrend,
        revenueGrowth: `${revenueGrowth}%`,
        ordersGrowth: `${ordersGrowth}%`,
        revenueGrowthDirection: revenueGrowthNum >= 0 ? 'up' : 'down' as 'up' | 'down',
        ordersGrowthDirection: ordersGrowthNum >= 0 ? 'up' : 'down' as 'up' | 'down',
        thisMonthRevenue,
        lastMonthRevenue,
        thisMonthOrders: thisMonthOrders.length,
        lastMonthOrders: lastMonthOrders.length
      };

      setStats(newStats);
      console.log("✅ Dashboard cargado exitosamente");

    } catch (err: any) {
      console.error('❌ Error al cargar dashboard:', err);
      setError(err.message || 'Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
      loadingRef.current = false;

      // Limpiar timeout en caso de error
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [getCategoryColor, generateRealSalesTrend, lastLoadTime, perfMonitor]);

  // Effect optimizado con dependency array fija
  useEffect(() => {
    loadDashboardData();

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      loadingRef.current = false;
    };
  }, []); // Solo se ejecuta una vez al montar

  const handleRefresh = useCallback(() => {
    loadDashboardData(true);
  }, [loadDashboardData]);

  // Función para obtener el color del estado
  const getStatusColor = useCallback((status: string) => {
    const colors = {
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmado': 'bg-blue-100 text-blue-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'en_preparacion': 'bg-orange-100 text-orange-800',
      'preparing': 'bg-orange-100 text-orange-800',
      'listo_para_entrega': 'bg-purple-100 text-purple-800',
      'ready': 'bg-purple-100 text-purple-800',
      'entregado': 'bg-green-100 text-green-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }, []);

  // Función para traducir estados
  const translateStatus = useCallback((status: string) => {
    const translations = {
      'pendiente': 'Pendiente',
      'pending': 'Pendiente',
      'confirmado': 'Confirmado',
      'confirmed': 'Confirmado',
      'en_preparacion': 'Preparando',
      'preparing': 'Preparando',
      'listo_para_entrega': 'Listo para Entrega',
      'ready': 'Listo para Entrega',
      'entregado': 'Entregado',
      'delivered': 'Entregado',
      'cancelado': 'Cancelado',
      'cancelled': 'Cancelado'
    };
    return translations[status as keyof typeof translations] || status;
  }, []);

  if (loading) {
    return <LoadingFallback />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar el dashboard</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => loadDashboardData()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-cafe font-heading">
            📊 Dashboard Principal
          </h1>
          <p className="text-brand-cafe/70 mt-1">
            Resumen ejecutivo de tu negocio en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className="bg-brand-beige border-brand-cafe/20 hover:bg-brand-pink/10"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
          {stats ? (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Conectado
            </Badge>
          ) : error ? (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Error
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-brand-pink/10 text-brand-pink border-brand-pink/30">
              <Activity className="h-3 w-3 mr-1" />
              Cargando
            </Badge>
          )}
        </div>
      </div>

      {/* Cards Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Revenue Total */}
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCLP(stats?.totalRevenue || 0)}
            </div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              {stats?.revenueGrowthDirection === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              )}
              {stats?.revenueGrowth || '0%'} vs mes anterior
            </div>
          </CardContent>
        </Card>

        {/* Pedidos Totales */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Pedidos Totales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats?.totalOrders}</div>
            <div className="flex items-center text-xs text-blue-600 mt-1">
              {stats?.ordersGrowthDirection === 'up' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              )}
              {stats?.todayOrders} hoy ({stats?.ordersGrowth || '0%'} vs ayer)
            </div>
          </CardContent>
        </Card>

        {/* Productos Activos */}
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Productos</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{stats?.activeProducts}</div>
            <div className="text-xs text-purple-600 mt-1">
              de {stats?.totalProducts} totales
            </div>
          </CardContent>
        </Card>

        {/* Usuarios Registrados */}
        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats?.totalUsers}</div>
            <div className="text-xs text-orange-600 mt-1">
              registrados
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs con Contenido Detallado */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-brand-beige border border-brand-cafe/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-brand-pink data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-brand-pink data-[state=active]:text-white">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Pedidos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Gráfico de Tendencia de Ventas */}
            <Card className="bg-brand-beige border-brand-cafe/20">
              <CardHeader>
                <CardTitle className="text-brand-cafe font-heading flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-brand-pink" />
                  Tendencia de Ventas (7 días)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.salesTrend}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E75480" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#E75480" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#8B4513" opacity={0.3} />
                      <XAxis dataKey="date" stroke="#8B4513" />
                      <YAxis stroke="#8B4513" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#F5E6D3',
                          border: '1px solid #8B4513',
                          borderRadius: '8px',
                          color: '#8B4513'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#E75480"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Distribución por Categorías */}
            <Card className="bg-brand-beige border-brand-cafe/20">
              <CardHeader>
                <CardTitle className="text-brand-cafe font-heading flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-brand-pink" />
                  Productos por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={stats?.categoryStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="count"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                      >
                        {stats?.categoryStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Métricas Adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-brand-beige border-brand-cafe/20">
              <CardHeader>
                <CardTitle className="text-brand-cafe font-heading">💰 Valor Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-cafe">
                  {formatCLP(stats?.averageOrderValue || 0)}
                </div>
                <p className="text-sm text-brand-cafe/70 mt-1">Por pedido</p>
              </CardContent>
            </Card>

            <Card className="bg-brand-beige border-brand-cafe/20">
              <CardHeader>
                <CardTitle className="text-brand-cafe font-heading">📦 Pedidos Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-cafe">{stats?.pendingOrders}</div>
                <p className="text-sm text-brand-cafe/70 mt-1">Por procesar</p>
              </CardContent>
            </Card>

            <Card className="bg-brand-beige border-brand-cafe/20">
              <CardHeader>
                <CardTitle className="text-brand-cafe font-heading">✅ Completados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-brand-cafe">{stats?.completedOrders}</div>
                <p className="text-sm text-brand-cafe/70 mt-1">Entregados</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card className="bg-brand-beige border-brand-cafe/20">
            <CardHeader>
              <CardTitle className="text-brand-cafe font-heading">
                🛒 Pedidos Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {stats?.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-brand-cafe">{order.contact_name}</p>
                            <p className="text-sm text-brand-cafe/60">
                              {new Date(order.created_at).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-brand-cafe">{formatCLP(order.total)}</div>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          {translateStatus(order.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <Card className="bg-gradient-to-r from-brand-pink/10 to-brand-cafe/10 border-brand-cafe/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-brand-cafe">
                📈 Delicias de Faby Dashboard
              </h3>
              <p className="text-sm text-brand-cafe/70">
                Datos en tiempo real • Última actualización: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <Badge className="bg-brand-pink text-white">
              <Clock className="h-3 w-3 mr-1" />
              Activo
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}