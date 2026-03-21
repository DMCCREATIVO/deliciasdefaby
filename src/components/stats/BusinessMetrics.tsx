import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ShoppingCart,
  Users,
  Clock,
  Star,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Percent
} from "lucide-react";

interface BusinessMetricsProps {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  avgOrderValue: number;
  className?: string;
}

export const BusinessMetrics = ({ 
  totalRevenue, 
  totalOrders, 
  totalUsers, 
  avgOrderValue,
  className = "" 
}: BusinessMetricsProps) => {
  
  // Calcular métricas derivadas
  const revenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0;
  const orderConversionRate = totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0;
  
  // Simular tendencias (en un caso real vendrían de comparaciones con períodos anteriores)
  const metrics = [
    {
      title: "Ingresos Totales",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+23.5%",
      trend: "up" as const,
      icon: <DollarSign className="h-4 w-4" />,
      description: "Último mes",
      color: "text-green-600"
    },
    {
      title: "Pedidos Totales", 
      value: totalOrders.toString(),
      change: "+18.2%",
      trend: "up" as const,
      icon: <ShoppingCart className="h-4 w-4" />,
      description: "Este período",
      color: "text-blue-600"
    },
    {
      title: "Ticket Promedio",
      value: `$${Math.round(avgOrderValue).toLocaleString()}`,
      change: "+5.8%",
      trend: "up" as const,
      icon: <Target className="h-4 w-4" />,
      description: "Por pedido",
      color: "text-purple-600"
    },
    {
      title: "Revenue por Usuario",
      value: `$${Math.round(revenuePerUser).toLocaleString()}`,
      change: "+12.1%",
      trend: "up" as const,
      icon: <Users className="h-4 w-4" />,
      description: "Promedio",
      color: "text-orange-600"
    },
    {
      title: "Tasa de Conversión",
      value: `${orderConversionRate.toFixed(1)}%`,
      change: orderConversionRate > 50 ? "+3.2%" : "-1.1%",
      trend: orderConversionRate > 50 ? "up" as const : "down" as const,
      icon: <Percent className="h-4 w-4" />,
      description: "Usuarios → Pedidos",
      color: orderConversionRate > 50 ? "text-green-600" : "text-red-600"
    },
    {
      title: "Satisfacción",
      value: "4.8/5",
      change: "+0.3",
      trend: "up" as const,
      icon: <Star className="h-4 w-4" />,
      description: "Rating promedio",
      color: "text-yellow-600"
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold admin-text-accent">
          📈 Métricas de Rendimiento
        </h3>
        <Badge variant="outline" className="admin-badge-success">
          <TrendingUp className="h-3 w-3 mr-1" />
          Crecimiento
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card 
            key={index}
            className="admin-card shadow-none"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor:
                      'color-mix(in srgb, var(--theme-accent-secondary) 14%, transparent)',
                    color: 'var(--theme-accent-secondary)'
                  }}
                >
                  {metric.icon}
                </div>
                <div
                  className="flex items-center gap-1 text-xs font-medium"
                  style={{
                    color:
                      metric.trend === 'up' ? 'var(--admin-success)' : 'var(--admin-error)'
                  }}
                >
                  {metric.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {metric.change}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium admin-text-secondary mb-1">
                  {metric.title}
                </p>
                <p className="text-xl font-bold admin-text-accent mb-1">
                  {metric.value}
                </p>
                <p className="text-xs admin-text-muted">
                  {metric.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insights adicionales */}
      <Card className="admin-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className="p-2 rounded-lg"
              style={{
                backgroundColor:
                  'color-mix(in srgb, var(--theme-accent-secondary) 12%, transparent)',
              }}
            >
              <Target className="h-5 w-5 admin-text-accent" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold admin-text-accent mb-1">
                💡 Insights Clave
              </h4>
              <div className="space-y-1 text-sm admin-text-secondary">
                <p>• El ticket promedio está por encima del promedio de la industria</p>
                <p>• La tasa de conversión muestra potencial de crecimiento</p>
                <p>• Los usuarios están altamente satisfechos con el servicio</p>
                {totalRevenue > 300000 && (
                  <p className="font-medium" style={{ color: 'var(--admin-success)' }}>
                    • ¡Meta de revenue mensual alcanzada! 🎉
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 