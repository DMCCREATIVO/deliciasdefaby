import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Loader2, User, Phone, MapPin, Save, LogOut, Heart, Package, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { userService, orderService } from "@/lib/database/index";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });

  // Keep form in sync with user if it changes (e.g. after login/re-loading)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  const { data: userStats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['userStats', user?.email],
    queryFn: async () => {
      if (!user?.email) return { totalOrders: 0, lastOrder: 'No hay pedidos' };
      const allOrders = await orderService.getAll();
      const userOrders = allOrders.filter(o => o.customer_email === user.email);

      return {
        totalOrders: userOrders.length,
        lastOrder: userOrders.length > 0 ? new Date(userOrders[0].created_at).toLocaleDateString() : 'No hay pedidos'
      };
    },
    enabled: !!user?.email
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    try {
      const success = await userService.update(user.id, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      if (!success) throw new Error('Error al actualizar perfil');

      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido actualizados correctamente",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 pt-16 pb-8 animate-fade-up">
      <div className="grid gap-6 md:grid-cols-12">
        {/* Sidebar */}
        <div className="md:col-span-3">
          <Card className="p-6 space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-brand-pink/10 flex items-center justify-center">
                <User className="h-12 w-12 text-brand-pink" />
              </div>
              <div className="text-center">
                <h2 className="font-semibold">{formData.name || 'Usuario'}</h2>
                <p className="text-sm text-zinc-500">{user?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/pedidos')}
              >
                <Package className="mr-2 h-4 w-4" />
                Mis Pedidos
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/favoritos')}
              >
                <Heart className="mr-2 h-4 w-4" />
                Favoritos
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/notificaciones')}
              >
                <Bell className="mr-2 h-4 w-4" />
                Notificaciones
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:col-span-9 space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6">
              <User className="h-5 w-5 text-brand-pink" />
              Información Personal
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Nombre Completo
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre completo"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Teléfono
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Tu número de teléfono"
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Dirección
                </label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Tu dirección de entrega"
                  className="w-full"
                />
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="submit"
                  className="bg-brand-pink hover:bg-brand-pink/90"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Guardar Cambios
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-brand-pink" />
              Resumen de Actividad
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <h3 className="font-medium mb-1">Pedidos Totales</h3>
                <p className="text-2xl font-bold text-brand-pink">{userStats?.totalOrders || 0}</p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <h3 className="font-medium mb-1">Productos Favoritos</h3>
                <p className="text-2xl font-bold text-brand-pink">0</p>
              </div>
              <div className="p-4 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <h3 className="font-medium mb-1">Último Pedido</h3>
                <p className="text-sm text-zinc-500">{userStats?.lastOrder || 'No hay pedidos'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;