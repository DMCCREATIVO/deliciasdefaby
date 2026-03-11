import { Button } from "@/components/ui/button";
import { Store, Phone, LogIn, UserPlus, ShoppingBag, Search, BookOpen, Users, BookOpenText, User, Home, Heart, Package, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="md:hidden py-4 space-y-4 px-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="search"
          placeholder="Buscar productos..."
          className="w-full pl-10 pr-4 py-2 bg-brand-beige/5 border border-brand-cafe/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rosado focus:border-transparent text-brand-cafe"
        />
      </div>
      
      <div className="flex flex-col space-y-1">
        <Button 
          variant="ghost"
          onClick={() => {
            navigate('/');
            onClose();
          }}
          className="justify-start text-brand-cafe hover:bg-brand-rosado/10 hover:text-brand-rosado"
        >
          <Home className="mr-2 h-4 w-4" />
          Inicio
        </Button>

        <Button 
          variant="ghost"
          onClick={() => {
            navigate('/productos');
            onClose();
          }}
          className="justify-start hover:bg-brand-pink/10 hover:text-brand-pink"
        >
          <Store className="mr-2 h-4 w-4" />
          Productos
        </Button>

        <Button 
          variant="ghost"
          onClick={() => {
            navigate('/blog');
            onClose();
          }}
          className="justify-start hover:bg-brand-pink/10 hover:text-brand-pink"
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Blog
        </Button>

        <Button 
          variant="ghost"
          onClick={() => {
            navigate('/quienes-somos');
            onClose();
          }}
          className="justify-start hover:bg-brand-pink/10 hover:text-brand-pink"
        >
          <Users className="mr-2 h-4 w-4" />
          Quiénes Somos
        </Button>
        
        <Button 
          variant="ghost"
          onClick={() => {
            navigate('/contacto');
            onClose();
          }}
          className="justify-start hover:bg-brand-pink/10 hover:text-brand-pink"
        >
          <Phone className="mr-2 h-4 w-4" />
          Contacto
        </Button>

        {user ? (
          <>
            <div className="my-2 border-t border-zinc-200 dark:border-zinc-700 pt-2">
              <Button 
                variant="ghost"
                onClick={() => {
                  navigate('/perfil');
                  onClose();
                }}
                className="w-full justify-start bg-brand-pink/10 text-brand-pink hover:bg-brand-pink/20"
              >
                <User className="mr-2 h-4 w-4" />
                Mi Panel
              </Button>
              <Button 
                variant="ghost"
                onClick={() => {
                  navigate('/pedidos');
                  onClose();
                }}
                className="w-full justify-start hover:bg-brand-pink/10 hover:text-brand-pink"
              >
                <Package className="mr-2 h-4 w-4" />
                Mis Pedidos
              </Button>
              <Button 
                variant="ghost"
                onClick={() => {
                  navigate('/favoritos');
                  onClose();
                }}
                className="w-full justify-start hover:bg-brand-pink/10 hover:text-brand-pink"
              >
                <Heart className="mr-2 h-4 w-4" />
                Favoritos
              </Button>
              
              {/* Botón de Panel de Admin - Solo visible para administradores */}
              {isAdmin && (
                <Button 
                  variant="ghost"
                  onClick={() => {
                    navigate('/admin');
                    onClose();
                  }}
                  className="w-full justify-start bg-amber-50 text-amber-600 hover:bg-amber-100 font-medium"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Panel de Admin
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="my-2 border-t border-zinc-200 dark:border-zinc-700 pt-2">

              <Button 
                variant="outline"
                className="w-full border-2 border-brand-pink text-brand-pink hover:bg-brand-pink/10 justify-start mt-2"
                onClick={() => {
                  navigate('/login');
                  onClose();
                }}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar Sesión
              </Button>
              <Button 
                className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white justify-start mt-2"
                onClick={() => {
                  navigate('/register');
                  onClose();
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Crear Cuenta
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};