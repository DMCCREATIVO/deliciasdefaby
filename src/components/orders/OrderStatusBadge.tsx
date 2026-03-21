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
          variant: "warning" as const,
        };
      case "confirmado":
        return {
          label: "🔵 Confirmado",
          variant: "default" as const,
        };
      case "en_preparacion":
        return {
          label: "🟠 En Preparación",
          variant: "default" as const,
        };
      case "listo_para_entrega":
        return {
          label: "🟣 Listo para Entrega",
          variant: "secondary" as const,
        };
      case "entregado":
        return {
          label: "🟢 Entregado",
          variant: "success" as const,
        };
      case "cancelado":
        return {
          label: "🔴 Cancelado",
          variant: "destructive" as const,
        };
      default:
        return {
          label: "❓ Desconocido",
          variant: "secondary" as const,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant} 
    >
      {config.label}
    </Badge>
  );
}