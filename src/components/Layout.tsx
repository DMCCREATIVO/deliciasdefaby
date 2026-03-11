import { Navbar } from "./Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DeliveryBanner } from "./DeliveryBanner";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

export const Layout = ({ children, showFooter = true }: LayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isAdminPage = location.pathname.startsWith("/admin");
  const isClientPage = location.pathname === "/perfil" || 
                      location.pathname === "/pedidos" || 
                      location.pathname === "/favoritos";
  const showNavbar = !isAuthPage;
  const showDeliveryBanner = showNavbar && !isAdminPage && !isClientPage;
  const isHomePage = location.pathname === "/";

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-light dark:bg-gradient-primary flex flex-col mobile-safe">
        <div className="flex flex-col flex-1 w-full">
          {showNavbar && <Navbar />}
          {showDeliveryBanner && <DeliveryBanner />}
          
          {/* Contenido principal con espaciado optimizado especialmente para home */}
          <main className={`w-full min-h-screen overflow-y-auto relative ${
            showNavbar ? (
              isHomePage ? 'pt-16 sm:pt-20' : (
                showDeliveryBanner ? 'pt-[4.5rem] sm:pt-[5.5rem]' : 'pt-16 sm:pt-20'
              )
            ) : 'pt-0'
          }`}>
            {children}
          </main>
        </div>
        
        {showFooter && !isAuthPage && !isAdminPage && !isClientPage && (
          <div className="w-full">
            <Footer />
          </div>
        )}
        <WhatsAppButton />
      </div>
    </SidebarProvider>
  );
};

export default Layout;