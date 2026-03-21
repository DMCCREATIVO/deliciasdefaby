import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/lib/database/index";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const Hero = () => {
  const navigate = useNavigate();

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const allSettings = await settingsService.getSettings();
      return allSettings || {};
    }
  });

  const scrollToProducts = () => {
    const productsSection = document.getElementById('productos');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[100vh] w-full overflow-hidden -mt-16 sm:-mt-20">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src="/1.png"
          alt="Background Delicias de Faby"
          width="1920"
          height="1080"
          className="w-full h-full object-cover object-center scale-100 md:scale-105"
          loading="eager"
          sizes="100vw"
        />
      </motion.div>

      {/* Overlay con color del tema */}
      <div className="absolute inset-0 bg-black/65" />
      <div className="themed-hero-overlay absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />

      {/* Contenido */}
      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8 sm:pb-12 h-full flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          
          {/* Logo */}
          <motion.div
            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <img
              src="/2.png"
              alt="Logo Delicias de Faby"
              width="128"
              height="128"
              className="w-full h-full object-contain drop-shadow-2xl"
              loading="eager"
            />
          </motion.div>

          {/* Título */}
          <motion.h1
            className="themed-hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            Delicias Artesanales con Amor y Tradición
          </motion.h1>

          {/* Descripción */}
          <motion.p
            className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Bienvenidos a Delicias de Faby, donde cada día horneamos con pasión panes artesanales,
            pasteles irresistibles y una amplia variedad de productos de repostería fina.
          </motion.p>

          {/* Botones — columna en móvil, fila en tablet+ */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0 pt-2 sm:pt-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button
              onClick={scrollToProducts}
              className="themed-hero-btn-primary w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base rounded-full shadow-xl font-semibold border-0"
            >
              Ver Nuestros Productos
            </Button>
            <Button
              variant="outline"
              className="themed-hero-btn-secondary w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base rounded-full font-semibold border-2"
              onClick={() => navigate('/quienes-somos')}
            >
              Conoce Nuestra Historia
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8, repeat: Infinity, repeatType: "mirror" }}
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-white/80 hover:text-white transition-opacity" />
        </motion.div>
      </div>
    </div>
  );
};