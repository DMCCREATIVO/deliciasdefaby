import React, { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ImagePlus, X, Loader2, Package,
  DollarSign, Package2, Image, Link, Upload, Star
} from 'lucide-react'
import { categoryService } from '@/lib/database/index'
import { toast } from 'sonner'
import { productSchema, type ProductFormValues } from "@/lib/validations/product";

interface ProductFormProps {
  product?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface GalleryItem {
  preview: string;   // URL para mostrar (blob o real)
  file?: File;       // Si es archivo nuevo
  isExisting?: boolean; // Si ya está en la BD
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [imageMode, setImageMode] = useState<'url' | 'upload'>(
    product?.image_url && !product.image_url.startsWith('blob') ? 'url' : 'upload'
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(product?.image_url || '')

  // Galería
  const [gallery, setGallery] = useState<GalleryItem[]>(
    Array.isArray(product?.images)
      ? product.images.filter(Boolean).map((url: string) => ({ preview: url, isExisting: true }))
      : []
  )

  const [isSaving, setIsSaving] = useState(false)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || '',
      short_description: product?.short_description || '',
      description: product?.description || '',
      price: product?.price || 0,
      stock: product?.stock || 0,
      weight: product?.weight || '',
      image_url: product?.image_url || '',
      category_id: product?.category_id || '',
      is_active: product?.is_active ?? true,
      is_featured: product?.is_featured ?? false,
      gallery: [],
    },
  })

  const { data: categories, isLoading: isLoadingCategories, error } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  })

  // Manejo de imagen principal (archivo)
  const handleMainFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('La imagen supera 5MB'); return }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    form.setValue('image_url', '') // limpiar URL manual
  }, [form])

  // Manejo de URL manual
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    form.setValue('image_url', url)
    setImagePreview(url)
    setImageFile(null)
  }

  const removeMainImage = () => {
    setImageFile(null)
    setImagePreview('')
    form.setValue('image_url', '')
  }

  // Galería — agregar múltiples archivos
  const handleGalleryFiles = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const oversized = files.filter(f => f.size > 5 * 1024 * 1024)
    if (oversized.length > 0) { toast.error('Algunas imágenes superan 5MB y fueron ignoradas') }
    const valid = files.filter(f => f.size <= 5 * 1024 * 1024)
    const newItems: GalleryItem[] = valid.map(file => ({
      preview: URL.createObjectURL(file),
      file,
      isExisting: false,
    }))
    setGallery(prev => [...prev, ...newItems])
    e.target.value = '' // reset input
  }, [])

  const removeGalleryItem = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (data: ProductFormValues) => {
    if (!data.title?.trim()) { toast.error('El nombre es obligatorio'); return }
    if (!data.price || data.price <= 0) { toast.error('El precio debe ser mayor a 0'); return }
    if (!data.category_id?.trim()) { toast.error('Selecciona una categoría'); return }

    setIsSaving(true)
    try {
      const galleryFiles = gallery.filter(g => g.file instanceof File).map(g => g.file as File)

      const payload = {
        title: data.title.trim(),
        description: data.description || '',
        short_description: data.short_description || '',
        price: Number(data.price),
        stock: Number(data.stock) || 0,
        weight: data.weight || '',
        category_id: data.category_id,
        is_active: data.is_active ?? true,
        is_featured: data.is_featured ?? false,
        image_url: imageFile ? '' : (data.image_url || ''), // si hay archivo, PocketBase generará la URL
        slug: product?.slug || undefined,        // preservar slug al editar; se genera automáticamente al crear
        _imageFile: imageFile || undefined,      // archivo imagen principal
        _galleryFiles: galleryFiles,             // archivos galería
      }

      await onSubmit(payload)
    } catch (err: any) {
      toast.error(`Error: ${err.message || 'Desconocido'}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (error) {
    return (
      <Card className="p-6 bg-white mx-auto max-w-md">
        <div className="text-center space-y-4">
          <div className="p-3 bg-red-100 rounded-full mx-auto w-fit">
            <Package className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Error de Conexión</h3>
          <p className="text-red-600 text-sm">No se pudieron cargar las categorías</p>
          <Button variant="outline" onClick={onCancel} className="w-full">Volver</Button>
        </div>
      </Card>
    )
  }

  const isSubmitting = isSaving || form.formState.isSubmitting

  return (
    <div className="w-full bg-white h-full flex flex-col overflow-hidden">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 mb-4 flex-shrink-0 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {product ? "Editar Producto" : "Nuevo Producto"}
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm">
                  {product ? "Modifica los datos del producto" : "Completa la información del nuevo producto"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Estado:</span>
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Badge variant={form.watch('is_active') ? 'default' : 'secondary'} className="text-xs">
                {form.watch('is_active') ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0 px-1">
            <div className="space-y-6 pb-6">

              {/* ── Información Básica ── */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Package2 className="h-5 w-5 text-orange-500" />
                  <h3 className="text-base font-semibold text-gray-800">Información Básica</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <FormField control={form.control} name="title" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-medium">Nombre *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Torta de Chocolate" className="text-sm border-gray-300 focus:border-orange-500" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="category_id" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-medium">Categoría *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="text-sm border-gray-300 focus:border-orange-500">
                            <SelectValue placeholder="Seleccionar..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {isLoadingCategories
                            ? <div className="p-3 flex gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-sm">Cargando...</span></div>
                            : categories?.map(cat => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="short_description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-medium">Descripción Corta</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Breve descripción para las tarjetas..." className="text-sm border-gray-300 min-h-[70px] resize-none" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 text-sm font-medium">Descripción Completa</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ingredientes, presentación, detalles..." className="text-sm border-gray-300 min-h-[100px] resize-none" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )} />
              </section>

              <Separator />

              {/* ── Precio e Inventario ── */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-orange-500" />
                  <h3 className="text-base font-semibold text-gray-800">Precio e Inventario</h3>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-medium">Precio ($) *</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" min="0" placeholder="0" className="text-sm border-gray-300" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="stock" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 text-sm font-medium">Stock</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" placeholder="0" className="text-sm border-gray-300" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="weight" render={({ field }) => (
                    <FormItem className="col-span-2 lg:col-span-1">
                      <FormLabel className="text-gray-700 text-sm font-medium">Peso</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 500g, 1kg" className="text-sm border-gray-300" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="is_featured" render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border border-gray-200 p-4 bg-amber-50">
                    <div>
                      <FormLabel className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500" /> Producto Destacado
                      </FormLabel>
                      <p className="text-xs text-gray-500 mt-0.5">Aparece en la página principal</p>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )} />
              </section>

              <Separator />

              {/* ── Imagen Principal ── */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Image className="h-5 w-5 text-orange-500" />
                  <h3 className="text-base font-semibold text-gray-800">Imagen Principal</h3>
                </div>

                {/* Toggle URL / Archivo */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
                  <button type="button" onClick={() => { setImageMode('url'); setImageFile(null) }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${imageMode === 'url' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Link className="w-3.5 h-3.5" /> Pegar URL
                  </button>
                  <button type="button" onClick={() => { setImageMode('upload'); form.setValue('image_url', '') }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${imageMode === 'upload' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Upload className="w-3.5 h-3.5" /> Subir Archivo
                  </button>
                </div>

                {imageMode === 'url' ? (
                  <div>
                    <Label className="text-sm text-gray-700 font-medium mb-1.5 block">URL de imagen</Label>
                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                      value={form.watch('image_url') || ''}
                      onChange={handleUrlChange}
                      className="text-sm border-gray-300 focus:border-orange-400"
                    />
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-colors">
                    <ImagePlus className="w-7 h-7 text-gray-400 mb-1.5" />
                    <p className="text-sm text-gray-500">{imageFile ? imageFile.name : 'Haz clic o arrastra una imagen'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG, WebP · máx. 5MB</p>
                    <input type="file" className="hidden" accept="image/*" onChange={handleMainFileChange} />
                  </label>
                )}

                {/* Preview imagen principal */}
                {imagePreview && (
                  <div className="relative w-32 h-32 group rounded-xl overflow-hidden border-2 border-orange-200 shadow-sm">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                    <button type="button" onClick={removeMainImage}
                      className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 left-1.5 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      PRINCIPAL
                    </div>
                  </div>
                )}
              </section>

              <Separator />

              {/* ── Galería de Imágenes ── */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImagePlus className="h-5 w-5 text-orange-500" />
                    <h3 className="text-base font-semibold text-gray-800">Galería</h3>
                    {gallery.length > 0 && (
                      <Badge variant="secondary" className="text-xs">{gallery.length} foto{gallery.length !== 1 ? 's' : ''}</Badge>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500">Agrega más imágenes para mostrar distintos ángulos o presentaciones del producto.</p>

                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                  {/* Imágenes existentes */}
                  {gallery.map((item, i) => (
                    <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                      <img src={item.preview} alt={`Galería ${i + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                      <button type="button" onClick={() => removeGalleryItem(i)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                        <X className="w-3 h-3" />
                      </button>
                      {item.file && (
                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full">
                          NUEVO
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Botón agregar */}
                  <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-colors">
                    <ImagePlus className="w-6 h-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-400 text-center">Agregar</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryFiles} />
                  </label>
                </div>
              </section>

            </div>
          </ScrollArea>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 bg-white flex-shrink-0 mt-4">
            <Button type="button" variant="outline" onClick={onCancel}
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 order-2 sm:order-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoadingCategories}
              className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-semibold shadow-md order-1 sm:order-2 min-w-[140px]">
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{product ? 'Guardando...' : 'Creando...'}</>
              ) : (
                <>{product ? 'Guardar Cambios' : 'Crear Producto'}</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}