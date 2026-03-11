import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const NavAuth = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Si el usuario está logueado, mostrar menú de usuario
  if (user) {
    const initials = user.email?.charAt(0).toUpperCase() || 'U';
    
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="flex items-center gap-2 text-brand-cafe hover:bg-brand-beige/50 hover:text-brand-brown transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-brand-cafe text-white text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium">Mi Cuenta</span>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-white/95 backdrop-blur-sm border border-brand-cafe/20 shadow-lg"
        >
          <div className="px-3 py-2">
            <p className="text-sm font-medium text-brand-cafe">
              {user.email}
            </p>
          </div>
          
          <DropdownMenuSeparator className="bg-brand-cafe/20" />
          
          <DropdownMenuItem 
            onClick={() => navigate('/perfil')}
            className="text-brand-cafe hover:bg-brand-beige/50 cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Mi Perfil
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => navigate('/pedidos')}
            className="text-brand-cafe hover:bg-brand-beige/50 cursor-pointer"
          >
            <User className="mr-2 h-4 w-4" />
            Mis Pedidos
          </DropdownMenuItem>
          
          {/* Botón de Panel de Admin - Solo visible para administradores */}
          {isAdmin && (
            <>
              <DropdownMenuSeparator className="bg-brand-cafe/20" />
              <DropdownMenuItem 
                onClick={() => navigate('/admin')}
                className="text-amber-600 hover:bg-amber-50 cursor-pointer font-medium"
              >
                <Settings className="mr-2 h-4 w-4" />
                Panel de Admin
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator className="bg-brand-cafe/20" />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Si no está logueado, mostrar botones de login y registro
  return (
    <>
      <Button 
        variant="outline"
        size="sm"
        className="border-2 border-brand-cafe text-brand-cafe hover:bg-brand-cafe/10 text-sm"
        onClick={() => navigate('/login')}
      >
        <LogIn className="mr-1 h-3 w-3" />
        Iniciar Sesión
      </Button>
      <Button 
        size="sm"
        className="bg-brand-cafe hover:bg-brand-brown text-white text-sm"
        onClick={() => navigate('/register')}
      >
        <UserPlus className="mr-1 h-3 w-3" />
        Crear Cuenta
      </Button>
    </>
  );
};