import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { OrderStatusBadge } from "./orders/OrderStatusBadge";
import { OrderCustomerInfo } from "./orders/OrderCustomerInfo";
import { OrderItemsList } from "./orders/OrderItemsList";
import { OrderActions } from "./orders/OrderActions";
import { Skeleton } from "@/components/ui/skeleton";
import { orderService } from "@/lib/database/index";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCLP } from "@/utils/currency";
import { Order, OrderItem } from "@/lib/database/types";

// Keep local interface for compatibility with existing UI if needed, 
// but we'll try to use the unified ones.
// Mapping from Order (unified) to what this component expected previously
const mapUnifiedToLocalOrder = (order: Order) => ({
  ...order,
  total: order.total_amount, // compatibility
  items: (order.order_items || []).map(item => ({
    id: item.id,
    title: item.product_title,
    price: item.unit_price,
    quantity: item.quantity
  }))
});

interface OrdersListProps {
  filterStatus: string;
  searchQuery: string;
  className?: string;
}

export function OrdersList({ filterStatus, searchQuery, className }: OrdersListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const allOrders = await orderService.getAll();
      return allOrders.map(mapUnifiedToLocalOrder);
    }
  });

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = searchQuery === "" ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: "completed" | "cancelled") => {
    try {
      await orderService.updateStatus(orderId, newStatus);

      queryClient.invalidateQueries({ queryKey: ['orders'] });

      toast({
        title: "Estado actualizado",
        description: `Pedido #${orderId} marcado como ${newStatus === "completed" ? "completado" : "cancelado"
          }`,
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pedido",
        variant: "destructive",
      });
    }
  };

  const handleContact = (type: "phone" | "email" | "whatsapp", contact: string) => {
    switch (type) {
      case "phone":
        window.location.href = `tel:${contact}`;
        break;
      case "email":
        window.location.href = `mailto:${contact}`;
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/${contact.replace(/\D/g, "")}`,
          "_blank"
        );
        break;
    }
  };

  const handleViewDetails = (orderId: string) => {
    toast({
      title: "Ver detalles",
      description: `Mostrando detalles del pedido #${orderId}`,
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-12 w-full bg-slate-800/50" />
          </div>
        ))}
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-slate-300 text-lg mb-2">No hay pedidos que coincidan con los filtros</div>
        <p className="text-slate-400 text-sm">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-600/50 hover:bg-slate-800/50">
            <TableHead className="text-slate-300 font-semibold">Pedido</TableHead>
            <TableHead className="text-slate-300 font-semibold">Cliente</TableHead>
            <TableHead className="text-slate-300 font-semibold">Estado</TableHead>
            <TableHead className="text-slate-300 font-semibold">Productos</TableHead>
            <TableHead className="text-slate-300 font-semibold">Total</TableHead>
            <TableHead className="text-slate-300 font-semibold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow
              key={order.id}
              className="border-b border-slate-600/30 transition-colors hover:bg-slate-800/40"
            >
              <TableCell className="font-bold text-emerald-400">
                #{order.id.slice(0, 8)}
              </TableCell>
              <TableCell>
                <OrderCustomerInfo
                  name={order.customer_name}
                  email={order.customer_email}
                  phone={order.contact_phone || ''}
                  onContact={handleContact}
                />
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="max-w-[200px]">
                <OrderItemsList items={order.items} />
              </TableCell>
              <TableCell className="font-bold text-xl text-emerald-300">
                {formatCLP(order.total)}
              </TableCell>
              <TableCell>
                <OrderActions
                  orderId={order.id}
                  status={order.status}
                  onViewDetails={() => handleViewDetails(order.id)}
                  onUpdateStatus={handleUpdateStatus}
                  order={order}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}