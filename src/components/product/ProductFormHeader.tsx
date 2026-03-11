import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProductFormHeaderProps {
  isEditing: boolean;
  isActive: boolean;
  onActiveChange: (checked: boolean) => void;
}

export const ProductFormHeader = ({
  isEditing,
  isActive,
  onActiveChange,
}: ProductFormHeaderProps) => {
  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4">
        {isEditing ? "Editar Producto" : "Nuevo Producto"}
      </h3>
      <div className="flex items-center justify-between bg-zinc-800 p-4 rounded-lg border border-zinc-700">
        <Label htmlFor="is_active" className="text-white font-medium">Estado del Producto</Label>
        <Switch
          id="is_active"
          checked={isActive}
          onCheckedChange={onActiveChange}
          className="data-[state=checked]:bg-orange-500"
        />
      </div>
    </div>
  );
};