import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  User, 
  Bell, 
  Search,
  Menu,
  LogOut
} from "lucide-react";
import { adminComponentPresets } from "@/hooks/useAdminTheme";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  showNotifications?: boolean;
  notificationCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  actions,
  showNotifications = true,
  notificationCount = 0
}) => {
  return (
    <div className="admin-gradient-secondary border-b admin-border-light admin-shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Información del título */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold admin-text-primary font-heading">
                {title}
              </h1>
              {showNotifications && notificationCount > 0 && (
                <Badge className={adminComponentPresets.statusInfo}>
                  {notificationCount} nueva{notificationCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            {subtitle && (
              <p className="admin-text-secondary">
                {subtitle}
              </p>
            )}
          </div>

          {/* Acciones de la derecha */}
          <div className="flex items-center gap-3">
            {/* Buscador rápido */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 admin-text-muted" />
              <input
                type="text"
                placeholder="Buscar..."
                className="admin-input pl-10 pr-4 py-2 w-64"
              />
            </div>

            {/* Notificaciones */}
            {showNotifications && (
              <Button
                variant="outline"
                size="icon"
                className={`${adminComponentPresets.secondaryButton} relative`}
              >
                <Bell className="h-4 w-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 admin-bg-error text-white text-xs rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Button>
            )}

            {/* Configuración */}
            <Button
              variant="outline"
              size="icon"
              className={adminComponentPresets.secondaryButton}
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Perfil de usuario */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={adminComponentPresets.secondaryButton}
              >
                <User className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                className="admin-bg-error-light hover:admin-bg-error admin-text-error hover:admin-text-inverse"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Acciones personalizadas */}
            {actions}
          </div>
        </div>
      </div>
    </div>
  );
}; 