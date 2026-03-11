import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Pencil, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { blogService } from "@/services/blogService";

// Posts de ejemplo fijos que siempre se mostrarán
const POSTS = [
  {
    id: '1',
    title: 'Primer post de ejemplo',
    slug: 'primer-post-de-ejemplo',
    is_published: true,
    created_at: '2025-05-07T01:31:12.783441+00:00'
  },
  {
    id: '2',
    title: 'Segundo post de ejemplo',
    slug: 'segundo-post-de-ejemplo',
    is_published: true,
    created_at: '2025-05-07T01:31:12.783441+00:00'
  },
  {
    id: '3',
    title: 'Tercer post de ejemplo (Borrador)',
    slug: 'tercer-post-de-ejemplo',
    is_published: false,
    created_at: '2025-05-10T04:01:08.425601+00:00'
  }
];

export default function BlogList() {
  console.log("🚀 Renderizando BlogList Simple");
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  // Filtrar posts según búsqueda
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  // Cargar posts cuando se monte el componente
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Usar el método seguro para obtener todos los posts
        const posts = await blogService.getAllPostsSecure();
        setPosts(posts);
      } catch (error) {
        console.error('Error al cargar posts:', error);
        toast.error('No se pudieron cargar los posts');
        // Intentar método alternativo si falla el primero
        try {
          const fallbackPosts = await blogService.getAllAdmin();
          setPosts(fallbackPosts);
          if (fallbackPosts.length > 0) {
            toast.info('Posts cargados con método alternativo');
          }
        } catch (fallbackError) {
          console.error('Error en método alternativo:', fallbackError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [refresh]);

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 shadow-xl">
      <CardHeader className="border-b border-zinc-800 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-white">
            Administrar Blog (Versión Simple)
          </CardTitle>
          <Button onClick={() => navigate("/admin/blog/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Post
          </Button>
        </div>
        <CardDescription className="text-zinc-400">
          Gestiona tus posts en un solo lugar.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-zinc-800 border-zinc-700"
            />
          </div>
        </div>
        
        <Table>
          <TableHeader className="bg-zinc-800/50">
            <TableRow className="hover:bg-zinc-800/70 border-zinc-700">
              <TableHead className="w-[40%] text-zinc-300">Título</TableHead>
              <TableHead className="w-[15%] text-zinc-300">Estado</TableHead>
              <TableHead className="w-[15%] text-zinc-300">Fecha</TableHead>
              <TableHead className="w-[30%] text-zinc-300 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No se encontraron posts
                  {searchTerm && (
                    <div className="mt-2">
                      <Button variant="outline" onClick={() => setSearchTerm("")} size="sm">
                        Limpiar búsqueda
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-zinc-800/30 border-zinc-800">
                  <TableCell className="font-medium">
                    {post.title}
                  </TableCell>
                  <TableCell>
                    {post.is_published ? (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-500">Publicado</Badge>
                    ) : (
                      <Badge variant="outline">Borrador</Badge>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(post.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/blog/${post.slug}`)}
                        title="Ver"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                        title="Editar"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => alert(`Post "${post.title}" eliminado (simulación)`)}
                        title="Eliminar"
                        className="hover:text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      
      <CardFooter className="border-t border-zinc-800 pt-4 flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {filteredPosts.length} posts encontrados
        </span>
        <Button variant="outline" onClick={() => console.log("Actualizando...")}>
          Actualizar
        </Button>
      </CardFooter>
    </Card>
  );
}