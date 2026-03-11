import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { pb } from "@/lib/pocketbase/client";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      console.log('📝 Registrando usuario en PocketBase:', formData.email);

      // Registrar usuario en PocketBase
      await pb.collection('users').create({
        email: formData.email,
        name: formData.name,
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
        role: 'customer',
        emailVisibility: true,
      });

      console.log('✅ Usuario registrado exitosamente');
      toast.success("¡Cuenta creada! Ya puedes iniciar sesión.");
      navigate("/login");
    } catch (error: any) {
      console.error('Error en el registro:', error);

      let errorMessage = "Error al registrar usuario";

      if (error.status === 400) {
        const data = error.data?.data || {};
        if (data.email?.code === 'validation_not_unique') {
          errorMessage = "Este email ya está registrado.";
        } else if (data.password) {
          errorMessage = "La contraseña no cumple los requisitos mínimos.";
        } else {
          errorMessage = error.message || errorMessage;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-white/90">Nombre completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-zinc-800/50 border-zinc-700/50 text-white focus:border-brand-pink/50 focus:ring-brand-pink/10 transition-colors"
            required
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-white/90">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-zinc-800/50 border-zinc-700/50 text-white focus:border-brand-pink/50 focus:ring-brand-pink/10 transition-colors"
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-white/90">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-zinc-800/50 border-zinc-700/50 text-white focus:border-brand-pink/50 focus:ring-brand-pink/10 transition-colors"
            required
            minLength={8}
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-white/90">Confirmar Contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="bg-zinc-800/50 border-zinc-700/50 text-white focus:border-brand-pink/50 focus:ring-brand-pink/10 transition-colors"
            required
            minLength={8}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-brand-pink hover:bg-brand-pink/90 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Registrando...
          </div>
        ) : (
          "Registrarse"
        )}
      </Button>
    </form>
  );
};