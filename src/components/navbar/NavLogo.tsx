import { useNavigate } from "react-router-dom";

export const NavLogo = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="cursor-pointer flex items-center hover:scale-105 transition-transform duration-200" 
      onClick={() => navigate('/')}
    >
      <img 
        src="/lovable-uploads/21476c6b-a753-42d1-84c3-b408581648c1.png" 
        alt="Delicias de Faby Logo" 
        className="h-10 md:h-12 w-auto" 
      />
    </div>
  );
};