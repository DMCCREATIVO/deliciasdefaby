import { Cake, Heart, Star, Clock, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Features = () => {
  return (
    <section className="themed-features-section py-12 sm:py-16 md:py-20 lg:py-24 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.div 
          className="text-center mb-10 sm:mb-12 md:mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="themed-section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
            Nuestra Pasión por la Panadería y Repostería
          </h2>
          <p className="themed-section-subtitle text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
            Combinamos técnicas tradicionales con innovación para crear productos únicos que deleitan todos los sentidos. 
            Desde el aroma del pan recién horneado hasta el sabor exquisito de nuestros pasteles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            { icon: Cake, title: "Variedad Artesanal", description: "Elaboramos una amplia gama de productos: panes artesanales, pasteles, tortas personalizadas, galletas, empanadas y especialidades de temporada." },
            { icon: Heart, title: "Hecho con Amor", description: "Cada producto es elaborado con dedicación y los mejores ingredientes, manteniendo vivas las recetas tradicionales y creando nuevas delicias." },
            { icon: Star, title: "Calidad Premium", description: "Seleccionamos cuidadosamente cada ingrediente para garantizar el mejor sabor y frescura en todos nuestros productos de panadería y repostería." },
            { icon: Clock, title: "Siempre Fresco", description: "Horneamos diariamente para asegurar que nuestros clientes disfruten de productos frescos, desde el pan de la mañana hasta los pasteles del día." },
            { icon: Award, title: "Experiencia y Tradición", description: "Años de experiencia en panadería y pastelería nos respaldan, combinando métodos tradicionales con técnicas modernas para resultados excepcionales." },
            { icon: Sparkles, title: "Ocasiones Especiales", description: "Creamos tortas y pasteles personalizados para tus momentos más importantes, desde cumpleaños hasta bodas, con diseños únicos y sabores memorables." }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="themed-card p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl transition-all duration-300 group hover:shadow-xl border backdrop-blur-sm"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="themed-feature-icon w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 group-hover:scale-105 transition-transform"
                whileHover={{ rotate: 15, scale: 1.1, transition: { type: "spring", stiffness: 300 } }}
              >
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </motion.div>
              <h3 className="themed-feature-title text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-4">{feature.title}</h3>
              <p className="themed-feature-text leading-relaxed text-sm sm:text-base">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};