import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { TestimonialForm } from "./TestimonialForm";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";
import { Star, Quote, ArrowRight } from "lucide-react";
import { pb } from "@/lib/pocketbase/client";

interface Testimonial {
  id: string;
  name: string;
  comment: string;
  rating: number;
  avatar?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export const Testimonials = () => {
  const [showForm, setShowForm] = useState(false);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedTestimonials, setExpandedTestimonials] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadTestimonials();
  }, []);

  const toggleExpanded = (testimonialId: string) => {
    setExpandedTestimonials(prev => ({
      ...prev,
      [testimonialId]: !prev[testimonialId]
    }));
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  async function loadTestimonials() {
    try {
      setIsLoading(true);

      // Intentar cargar testimonios de PocketBase
      try {
        const records = await pb.collection('testimonials').getList(1, 50, {
          sort: 'name',
        });

        if (records.items && records.items.length > 0) {
          const testimonials = records.items.map(record => ({
            id: record.id,
            name: record.name,
            comment: record.comment,
            rating: record.rating,
            avatar: record.avatar,
            status: record.status || 'approved',
            created_at: record.created
          }));
          setTestimonialsList(testimonials);
          return;
        }
      } catch (pbError) {
        console.log('No se pudieron cargar testimonios de PocketBase, usando testimonios estáticos');
      }

      // Si no hay testimonios en PocketBase o hubo error, usar estáticos
      setTestimonialsList(getStaticTestimonials());
    } catch (error) {
      console.error('Error loading testimonials:', error);
      setTestimonialsList(getStaticTestimonials());
    } finally {
      setIsLoading(false);
    }
  }

  function getStaticTestimonials(): Testimonial[] {
    return [
      {
        id: '1',
        name: "María González",
        comment: "¡Los mejores pasteles que he probado! Siempre frescos y deliciosos. La calidad de los ingredientes se nota desde el primer bocado y el servicio al cliente es excepcional.",
        avatar: "/lovable-uploads/63e31e76-6658-4f03-b1a3-2eea65235d73.png",
        rating: 5,
        status: 'approved',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: "Juan Pérez",
        comment: "El servicio es excelente y los productos son de primera calidad.",
        avatar: "/lovable-uploads/5877841d-d8f6-412c-891a-daace8802a54.png",
        rating: 5,
        status: 'approved',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name: "Ana Martínez",
        comment: "Me encanta cómo cuidan cada detalle. ¡Totalmente recomendados! Desde el momento en que entras a la tienda, te recibe el aroma de pan recién horneado. Los pasteles son obras de arte comestibles y el personal siempre está dispuesto a ayudar con una sonrisa. Sin duda, es mi panadería favorita en toda la ciudad.",
        avatar: "/lovable-uploads/e6a5756a-0b88-4eec-bac0-68840688da5a.png",
        rating: 5,
        status: 'approved',
        created_at: new Date().toISOString()
      },
      {
        id: '4',
        name: "Carlos Rodríguez",
        comment: "Increíble experiencia. Los panes artesanales son únicos.",
        avatar: "/lovable-uploads/63e31e76-6658-4f03-b1a3-2eea65235d73.png",
        rating: 5,
        status: 'approved',
        created_at: new Date().toISOString()
      },
      {
        id: '5',
        name: "Lucía Fernández",
        comment: "La atención personalizada y la calidad de los productos hacen de este lugar algo muy especial. Cada visita es una experiencia gastronómica memorable. Los precios son justos considerando la alta calidad de los ingredientes y la dedicación que ponen en cada producto. Altamente recomendado para cualquier ocasión especial.",
        avatar: "/lovable-uploads/e6a5756a-0b88-4eec-bac0-68840688da5a.png",
        rating: 5,
        status: 'approved',
        created_at: new Date().toISOString()
      }
    ];
  }

  const handleTestimonialSubmit = async (newTestimonial: { name: string; comment: string; rating: number }) => {
    try {
      await pb.collection('testimonials').create({
        name: newTestimonial.name,
        comment: newTestimonial.comment,
        rating: newTestimonial.rating,
        status: 'pending',
      });

      setShowForm(false);
      toast({
        title: 'Gracias por tu testimonio',
        description: 'Tu testimonio será revisado y publicado pronto.',
      });
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el testimonio. Por favor, intenta de nuevo.',
        variant: 'destructive'
      });
    }
  };

  return (
    <section className="w-full py-20 bg-gradient-to-b from-background to-brand-beige/20 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-cafe/5 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-brand-cafe/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-brand-brown/10 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-brand-cafe">
              Lo que dicen nuestros clientes
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-cafe to-brand-brown rounded-full mx-auto"></div>
            <p className="mt-4 text-lg text-brand-cafe/70 max-w-lg mx-auto">
              Descubre por qué nuestros clientes nos eligen una y otra vez para sus momentos especiales
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-cafe"></div>
            </div>
          ) : (
            <>
              <div className="relative px-12">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true
                  }}
                  className="w-full relative"
                >
                  <div className="overflow-hidden">
                    <CarouselContent>
                      {testimonialsList.map((testimonial, index) => {
                        const isExpanded = expandedTestimonials[testimonial.id];
                        const needsTruncation = testimonial.comment.length > 120;
                        const displayText = isExpanded ? testimonial.comment : truncateText(testimonial.comment);

                        return (
                          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                            <div className="h-full">
                              <Card className="h-80 bg-white/95 backdrop-blur-sm border border-brand-beige hover:border-brand-cafe/50 transition-all duration-500 hover:shadow-xl hover:shadow-brand-cafe/10 rounded-lg overflow-hidden flex flex-col">
                                {/* Header con avatar y nombre - altura fija */}
                                <CardHeader className="flex flex-row items-center space-x-4 p-4 flex-shrink-0">
                                  <Avatar className="h-12 w-12 ring-2 ring-brand-cafe/20">
                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                                    <AvatarFallback className="bg-gradient-to-br from-brand-cafe to-brand-brown text-white font-bold text-sm">
                                      {testimonial.name[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <CardTitle className="text-base font-bold text-brand-cafe truncate">
                                      {testimonial.name}
                                    </CardTitle>
                                    <div className="flex space-x-1 mt-1">
                                      {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-3 h-3 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <Quote className="w-5 h-5 text-brand-cafe/30 flex-shrink-0" />
                                </CardHeader>

                                {/* Contenido del comentario - área expandible */}
                                <CardContent className="flex-1 flex flex-col justify-between p-4 pt-0">
                                  <div className="flex-1">
                                    <p className="text-brand-cafe/80 leading-relaxed text-sm italic">
                                      "{displayText}"
                                    </p>
                                  </div>

                                  {/* Botón de expandir si es necesario */}
                                  {needsTruncation && (
                                    <div className="mt-3 pt-3 border-t border-brand-beige">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleExpanded(testimonial.id);
                                        }}
                                        className="text-brand-cafe hover:text-brand-brown text-xs font-medium transition-colors duration-300 flex items-center gap-1"
                                      >
                                        {isExpanded ? 'Ver menos' : 'Leer más'}
                                        <ArrowRight className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                      </button>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        );
                      })}
                    </CarouselContent>
                  </div>
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                    <div className="pointer-events-auto">
                      <CarouselPrevious className="bg-white/90 hover:bg-white border-brand-cafe/20 hover:border-brand-cafe/50 hover:bg-brand-cafe/10 shadow-lg hover:shadow-xl transition-all duration-300" />
                    </div>
                    <div className="pointer-events-auto">
                      <CarouselNext className="bg-white/90 hover:bg-white border-brand-cafe/20 hover:border-brand-cafe/50 hover:bg-brand-cafe/10 shadow-lg hover:shadow-xl transition-all duration-300" />
                    </div>
                  </div>
                </Carousel>
              </div>

              <div className="mt-16 text-center">
                {!showForm ? (
                  <Button
                    onClick={() => setShowForm(true)}
                    className="bg-brand-cafe hover:bg-brand-brown text-white font-semibold px-8 py-6 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-500"
                  >
                    Compartir tu Experiencia
                  </Button>
                ) : (
                  <div className="max-w-md mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-brand-cafe/20 shadow-xl">
                    <h3 className="text-xl font-bold text-brand-cafe mb-4">Tu opinión es importante</h3>
                    <TestimonialForm onSubmit={handleTestimonialSubmit} />
                    <Button
                      onClick={() => setShowForm(false)}
                      variant="outline"
                      className="mt-4 w-full border-brand-cafe/20 hover:border-brand-cafe/50 hover:bg-brand-cafe/5"
                    >
                      Cancelar
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};