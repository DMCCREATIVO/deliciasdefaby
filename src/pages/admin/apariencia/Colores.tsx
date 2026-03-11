import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Paintbrush, Wand2, Square } from "lucide-react";

const Colores = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Header mejorado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Palette className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold admin-improved-text">Colores del Sitio</h1>
            <p className="admin-improved-text-muted">Personaliza la paleta de colores de tu sitio web</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg">
          <Paintbrush className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      {/* Grid de configuración de colores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Colores Principales */}
        <Card className="admin-improved-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 admin-improved-text">
              <Wand2 className="h-5 w-5 text-orange-600" />
              Colores Principales
            </CardTitle>
            <CardDescription className="admin-improved-text-muted">
              Define los colores primarios y secundarios de tu marca
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="colorPrimario" className="admin-improved-text font-medium">
                  Color Primario
                </Label>
                <div className="flex gap-2">
            <Input
              type="color"
              id="colorPrimario"
                    defaultValue="#ea580c"
                    className="w-16 h-12 p-1 border admin-improved-border rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue="#ea580c"
                    className="flex-1 admin-improved-text"
                    placeholder="Código hex"
            />
          </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="colorSecundario" className="admin-improved-text font-medium">
                  Color Secundario
                </Label>
                <div className="flex gap-2">
            <Input
              type="color"
              id="colorSecundario"
                    defaultValue="#f59e0b"
                    className="w-16 h-12 p-1 border admin-improved-border rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue="#f59e0b"
                    className="flex-1 admin-improved-text"
                    placeholder="Código hex"
            />
          </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colores de Fondo */}
        <Card className="admin-improved-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 admin-improved-text">
              <Square className="h-5 w-5 text-blue-600" />
              Colores de Fondo
            </CardTitle>
            <CardDescription className="admin-improved-text-muted">
              Configura los fondos y superficies de tu sitio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="colorFondo" className="admin-improved-text font-medium">
                  Fondo Principal
                </Label>
                <div className="flex gap-2">
            <Input
              type="color"
              id="colorFondo"
                    defaultValue="#ffffff"
                    className="w-16 h-12 p-1 border admin-improved-border rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue="#ffffff"
                    className="flex-1 admin-improved-text"
                    placeholder="Código hex"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="colorSurface" className="admin-improved-text font-medium">
                  Superficie (Cards)
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="colorSurface"
                    defaultValue="#f8fafc"
                    className="w-16 h-12 p-1 border admin-improved-border rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue="#f8fafc"
                    className="flex-1 admin-improved-text"
                    placeholder="Código hex"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colores de Texto */}
        <Card className="admin-improved-card">
          <CardHeader>
            <CardTitle className="admin-improved-text">Colores de Texto</CardTitle>
            <CardDescription className="admin-improved-text-muted">
              Define los colores para diferentes tipos de texto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="colorTextoPrincipal" className="admin-improved-text font-medium">
                  Texto Principal
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="colorTextoPrincipal"
                    defaultValue="#0f172a"
                    className="w-16 h-12 p-1 border admin-improved-border rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue="#0f172a"
                    className="flex-1 admin-improved-text"
                    placeholder="Código hex"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="colorTextoSecundario" className="admin-improved-text font-medium">
                  Texto Secundario
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="colorTextoSecundario"
                    defaultValue="#64748b"
                    className="w-16 h-12 p-1 border admin-improved-border rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue="#64748b"
                    className="flex-1 admin-improved-text"
                    placeholder="Código hex"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colores de Estado */}
        <Card className="admin-improved-card">
          <CardHeader>
            <CardTitle className="admin-improved-text">Colores de Estado</CardTitle>
            <CardDescription className="admin-improved-text-muted">
              Colores para estados de éxito, error, advertencia e información
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="colorExito" className="admin-improved-text font-medium">
                  Éxito
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="colorExito"
                    defaultValue="#059669"
                    className="w-12 h-10 p-1 border admin-improved-border rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue="#059669"
                    className="flex-1 text-sm admin-improved-text"
                    placeholder="Código hex"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="colorError" className="admin-improved-text font-medium">
                  Error
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="colorError"
                    defaultValue="#dc2626"
                    className="w-12 h-10 p-1 border admin-improved-border rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue="#dc2626"
                    className="flex-1 text-sm admin-improved-text"
                    placeholder="Código hex"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="colorAdvertencia" className="admin-improved-text font-medium">
                  Advertencia
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    id="colorAdvertencia"
                    defaultValue="#d97706"
                    className="w-12 h-10 p-1 border admin-improved-border rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue="#d97706"
                    className="flex-1 text-sm admin-improved-text"
                    placeholder="Código hex"
            />
          </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="colorInfo" className="admin-improved-text font-medium">
                  Información
                </Label>
                <div className="flex gap-2">
            <Input
              type="color"
                    id="colorInfo"
                    defaultValue="#2563eb"
                    className="w-12 h-10 p-1 border admin-improved-border rounded-lg cursor-pointer"
                  />
                  <Input
                    type="text"
                    defaultValue="#2563eb"
                    className="flex-1 text-sm admin-improved-text"
                    placeholder="Código hex"
            />
          </div>
        </div>
      </div>
          </CardContent>
        </Card>
      </div>

      {/* Vista previa de colores */}
      <Card className="admin-improved-card">
        <CardHeader>
          <CardTitle className="admin-improved-text">Vista Previa</CardTitle>
          <CardDescription className="admin-improved-text-muted">
            Así se verán los colores en tu sitio web
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-orange-600 text-white text-center">
              <div className="text-sm font-medium">Primario</div>
              <div className="text-xs opacity-75">#ea580c</div>
            </div>
            <div className="p-4 rounded-lg bg-amber-500 text-white text-center">
              <div className="text-sm font-medium">Secundario</div>
              <div className="text-xs opacity-75">#f59e0b</div>
            </div>
            <div className="p-4 rounded-lg bg-emerald-600 text-white text-center">
              <div className="text-sm font-medium">Éxito</div>
              <div className="text-xs opacity-75">#059669</div>
            </div>
            <div className="p-4 rounded-lg bg-red-600 text-white text-center">
              <div className="text-sm font-medium">Error</div>
              <div className="text-xs opacity-75">#dc2626</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Colores;