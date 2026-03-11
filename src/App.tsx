import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "@/pages/index.tsx";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Admin from "@/pages/Admin";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import Contact from "@/pages/Contact";
import Favorites from "@/pages/Favorites";
import BlogPage from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import AboutUs from "@/pages/AboutUs";
import { AuthProvider } from "@/context/AuthContext";
import { SystemProvider } from "@/context/SystemContext";
import { CartProvider } from "@/context/CartContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Layout } from "@/components/Layout";
import BlogTestAdminPage from "@/pages/admin/BlogTest";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SystemProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <Layout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/productos" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin/*" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
                  <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/pedidos" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="/contacto" element={<Contact />} />
                  <Route path="/favoritos" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/quienes-somos" element={<AboutUs />} />
                  <Route path="/admin/blog-test" element={<BlogTestAdminPage />} />
                </Routes>
              </Layout>
            </Router>
            <Toaster />
            <Sonner />
          </CartProvider>
        </AuthProvider>
      </SystemProvider>
    </QueryClientProvider>
  );
}

export default App;