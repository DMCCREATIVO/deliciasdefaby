import { Cake, Heart, Star, Clock, Award, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Features = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-background/95 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.div 
          className="text-center mb-12 sm:mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-brand-pink via-brand-pink/80 to-brand-beige bg-clip-text text-transparent mb-4 sm:mb-6 animate-float hover:scale-105 transition-transform duration-300">
            Nuestra Pasión por la Panadería y Repostería
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto">
            Combinamos técnicas tradicionales con innovación para crear productos únicos que deleitan todos los sentidos. 
            Desde el aroma del pan recién horneado hasta el sabor exquisito de nuestros pasteles.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: Cake,
              title: "Variedad Artesanal",
              description: "Elaboramos una amplia gama de productos: panes artesanales, pasteles, tortas personalizadas, galletas, empanadas y especialidades de temporada."
            },
            {
              icon: Heart,
              title: "Hecho con Amor",
              description: "Cada producto es elaborado con dedicación y los mejores ingredientes, manteniendo vivas las recetas tradicionales y creando nuevas delicias."
            },
            {
              icon: Star,
              title: "Calidad Premium",
              description: "Seleccionamos cuidadosamente cada ingrediente para garantizar el mejor sabor y frescura en todos nuestros productos de panadería y repostería."
            },
            {
              icon: Clock,
              title: "Siempre Fresco",
              description: "Horneamos diariamente para asegurar que nuestros clientes disfruten de productos frescos, desde el pan de la mañana hasta los pasteles del día."
            },
            {
              icon: Award,
              title: "Experiencia y Tradición",
              description: "Años de experiencia en panadería y pastelería nos respaldan, combinando métodos tradicionales con técnicas modernas para resultados excepcionales."
            },
            {
              icon: Sparkles,
              title: "Ocasiones Especiales",
              description: "Creamos tortas y pasteles personalizados para tus momentos más importantes, desde cumpleaños hasta bodas, con diseños únicos y sabores memorables."
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="glass-light dark:glass-dark p-6 sm:p-8 rounded-2xl hover:scale-[1.02] transition-all duration-300 group hover:shadow-xl border border-brand-pink/10 hover:border-brand-pink/20 backdrop-blur-sm hover:bg-brand-pink/5"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-rosado/10 dark:bg-brand-rosado/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-sm hover:shadow-md"
                whileHover={{ rotate: 15, scale: 1.1, transition: { type: "spring", stiffness: 300 } }}
              >
                <feature.icon className="w-7 h-7 sm:w-8 sm:h-8 text-brand-rosado dark:text-brand-rosado" />
              </motion.div>
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4 bg-gradient-to-r from-brand-pink/80 to-brand-beige/80 bg-clip-text text-transparent hover:scale-105 transition-transform">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base hover:text-foreground/80 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};