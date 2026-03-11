"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { OrderService } from "@/lib/supabase/orders";
import { Order } from "@/types/order";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { Spinner } from "@/components/ui/spinner";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCLP } from "@/utils/currency";

const orderService = new OrderService();

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const fetchedOrders = await orderService.getAll();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error al cargar las órdenes:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las órdenes. Por favor, intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      await orderService.updateStatus(orderId, newStatus);
      
      // Actualizar la orden en el estado local
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ));

      toast({
        title: "Estado actualizado",
        description: "El estado de la orden se actualizó correctamente.",
      });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado de la orden.",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Órdenes</h1>
          <p className="text-muted-foreground">
            Administra y actualiza el estado de las órdenes
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer_name}</TableCell>
                <TableCell className="font-semibold text-green-600">
                  {formatCLP(order.total)}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  {new Date(order.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusChange(order.id, value)}
                      disabled={updatingOrderId === order.id}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendiente">🟡 Pendiente</SelectItem>
                        <SelectItem value="confirmado">🔵 Confirmado</SelectItem>
                        <SelectItem value="en_preparacion">🟠 En Preparación</SelectItem>
                        <SelectItem value="listo_para_entrega">🟣 Listo para Entrega</SelectItem>
                        <SelectItem value="entregado">🟢 Entregado</SelectItem>
                        <SelectItem value="cancelado">🔴 Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    {updatingOrderId === order.id && (
                      <Spinner className="w-4 h-4" />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 