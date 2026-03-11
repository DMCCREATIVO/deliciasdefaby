import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/database";
import { toast } from "sonner";
import { Loader2, CheckCircle, XCircle, Zap, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ActivarProductosPage() {
    const [processing, setProcessing] = useState(false);
    const queryClient = useQueryClient();

    const { data: products = [], isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: () => db.products.getAll(),
    });

    const updateMutation = useMutation({
        mutationFn: async ({ id, data }: { id: string; data: any }) => {
            return await db.products.update(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });

    const activarTodos = async () => {
        setProcessing(true);
        let activados = 0;
        let errores = 0;

        for (const producto of products) {
            if (!producto.is_active) {
                try {
                    await updateMutation.mutateAsync({
                        id: producto.id,
                        data: { is_active: true },
                    });
                    activados++;
                    toast.success(`✅ ${producto.title}`, { duration: 1000 });
                } catch (error: any) {
                    errores++;
                    toast.error(`❌ ${producto.title}: ${error.message}`, { duration: 2000 });
                }
            }
        }

        setProcessing(false);

        if (errores === 0) {
            toast.success(`🎉 ${activados} productos activados exitosamente!`);
        } else {
            toast.warning(`⚠️ ${activados} activados, ${errores} errores`);
        }
    };

    const destacarPrimeros = async () => {
        setProcessing(true);
        const primeros5 = products.slice(0, 5);
        let destacados = 0;

        for (const producto of primeros5) {
            try {
                await updateMutation.mutateAsync({
                    id: producto.id,
                    data: { is_active: true, is_featured: true },
                });
                destacados++;
                toast.success(`⭐ ${producto.title}`, { duration: 1000 });
            } catch (error: any) {
                toast.error(`❌ ${producto.title}: ${error.message}`);
            }
        }

        setProcessing(false);
        toast.success(`✨ ${destacados} productos destacados!`);
    };

    const stats = {
        total: products.length,
        activos: products.filter(p => p.is_active).length,
        inactivos: products.filter(p => !p.is_active).length,
        destacados: products.filter(p => p.is_featured).length,
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-zinc-200">🚀 Activar Productos</h1>
                <p className="text-zinc-400 mt-2">
                    Herramienta para activar productos masivamente y hacerlos visibles en el sitio web
                </p>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-zinc-800/50 border-zinc-700">
                    <div className="text-sm text-zinc-400">Total</div>
                    <div className="text-2xl font-bold text-white">{stats.total}</div>
                </Card>
                <Card className="p-4 bg-green-900/20 border-green-700/50">
                    <div className="text-sm text-green-400">Activos</div>
                    <div className="text-2xl font-bold text-green-400">{stats.activos}</div>
                </Card>
                <Card className="p-4 bg-red-900/20 border-red-700/50">
                    <div className="text-sm text-red-400">Inactivos</div>
                    <div className="text-2xl font-bold text-red-400">{stats.inactivos}</div>
                </Card>
                <Card className="p-4 bg-yellow-900/20 border-yellow-700/50">
                    <div className="text-sm text-yellow-400">Destacados</div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.destacados}</div>
                </Card>
            </div>

            {/* Acciones */}
            <Card className="p-6 bg-zinc-800/50 border-zinc-700">
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">Acciones Masivas</h2>
                <div className="flex flex-wrap gap-4">
                    <Button
                        onClick={activarTodos}
                        disabled={processing || isLoading || stats.inactivos === 0}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5 mr-2" />
                                Activar Todos ({stats.inactivos})
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={destacarPrimeros}
                        disabled={processing || isLoading}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        size="lg"
                    >
                        <Star className="w-5 h-5 mr-2" />
                        Destacar Primeros 5
                    </Button>
                </div>

                {stats.inactivos === 0 && (
                    <div className="mt-4 p-4 bg-green-900/20 border border-green-700/50 rounded-lg">
                        <p className="text-green-400 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            ¡Todos los productos ya están activos!
                        </p>
                    </div>
                )}
            </Card>

            {/* Lista de productos */}
            <Card className="p-6 bg-zinc-800/50 border-zinc-700">
                <h2 className="text-xl font-semibold text-zinc-200 mb-4">
                    Lista de Productos ({products.length})
                </h2>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                    </div>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-700/50 hover:border-zinc-600 transition-colors"
                            >
                                <div className="flex items-center gap-3 flex-1">
                                    <div>
                                        {product.is_active ? (
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        )}
                                    </div>
                                    {product.is_featured && (
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    )}
                                    <div className="flex-1">
                                        <div className="font-medium text-zinc-200">{product.title}</div>
                                        <div className="text-sm text-zinc-400">
                                            ${product.price.toLocaleString('es-CL')} • Stock: {product.stock}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Badge
                                        variant={product.is_active ? "default" : "secondary"}
                                        className={product.is_active ? "bg-green-600" : ""}
                                    >
                                        {product.is_active ? "Activo" : "Inactivo"}
                                    </Badge>
                                    {product.is_featured && (
                                        <Badge variant="default" className="bg-yellow-600">
                                            Destacado
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Instrucciones */}
            <Card className="p-6 bg-blue-900/20 border-blue-700/50">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">
                    💡 Instrucciones
                </h3>
                <ul className="space-y-2 text-sm text-blue-300">
                    <li>• <strong>Activar Todos:</strong> Activa todos los productos inactivos para que sean visibles en el sitio web</li>
                    <li>• <strong>Destacar Primeros 5:</strong> Marca los primeros 5 productos como destacados (aparecen primero en la página principal)</li>
                    <li>• Los productos activos aparecerán automáticamente en la sección "Productos" del sitio</li>
                    <li>• Los productos destacados aparecen en la sección "Productos Destacados"</li>
                </ul>
            </Card>
        </div>
    );
}
