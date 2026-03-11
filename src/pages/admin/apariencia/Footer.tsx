import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { settingsService } from "@/lib/database/index";

export default function Footer() {
  const [facebookUrl, setFacebookUrl] = useState("https://www.facebook.com/share/1GoUHUUYN4/");
  const [instagramUrl, setInstagramUrl] = useState("https://www.instagram.com/deliciasdefaby?igsh=aWl0MW94dzR4YXNr");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [footerText, setFooterText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFooterSettings();
  }, []);

  const loadFooterSettings = async () => {
    try {
      const allSettings = await settingsService.getAll();
      const settingsMap = allSettings.reduce((acc: any, s) => {
        acc[s.key] = s.value;
        return acc;
      }, {});

      if (settingsMap.facebook_url) setFacebookUrl(settingsMap.facebook_url);
      if (settingsMap.instagram_url) setInstagramUrl(settingsMap.instagram_url);
      if (settingsMap.whatsapp_number) setWhatsappNumber(settingsMap.whatsapp_number);
      if (settingsMap.footer_text) setFooterText(settingsMap.footer_text);

    } catch (error) {
      console.error('Error loading footer settings:', error);
      toast.error("Error al cargar la configuración del pie de página");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Update each setting
      await Promise.all([
        settingsService.update('facebook_url', facebookUrl),
        settingsService.update('instagram_url', instagramUrl),
        settingsService.update('whatsapp_number', whatsappNumber),
        settingsService.update('footer_text', footerText),
      ]);

      toast.success("Configuración del pie de página actualizada");
    } catch (error) {
      console.error('Error saving footer settings:', error);
      toast.error("Error al guardar la configuración del pie de página");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Configuración del Pie de Página</h2>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-brand-pink hover:bg-brand-pink/90"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>

      <div className="space-y-6 rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="facebook" className="text-white">URL de Facebook</Label>
            <Input
              id="facebook"
              placeholder="https://facebook.com/tu-pagina"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram" className="text-white">URL de Instagram</Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/tu-cuenta"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp" className="text-white">Número de WhatsApp</Label>
          <Input
            id="whatsapp"
            placeholder="Ej: +56912345678"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
          <p className="text-sm text-zinc-400">Ingresa el número completo con código de país</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="footerText" className="text-white">Texto del Pie de Página</Label>
          <Input
            id="footerText"
            placeholder="Ej: © 2024 Delicias de Faby. Todos los derechos reservados."
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
      </div>
    </div>
  );
}