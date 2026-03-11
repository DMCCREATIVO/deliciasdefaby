import { LoginForm } from "@/components/auth/LoginForm";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative bg-gradient-to-b from-zinc-900 to-zinc-950">
        <Link 
          to="/" 
          className="fixed top-4 sm:top-6 left-4 sm:left-6 text-zinc-400 hover:text-brand-pink transition-colors z-10"
        >
          <Button variant="ghost" className="gap-2 hover:bg-zinc-800/50">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
        </Link>

        <div className="w-full max-w-md bg-gradient-to-br from-zinc-900/95 via-zinc-900/98 to-zinc-900/95 backdrop-blur-xl rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl border border-zinc-800/50 hover:border-brand-pink/20 transition-all duration-500 p-4 sm:p-6 animate-fade-up">
          <div className="text-center">
            <img
              src="/lovable-uploads/21476c6b-a753-42d1-84c3-b408581648c1.png"
              alt="Logo"
              className="mx-auto h-16 sm:h-20 w-auto mb-4 sm:mb-6 animate-fade-up"
            />
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-brand-pink via-white to-brand-beige bg-clip-text text-transparent">
              Iniciar Sesión
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white">
              Bienvenido de vuelta a nuestra panadería
            </p>
          </div>

          <LoginForm />

          <div className="text-center mt-4">
            <p className="text-sm sm:text-base text-white">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-brand-pink hover:text-brand-pink/80 font-medium transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;