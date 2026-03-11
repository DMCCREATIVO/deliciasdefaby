import { Button } from "@/components/ui/button";
import { Store, Phone, BookOpen, Users, BookOpenText, User, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const NavLinks = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex md:flex-row flex-col w-full md:w-auto items-stretch md:items-center gap-2 md:gap-1">
      <Button 
        variant="ghost"
        onClick={() => navigate('/')}
        size="sm"
        className={`text-sm font-medium px-4 py-2 transition-all duration-300 hover:scale-105 justify-start md:justify-center ${
          isActive('/') 
            ? 'text-brand-cafe bg-brand-beige/50 font-semibold' 
            : 'text-brand-cafe/80 hover:text-brand-cafe hover:bg-brand-beige/30'
        }`}
      >
        <Home className="mr-2 h-4 w-4" />
        Inicio
      </Button>

      <Button 
        variant="ghost"
        onClick={() => navigate('/productos')}
        size="sm"
        className={`text-sm font-medium px-4 py-2 transition-all duration-300 hover:scale-105 justify-start md:justify-center ${
          isActive('/productos') 
            ? 'text-brand-cafe bg-brand-beige/50 font-semibold' 
            : 'text-brand-cafe/80 hover:text-brand-cafe hover:bg-brand-beige/30'
        }`}
      >
        <Store className="mr-2 h-4 w-4" />
        Productos
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/blog')}
        size="sm"
        className={`text-sm font-medium px-4 py-2 transition-all duration-300 hover:scale-105 justify-start md:justify-center ${
          isActive('/blog') 
            ? 'text-brand-cafe bg-brand-beige/50 font-semibold' 
            : 'text-brand-cafe/80 hover:text-brand-cafe hover:bg-brand-beige/30'
        }`}
      >
        <BookOpen className="mr-2 h-4 w-4" />
        Blog
      </Button>

      <Button 
        variant="ghost"
        onClick={() => navigate('/quienes-somos')}
        size="sm"
        className={`text-sm font-medium px-4 py-2 transition-all duration-300 hover:scale-105 justify-start md:justify-center ${
          isActive('/quienes-somos') 
            ? 'text-brand-cafe bg-brand-beige/50 font-semibold' 
            : 'text-brand-cafe/80 hover:text-brand-cafe hover:bg-brand-beige/30'
        }`}
      >
        <Users className="mr-2 h-4 w-4" />
        Quiénes Somos
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => navigate('/contacto')}
        size="sm"
        className={`text-sm font-medium px-4 py-2 transition-all duration-300 hover:scale-105 justify-start md:justify-center ${
          isActive('/contacto') 
            ? 'text-brand-cafe bg-brand-beige/50 font-semibold' 
            : 'text-brand-cafe/80 hover:text-brand-cafe hover:bg-brand-beige/30'
        }`}
      >
        <Phone className="mr-2 h-4 w-4" />
        Contacto
      </Button>

      {user && (
        <Button 
          variant="ghost"
          onClick={() => navigate('/perfil')}
          size="sm"
          className={`text-sm font-medium px-4 py-2 transition-all duration-300 hover:scale-105 justify-start md:justify-center ${isActive('/perfil') ? 'text-brand-pink bg-brand-pink/10' : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'}`}
        >
          <User className="mr-2 h-4 w-4" />
          Mi Panel
        </Button>
      )}
    </div>
  );
};