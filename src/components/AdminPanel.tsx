import { Home, Package, ShoppingCart, FolderTree, FileText, Users, BarChart3, Clock, Settings, LogOut, ChevronLeft, ChevronDown } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Definir interfaces para los tipos
interface MenuItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  isCollapsed: boolean;
  onClick?: () => void;
  isActive?: boolean;
}

interface SubMenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
}

interface SubMenuProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  items: SubMenuItem[];
  isCollapsed: boolean;
}

function Tooltip({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="group relative flex items-center">
      {children}
      <span 
        className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2 z-10 hidden group-hover:block whitespace-nowrap rounded px-2 py-1 text-xs text-white shadow-lg transition-all"
        style={{ backgroundColor: 'var(--theme-sidebar-bg)' }}
      >
        {label}
      </span>
    </div>
  );
}

function MenuItem({ icon: Icon, label, path, isCollapsed, onClick, isActive }: MenuItemProps) {
  const content = (
    <span className="flex items-center gap-3">
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>}
    </span>
  );
  return (
    <NavLink
      to={path}
      aria-label={label}
      tabIndex={0}
      className={({ isActive: active }) =>
        `flex items-center admin-nav-link ${isCollapsed ? 'justify-center px-3' : 'px-4'} py-3 rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${active || isActive
          ? 'admin-nav-link-active'
          : 'admin-nav-link-inactive'}`
      }
      onClick={onClick}
    >
      {isCollapsed ? <Tooltip label={label}>{content}</Tooltip> : content}
    </NavLink>
  );
}

function SubMenu({ icon: Icon, label, items, isCollapsed }: SubMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-full">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        tabIndex={0}
        className={`flex items-center gap-3 px-4 py-3 w-full font-medium rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 admin-nav-link-inactive ${isCollapsed ? 'justify-center' : ''}`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setOpen(v => !v); }}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        {!isCollapsed && <span className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">{label}</span>}
        {!isCollapsed && <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      {!isCollapsed && open && (
        <div className="pl-6 mt-2 space-y-1 animate-fade-down" role="menu">
          {items.map((subItem: SubMenuItem, subIndex: number) => (
            <MenuItem key={subIndex} {...subItem} isCollapsed={false} />
          ))}
        </div>
      )}
    </div>
  );
}

export const AdminPanel = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: Package, label: "Productos", path: "/admin/productos" },
    { icon: ShoppingCart, label: "Pedidos", path: "/admin/pedidos" },
    { icon: FolderTree, label: "Categorías", path: "/admin/categorias" },
    { icon: FileText, label: "Blog", path: "/admin/blog" },
    { icon: Users, label: "Testimonios", path: "/admin/testimonios" },
    { icon: Users, label: "Clientes", path: "/admin/clientes" },
    { icon: BarChart3, label: "Estadísticas", path: "/admin/estadisticas" },
    { icon: Clock, label: "Horarios", path: "/admin/horarios" },
    { icon: Settings, label: "Configuración", path: "/admin/configuracion" },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav
      className={`admin-sidebar h-full flex flex-col border-r shadow-2xl overflow-y-auto transition-all duration-300 ${isCollapsed ? 'w-[4.5rem]' : 'w-[280px]'}`}
      aria-label="Menú principal del panel de administración"
      role="navigation"
    >
      {/* Header del panel — usa colores del tema */}
      <div className="admin-sidebar-header flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="admin-sidebar-logo w-8 h-8 rounded-lg flex items-center justify-center shadow-lg">
              <span className="font-bold text-lg">D</span>
            </div>
            <div>
              <h2 className="font-bold text-base admin-sidebar-title">Delicias de Faby</h2>
              <p className="text-xs opacity-90">Panel Admin</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-white/20 transition-colors admin-sidebar-toggle"
          aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      
      {/* Navegación */}
      <div className="flex-1 space-y-2 p-4">
        {menuItems.map((item, index) => (
          <div key={index} className="space-y-1">
            {item.subItems ? (
              <SubMenu icon={item.icon} label={item.label} items={item.subItems} isCollapsed={isCollapsed} />
            ) : (
              <MenuItem icon={item.icon} label={item.label} path={item.path} isCollapsed={isCollapsed} />
            )}
          </div>
        ))}
      </div>
      
      {/* Footer con botón de logout */}
      <div className="admin-sidebar-footer mt-auto border-t p-4">
        <button
          onClick={handleLogout}
          className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-4'} py-3 gap-3 w-full rounded-xl transition-all duration-200 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 outline-none focus-visible:ring-2 focus-visible:ring-red-500 hover:shadow-md`}
          aria-label="Cerrar sesión"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">Cerrar Sesión</span>}
        </button>
      </div>
    </nav>
  );
};

export default AdminPanel;