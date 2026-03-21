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
        console.log('Settings collection not found, using defaults');
      }
    };
    loadSettings();
  }, []);

  return (
    <footer className="themed-footer relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('/img/pattern-light.svg')]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">

          {/* Contacto */}
          <div className="space-y-5">
            <h3 className="themed-footer-title text-xl sm:text-2xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">Contacto</span>
              <span className="themed-footer-title-bar absolute -bottom-1 left-0 w-10 h-1 rounded-full"></span>
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 themed-footer-link group">
                <div className="themed-footer-icon-bg p-2 rounded-full mt-0.5 transition-all duration-300">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                </div>
                <span className="text-sm">{settings.business_address || "Dirección pendiente"}</span>
              </div>
              <div className="flex items-center gap-3 themed-footer-link group">
                <div className="themed-footer-icon-bg p-2 rounded-full transition-all duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-sm">{settings.whatsapp_number || "Teléfono pendiente"}</span>
              </div>
              <div className="flex items-center gap-3 themed-footer-link group">
                <div className="themed-footer-icon-bg p-2 rounded-full transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">contacto@deliciasdefaby.com</span>
              </div>
            </div>
          </div>

          {/* Enlaces */}
          <div className="space-y-5">
            <h3 className="themed-footer-title text-xl sm:text-2xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">Enlaces Rápidos</span>
              <span className="themed-footer-title-bar absolute -bottom-1 left-0 w-10 h-1 rounded-full"></span>
            </h3>
            <nav className="flex flex-col space-y-3">
              {[
                { to: "/quienes-somos", label: "Quiénes Somos" },
                { to: "/productos", label: "Nuestros Productos" },
                { to: "/contacto", label: "Contáctanos" },
                { to: "/blog", label: "Blog" },
              ].map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="themed-footer-link transition-all duration-300 flex items-center gap-2 group text-sm"
                >
                  <span className="themed-footer-dot h-1.5 w-1.5 rounded-full group-hover:w-3 transition-all duration-300"></span>
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Redes Sociales */}
          <div className="space-y-5">
            <h3 className="themed-footer-title text-xl sm:text-2xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">Síguenos</span>
              <span className="themed-footer-title-bar absolute -bottom-1 left-0 w-10 h-1 rounded-full"></span>
            </h3>
            <div className="flex items-center gap-4 flex-wrap">
              {settings.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="themed-footer-icon-bg p-3 rounded-full themed-footer-link transition-all duration-300 transform hover:scale-110"
                  aria-label="Visítanos en Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="themed-footer-icon-bg p-3 rounded-full themed-footer-link transition-all duration-300 transform hover:scale-110"
                  aria-label="Síguenos en Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.whatsapp_number && (
                <a
                  href={`https://wa.me/${settings.whatsapp_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="themed-footer-icon-bg p-3 rounded-full themed-footer-link transition-all duration-300 transform hover:scale-110"
                  aria-label="Contáctanos por WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
            </div>
            <p className="themed-footer-text text-sm leading-relaxed">
              Conéctate con nosotros en redes sociales para ver nuestras últimas creaciones.
            </p>
          </div>

          {/* Texto */}
          <div className="space-y-5">
            <h3 className="themed-footer-title text-xl sm:text-2xl font-bold mb-4 relative inline-block">
              <span className="relative z-10">Delicias de Faby</span>
              <span className="themed-footer-title-bar absolute -bottom-1 left-0 w-10 h-1 rounded-full"></span>
            </h3>
            <p className="themed-footer-text text-sm leading-relaxed">
              {settings.footer_text || "Encuentra los dulces y postres más deliciosos hechos con amor y dedicación. Sabores que te harán volver por más."}
            </p>
            <p className="themed-footer-text italic text-sm themed-footer-quote p-3 rounded-r-lg border-l-2">
              "Jesús le dijo: ¿No te he dicho que si crees, verás la gloria de Dios?" - Juan 11:40
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="themed-footer-border mt-10 sm:mt-14 pt-6 sm:pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="themed-footer-text text-xs sm:text-sm flex items-center">
            <Copyright className="w-3.5 h-3.5 mr-1.5" />
            {currentYear} Delicias de Faby. Todos los derechos reservados.
          </p>
          <p className="themed-footer-text text-xs sm:text-sm flex items-center">
            Hecho con <Heart className="themed-footer-heart w-3.5 h-3.5 mx-1 animate-pulse" /> en Santiago, Chile
          </p>
        </div>
      </div>
    </footer>
  );
};