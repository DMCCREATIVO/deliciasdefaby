import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  MessageSquare,
  Star,
  Clock
} from "lucide-react";
import { adminComponentPresets } from "@/hooks/useAdminTheme";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: <LayoutDashboard className="h-5 w-5" />, label: "Dashboard", href: "/admin" },
  { icon: <BarChart3 className="h-5 w-5" />, label: "Estadísticas", href: "/admin/estadisticas" },
  { icon: <Package className="h-5 w-5" />, label: "Productos", href: "/admin/productos" },
  { icon: <ShoppingBag className="h-5 w-5" />, label: "Pedidos", href: "/admin/pedidos", badge: "3" },
  { icon: <Users className="h-5 w-5" />, label: "Clientes", href: "/admin/clientes" },
  { icon: <FileText className="h-5 w-5" />, label: "Blog", href: "/admin/blog" },
  { icon: <Star className="h-5 w-5" />, label: "Testimonios", href: "/admin/testimonios" },
  { icon: <Clock className="h-5 w-5" />, label: "Horarios", href: "/admin/horarios" },
  { icon: <Settings className="h-5 w-5" />, label: "Configuración", href: "/admin/configuracion" },
];

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  isCollapsed = false,
  onToggle 
}) => {
  const location = useLocation();

  return (
    <div className={`admin-gradient-secondary h-full admin-shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Logo/Header */}
      <div className="p-4 border-b admin-border-light">
        <div className="flex items-center gap-3">
          <div className="admin-bg-primary w-10 h-10 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold admin-text-primary">Delicias de Faby</h2>
              <p className="text-sm admin-text-muted">Panel Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? adminComponentPresets.navItemActive 
                  : adminComponentPresets.navItem
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon}
              {!isCollapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.badge && (
                    <span className={`${adminComponentPresets.statusError} text-xs px-2 py-1`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="admin-card p-3">
            <div className="flex items-center gap-3">
              <div className="admin-bg-accent w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium admin-text-primary text-sm truncate">Admin</p>
                <p className="text-xs admin-text-muted truncate">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 