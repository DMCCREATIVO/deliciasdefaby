import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { blogService, settingsService } from "@/lib/database/index";
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

  const { data, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      return await blogService.getAll();
    },
  });
  const posts = Array.isArray(data) ? data : [];
  console.log("POSTS:", posts);

  return (
    <div className="relative min-h-[100vh] w-full overflow-hidden -mt-16 sm:-mt-20">
      {/* Background Layers */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src="/1.png"
          alt="Background"
          width="1920"
          height="1080"
          className="w-full h-full object-cover object-center scale-100 md:scale-105"
          loading="eager"
          sizes="100vw"
        />
      </motion.div>

      {/* Capa oscura más opaca sobre la imagen de fondo */}
      <div className="absolute inset-0 bg-black/70" />
      {/* Glass Overlay con menos opacidad */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cafe/30 via-transparent to-brand-cafe/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-brown/15 via-transparent to-brand-brown/15" />

      {/* Content positioned to account for navbar */}
      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8 sm:pb-12 h-full flex flex-col justify-center">
        <div className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-6">
          {/* Logo with responsive sizing */}
          <motion.div
            className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <img
              src="/2.png"
              alt="Logo"
              width="128"
              height="128"
              className="w-full h-full object-contain"
              loading="eager"
            />
          </motion.div>

          {/* Main Title with improved typography */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1]"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          >
            Delicias Artesanales con Amor y Tradición
          </motion.h1>

          {/* Description with improved readability */}
          <motion.p
            className="text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Bienvenidos a Delicias de Faby, donde cada día horneamos con pasión panes artesanales,
            pasteles irresistibles y una amplia variedad de productos de repostería fina.
          </motion.p>

          {/* Buttons with improved mobile layout */}
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0 pt-2 sm:pt-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <Button
              onClick={scrollToProducts}
              className="w-full sm:w-auto bg-brand-cafe hover:bg-brand-brown text-white px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base rounded-full shadow-xl hover:shadow-brand-cafe/30 transition-all duration-300 hover:-translate-y-1 border border-brand-cafe/20 font-semibold"
            >
              Ver Nuestros Productos
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-2 border-white/80 text-brand-cafe bg-white/90 hover:bg-white hover:border-white px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base rounded-full transition-all duration-300 hover:-translate-y-1 font-semibold"
              onClick={() => navigate('/quienes-somos')}
            >
              Conoce Nuestra Historia
            </Button>
          </motion.div>
        </div>

        {/* Scroll Indicator with improved visibility */}
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