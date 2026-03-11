import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { NavLogo } from "./navbar/NavLogo";
import { NavLinks } from "./navbar/NavLinks";
import { NavAuth } from "./navbar/NavAuth";
import { useAuth } from "@/context/AuthContext";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-cafe/20 shadow-lg shadow-brand-cafe/10">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="grid grid-cols-[auto,1fr,auto] gap-2 sm:gap-4 items-center h-16 sm:h-20 relative">
          <div className="flex items-center justify-start min-w-0">
            <NavLogo />
          </div>

          <div className="hidden md:flex items-center justify-center">
            <NavLinks />
          </div>

          <div className="flex items-center justify-end gap-1 sm:gap-2">
            <div className="hidden md:flex">
              <NavAuth />
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <CartDrawer />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                className="md:hidden text-brand-cafe hover:text-brand-brown hover:bg-brand-beige/50 transition-colors min-h-[44px] min-w-[44px] touch-manipulation"
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-16 sm:top-20 bg-white/95 backdrop-blur-md border-t border-brand-cafe/20 animate-in slide-in-from-top duration-300 shadow-lg mobile-safe">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 space-y-4">
              <div className="space-y-2">
                <NavLinks />
              </div>
              <div className="border-t border-brand-cafe/20 pt-4">
                <NavAuth />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};