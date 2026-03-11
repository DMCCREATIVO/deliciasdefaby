import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  MessageSquare,
  LogOut,
  User,
  Users,
  FileText,
  Clock,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

const adminRoutes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    description: "Vista general del negocio"
  },
  {
    label: "Productos",
    icon: Package,
    href: "/admin/productos",
    description: "Gestión de productos y categorías"
  },
  {
    label: "Pedidos",
    icon: ShoppingCart,
    href: "/admin/pedidos",
    description: "Administración de pedidos"
  },
  {
    label: "Clientes",
    icon: Users,
    href: "/admin/clientes",
    description: "Gestión de usuarios"
  },
  {
    label: "Blog",
    icon: FileText,
    href: "/admin/blog",
    description: "Administración del blog"
  },
  {
    label: "Testimonios",
    icon: MessageSquare,
    href: "/admin/testimonios",
    description: "Gestión de testimonios"
  },
  {
    label: "Horarios",
    icon: Clock,
    href: "/admin/horarios",
    description: "Configuración de horarios"
  },
  {
    label: "Configuración",
    icon: Settings,
    href: "/admin/configuracion",
    description: "Configuración del sistema"
  }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Memoizar el estado de autenticación para evitar re-renders
  const authState = useMemo(() => ({
    user: user?.id || null,
    isAdmin,
    isLoading
  }), [user?.id, isAdmin, isLoading]);

  // Memoizar la verificación de autenticación
  const shouldRedirect = useMemo(() => {
    return !isLoading && (!user || !isAdmin);
  }, [isLoading, user, isAdmin]);

  // Callback para manejar logout
  const handleLogout = useCallback(async () => {
    await logout();
    navigate("/");
  }, [logout, navigate]);

  // Solo redirigir cuando sea necesario
  useEffect(() => {
    if (shouldRedirect) {
      navigate("/");
    }
  }, [shouldRedirect, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-pink border-t-transparent"></div>
          <p className="text-sm text-zinc-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const currentRoute = adminRoutes.find(route => route.href === location.pathname);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-zinc-200 transform transition-transform duration-300 ease-in-out",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200">
            <h1 className="text-xl font-bold text-zinc-900">Panel Admin</h1>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-md hover:bg-zinc-100 lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {adminRoutes.map((route) => {
              const Icon = route.icon;
              const isActive = location.pathname === route.href;
              
              return (
                <Link
                  key={route.href}
                  to={route.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-pink text-white"
                      : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {route.label}
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-zinc-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-zinc-100 rounded-full">
                <User className="h-5 w-5 text-zinc-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 truncate">
                  {user.name || user.email}
                </p>
                <p className="text-xs text-zinc-500">Administrador</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-700 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      )}>
        {/* Top bar */}
        <header className="bg-white border-b border-zinc-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-md hover:bg-zinc-100"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-zinc-900">
                  {currentRoute?.label || "Dashboard"}
                </h1>
                <p className="text-sm text-zinc-500">
                  {currentRoute?.description || "Panel de administración"}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
} 