import { Badge } from "@/components/ui/badge";

type OrderStatus = "pendiente" | "confirmado" | "en_preparacion" | "listo_para_entrega" | "entregado" | "cancelado";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "pendiente":
        return {
          label: "🟡 Pendiente",
          variant: "secondary" as const,
          className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        };
      case "confirmado":
        return {
          label: "🔵 Confirmado",
          variant: "default" as const,
          className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        };
      case "en_preparacion":
        return {
          label: "🟠 En Preparación",
          variant: "default" as const,
          className: "bg-orange-500/20 text-orange-300 border-orange-500/30",
        };
      case "listo_para_entrega":
        return {
          label: "🟣 Listo para Entrega",
          variant: "default" as const,
          className: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        };
      case "entregado":
        return {
          label: "🟢 Entregado",
          variant: "default" as const,
          className: "bg-green-500/20 text-green-300 border-green-500/30",
        };
      case "cancelado":
        return {
          label: "🔴 Cancelado",
          variant: "destructive" as const,
          className: "bg-red-500/20 text-red-300 border-red-500/30",
        };
      default:
        return {
          label: "❓ Desconocido",
          variant: "secondary" as const,
          className: "bg-gray-500/20 text-gray-300 border-gray-500/30",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant} 
      className={config.className}
    >
      {config.label}
    </Badge>
  );
}