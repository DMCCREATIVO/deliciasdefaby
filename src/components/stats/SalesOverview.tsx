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
      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Pedidos de Invitados</p>
            <p className="text-2xl font-bold mt-1 text-purple-800">{guestStats.count}</p>
          </div>
          <div className="p-3 bg-purple-500 rounded-full">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-emerald-600 font-medium">Pedidos de Clientes</p>
            <p className="text-2xl font-bold mt-1 text-emerald-800">{registeredStats.count}</p>
          </div>
          <div className="p-3 bg-emerald-500 rounded-full">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-indigo-600 font-medium">Total Ventas Invitados</p>
            <p className="text-2xl font-bold mt-1 text-indigo-800">
              ${guestStats.total.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-indigo-500 rounded-full">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 font-medium">Total Ventas Clientes</p>
            <p className="text-2xl font-bold mt-1 text-green-800">
              ${registeredStats.total.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-green-500 rounded-full">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>
    </div>
  );
};