import { Button } from "@/components/ui/button";
import { Plus, Package, ShoppingCart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const QuickAccessButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Button
        onClick={() => navigate("/admin/productos/nuevo")}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
      >
        <Plus className="h-4 w-4" />
        Nuevo Producto
      </Button>
      <Button
        onClick={() => navigate("/admin/productos")}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
      >
        <Package className="h-4 w-4" />
        Ver Productos
      </Button>
      <Button
        onClick={() => navigate("/admin/pedidos")}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
      >
        <ShoppingCart className="h-4 w-4" />
        Ver Pedidos
      </Button>
      <Button
        onClick={() => navigate("/admin/clientes")}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
      >
        <Users className="h-4 w-4" />
        Ver Clientes
      </Button>
    </div>
  );
};