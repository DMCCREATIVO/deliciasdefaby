import { motion } from "framer-motion";
import { Check, HeartHandshake, Star } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";

export const ValuesSection = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <section className="py-20 w-full bg-gradient-to-b from-white to-pink-50 dark:from-zinc-900 dark:to-zinc-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-brand-pink via-brand-pink/80 to-brand-beige bg-clip-text text-transparent"
          >
            Nuestros Valores
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Los principios que guían nuestro trabajo diario y nos ayudan a crear momentos dulces inolvidables.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 relative">
          {/* Background decoration */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-[120%] h-[120%] bg-gradient-radial from-brand-pink/10 via-transparent to-transparent" />
            </motion.div>
          )}

          {/* Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-pink/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Check className="w-14 h-14 text-green-500 mb-6 mx-auto p-2.5 bg-green-50 dark:bg-green-900/20 rounded-full" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
              Compromiso con la Calidad
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center text-lg leading-relaxed">
              Seleccionamos cuidadosamente cada ingrediente y supervisamos cada paso del proceso de elaboración.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-pink/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <HeartHandshake className="w-14 h-14 text-pink-500 mb-6 mx-auto p-2.5 bg-pink-50 dark:bg-pink-900/20 rounded-full" />
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white text-center">
              Atención Personalizada
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center text-lg leading-relaxed">
              Cada cliente es único, y nos esforzamos por brindar un servicio excepcional y personalizado.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
