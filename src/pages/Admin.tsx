import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AdminPanel } from "@/components/AdminPanel";
import { Spinner } from '@/components/ui/spinner'

const Dashboard = lazy(() => import('./admin/dashboard'))
const Productos = lazy(() => import('./admin/productos'))
const ActivarProductos = lazy(() => import('./admin/activar-productos'))
const Pedidos = lazy(() => import('./admin/pedidos'))
const Testimonios = lazy(() => import('./admin/testimonios'))
const Categorias = lazy(() => import('./admin/Categorias'))
const Blog = lazy(() => import('./admin/blog'))
const BlogForm = lazy(() => import('./admin/blog/BlogForm'))
const Configuracion = lazy(() => import('./admin/Configuracion'))
const Clientes = lazy(() => import('./admin/Clientes'))
const Horarios = lazy(() => import('./admin/Horarios'))
const Colores = lazy(() => import('./admin/apariencia/Colores'))
const Estadisticas = lazy(() => import('./admin/Estadisticas'))

const Admin = () => {
  return (
    <div className="admin-page min-h-screen w-full flex">
      {/* Menú lateral */}
      <div className="h-screen flex-shrink-0">
        <AdminPanel />
      </div>
      {/* Contenido principal */}
      <main className="flex-1 h-screen overflow-y-auto admin-main-content">
        <div className="p-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-4">
                <Spinner className="w-8 h-8 text-amber-600" />
                <p className="text-sm text-zinc-600 font-medium">Cargando...</p>
              </div>
            </div>
          }>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="productos/*" element={<Productos />} />
              <Route path="activar-productos" element={<ActivarProductos />} />
              <Route path="pedidos/*" element={<Pedidos />} />
              <Route path="testimonios/*" element={<Testimonios />} />
              <Route path="categorias/*" element={<Categorias />} />
              <Route path="blog/*" element={<Blog />} />
              <Route path="configuracion/*" element={<Configuracion />} />
              <Route path="clientes/*" element={<Clientes />} />
              <Route path="horarios/*" element={<Horarios />} />
              <Route path="apariencia/colores" element={<Colores />} />
              <Route path="estadisticas/*" element={<Estadisticas />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default Admin;