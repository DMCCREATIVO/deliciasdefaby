import { Copyright, Facebook, Instagram, MessageCircle, MapPin, Phone, Mail, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { pb } from "@/lib/pocketbase/client";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({
    facebook_url: "",
    instagram_url: "",
    whatsapp_number: "",
    footer_text: "",
    business_address: ""
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const records = await pb.collection('settings').getList(1, 1);

        if (records.items && records.items.length > 0) {
          const data = records.items[0];
          setSettings({
            facebook_url: data.facebook_url || "",
            instagram_url: data.instagram_url || "",
            whatsapp_number: data.whatsapp_number || "",
            footer_text: data.footer_text || "",
            business_address: data.business_address || ""
          });
        }
      } catch (error) {
        // Silenciosamente usar valores por defecto si la colección no existe
        console.log('Settings collection not found, using defaults');
      }
    };

    loadSettings();
  }, []);

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-850 to-gray-800 border-t border-gray-700/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/img/pattern-light.svg')] opacity-5"></div>
      <div className="max-w-7xl mx-auto px-6 py-20 sm:py-24 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Información de Contacto */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-brand-beige mb-6 relative inline-block">
              <span className="relative z-10">Contacto</span>
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-brand-rosado rounded-full"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-brand-beige/80 hover:text-brand-rosado/90 transition-all duration-300 group">
                <div className="p-2 bg-brand-cafe/20 rounded-full group-hover:bg-brand-rosado/20 transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="text-sm">{settings.business_address || "Dirección pendiente"}</span>
              </div>
              <div className="flex items-center gap-3 text-brand-beige/80 hover:text-brand-rosado/90 transition-all duration-300 group">
                <div className="p-2 bg-brand-cafe/20 rounded-full group-hover:bg-brand-rosado/20 transition-all duration-300">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-sm">{settings.whatsapp_number || "Teléfono pendiente"}</span>
              </div>
              <div className="flex items-center gap-3 text-brand-beige/80 hover:text-brand-rosado/90 transition-all duration-300 group">
                <div className="p-2 bg-brand-cafe/20 rounded-full group-hover:bg-brand-rosado/20 transition-all duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <span className="text-sm">contacto@deliciasdefaby.com</span>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-brand-beige mb-6 relative inline-block">
              <span className="relative z-10">Enlaces Rápidos</span>
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-brand-rosado rounded-full"></span>
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link
                to="/quienes-somos"
                className="text-brand-beige/80 hover:text-brand-rosado transition-all duration-300 flex items-center gap-2 group"
              >
                <span className="h-1.5 w-1.5 bg-brand-rosado/50 rounded-full group-hover:w-3 transition-all duration-300"></span>
                <span>Quiénes Somos</span>
              </Link>
              <Link
                to="/productos"
                className="text-brand-beige/80 hover:text-brand-rosado transition-all duration-300 flex items-center gap-2 group"
              >
                <span className="h-1.5 w-1.5 bg-brand-rosado/50 rounded-full group-hover:w-3 transition-all duration-300"></span>
                <span>Nuestros Productos</span>
              </Link>
              <Link
                to="/contacto"
                className="text-brand-beige/80 hover:text-brand-rosado transition-all duration-300 flex items-center gap-2 group"
              >
                <span className="h-1.5 w-1.5 bg-brand-rosado/50 rounded-full group-hover:w-3 transition-all duration-300"></span>
                <span>Contáctanos</span>
              </Link>
              <Link
                to="/blog"
                className="text-brand-beige/80 hover:text-brand-rosado transition-all duration-300 flex items-center gap-2 group"
              >
                <span className="h-1.5 w-1.5 bg-brand-rosado/50 rounded-full group-hover:w-3 transition-all duration-300"></span>
                <span>Blog</span>
              </Link>
            </nav>
          </div>

          {/* Redes Sociales */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-brand-beige mb-6 relative inline-block">
              <span className="relative z-10">Síguenos</span>
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-brand-rosado rounded-full"></span>
            </h3>
            <div className="flex items-center gap-6">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-beige/80 bg-brand-cafe/10 p-3 rounded-full hover:bg-brand-rosado/20 hover:text-brand-rosado transition-all duration-300 transform hover:scale-110"
                  aria-label="Visítanos en Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-beige/80 bg-brand-cafe/10 p-3 rounded-full hover:bg-brand-rosado/20 hover:text-brand-rosado transition-all duration-300 transform hover:scale-110"
                  aria-label="Síguenos en Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              )}
              {settings.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-beige/80 bg-brand-cafe/10 p-3 rounded-full hover:bg-brand-rosado/20 hover:text-brand-rosado transition-all duration-300 transform hover:scale-110"
                  aria-label="Contáctanos por WhatsApp"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
              )}
            </div>
            <p className="text-brand-beige/60 text-sm">Conéctate con nosotros en redes sociales para ver nuestras últimas creaciones y promociones especiales.</p>
          </div>

          {/* Texto del Footer */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-brand-beige mb-6 relative inline-block">
              <span className="relative z-10">Delicias de Faby</span>
              <span className="absolute -bottom-1 left-0 w-12 h-1 bg-brand-rosado rounded-full"></span>
            </h3>
            <p className="text-brand-beige/80 text-sm leading-relaxed">
              {settings.footer_text || "Encuentra los dulces y postres más deliciosos hechos con amor y dedicación. Sabores que te harán volver por más."}
            </p>
            <p className="text-brand-beige/70 italic text-sm bg-brand-cafe/10 p-3 rounded-lg border-l-2 border-brand-rosado/50">
              "Jesús le dijo: ¿No te he dicho que si crees, verás la gloria de Dios?" - Juan 11:40 RVR1960
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-700/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-brand-beige/60 text-sm flex items-center">
            <Copyright className="w-4 h-4 mr-2" /> {currentYear} Delicias de Faby. Todos los derechos reservados.
          </p>
          <p className="text-brand-beige/60 text-sm flex items-center">
            Hecho con <Heart className="w-4 h-4 mx-1 text-brand-rosado animate-pulse" /> en Santiago, Chile
          </p>
        </div>
      </div>
    </footer>
  );
};