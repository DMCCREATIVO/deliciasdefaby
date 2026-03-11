import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Cake, Heart } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";

export const HeroSection = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section className="relative h-[90vh] md:h-[80vh] w-full overflow-hidden group">
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/a96e12eb-6b90-4fce-b3a9-40c6344f9e3a.png"
          alt="Nuestro proceso artesanal"
          className="w-full h-full object-cover object-center animate-slow-zoom transform group-hover:scale-105 transition-transform duration-1000 ease-[cubic-bezier(0.05,0.6,0.4,0.9)] scale-110 md:scale-105"
          loading="eager"
          sizes="100vw"
          style={{ willChange: 'transform' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/50 dark:from-black/95 dark:via-black/80 dark:to-black/60 transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      </div>
      
      <div className="relative h-full flex items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white px-4 space-y-6 md:space-y-8"
        >
          {/* Icon decoration */}
          {!isMobile && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute -top-16 -left-16 opacity-20"
            >
              <Cake className="w-48 h-48 text-brand-pink/20" />
            </motion.div>
          )}

          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-brand-pink via-brand-pink/80 to-brand-beige bg-clip-text text-transparent"
          >
            Delicias de Faby
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl max-w-2xl mx-auto text-muted-foreground leading-relaxed"
          >
            Descubre la magia de nuestros pasteles artesanales, hechos con amor y los mejores ingredientes
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full px-4 sm:px-0"
          >
            <Button
              onClick={() => navigate('/productos')}
              className="w-full sm:w-auto bg-brand-pink hover:bg-brand-pink/90 dark:bg-brand-dark-pink dark:hover:bg-brand-dark-pink/90 text-white px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg rounded-full shadow-lg hover:shadow-brand-pink/20 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                <Cake className="w-5 h-5" />
                Ver Productos
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-2 border-brand-pink text-brand-pink hover:bg-brand-pink/10 dark:border-brand-dark-pink dark:text-brand-dark-pink dark:hover:bg-brand-dark-pink/10 px-6 sm:px-10 py-5 sm:py-7 text-base sm:text-lg rounded-full transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
              onClick={() => navigate('/contacto')}
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                <Heart className="w-5 h-5" />
                Contáctanos
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
