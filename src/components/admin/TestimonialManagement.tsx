import { useState, useEffect, Suspense } from "react";
import { testimonialService } from "@/lib/database/index";
import type { Testimonial } from "@/lib/database/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, RefreshCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    loadTestimonials();
  }, [currentPage]);

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await testimonialService.getAllAdmin(currentPage, pageSize);
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error loading testimonials:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los testimonios',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await testimonialService.updateStatus(id, status);

      setTestimonials(testimonials.map(t =>
        t.id === id ? { ...t, status } : t
      ));

      toast({
        title: 'Éxito',
        description: `Testimonio ${status === 'approved' ? 'aprobado' : 'rechazado'} correctamente`,
      });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el estado del testimonio',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pendiente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Rechazado</Badge>;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-pink border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-brand-pink border-t-transparent"></div>
      </div>
    }>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-zinc-800">Testimonios</h2>
            <Badge variant="outline" className="bg-zinc-100">
              {testimonials.length}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadTestimonials}
              variant="outline"
              size="sm"
              className="text-zinc-600 hover:text-zinc-900"
            >
              <RefreshCcw className="w-4 h-4 mr-1" />
              Actualizar
            </Button>
            <div className="flex gap-1">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                variant="outline"
                size="sm"
                disabled={currentPage === 0}
              >
                Anterior
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => prev + 1)}
                variant="outline"
                size="sm"
                disabled={testimonials.length < pageSize}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50">
                <TableHead className="font-medium">Usuario</TableHead>
                <TableHead className="font-medium">Comentario</TableHead>
                <TableHead className="font-medium">Calificación</TableHead>
                <TableHead className="font-medium">Estado</TableHead>
                <TableHead className="font-medium">Fecha</TableHead>
                <TableHead className="font-medium text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testimonials.map((testimonial) => (
                <TableRow key={testimonial.id} className="hover:bg-zinc-50/50">
                  <TableCell className="py-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={testimonial.avatar} loading="lazy" />
                        <AvatarFallback className="text-xs bg-zinc-100">{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-zinc-900">{testimonial.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md py-2">
                    <p className="text-sm text-zinc-600 truncate">{testimonial.comment}</p>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex gap-0.5 text-yellow-400">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    {getStatusBadge(testimonial.status)}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-600 py-2">
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right py-2">
                    {testimonial.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => updateTestimonialStatus(testimonial.id, 'approved')}
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white h-8"
                        >
                          Aprobar
                        </Button>
                        <Button
                          onClick={() => updateTestimonialStatus(testimonial.id, 'rejected')}
                          size="sm"
                          variant="destructive"
                          className="h-8"
                        >
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Suspense>
  );
};

export default TestimonialManagement; 