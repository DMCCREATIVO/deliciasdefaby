import { Button } from "@/components/ui/button";
import { 
  ShoppingBag, 
  User, 
  LogIn, 
  Heart, 
  Package, 
  Phone, 
  BookOpen, 
  Users, 
  BookOpenText,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const MenuItem = ({ icon, label, path, isCollapsed, isActive }: MenuItemProps) => {
  const navigate = useNavigate();
  
  return (
    <Button 
      variant="ghost" 
      className={cn(
        "w-full justify-start group",
        isActive ? 'bg-brand-pink/10 text-brand-pink dark:bg-brand-dark-pink/10 dark:text-brand-dark-pink' : 
                  'text-muted-foreground hover:bg-brand-pink/5 hover:text-brand-pink dark:hover:bg-brand-dark-pink/5 dark:hover:text-brand-dark-pink'
      )}
      onClick={() => navigate(path)}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
      <ChevronRight 
        className={cn(
          "ml-auto h-4 w-4 transition-transform",
          isActive ? 'rotate-90' : 'group-hover:rotate-90'
        )} 
      />
    </Button>
  );
};

export const VerticalMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem('verticalMenuCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem('verticalMenuCollapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`flex flex-col h-full bg-white/5 dark:bg-zinc-900/50 backdrop-blur-sm rounded-lg p-4 transition-all duration-300 ${isCollapsed ? 'w-[4.5rem]' : 'w-full'}`}>
      <div className="sticky top-0 z-10 mb-8">
        <img 
          src="/lovable-uploads/21476c6b-a753-42d1-84c3-b408581648c1.png"
          alt="Delicias de Faby" 
          className={`mx-auto mb-6 cursor-pointer hover:scale-105 transition-transform duration-300 ${isCollapsed ? 'w-14' : 'w-28'}`}
          onClick={() => handleNavigation('/')}
        />
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute -right-3 top-4 rounded-full border border-zinc-200 dark:border-zinc-700 bg-background shadow-sm hover:bg-muted"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {user && (
        <div className="bg-brand-pink/5 dark:bg-brand-dark-pink/5 rounded-lg mb-8 p-4 border border-brand-pink/10 dark:border-brand-dark-pink/10">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-brand-pink dark:text-brand-dark-pink truncate">
              ¡Hola, {user.name}!
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              Bienvenido a tu panel
            </p>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-2.5" role="navigation" aria-label="Main Navigation">
        <MenuItem
          icon={<BookOpenText className="h-4 w-4 mr-3" />}
          label="Inicio"
          path="/"
          isCollapsed={isCollapsed}
          isActive={isActive('/')}
        />

        <MenuItem
          icon={<ShoppingBag className="h-4 w-4 mr-3" />}
          label="Productos"
          path="/productos"
          isCollapsed={isCollapsed}
          isActive={isActive('/productos')}
        />

        <MenuItem
          icon={<Users className="h-4 w-4 mr-3" />}
          label="Quiénes Somos"
          path="/quienes-somos"
          isCollapsed={isCollapsed}
          isActive={isActive('/quienes-somos')}
        />

        <MenuItem
          icon={<BookOpen className="h-4 w-4 mr-3" />}
          label="Blog"
          path="/blog"
          isCollapsed={isCollapsed}
          isActive={isActive('/blog')}
        />

        {user ? (
          <div className="pt-6 mt-6 border-t border-zinc-200 dark:border-zinc-700">
            <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4 px-3">
              {!isCollapsed && 'Mi Panel'}
            </h3>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className={`w-full justify-start group transition-all duration-200 ${isActive('/perfil') ? 'bg-brand-pink/10 text-brand-pink dark:bg-brand-dark-pink/10 dark:text-brand-dark-pink shadow-sm' : 'text-muted-foreground hover:bg-brand-pink/5 hover:text-brand-pink dark:hover:bg-brand-dark-pink/5 dark:hover:text-brand-dark-pink'}`}
                onClick={() => handleNavigation('/perfil')}
              >
                <User className="h-4 w-4 mr-3" />
                {!isCollapsed && <span>Mi Perfil</span>}
                <ChevronRight className={`ml-auto h-4 w-4 transition-transform duration-300 ${isActive('/perfil') ? 'rotate-90' : 'group-hover:rotate-90'}`} />
              </Button>

              <Button 
                variant="ghost" 
                className={`w-full justify-start group transition-all duration-200 ${isActive('/favoritos') ? 'bg-brand-pink/10 text-brand-pink dark:bg-brand-dark-pink/10 dark:text-brand-dark-pink shadow-sm' : 'text-muted-foreground hover:bg-brand-pink/5 hover:text-brand-pink dark:hover:bg-brand-dark-pink/5 dark:hover:text-brand-dark-pink'}`}
                onClick={() => handleNavigation('/favoritos')}
              >
                <Heart className="h-4 w-4 mr-3" />
                {!isCollapsed && <span>Favoritos</span>}
                <ChevronRight className={`ml-auto h-4 w-4 transition-transform duration-300 ${isActive('/favoritos') ? 'rotate-90' : 'group-hover:rotate-90'}`} />
              </Button>

              <Button 
                variant="ghost" 
                className={`w-full justify-start group transition-all duration-200 ${isActive('/pedidos') ? 'bg-brand-pink/10 text-brand-pink dark:bg-brand-dark-pink/10 dark:text-brand-dark-pink shadow-sm' : 'text-muted-foreground hover:bg-brand-pink/5 hover:text-brand-pink dark:hover:bg-brand-dark-pink/5 dark:hover:text-brand-dark-pink'}`}
                onClick={() => handleNavigation('/pedidos')}
              >
                <Package className="h-4 w-4 mr-3" />
                {!isCollapsed && <span>Mis Pedidos</span>}
                <ChevronRight className={`ml-auto h-4 w-4 transition-transform duration-300 ${isActive('/pedidos') ? 'rotate-90' : 'group-hover:rotate-90'}`} />
              </Button>

              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 mt-4"
                onClick={handleLogout}
              >
                <LogIn className="h-4 w-4 mr-3" />
                {!isCollapsed && <span>Cerrar Sesión</span>}
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="ghost" 
            className="w-full justify-start text-brand-pink hover:bg-brand-pink/10 transition-all duration-200 mt-4"
            onClick={() => handleNavigation('/login')}
          >
            <LogIn className="h-4 w-4 mr-3" />
            {!isCollapsed && <span>Iniciar Sesión</span>}
          </Button>
        )}
      </nav>
    </div>
  );
};