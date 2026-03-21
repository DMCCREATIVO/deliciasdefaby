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
    <Card className="admin-card">
      <CardHeader className="admin-card-header">
        <CardTitle className="admin-text-accent">Ventas Mensuales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorGuest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--theme-accent-secondary, #C71585)" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="var(--theme-accent-secondary, #C71585)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRegistered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--theme-accent, #5C4033)" stopOpacity={0.85} />
                  <stop offset="95%" stopColor="var(--theme-accent, #5C4033)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                  borderRadius: '0.5rem'
                }}
              />
              <Area
                type="monotone"
                dataKey="guest"
                name="Invitados"
                stroke="var(--theme-accent-secondary, #C71585)"
                fillOpacity={1}
                fill="url(#colorGuest)"
              />
              <Area
                type="monotone"
                dataKey="registered"
                name="Clientes"
                stroke="var(--theme-accent, #5C4033)"
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