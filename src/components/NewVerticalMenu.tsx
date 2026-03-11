import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  BookOpenText,
  ShoppingBag,
  Users,
  BookOpen,
  User,
  Heart,
  Package,
  LogIn,
  ChevronLeft
} from "lucide-react";

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  path,
  isCollapsed,
  isActive,
  onClick
}) => (
  <Button
    variant="ghost"
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2 transition-all duration-300",
      isActive
        ? "bg-brand-cafe/10 text-brand-cafe dark:bg-brand-rosado/10 dark:text-brand-rosado shadow-sm"
        : "text-muted-foreground hover:bg-brand-cafe/5 hover:text-brand-cafe dark:hover:bg-brand-rosado/5 dark:hover:text-brand-rosado"
    )}
    onClick={onClick}
  >
    <span className="flex-shrink-0">{icon}</span>
    {!isCollapsed && (
      <span className="flex-1 text-left truncate">{label}</span>
    )}
    <ChevronRight
      className={cn(
        "h-4 w-4 flex-shrink-0 transition-transform duration-300",
        isActive ? "rotate-90" : "group-hover:rotate-90"
      )}
    />
  </Button>
);

export const NewVerticalMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    const savedState = localStorage.getItem("verticalMenuCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });

  React.useEffect(() => {
    localStorage.setItem("verticalMenuCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const handleNavigation = (path: string) => navigate(path);
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  const isActive = (path: string) => location.pathname === path;

  const mainMenuItems = [
    { icon: <BookOpenText className="h-4 w-4" />, label: "Inicio", path: "/" },
    { icon: <ShoppingBag className="h-4 w-4" />, label: "Productos", path: "/productos" },
    { icon: <Users className="h-4 w-4" />, label: "Quiénes Somos", path: "/quienes-somos" },
    { icon: <BookOpen className="h-4 w-4" />, label: "Blog", path: "/blog" },
  ];

  const userMenuItems = [
    { icon: <User className="h-4 w-4" />, label: "Mi Perfil", path: "/perfil" },
    { icon: <Heart className="h-4 w-4" />, label: "Favoritos", path: "/favoritos" },
    { icon: <Package className="h-4 w-4" />, label: "Mis Pedidos", path: "/pedidos" },
  ];

  return (
    <aside
      className={cn(
        "h-full flex flex-col bg-white/5 dark:bg-zinc-900/50 backdrop-blur-xl rounded-lg transition-all duration-300 shadow-lg",
        isCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Header with Logo and Collapse Button */}
      <div className="relative p-3 border-b border-zinc-200/10 dark:border-zinc-700/30">
        <img
          src="/lovable-uploads/21476c6b-a753-42d1-84c3-b408581648c1.png"
          alt="Logo"
          className={cn(
            "mx-auto cursor-pointer transition-all duration-300 hover:scale-105",
            isCollapsed ? "w-10" : "w-28"
          )}
          onClick={() => handleNavigation("/")}
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-background shadow-sm hover:bg-muted"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              isCollapsed ? "rotate-180" : ""
            )}
          />
        </Button>
      </div>

      {/* User Welcome Section */}
      {user && (
        <div className="p-4 space-y-2 border-b border-zinc-200/10 dark:border-zinc-700/30">
          <h2 className="text-lg font-semibold text-brand-pink dark:text-brand-dark-pink truncate">
            ¡Hola, {user.name}!
          </h2>
          {!isCollapsed && (
            <p className="text-sm text-muted-foreground truncate">
              Bienvenido a tu panel
            </p>
          )}
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-600/50">
        <div className="space-y-2">
          {mainMenuItems.map((item) => (
            <MenuItem
              key={item.path}
              {...item}
              isCollapsed={isCollapsed}
              isActive={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
            />
          ))}
        </div>

        {user && (
          <div className="space-y-2 pt-4 border-t border-zinc-200/10 dark:border-zinc-700/30">
            {!isCollapsed && (
              <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 px-3 mb-2">
                Mi Panel
              </h3>
            )}
            {userMenuItems.map((item) => (
              <MenuItem
                key={item.path}
                {...item}
                isCollapsed={isCollapsed}
                isActive={isActive(item.path)}
                onClick={() => handleNavigation(item.path)}
              />
            ))}
          </div>
        )}
      </nav>

      {/* Footer with Login/Logout */}
      <div className="p-4 border-t border-zinc-200/10 dark:border-zinc-700/30">
        {user ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-500"
            onClick={handleLogout}
          >
            <LogIn className="h-4 w-4 mr-3" />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-brand-pink hover:bg-brand-pink/10"
            onClick={() => handleNavigation("/login")}
          >
            <LogIn className="h-4 w-4 mr-3" />
            {!isCollapsed && <span>Iniciar Sesión</span>}
          </Button>
        )}
      </div>
    </aside>
  );
};