import { Card } from "@/components/ui/card";

export const AboutUs = () => {
  return (
    <div className="relative overflow-hidden -mt-16 sm:-mt-20">
      {/* Hero Section - Optimizado */}
      <section 
        className="relative h-[70vh] sm:h-[80vh] flex items-center justify-center bg-cover bg-center pt-24 sm:pt-28"
        style={{ 
          backgroundImage: "url('/3.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-cafe/5 via-brand-rosado/3 to-brand-cafe/5 backdrop-blur-[0.3px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
        <div className="relative z-10 text-center max-w-2xl px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-up">
            Quiénes Somos
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 animate-fade-up animate-delay-100">
            Conoce nuestra historia y pasión por la cocina
          </p>
        </div>
      </section>

      {/* Contenido Principal - Sin margen negativo excesivo */}
      <section className="relative z-20 bg-gradient-to-b from-brand-beige/20 via-white to-brand-beige/10 -mt-8 sm:-mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <Card className="p-6 sm:p-8 md:p-10 bg-white/95 backdrop-blur-lg shadow-2xl border-brand-cafe/10">
            <div className="space-y-8 sm:space-y-12 md:space-y-16">
              {/* Historia */}
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-cafe mb-4 sm:mb-6">
                  Nuestra Historia
                </h2>
                <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl leading-relaxed text-brand-cafe/90">
                  <p>
                    Así comencé con Delicias de Faby, con un horno semi industrial de un proyecto para emprendedores que me gané en la municipalidad de El Bosque.
                  </p>
                  <p>
                    La iniciativa de comenzar a preparar el pan semi integral, que fue el primero de todos los productos que comencé a comercializar, surgió de una historia que me contó mi mamá y me inspiró a comenzar mi propio emprendimiento.
                  </p>
                  <p>
                    Primero fueron pan semi integral y galletas de navidad en diciembre del 2013. Ya en el 2014 realicé mi primer curso de pastelería, incorporando más productos a la venta.
                  </p>
                  <p>
                    Seguí capacitándome en el 2015 con cursos de Panadería y Banquetería. Durante la pandemia mi emprendimiento se detuvo, pero en el 2021 lo retomé con más fuerza.
                  </p>
                </div>
              </div>

              {/* Imagen Decorativa */}
              <div className="relative w-full max-w-4xl mx-auto my-8 sm:my-12 md:my-16 overflow-hidden rounded-2xl shadow-xl">
                <img
                  src="/3.png"
                  alt="Delicias de Faby - Nuestra Pasión"
                  className="w-full h-full object-contain min-h-[300px] sm:min-h-[400px] mx-auto transform hover:scale-105 transition-transform duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Productos */}
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-cafe mb-4 sm:mb-6">
                  Nuestros Productos
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  <Card className="p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-brand-cafe/10">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Panadería</h3>
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base">
                      <li>Pan semi integral</li>
                      <li>Variedad de panes</li>
                    </ul>
                  </Card>
                  <Card className="p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-brand-cafe/10">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Pastelería</h3>
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base">
                      <li>Surtido de tortas</li>
                      <li>Variedad de sabores de queques</li>
                    </ul>
                  </Card>
                  <Card className="p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-brand-cafe/10">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Especialidades</h3>
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base">
                      <li>Empanadas de cóctel</li>
                      <li>Canapés y tapaditos</li>
                    </ul>
                  </Card>
                  <Card className="p-4 sm:p-6 md:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-brand-cafe/10">
                    <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Infaltables</h3>
                    <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base">
                      <li>Pie de limón</li>
                      <li>Tartas y kuchen</li>
                    </ul>
                  </Card>
                </div>
              </div>

              {/* Mensaje Final */}
              <div className="space-y-4 sm:space-y-6 text-center">
                <p className="text-base sm:text-lg">
                  Avanzando y mejorando cada día en los detalles para así entregar un servicio de excelencia a mis clientes.
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-sm sm:text-base">
                    Agradecida primeramente de Dios que me da la oportunidad de seguir avanzando en este proyecto hermoso de servir a los demás.
                  </p>
                  <p className="text-sm sm:text-base">
                    Gracias también a todos los que hacen posible este negocio.
                  </p>
                  <p className="italic text-brand-cafe text-sm sm:text-base">
                    "Jesús le dijo: ¿No te he dicho que si crees, verás la gloria de Dios?" - Juan 11:40 RVR1960
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;