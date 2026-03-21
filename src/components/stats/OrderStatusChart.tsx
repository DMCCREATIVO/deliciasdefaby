import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/lib/database/index";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const OrderStatusChart = () => {
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      return await orderService.getAll();
    }
  });

  const processStatusData = (orders: any[] = []) => {
    const statusCount: { [key: string]: number } = {};
    orders.forEach(order => {
      statusCount[order.status] = (statusCount[order.status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  };

  const data = processStatusData(orders);
  const COLORS = [
    'var(--theme-accent-secondary, #C71585)',
    'var(--theme-accent, #5C4033)',
    'color-mix(in srgb, var(--theme-accent-secondary) 60%, white)',
    'color-mix(in srgb, var(--theme-text-secondary) 55%, transparent)',
  ];

  return (
    <Card className="admin-card">
      <CardHeader className="admin-card-header">
        <CardTitle className="admin-text-accent">Estado de Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="var(--theme-accent-secondary, #C71585)"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--theme-card-bg)',
                  border: `1px solid color-mix(in srgb, var(--theme-card-border) 80%, transparent)`,
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};