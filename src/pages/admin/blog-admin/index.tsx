import React from 'react';
import BlogTestAdminPage from '../BlogTest';

/**
 * Componente para la gestión del blog en el panel de administración
 * Este componente integra el AdminLayout para incluir el menú vertical
 * y renderiza el BlogTestAdminPage dentro de este layout.
 */
export default function BlogAdmin() {
  console.log("Renderizando página de admin blog desde blog-admin/index.tsx");
  
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-8 grid grid-cols-1 gap-6">
      <BlogTestAdminPage />
    </div>
  );
}
