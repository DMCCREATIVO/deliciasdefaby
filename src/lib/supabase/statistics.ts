import {
  productService,
  categoryService,
  userService,
  orderService
} from "@/lib/database/index";

export interface BusinessStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalAdmins: number;
  totalOrders: number;
  totalRevenue: number;
  avgProductPrice: number;
  monthlyStats: Array<{
    month: string;
    products: number;
    users: number;
    revenue: number;
  }>;
  categoryDistribution: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    type: 'product' | 'user' | 'order';
    description: string;
    timestamp: string;
  }>;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

class StatisticsService {
  /**
   * Obtiene todas las estadísticas del negocio
   */
  async getBusinessStats(): Promise<BusinessStats> {
    try {
      console.log("📊 [DEBUG] Iniciando carga de estadísticas del negocio (PocketBase)...");

      // Consulta servicios
      const [products, categories, users, orders] = await Promise.all([
        productService.getAllAdmin(),
        categoryService.getAll(),
        userService.getAll(),
        orderService.getAll()
      ]);

      console.log("📊 [DEBUG] Datos procesados:", {
        products: products.length,
        categories: categories.length,
        users: users.length,
        orders: orders.length
      });

      // Calcular estadísticas básicas
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.is_active).length;
      const inactiveProducts = totalProducts - activeProducts;
      const totalCategories = categories.length;
      const totalUsers = users.filter(p => p.role === 'customer').length;
      const totalAdmins = users.filter(p => p.role === 'admin' || p.role === 'superadmin').length;
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);

      // Calcular precio promedio de productos
      const avgProductPrice = totalProducts > 0
        ? products.reduce((sum, p) => sum + Number(p.price || 0), 0) / totalProducts
        : 0;

      // Generar estadísticas mensuales (últimos 6 meses)
      const monthlyStats = this.generateMonthlyStats(products, users, orders);

      // Calcular distribución por categorías
      const categoryDistribution = this.calculateCategoryDistribution(products, categories);

      // Generar actividad reciente
      const recentActivity = this.generateRecentActivity(products, users, orders);

      return {
        totalProducts,
        activeProducts,
        inactiveProducts,
        totalCategories,
        totalUsers,
        totalAdmins,
        totalOrders,
        totalRevenue,
        avgProductPrice,
        monthlyStats,
        categoryDistribution,
        recentActivity
      };

    } catch (error) {
      console.error('❌ [DEBUG] Error al cargar estadísticas:', error);
      throw new Error('No se pudieron cargar las estadísticas: ' + (error as Error).message);
    }
  }

  /**
   * Genera estadísticas mensuales para los últimos 6 meses
   */
  private generateMonthlyStats(products: any[], users: any[], orders: any[]) {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];

    return months.map((month, index) => {
      // Para demonstración, generamos datos basados en la cantidad real de productos
      const baseProducts = products.length;
      const baseUsers = users.length;
      const baseRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

      // Añadir algo de variación aleatoria basada en datos reales
      const monthMultiplier = (index + 1) / 6; // Tendencia creciente
      const randomFactor = 0.8 + Math.random() * 0.4; // Variación ±20%

      return {
        month,
        products: Math.floor(baseProducts * monthMultiplier * randomFactor),
        users: Math.floor(baseUsers * monthMultiplier * randomFactor),
        revenue: Math.floor(baseRevenue * monthMultiplier * randomFactor)
      };
    });
  }

  /**
   * Calcula la distribución de productos por categoría
   */
  private calculateCategoryDistribution(products: any[], categories: any[]) {
    const distribution = categories.map(category => {
      const productsInCategory = products.filter(p => p.category_id === category.id).length;
      const percentage = products.length > 0 ? (productsInCategory / products.length) * 100 : 0;

      return {
        name: category.name,
        count: productsInCategory,
        percentage: Math.round(percentage)
      };
    });

    // Filtramos categorías sin productos o devolvemos simulado si todo está vacío
    const realDistribution = distribution.filter(d => d.count > 0);

    if (realDistribution.length === 0) {
      return [
        { name: 'Postres Fríos', count: 8, percentage: 45 },
        { name: 'Tortas', count: 5, percentage: 30 },
        { name: 'Dulces', count: 4, percentage: 25 }
      ];
    }

    return realDistribution;
  }

  /**
   * Genera actividad reciente del sistema
   */
  private generateRecentActivity(products: any[], users: any[], orders: any[]) {
    const activities: any[] = [];

    // Agregar productos recientes
    const recentProducts = [...products]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 2);

    recentProducts.forEach(product => {
      activities.push({
        type: 'product' as const,
        description: `Nuevo producto agregado: ${product.title}`,
        timestamp: product.created_at
      });
    });

    // Agregar usuarios recientes
    const recentUsers = [...users]
      .filter(p => p.role === 'customer')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 2);

    recentUsers.forEach(user => {
      activities.push({
        type: 'user' as const,
        description: `Nuevo usuario registrado`,
        timestamp: user.created_at
      });
    });

    // Agregar órdenes recientes
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 2);

    recentOrders.forEach(order => {
      activities.push({
        type: 'order' as const,
        description: `Nueva orden recibida por $${order.total_amount.toLocaleString()}`,
        timestamp: order.created_at
      });
    });

    // Ordenar por fecha más reciente
    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }

  /**
   * Obtiene datos para el gráfico de ventas mensuales
   */
  async getSalesChartData(): Promise<ChartData[]> {
    try {
      const stats = await this.getBusinessStats();
      return stats.monthlyStats.map(stat => ({
        name: stat.month,
        value: stat.revenue,
        ventas: stat.revenue,
        pedidos: Math.floor(stat.revenue / 100) // Simulado
      }));
    } catch (error) {
      console.error('Error al obtener datos de ventas:', error);
      return [];
    }
  }

  /**
   * Obtiene datos para el gráfico de distribución por categorías
   */
  async getCategoryChartData(): Promise<ChartData[]> {
    try {
      const stats = await this.getBusinessStats();
      const colors = ['#E75480', '#8B4513', '#D4A574', '#A0522D', '#F5E6D3'];

      return stats.categoryDistribution.map((category, index) => ({
        name: category.name,
        value: category.percentage,
        color: colors[index % colors.length]
      }));
    } catch (error) {
      console.error('Error al obtener datos de categorías:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas rápidas para las cards principales
   */
  async getQuickStats() {
    try {
      const stats = await this.getBusinessStats();

      return {
        totalProducts: stats.totalProducts,
        activeProducts: stats.activeProducts,
        totalCategories: stats.totalCategories,
        totalUsers: stats.totalUsers,
        totalAdmins: stats.totalAdmins,
        avgProductPrice: stats.avgProductPrice,
        totalRevenue: stats.totalRevenue,
        totalOrders: stats.totalOrders
      };
    } catch (error) {
      console.error('Error al obtener estadísticas rápidas:', error);
      throw error;
    }
  }
}

export const statisticsService = new StatisticsService();
