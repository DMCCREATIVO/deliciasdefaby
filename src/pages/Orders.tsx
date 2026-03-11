import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/lib/database/index";
import { Order } from "@/lib/database/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingBag, Clock, CheckCircle, AlertCircle, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  pending: {
    label: 'Pendiente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock
  },
  confirmed: {
    label: 'Confirmado',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle
  },
  preparing: {
    label: 'Preparando',
    color: 'bg-orange-100 text-orange-800',
    icon: Package
  },
  ready: {
    label: 'Listo',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  delivered: {
    label: 'Entregado',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: AlertCircle
  }
};

export default function Orders() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user?.email) return [];
      const allOrders = await orderService.getAll();
      return allOrders.filter(o => o.customer_email === user.email);
    },
    enabled: !!user
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-beige/10 to-white -mt-16 sm:-mt-20 pt-24 sm:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-brand-cafe/30 mx-auto mb-6" />
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-cafe mb-4">Mis Pedidos</h1>
            <p className="text-brand-cafe/60 mb-6 text-sm sm:text-base">
              Inicia sesión para ver el historial de tus pedidos
            </p>
            <Button
              onClick={() => navigate('/login')}
              className="bg-brand-cafe hover:bg-brand-brown text-white min-h-[48px]"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-beige/10 to-white -mt-16 sm:-mt-20">
      {/* Hero Section - Optimizado */}
      <div className="relative bg-gradient-to-br from-brand-cafe/10 via-brand-beige/20 to-brand-cafe/5 pt-24 sm:pt-28 pb-8 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-brand-cafe" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-cafe">
                Mis Pedidos
              </h1>
            </div>
            <p className="text-base sm:text-lg text-brand-cafe/70 max-w-2xl mx-auto">
              Revisa el estado y historial de todos tus pedidos
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contenido Principal - Sin margen excesivo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 -mt-4 sm:-mt-8 relative z-10">
        {isLoading ? (
          <div className="space-y-4 sm:space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : orders && orders.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {orders.map((order, index) => {
              const statusInfo = statusConfig[order.status];
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-brand-cafe/10">
                    <CardHeader className="bg-gradient-to-r from-brand-beige/30 to-brand-cafe/5 pb-3 sm:pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <StatusIcon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-cafe" />
                          <div>
                            <CardTitle className="text-lg sm:text-xl text-brand-cafe">
                              Pedido #{order.id.slice(-8).toUpperCase()}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-cafe/60 mt-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              {format(new Date(order.created_at), 'PPP', { locale: es })}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Badge className={`${statusInfo.color} px-2 sm:px-3 py-1 text-xs sm:text-sm`}>
                            {statusInfo.label}
                          </Badge>
                          <div className="flex items-center gap-1 text-brand-cafe font-semibold">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm sm:text-base">${order.total_amount?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <h4 className="font-medium text-brand-cafe mb-2 text-sm sm:text-base">Productos:</h4>
                          <div className="space-y-1 sm:space-y-2">
                            {order.order_items?.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex justify-between items-center text-xs sm:text-sm text-brand-cafe/70 py-1 border-b border-brand-cafe/10 last:border-0"
                              >
                                <span>{item.quantity}x {item.product_title}</span>
                                <span className="font-medium">${(item.unit_price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 sm:pt-3 border-t border-cafe/10">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                            <div>
                              <span className="text-brand-cafe/60">Cliente:</span>
                              <span className="ml-2 text-brand-cafe font-medium">{order.customer_name}</span>
                            </div>
                            <div>
                              <span className="text-brand-cafe/60">Teléfono:</span>
                              <span className="ml-2 text-brand-cafe font-medium">{order.customer_phone}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            className="text-center py-12 sm:py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Package className="w-16 h-16 sm:w-20 sm:h-20 text-brand-cafe/30 mx-auto mb-6" />
            <h3 className="text-lg sm:text-xl font-semibold text-brand-cafe mb-3">No tienes pedidos aún</h3>
            <p className="text-brand-cafe/60 mb-6 text-sm sm:text-base">
              ¡Explora nuestro catálogo y realiza tu primera compra!
            </p>
            <Button
              onClick={() => navigate('/')}
              className="bg-brand-cafe hover:bg-brand-brown text-white min-h-[48px]"
            >
              Ver Productos
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}