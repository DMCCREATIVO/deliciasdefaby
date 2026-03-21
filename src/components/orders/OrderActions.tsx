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
    const colors: Record<OrderStatus, string> = {
      pendiente: "text-[var(--theme-accent-secondary)] hover:text-[var(--theme-accent-secondary)]",
      confirmado: "text-[var(--theme-accent)] hover:text-[var(--theme-accent)]",
      en_preparacion: "text-[var(--theme-accent)] hover:text-[var(--theme-accent)]",
      listo_para_entrega: "text-[var(--theme-accent-secondary)] hover:text-[var(--theme-accent-secondary)]",
      entregado: "text-[var(--theme-accent)] hover:text-[var(--theme-accent)]",
      cancelado: "text-[var(--admin-error)] hover:text-[var(--admin-error)]",
    };
    return colors[status] || "";
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
      <Button variant="ghost" size="sm" disabled className="admin-text-muted">
        Sin acciones
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-[color-mix(in_srgb,var(--theme-accent)_18%,transparent)] hover:text-[var(--theme-accent)] transition-colors"
          disabled={isUpdating}
        >
          <span className="sr-only">Cambiar estado del pedido</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[250px]"
      >
        <div className="px-2 py-1 text-xs admin-text-muted border-b admin-border-light mb-1">
          Estado actual: {getStatusDescription(order.status as OrderStatus)}
        </div>
        {availableActions.map((action) => (
          <DropdownMenuItem
            key={action}
            onClick={() => onStatusChange(action)}
            disabled={isUpdating}
            className={`flex items-center hover:bg-[color-mix(in_srgb,var(--theme-accent)_15%,transparent)] focus:bg-[color-mix(in_srgb,var(--theme-accent)_15%,transparent)] ${getStatusColor(action)} cursor-pointer py-2 px-3`}
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
