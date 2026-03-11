import { Button } from "@/components/ui/button";

interface ProductFormActionsProps {
  isLoading: boolean;
  isEditing: boolean;
  onClose: () => void;
}

export const ProductFormActions = ({
  isLoading,
  isEditing,
  onClose,
}: ProductFormActionsProps) => {
  return (
    <div className="flex justify-end space-x-4 pt-4 border-t border-zinc-700">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
        disabled={isLoading}
      >
        Cancelar
      </Button>
      <Button 
        type="submit" 
        className="bg-orange-500 hover:bg-orange-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Producto"}
      </Button>
    </div>
  );
};