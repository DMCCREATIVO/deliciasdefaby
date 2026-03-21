import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Upload, Save, RefreshCw, Globe, DollarSign, Store, MessageSquare, CreditCard, Clock, MapPin, Settings, Building, Phone, Palette } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { settingsService } from "@/lib/database/index";
import { BusinessSettings } from "@/lib/database/settings.pocketbase";
import { ThemeSwitcher } from "@/components/admin/ThemeSwitcher";
import { toast } from "sonner";

const defaultSettings: BusinessSettings = {
  business_name: "Mi Catálogo",
  business_address: "",
  whatsapp_number: "",
  email: "",
  phone: "",
  currency: "CLP",
  language: "es",
  timezone: "America/Santiago",
  enable_online_payments: false,
  mercadopago_public_key: "",
  mercadopago_access_token: "",
  delivery_schedule_text: "",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  youtube_url: "",
  footer_text: "",
  maintenance_mode: false,
  allow_registration: true,
  min_order_amount: 0,
  delivery_fee: 0,
  free_delivery_threshold: 0,
};

export default function Configuracion() {
  const [settings, setSettings] = useState<BusinessSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);

      // Intentar cargar configuración existente
      const data = await settingsService.getSettings();

      if (data) {
        const loadedSettings = { ...defaultSettings, ...data };
        setSettings(loadedSettings);
        if (loadedSettings.logo) {
          setLogoPreview(loadedSettings.logo);
        }
        toast.success("Configuración cargada correctamente");
      } else {
        // Si no hay configuración, usar valores por defecto
        setSettings(defaultSettings);
        toast.info("Usando configuración por defecto - recuerda guardar los cambios");
      }
    } catch (error) {
      console.error('Error loadSettings:', error);
      toast.error("Error al cargar la configuración");
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BusinessSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null;

    try {
      setUploadingLogo(true);
      const publicUrl = await settingsService.uploadLogo(logoFile);
      return publicUrl;
    } catch (error) {
      console.error('Error al subir logo:', error);
      toast.error("Error al subir el logo");
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  const saveSettings = async () => {
    try {
      console.log("🚀 Iniciando guardado de configuración (PocketBase)...");
      setSaving(true);

      let logoUrl = settings.logo;

      // Subir nuevo logo si hay uno
      if (logoFile) {
        console.log("📸 Subiendo nuevo logo...");
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) {
          logoUrl = uploadedUrl;
          console.log("✅ Logo subido exitosamente:", uploadedUrl);
        }
      }

      const settingsToSave = {
        ...settings,
        logo: logoUrl,
      };

      console.log("💾 Datos finales a guardar:", settingsToSave);
      const result = await settingsService.saveSettings(settingsToSave);
      console.log("✅ Resultado del guardado:", result);

      setSettings({ ...settingsToSave, ...result });
      setLogoFile(null);
      toast.success("Configuración guardada exitosamente");
    } catch (error: any) {
      console.error('❌ Error al guardar:', error);
      toast.error("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  const testWhatsApp = () => {
    if (settings.whatsapp_number) {
      const url = `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}?text=Prueba%20de%20conexión%20desde%20${settings.business_name}`;
      window.open(url, '_blank');
    } else {
      toast.error("Primero configura el número de WhatsApp");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-stone-200">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
          <span className="text-zinc-700 font-medium">Cargando configuración...</span>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-stone-50/50 to-amber-50/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
          <h2 className="text-2xl font-bold text-zinc-800 mb-6 flex items-center gap-3">
            <Settings className="h-6 w-6 text-amber-600" />
            Configuración del Sistema
          </h2>

          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-zinc-400 mt-2">Gestiona la configuración general de tu tienda</p>
            </div>
            <Button
              onClick={saveSettings}
              disabled={saving || uploadingLogo}
              className="bg-brand-pink hover:bg-brand-pink/90"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 p-1 admin-tabs-list">
              <TabsTrigger value="general" className="admin-tab-trigger data-[state=active]:admin-tab-active">
                <Store className="w-4 h-4 mr-1.5 shrink-0" />
                General
              </TabsTrigger>
              <TabsTrigger value="apariencia" className="admin-tab-trigger data-[state=active]:admin-tab-active">
                <Palette className="w-4 h-4 mr-1.5 shrink-0" />
                Apariencia
              </TabsTrigger>
              <TabsTrigger value="contacto" className="admin-tab-trigger data-[state=active]:admin-tab-active">
                <MessageSquare className="w-4 h-4 mr-1.5 shrink-0" />
                Contacto
              </TabsTrigger>
              <TabsTrigger value="pagos" className="admin-tab-trigger data-[state=active]:admin-tab-active">
                <CreditCard className="w-4 h-4 mr-1.5 shrink-0" />
                Pagos
              </TabsTrigger>
              <TabsTrigger value="entrega" className="admin-tab-trigger data-[state=active]:admin-tab-active">
                <Clock className="w-4 h-4 mr-1.5 shrink-0" />
                Entrega
              </TabsTrigger>
              <TabsTrigger value="social" className="admin-tab-trigger data-[state=active]:admin-tab-active">
                <Globe className="w-4 h-4 mr-1.5 shrink-0" />
                Redes
              </TabsTrigger>
              <TabsTrigger value="avanzado" className="admin-tab-trigger data-[state=active]:admin-tab-active">
                <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" />
                Avanzado
              </TabsTrigger>
            </TabsList>

            <TabsContent value="apariencia" className="space-y-6">
              <Card className="admin-card">
                <CardHeader className="admin-card-header">
                  <CardTitle className="text-zinc-800 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-amber-600" />
                    Temas y Apariencia
                  </CardTitle>
                </CardHeader>
                <CardContent className="admin-card-content py-6">
                  <ThemeSwitcher />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración General */}
            <TabsContent value="general" className="space-y-6">
              <Card className="admin-card">
                <CardHeader className="admin-card-header">
                  <CardTitle className="text-zinc-800 flex items-center gap-2">
                    <Building className="h-5 w-5 text-amber-600" />
                    Información del Negocio
                  </CardTitle>
                </CardHeader>
                <CardContent className="admin-card-content space-y-4">
                  <div>
                    <Label htmlFor="business_name" className="admin-label">Nombre del Negocio *</Label>
                    <Input
                      id="business_name"
                      name="business_name"
                      value={settings.business_name}
                      onChange={(e) => handleInputChange('business_name', e.target.value)}
                      className="admin-input"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="currency" className="admin-label">Moneda</Label>
                    <Select value={settings.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                      <SelectTrigger className="admin-input">
                        <SelectValue placeholder="Selecciona una moneda" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-stone-200">
                        <SelectItem value="CLP">Peso Chileno (CLP)</SelectItem>
                        <SelectItem value="USD">Dólar Estadounidense (USD)</SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="ARS">Peso Argentino (ARS)</SelectItem>
                        <SelectItem value="MXN">Peso Mexicano (MXN)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="business_address" className="admin-label">Dirección del Negocio</Label>
                    <Textarea
                      id="business_address"
                      name="business_address"
                      value={settings.business_address}
                      onChange={(e) => handleInputChange('business_address', e.target.value)}
                      className="admin-input"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="language" className="admin-label">Idioma</Label>
                    <Select value={settings.language} onValueChange={(value) => handleInputChange('language', value)}>
                      <SelectTrigger className="admin-input">
                        <SelectValue placeholder="Selecciona un idioma" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-stone-200">
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="logo" className="admin-label">Logo del Negocio</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="admin-input"
                        disabled={uploadingLogo}
                      />
                      {uploadingLogo && <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />}
                    </div>
                    {logoPreview && (
                      <div className="mt-2">
                        <img src={logoPreview} alt="Logo actual" className="h-16 w-16 object-cover rounded border border-stone-200" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Información de Contacto */}
            <TabsContent value="contacto" className="space-y-6">
              <Card className="admin-card">
                <CardHeader className="admin-card-header">
                  <CardTitle className="text-zinc-800 flex items-center gap-2">
                    <Phone className="h-5 w-5 text-amber-600" />
                    Información de Contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="admin-card-content space-y-4">
                  <div>
                    <Label htmlFor="email" className="admin-label">Email de Contacto</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="admin-label">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={settings.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp_number" className="admin-label">Número de WhatsApp</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-600 text-sm">+56</span>
                      <Input
                        id="whatsapp_number"
                        name="whatsapp_number"
                        value={settings.whatsapp_number}
                        onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                        placeholder="912345678"
                        className="admin-input flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración de Pagos */}
            <TabsContent value="pagos" className="space-y-6">
              <Card className="admin-card">
                <CardHeader className="admin-card-header">
                  <CardTitle className="text-zinc-800 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-amber-600" />
                    Configuración de Pagos
                  </CardTitle>
                </CardHeader>
                <CardContent className="admin-card-content space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enable_online_payments"
                      checked={settings.enable_online_payments}
                      onCheckedChange={(checked) => handleInputChange('enable_online_payments', checked)}
                    />
                    <Label htmlFor="enable_online_payments" className="admin-label">
                      Habilitar pagos en línea
                    </Label>
                  </div>

                  {settings.enable_online_payments && (
                    <div className="space-y-4 border border-zinc-700 rounded-lg p-4">
                      <h4 className="text-white font-medium">Configuración de Mercado Pago</h4>

                      <div className="space-y-2">
                        <Label htmlFor="mercadopago_public_key" className="admin-label">Public Key</Label>
                        <Input
                          id="mercadopago_public_key"
                          value={settings.mercadopago_public_key}
                          onChange={(e) => handleInputChange('mercadopago_public_key', e.target.value)}
                          className="admin-input"
                          placeholder="TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mercadopago_access_token" className="admin-label">Access Token</Label>
                        <Input
                          id="mercadopago_access_token"
                          type="password"
                          value={settings.mercadopago_access_token}
                          onChange={(e) => handleInputChange('mercadopago_access_token', e.target.value)}
                          className="admin-input"
                          placeholder="TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        />
                      </div>

                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Obtén tus credenciales en el panel de desarrolladores de Mercado Pago.
                          Usa las credenciales de prueba para desarrollo y las de producción para el sitio en vivo.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_order_amount" className="admin-label">Monto mínimo de pedido</Label>
                      <Input
                        id="min_order_amount"
                        type="number"
                        value={settings.min_order_amount}
                        onChange={(e) => handleInputChange('min_order_amount', Number(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="delivery_fee" className="admin-label">Costo de entrega</Label>
                      <Input
                        id="delivery_fee"
                        type="number"
                        value={settings.delivery_fee}
                        onChange={(e) => handleInputChange('delivery_fee', Number(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="free_delivery_threshold" className="admin-label">Entrega gratis desde</Label>
                      <Input
                        id="free_delivery_threshold"
                        type="number"
                        value={settings.free_delivery_threshold}
                        onChange={(e) => handleInputChange('free_delivery_threshold', Number(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración de Entrega */}
            <TabsContent value="entrega" className="space-y-6">
              <Card className="admin-card">
                <CardHeader className="admin-card-header">
                  <CardTitle className="text-zinc-800 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    Configuración de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent className="admin-card-content space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="delivery_schedule_text" className="admin-label">Horarios de Entrega</Label>
                    <Textarea
                      id="delivery_schedule_text"
                      value={settings.delivery_schedule_text}
                      onChange={(e) => handleInputChange('delivery_schedule_text', e.target.value)}
                      className="admin-input"
                      rows={4}
                      placeholder="Lunes a Viernes: 9:00 AM - 6:00 PM&#10;Sábados: 9:00 AM - 2:00 PM&#10;Domingos: Cerrado"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Redes Sociales */}
            <TabsContent value="social" className="space-y-6">
              <Card className="admin-card">
                <CardHeader className="admin-card-header">
                  <CardTitle className="text-zinc-800 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-amber-600" />
                    Redes Sociales
                  </CardTitle>
                </CardHeader>
                <CardContent className="admin-card-content space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook_url" className="admin-label">Facebook</Label>
                      <Input
                        id="facebook_url"
                        value={settings.facebook_url}
                        onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                        className="admin-input"
                        placeholder="https://facebook.com/tu-pagina"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram_url" className="admin-label">Instagram</Label>
                      <Input
                        id="instagram_url"
                        value={settings.instagram_url}
                        onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                        className="admin-input"
                        placeholder="https://instagram.com/tu-cuenta"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter_url" className="admin-label">Twitter</Label>
                      <Input
                        id="twitter_url"
                        value={settings.twitter_url}
                        onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                        className="admin-input"
                        placeholder="https://twitter.com/tu-cuenta"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtube_url" className="admin-label">YouTube</Label>
                      <Input
                        id="youtube_url"
                        value={settings.youtube_url}
                        onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                        className="admin-input"
                        placeholder="https://youtube.com/tu-canal"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="footer_text" className="admin-label">Texto del Pie de Página</Label>
                    <Textarea
                      id="footer_text"
                      value={settings.footer_text}
                      onChange={(e) => handleInputChange('footer_text', e.target.value)}
                      className="admin-input"
                      rows={3}
                      placeholder="© 2024 Mi Negocio. Todos los derechos reservados."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Configuración Avanzada */}
            <TabsContent value="avanzado" className="space-y-6">
              <Card className="admin-card">
                <CardHeader className="admin-card-header">
                  <CardTitle className="text-zinc-800 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                    Configuración Avanzada
                  </CardTitle>
                </CardHeader>
                <CardContent className="admin-card-content space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="maintenance_mode"
                        checked={settings.maintenance_mode}
                        onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                      />
                      <Label htmlFor="maintenance_mode" className="admin-label">
                        Modo de mantenimiento
                      </Label>
                    </div>
                    {settings.maintenance_mode && (
                      <Alert className="border-yellow-600 bg-yellow-900/20">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-200">
                          El sitio web mostrará una página de mantenimiento a los visitantes.
                          Solo los administradores podrán acceder al sitio.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="allow_registration"
                        checked={settings.allow_registration}
                        onCheckedChange={(checked) => handleInputChange('allow_registration', checked)}
                      />
                      <Label htmlFor="allow_registration" className="admin-label">
                        Permitir registro de nuevos usuarios
                      </Label>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="admin-label">Zona Horaria</Label>
                      <Select value={settings.timezone} onValueChange={(value) => handleInputChange('timezone', value)}>
                        <SelectTrigger className="admin-input">
                          <SelectValue placeholder="Selecciona una zona horaria" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-stone-200">
                          <SelectItem value="America/Santiago">Santiago, Chile</SelectItem>
                          <SelectItem value="America/Buenos_Aires">Buenos Aires, Argentina</SelectItem>
                          <SelectItem value="America/Sao_Paulo">São Paulo, Brasil</SelectItem>
                          <SelectItem value="America/Mexico_City">Ciudad de México, México</SelectItem>
                          <SelectItem value="America/Lima">Lima, Perú</SelectItem>
                          <SelectItem value="America/Bogota">Bogotá, Colombia</SelectItem>
                          <SelectItem value="America/New_York">Nueva York, USA</SelectItem>
                          <SelectItem value="Europe/Madrid">Madrid, España</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 