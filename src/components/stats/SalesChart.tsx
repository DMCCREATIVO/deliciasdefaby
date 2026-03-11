import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/lib/database/index";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const SalesChart = () => {
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      return await orderService.getAll();
    }
  });

  const processOrdersData = (orders: any[] = []) => {
    const monthlyData: { [key: string]: { guest: number; registered: number } } = {};

    orders.forEach(order => {
      const date = new Date(order.created_at);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });

      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { guest: 0, registered: 0 };
      }

      if (order.user_id) {
        monthlyData[monthYear].registered += Number(order.total_amount || 0);
      } else {
        monthlyData[monthYear].guest += Number(order.total_amount || 0);
      }
    });

    return Object.entries(monthlyData).map(([name, data]) => ({
      name,
      ...data
    }));
  };

  const data = processOrdersData(orders);

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader>
        <CardTitle className="text-brand-pink">Ventas Mensuales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGuest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E75480" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#E75480" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRegistered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B4513" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8B4513" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Area
                type="monotone"
                dataKey="guest"
                name="Invitados"
                stroke="#E75480"
                fillOpacity={1}
                fill="url(#colorGuest)"
              />
              <Area
                type="monotone"
                dataKey="registered"
                name="Clientes"
                stroke="#8B4513"
                fillOpacity={1}
                fill="url(#colorRegistered)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};