import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { pb } from "@/lib/pocketbase/client";
import { useAuth } from "@/context/AuthContext";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("🔐 Iniciando login con PocketBase:", formData.email);

      // Autenticar con PocketBase usando la colección users
      const authData = await pb.collection('users').authWithPassword(
        formData.email,
        formData.password
      );

      if (!authData.record) {
        throw new Error('No se recibieron datos del usuario');
      }

      const isAdmin = authData.record.role === 'admin';

      login({
        id: authData.record.id,
        isAdmin,
        email: authData.record.email,
        name: authData.record.name || authData.record.email?.split('@')[0] || '',
      });

      toast.success("¡Bienvenido de vuelta! 👋");

      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      console.error('Error de login:', error);

      let errorMessage = "Error al iniciar sesión";

      if (error.status === 400 || error.message?.includes('Failed to authenticate')) {
        errorMessage = "Email o contraseña incorrectos.";
      } else if (error.message?.includes('email')) {
        errorMessage = "Por favor ingresa un email válido.";
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
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>

        <div>
          <Label htmlFor="password" className="text-white">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-brand-pink hover:bg-brand-pink-dark"
        disabled={isLoading}
      >
        {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </Button>
    </form>
  );
};