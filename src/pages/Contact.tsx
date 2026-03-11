import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Send, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/lib/database/index";

const contactFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un email válido"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const allSettings = await settingsService.getAll();
      const settingsMap: Record<string, any> = {};
      allSettings.forEach(s => {
        settingsMap[s.key] = s.value;
      });
      return settingsMap;
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const businessPhone = "56996509811";

      const message = `*Nuevo mensaje de contacto*%0A%0A` +
        `*Nombre:* ${data.name}%0A` +
        `*Email:* ${data.email}%0A%0A` +
        `*Teléfono:* ${data.phone}%0A%0A` +
        `*Mensaje:*%0A${data.message}`;

      window.open(
        `https://wa.me/${businessPhone}?text=${message}`,
        '_blank'
      );

      toast.success("Redirigiendo a WhatsApp...");
      form.reset();
    } catch (error) {
      toast.error("Error al enviar el mensaje");
    }
  };

  return (
    <div className="relative overflow-hidden -mt-16 sm:-mt-20">
      {/* Hero Section - Optimizado */}
      <section
        className="relative h-[70vh] sm:h-[80vh] flex items-center justify-center bg-cover bg-center pt-24 sm:pt-28"
        style={{ backgroundImage: "url('/1.png')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center max-w-2xl px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 animate-fade-up">
            Contáctanos
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 animate-fade-up animate-delay-100">
            Estamos aquí para ayudarte. ¡Escríbenos!
          </p>
        </div>
      </section>

      {/* Main Content - Sin margen excesivo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 -mt-8 sm:-mt-12 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <Card className="bg-brand-beige/10 border-brand-cafe/20">
              <CardHeader>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-brand-cafe mb-3 sm:mb-4">
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                {settings?.whatsapp_number && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-brand-rosado/10 rounded-lg">
                      <Phone className="w-6 h-6 text-brand-rosado" />
                    </div>
                    <div>
                      <p className="font-medium text-brand-cafe">WhatsApp</p>
                      <a
                        href={`https://wa.me/${settings.whatsapp_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-cafe/80 hover:text-brand-rosado transition-colors"
                      >
                        {settings.whatsapp_number}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="border-brand-cafe/20">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-brand-cafe mb-3 sm:mb-4">
                Envíanos un Mensaje
              </CardTitle>
              <p className="text-brand-cafe/80 text-sm sm:text-base">
                Completa el formulario y te responderemos lo antes posible
              </p>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-brand-cafe">Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tu nombre"
                            {...field}
                            className="border-brand-cafe/20 focus:border-brand-rosado/50 min-h-[44px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-brand-cafe">Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="tu@email.com"
                            {...field}
                            className="border-brand-cafe/20 focus:border-brand-rosado/50 min-h-[44px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-brand-cafe">Teléfono</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tu teléfono"
                            {...field}
                            className="border-brand-cafe/20 focus:border-brand-rosado/50 min-h-[44px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-brand-cafe">Mensaje</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tu mensaje..."
                            {...field}
                            className="border-brand-cafe/20 focus:border-brand-rosado/50 min-h-[120px] sm:min-h-[150px] resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-brand-cafe hover:bg-brand-brown text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[48px]"
                  >
                    {form.formState.isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enviando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Enviar Mensaje
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;