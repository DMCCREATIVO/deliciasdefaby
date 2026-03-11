import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "lucide-react";

const Logo = () => {
  return (
    <div className="h-full p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Logo del Sitio</h2>
        <Button className="bg-orange-500 hover:bg-orange-600">
          Guardar Cambios
        </Button>
      </div>
      <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="logo"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-zinc-700 border-dashed rounded-lg cursor-pointer bg-zinc-800 hover:bg-zinc-700"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Image className="w-12 h-12 mb-4 text-zinc-400" />
                <p className="mb-2 text-sm text-zinc-400">
                  <span className="font-semibold">Click para subir</span> o arrastra y suelta
                </p>
                <p className="text-xs text-zinc-400">PNG, JPG o GIF (MAX. 800x400px)</p>
              </div>
              <Input
                id="logo"
                type="file"
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;