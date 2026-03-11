import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Clock, CheckCircle, Truck, Package, XCircle } from "lucide-react";
import { Order } from "@/lib/database/types";

type OrderStatus = 'pendiente' | 'confirmado' | 'en_preparacion' | 'listo_para_entrega' | 'entregado' | 'cancelado';

interface OrderActionsProps {
  order: Order;
  onStatusChange: (status: OrderStatus) => void;
  isUpdating?: boolean;
}

export function OrderActions({ order, onStatusChange, isUpdating }: OrderActionsProps) {
  const getAvailableActions = (status: OrderStatus): OrderStatus[] => {
    switch (status) {
      case "pendiente":
        return ["confirmado", "cancelado"];
      case "confirmado":
        return ["en_preparacion", "pendiente", "cancelado"];
      case "en_preparacion":
        return ["listo_para_entrega", "confirmado", "cancelado"];
      case "listo_para_entrega":
        return ["entregado", "en_preparacion", "cancelado"];
      case "entregado":
        return ["listo_para_entrega"]; // Por si necesita revertir
      case "cancelado":
        return ["pendiente", "confirmado"];
      default:
        return [];
    }
  };

  const getStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      pendiente: "Pendiente",
      confirmado: "Confirmado",
      en_preparacion: "En Preparación",
      listo_para_entrega: "Listo para Entrega",
      entregado: "Entregado",
      cancelado: "Cancelado",
    };
    return labels[status];
  };

  const getStatusIcon = (status: OrderStatus) => {
    const icons = {
      pendiente: Clock,
      confirmado: CheckCircle,
      en_preparacion: Package,
      listo_para_entrega: Truck,
      entregado: CheckCircle,
      cancelado: XCircle,
    };
    const Icon = icons[status];
    return <Icon className="h-4 w-4 mr-2" />;
  };

  const getStatusColor = (status: OrderStatus): string => {
    const colors = {
      pendiente: "text-yellow-400 hover:text-yellow-300",
      confirmado: "text-blue-400 hover:text-blue-300",
      en_preparacion: "text-orange-400 hover:text-orange-300",
      listo_para_entrega: "text-purple-400 hover:text-purple-300",
      entregado: "text-green-400 hover:text-green-300",
      cancelado: "text-red-400 hover:text-red-300",
    };
    return colors[status];
  };

  const getStatusDescription = (status: OrderStatus): string => {
    const descriptions: Record<OrderStatus, string> = {
      pendiente: "⏳ Esperando confirmación",
      confirmado: "✅ Pedido confirmado, listo para preparar",
      en_preparacion: "👨‍🍳 Preparando en cocina",
      listo_para_entrega: "📦 Listo para entregar/recoger",
      entregado: "🎉 Pedido completado",
      cancelado: "❌ Pedido cancelado",
    };
    return descriptions[status];
  };

  const availableActions = getAvailableActions(order.status as OrderStatus);

  if (availableActions.length === 0) {
    return (
      <Button variant="ghost" size="sm" disabled className="text-slate-400">
        Sin acciones
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
          disabled={isUpdating}
        >
          <span className="sr-only">Cambiar estado del pedido</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-slate-800 border-slate-600 min-w-[250px]"
      >
        <div className="px-2 py-1 text-xs text-slate-400 border-b border-slate-600 mb-1">
          Estado actual: {getStatusDescription(order.status as OrderStatus)}
        </div>
        {availableActions.map((action) => (
          <DropdownMenuItem
            key={action}
            onClick={() => onStatusChange(action)}
            disabled={isUpdating}
            className={`flex items-center hover:bg-slate-700 focus:bg-slate-700 ${getStatusColor(action)} cursor-pointer py-2 px-3`}
          >
            {getStatusIcon(action)}
            <div className="flex flex-col">
              <span className="font-medium">Cambiar a {getStatusLabel(action)}</span>
              <span className="text-xs opacity-75">{getStatusDescription(action)}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
