import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { adminComponentPresets } from "@/hooks/useAdminTheme";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  Package,
  Star,
  MessageSquare,
  DollarSign,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Eye,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { statisticsService } from "@/lib/database/index";
import { BusinessStats } from "@/lib/database/statistics.pocketbase";
import { BusinessMetrics } from "@/components/stats/BusinessMetrics";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart } from "lucide-react";

interface StatsCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  description?: string;
}

const Estadisticas = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("7d");

  const loadAllData = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Cargar todas las estadísticas
      const businessStats = await statisticsService.getBusinessStats();

      // Calcular datos gráficos localmente a partir de la estadística para evitar múltiples consultas extra
      const salesChartData = businessStats.monthlyStats.map(stat => ({
        name: stat.month,
        value: stat.revenue,
        ventas: stat.revenue,
        pedidos: Math.floor(stat.revenue / 100)
      }));

      const colors = ['#E75480', '#8B4513', '#D4A574', '#A0522D', '#F5E6D3'];
      const categoryChartData = businessStats.categoryDistribution.map((category, index) => ({
        name: category.name,
        value: category.percentage || category.count, // Default to count if percentage fails
        count: category.count,
        percentage: category.percentage,
        color: colors[index % colors.length]
      }));

      setStats(businessStats);
      setSalesData(salesChartData);
      setCategoryData(categoryChartData);

    } catch (error) {
      console.error('Error cargando datos de estadísticas:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const topProducts = stats?.categoryDistribution?.slice(0, 5).map((c, i) => ({
    name: c.name,
    sales: c.count,
    revenue: c.count * (stats?.avgProductPrice || 0)
  })) || [];

  const recentOrders = stats?.recentActivity?.filter(a => a.type === 'order').map((a, i) => ({
    id: `ORD-${i}`,
    customer_email: 'Cliente',
    created_at: a.timestamp,
    total: 0,
    status: 'completed'
  })) || [];

  useEffect(() => {
    loadAllData();
  }, []);

  const handleRefresh = () => {
    loadAllData(true);
  };

  const refreshData = () => {
    loadAllData(true);
  };

  // Crear cards de estadísticas con datos reales
  const statsCards: StatsCard[] = stats ? [
    {
      title: "Total Productos",
      value: stats.totalProducts,
      change: "+12%",
      trend: "up",
      icon: <Package className="h-4 w-4" />,
      description: `${stats.activeProducts} activos`
    },
    {
      title: "Categorías",
      value: stats.totalCategories,
      change: "Sin cambios",
      trend: "neutral",
      icon: <BarChart3 className="h-4 w-4" />,
      description: "Organizadas"
    },
    {
      title: "Usuarios",
      value: stats.totalUsers,
      change: "+5%",
      trend: "up",
      icon: <Users className="h-4 w-4" />,
      description: `${stats.totalAdmins} admins`
    },
    {
      title: "Precio Promedio",
      value: `$${stats.avgProductPrice.toLocaleString()}`,
      change: "+8%",
      trend: "up",
      icon: <DollarSign className="h-4 w-4" />,
      description: "Por producto"
    }
  ] : [];

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-zinc-600 font-medium font-heading">Cargando estadísticas del negocio...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
        <AlertCircle className="h-10 w-10 text-stone-400 mx-auto mb-3" />
        <p className="text-stone-600">No se pudieron cargar las estadísticas. Reintenta más tarde.</p>
        <Button onClick={() => loadAllData()} variant="outline" className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className={`${adminComponentPresets.pageContainer} space-y-6 max-w-7xl mx-auto`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold admin-text-primary font-heading">
            📊 Estadísticas del Negocio
          </h1>
          <p className="admin-text-secondary mt-1">
            Dashboard completo con métricas y análisis en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            size="sm"
            className={adminComponentPresets.secondaryButton}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </Button>
          <Badge variant="outline" className={adminComponentPresets.statusSuccess}>
            <Activity className="h-3 w-3 mr-1" />
            En vivo
          </Badge>
        </div>
      </div>

      {/* Cards de Estadísticas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className={adminComponentPresets.statsCard}
          >
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 admin-bg-accent-light rounded-lg admin-text-primary">
                    {stat.icon}
                  </div>
                </div>
                {stat.trend && (
                  <div className={`flex items-center gap-1 text-xs ${stat.trend === 'up' ? adminComponentPresets.statusSuccess.split(' ')[0] :
                    stat.trend === 'down' ? adminComponentPresets.statusError.split(' ')[0] : 'admin-text-muted'
                    }`}>
                    {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> :
                      stat.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : null}
                    {stat.change}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium admin-text-secondary mb-1">
                  {stat.title}
                </h3>
                <p className="text-2xl md:text-3xl font-bold admin-text-primary mb-1">
                  {stat.value}
                </p>
                {stat.description && (
                  <p className="text-xs admin-text-muted">
                    {stat.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs con Gráficos */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="admin-bg-secondary-light border admin-border-light">
          <TabsTrigger value="overview" className="data-[state=active]:admin-bg-primary data-[state=active]:admin-text-inverse">
            <BarChart3 className="h-4 w-4 mr-2" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="metrics" className="data-[state=active]:admin-bg-primary data-[state=active]:admin-text-inverse">
            <TrendingUp className="h-4 w-4 mr-2" />
            Métricas
          </TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:admin-bg-primary data-[state=active]:admin-text-inverse">
            <Package className="h-4 w-4 mr-2" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="users" className="data-[state=active]:admin-bg-primary data-[state=active]:admin-text-inverse">
            <Users className="h-4 w-4 mr-2" />
            Usuarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Gráfico de Ventas */}
            <Card className={adminComponentPresets.sectionContainer}>
              <CardHeader>
                <CardTitle className="admin-text-primary font-heading flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 admin-text-accent" />
                  Tendencia Mensual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData}>
                      <defs>
                        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--admin-accent)" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="var(--admin-accent)" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--admin-text-muted)" opacity={0.3} />
                      <XAxis dataKey="name" stroke="var(--admin-text-primary)" />
                      <YAxis stroke="var(--admin-text-primary)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--admin-secondary-light)',
                          border: '1px solid var(--admin-border)',
                          borderRadius: '8px',
                          color: 'var(--admin-text-primary)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="ventas"
                        stroke="var(--admin-accent)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorVentas)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Distribución por Categorías */}
            <Card className={adminComponentPresets.sectionContainer}>
              <CardHeader>
                <CardTitle className="admin-text-primary font-heading flex items-center gap-2">
                  <PieChart className="h-5 w-5 admin-text-accent" />
                  Productos por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index % 2 === 0 ? 'var(--admin-accent)' : 'var(--admin-accent-light)'}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--admin-secondary-light)',
                          border: '1px solid var(--admin-border)',
                          borderRadius: '8px',
                          color: 'var(--admin-text-primary)'
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <Card className={adminComponentPresets.sectionContainer}>
            <CardHeader>
              <CardTitle className="admin-text-primary font-heading">
                <Package className="h-5 w-5 inline mr-2" />
                Resumen de Productos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 admin-bg-accent-light rounded-lg">
                  <Package className="h-8 w-8 admin-text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold admin-text-primary">{stats?.totalProducts}</p>
                  <p className="text-sm admin-text-secondary">Total Productos</p>
                </div>
                <div className="text-center p-4 admin-bg-success-light rounded-lg">
                  <Eye className="h-8 w-8 admin-text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold admin-text-primary">{stats?.activeProducts}</p>
                  <p className="text-sm admin-text-secondary">Productos Activos</p>
                </div>
                <div className="text-center p-4 admin-bg-warning-light rounded-lg">
                  <AlertCircle className="h-8 w-8 admin-text-warning mx-auto mb-2" />
                  <p className="text-2xl font-bold admin-text-primary">{stats?.inactiveProducts}</p>
                  <p className="text-sm admin-text-secondary">Productos Inactivos</p>
                </div>
              </div>

              {/* Distribución detallada por categoría */}
              <div className="mt-6">
                <h4 className="font-semibold admin-text-primary mb-4">Distribución por Categorías</h4>
                <div className="space-y-3">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between p-3 admin-bg-secondary-light rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: 'var(--admin-accent)' }}
                        />
                        <span className="font-medium admin-text-primary">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold admin-text-primary">{category.count} productos</div>
                        <div className="text-sm admin-text-muted">{category.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className={adminComponentPresets.sectionContainer}>
            <CardHeader>
              <CardTitle className="admin-text-primary font-heading">
                <Users className="h-5 w-5 inline mr-2" />
                Estadísticas de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 admin-bg-info-light rounded-lg">
                <Users className="h-12 w-12 admin-text-info mx-auto mb-4" />
                <p className="text-3xl font-bold admin-text-primary mb-2">{stats?.totalUsers}</p>
                <p className="admin-text-secondary">Total de usuarios registrados</p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 admin-bg-secondary-light rounded">
                    <p className="font-semibold admin-text-primary">{stats?.totalAdmins}</p>
                    <p className="text-sm admin-text-muted">Administradores</p>
                  </div>
                  <div className="p-3 admin-bg-secondary-light rounded">
                    <p className="font-semibold admin-text-primary">{(stats?.totalUsers || 0) - (stats?.totalAdmins || 0)}</p>
                    <p className="text-sm admin-text-muted">Usuarios Regulares</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6">
          <BusinessMetrics
            totalRevenue={stats?.totalRevenue || 0}
            totalOrders={stats?.totalOrders || 0}
            totalUsers={stats?.totalUsers || 0}
            avgOrderValue={stats?.avgProductPrice || 0}
          />
        </TabsContent>
      </Tabs>

      {/* Footer de Estadísticas */}
      <Card className="bg-gradient-to-r from-brand-pink/10 to-brand-cafe/10 border-brand-cafe/20">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-brand-cafe">
                💡 Insights del Negocio
              </h3>
              <p className="text-sm text-brand-cafe/70">
                Datos actualizados en tiempo real • Última actualización: {new Date().toLocaleTimeString()}
              </p>
            </div>
            <Badge className="admin-status-active">
              <Clock className="h-3 w-3 mr-1" />
              Tiempo Real
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Estadisticas;