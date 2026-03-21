import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Eye,
  Loader2,
} from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderActions } from "@/components/orders/OrderActions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/lib/database/index";
import { Order } from "@/lib/database/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCLP } from "@/utils/currency";
import { format } from "date-fns";
import { es } from "date-fns/locale";

type OrderStatus = Order["status"];

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const data = await orderService.getAll();
        return data || [];
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        throw new Error("No se pudieron cargar los pedidos. Por favor, intenta de nuevo.");
      }
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: async (variables: { orderId: string; status: OrderStatus }) => {
      try {
        return await orderService.updateStatus(variables.orderId, variables.status);
      } catch (error) {
        console.error("Error al actualizar estado:", error);
        throw new Error("No se pudo actualizar el estado del pedido.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Estado del pedido actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error al actualizar el estado del pedido");
    },
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderMutation.mutate({ orderId, status: newStatus });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const filteredOrders = orders
    .filter((order) => {
      if (selectedStatus !== "all" && order.status !== selectedStatus) return false;

      const searchLower = searchTerm.toLowerCase();
      const customerName = order.customer_name || "";
      const customerEmail = order.customer_email || "";
      return (
        order.id.toLowerCase().includes(searchLower) ||
        customerName.toLowerCase().includes(searchLower) ||
        customerEmail.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Calcular estadísticas
  const stats = {
    today: orders.filter(order => {
      const today = new Date().toISOString().split("T")[0];
      return order.created_at.startsWith(today);
    }).length,
    pendiente: orders.filter(order => order.status === "pendiente" || order.status === "pending").length,
    confirmado: orders.filter(order => order.status === "confirmado").length,
    en_preparacion: orders.filter(order => order.status === "en_preparacion").length,
    listo_para_entrega: orders.filter(order => order.status === "listo_para_entrega").length,
    entregado: orders.filter(order => order.status === "entregado" || order.status === "completed").length,
    cancelado: orders.filter(order => order.status === "cancelado" || order.status === "cancelled").length
  };

  if (error) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p className="text-red-400 mb-4">Error al cargar los pedidos</p>
        <Button
          onClick={() => queryClient.invalidateQueries({ queryKey: ["orders"] })}
          variant="outline"
          className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
        >
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      {/* Header con acciones */}
      <div>
          <h2 className="text-3xl font-bold admin-text-accent">Gestión de Pedidos</h2>
          <p className="text-sm admin-text-muted mt-1">
          Administra y da seguimiento a todos los pedidos de la panadería
        </p>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Buscar por cliente, email o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-9 focus-visible:ring-[color-mix(in_srgb,var(--theme-accent)_30%,_transparent)]"
          />
        </div>
        <Select
          value={selectedStatus}
          onValueChange={(value) => setSelectedStatus(value as OrderStatus | "all")}
        >
          <SelectTrigger className="w-[180px] admin-input">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pendiente">Pendientes</SelectItem>
            <SelectItem value="confirmado">Confirmados</SelectItem>
            <SelectItem value="en_preparacion">En preparación</SelectItem>
            <SelectItem value="listo_para_entrega">Listos para entrega</SelectItem>
            <SelectItem value="entregado">Entregados</SelectItem>
            <SelectItem value="cancelado">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4 admin-card shadow-none">
          <p className="text-sm text-[var(--theme-text-secondary)]">Pedidos Hoy</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent)' }}>{stats.today}</p>
        </Card>
        <Card className="p-4 admin-card shadow-none">
          <p className="text-sm admin-text-muted">Pendientes</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent-secondary)' }}>{stats.pendiente}</p>
        </Card>
        <Card className="p-4 admin-card shadow-none">
          <p className="text-sm admin-text-muted">Confirmados</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent)' }}>{stats.confirmado}</p>
        </Card>
        <Card className="p-4 admin-card shadow-none">
          <p className="text-sm admin-text-muted">En Preparación</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent-secondary)' }}>{stats.en_preparacion}</p>
        </Card>
        <Card className="p-4 admin-card shadow-none">
          <p className="text-sm admin-text-muted">Listos</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent)' }}>{stats.listo_para_entrega}</p>
        </Card>
        <Card className="p-4 admin-card shadow-none">
          <p className="text-sm admin-text-muted">Entregados</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--theme-accent)' }}>{stats.entregado}</p>
        </Card>
      </div>
      {/* Tabla de pedidos */}
      <div className="rounded-lg border overflow-hidden admin-table-container">
        {isLoading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--theme-accent)' }} />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-8 text-center admin-text-muted">
            No se encontraron pedidos
          </div>
        ) : (
          <>
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow className="admin-table-row">
                    <TableHead className="admin-table-head">ID Pedido</TableHead>
                    <TableHead className="admin-table-head">Cliente</TableHead>
                    <TableHead className="admin-table-head">Fecha</TableHead>
                    <TableHead className="admin-table-head">Total</TableHead>
                    <TableHead className="admin-table-head">Estado</TableHead>
                    <TableHead className="admin-table-head">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="admin-table-row">
                      <TableCell className="font-mono text-sm font-bold admin-text-accent">#{order.id.slice(0, 8)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-lg" style={{ color: 'var(--theme-text-primary)' }}>{order.customer_name}</p>
                          <p className="text-sm" style={{ color: 'var(--theme-accent)' }}>{order.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="admin-table-cell-muted">
                        {format(new Date(order.created_at), "PPP", { locale: es })}
                      </TableCell>
                      <TableCell className="font-bold text-xl" style={{ color: 'var(--theme-accent)' }}>
                        {formatCLP(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDetails(order)}
                            className="hover:bg-[color-mix(in_srgb,var(--theme-accent)_18%,transparent)] hover:text-[var(--theme-accent)] transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <OrderActions
                            order={order}
                            onStatusChange={(status: any) => handleStatusChange(order.id, status)}
                            isUpdating={updateOrderMutation.isPending}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="sm:hidden p-3 space-y-3">
              {filteredOrders.map((order) => (
                <div key={order.id} className="admin-card shadow-none p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-mono text-sm font-bold admin-text-accent">
                        #{order.id.slice(0, 8)}
                      </div>
                      <div className="mt-1">
                        <p className="font-bold" style={{ color: 'var(--theme-text-primary)' }}>
                          {order.customer_name}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--theme-accent)' }}>
                          {order.customer_email}
                        </p>
                      </div>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs admin-text-muted">Fecha</p>
                      <p className="text-sm admin-text-primary">
                        {format(new Date(order.created_at), "PPP", { locale: es })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs admin-text-muted">Total</p>
                      <p className="text-sm font-bold" style={{ color: 'var(--theme-accent)' }}>
                        {formatCLP(order.total_amount)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(order)}
                      className="hover:bg-[color-mix(in_srgb,var(--theme-accent)_18%,transparent)] hover:text-[var(--theme-accent)] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <OrderActions
                      order={order}
                      onStatusChange={(status: any) => handleStatusChange(order.id, status)}
                      isUpdating={updateOrderMutation.isPending}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal de detalles del pedido */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="admin-dialog-title">Detalles del Pedido</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Información del cliente */}
              <div>
                <h3 className="font-semibold mb-2 text-slate-200">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-400">Nombre</p>
                    <p className="text-slate-200">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Email</p>
                    <p className="text-slate-200">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Teléfono</p>
                    <p className="text-slate-200">{selectedOrder.contact_phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Dirección</p>
                    <p className="text-slate-200">{selectedOrder.shipping_address}</p>
                  </div>
                </div>
              </div>

              {/* Detalles del pedido */}
              <div>
                <h3 className="font-semibold mb-2 text-slate-200">Detalles del Pedido</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ID del Pedido:</span>
                    <span className="font-mono text-emerald-400">#{selectedOrder.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fecha:</span>
                    <span className="text-slate-200">{format(new Date(selectedOrder.created_at), "PPP", { locale: es })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estado:</span>
                    <OrderStatusBadge status={selectedOrder.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total:</span>
                    <span className="font-bold text-xl text-emerald-300">{formatCLP(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Items del pedido */}
              <div>
                <h3 className="font-semibold mb-2 text-slate-200">Productos</h3>
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {(selectedOrder.order_items || []).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-2 rounded bg-slate-800/50 border border-slate-600/30">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium text-slate-200">{item.product_title}</p>
                            <p className="text-sm text-slate-400">
                              {item.quantity} x {formatCLP(item.unit_price)}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-emerald-300">{formatCLP(item.unit_price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Notas */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold mb-2 text-slate-200">Notas</h3>
                  <p className="text-slate-300 bg-slate-800/50 p-3 rounded border border-slate-600/30">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}