import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Textos = () => {
  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Textos del Sitio</h2>
        <Button className="bg-orange-500 hover:bg-orange-600">
          Guardar Cambios
        </Button>
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo" className="text-white">Título Principal</Label>
            <Textarea
              id="titulo"
              placeholder="Ingresa el título principal del sitio..."
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion" className="text-white">Descripción</Label>
            <Textarea
              id="descripcion"
              placeholder="Ingresa la descripción del sitio..."
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-white">Mensaje de WhatsApp</Label>
            <Textarea
              id="whatsapp"
              placeholder="Ingresa el mensaje predeterminado de WhatsApp..."
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Textos;