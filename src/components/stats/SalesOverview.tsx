import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, DollarSign, TrendingUp } from "lucide-react";

interface SalesOverviewProps {
  orders: any[];
  className?: string;
}

export const SalesOverview = ({ orders, className }: SalesOverviewProps) => {
  // Separar pedidos de invitados y usuarios registrados
  const guestOrders = orders?.filter(order => !order.user_id) || [];
  const registeredOrders = orders?.filter(order => order.user_id) || [];

  // Calcular estadísticas
  const guestStats = {
    count: guestOrders.length,
    total: guestOrders.reduce((acc, order) => acc + Number(order.total || 0), 0)
  };

  const registeredStats = {
    count: registeredOrders.length,
    total: registeredOrders.reduce((acc, order) => acc + Number(order.total || 0), 0)
  };

  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 ${className}`}>
      <Card className="p-4 admin-card shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--theme-accent-secondary)' }}
            >
              Pedidos de Invitados
            </p>
            <p
              className="text-2xl font-bold mt-1"
              style={{ color: 'var(--theme-accent-secondary)' }}
            >
              {guestStats.count}
            </p>
          </div>
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: 'var(--theme-accent-secondary)' }}
          >
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4 admin-card shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--theme-accent)' }}
            >
              Pedidos de Clientes
            </p>
            <p
              className="text-2xl font-bold mt-1"
              style={{ color: 'var(--theme-accent)' }}
            >
              {registeredStats.count}
            </p>
          </div>
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: 'var(--theme-accent)' }}
          >
            <UserCheck className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4 admin-card shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--theme-accent-secondary)' }}
            >
              Total Ventas Invitados
            </p>
            <p
              className="text-2xl font-bold mt-1"
              style={{ color: 'var(--theme-accent-secondary)' }}
            >
              ${guestStats.total.toLocaleString()}
            </p>
          </div>
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: 'var(--theme-accent-secondary)' }}
          >
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4 admin-card shadow-none">
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: 'var(--theme-accent)' }}
            >
              Total Ventas Clientes
            </p>
            <p
              className="text-2xl font-bold mt-1"
              style={{ color: 'var(--theme-accent)' }}
            >
              ${registeredStats.total.toLocaleString()}
            </p>
          </div>
          <div
            className="p-3 rounded-full"
            style={{ backgroundColor: 'var(--theme-accent)' }}
          >
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
};