import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

interface CustomerInfoFormProps {
  onSubmit: (info: CustomerInfo) => void;
  onCancel: () => void;
  initialValues?: CustomerInfo;
}

export const CustomerInfoForm = ({ onSubmit, onCancel, initialValues }: CustomerInfoFormProps) => {
  const [info, setInfo] = useState<CustomerInfo>(initialValues || {
    name: "",
    phone: "",
    address: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!info.name || !info.phone || !info.address) {
      toast.error("Por favor complete todos los campos");
      return;
    }
    onSubmit(info);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
          Nombre Completo
        </label>
        <Input
          id="name"
          value={info.name}
          onChange={(e) => setInfo({ ...info, name: e.target.value })}
          className="bg-zinc-800 border-zinc-700 text-white"
          placeholder="Tu nombre completo"
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">
          Teléfono
        </label>
        <Input
          id="phone"
          value={info.phone}
          onChange={(e) => setInfo({ ...info, phone: e.target.value })}
          className="bg-zinc-800 border-zinc-700 text-white"
          placeholder="Tu número de teléfono"
          type="tel"
        />
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-200 mb-1">
          Dirección de Entrega
        </label>
        <Input
          id="address"
          value={info.address}
          onChange={(e) => setInfo({ ...info, address: e.target.value })}
          className="bg-zinc-800 border-zinc-700 text-white"
          placeholder="Tu dirección completa"
        />
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
        >
          Confirmar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};