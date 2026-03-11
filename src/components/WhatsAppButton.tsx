import { MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/lib/database/index";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const WhatsAppButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();

  // No mostrar el botón en páginas de administración
  const isAdminPage = location.pathname.startsWith("/admin");

  // Consulta optimizada con staleTime para evitar refetch innecesarios
  const { data: whatsappNumber } = useQuery({
    queryKey: ['settings', 'whatsapp_number'],
    queryFn: async () => {
      const allSettings = await settingsService.getAll();
      const setting = allSettings.find(s => s.key === 'whatsapp_number');
      return setting?.value;
    },
    staleTime: 1000 * 60 * 60 // 1 hora
  });

  const handleClick = () => {
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber.replace(/\+/g, '')}`, '_blank');
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (whatsappNumber && isMounted && !isAdminPage) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [whatsappNumber, isMounted, isAdminPage]);

  // No renderizar nada si estamos en una página de administración o no hay número
  if (isAdminPage || !whatsappNumber) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isHovered && (
        <div
          className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium mb-2 whitespace-nowrap transform transition-all duration-300 origin-bottom-right"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)'
          }}
        >
          ¡Contáctanos por WhatsApp!
          <div className="absolute bottom-0 right-4 w-2 h-2 bg-white dark:bg-gray-800 transform rotate-45 translate-y-1"></div>
        </div>
      )}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          relative overflow-hidden
          bg-gradient-to-r from-green-500 to-green-600 
          hover:from-green-600 hover:to-green-700
          text-white p-4 rounded-full 
          shadow-lg hover:shadow-xl shadow-green-500/20 hover:shadow-green-500/40
          transition-all duration-500
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
        aria-label="Contactar por WhatsApp"
      >
        <span className="absolute inset-0 bg-white rounded-full opacity-0 animate-ping-slow"></span>
        <span className="relative z-10">
          <MessageSquare className="w-6 h-6" />
        </span>
      </button>
    </div>
  );
};

// Agrega esta animación personalizada en tu archivo CSS global
// Si estás usando Tailwind, puedes agregarla al archivo tailwind.config.ts en la sección 'animations'
// @keyframes ping-slow {
//   0% {
//     transform: scale(1);
//     opacity: 0.8;
//   }
//   70%, 100% {
//     transform: scale(1.5);
//     opacity: 0;
//   }
// }
// .animate-ping-slow {
//   animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
// }