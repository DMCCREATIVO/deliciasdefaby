import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageSquare } from "lucide-react";

interface OrderCustomerInfoProps {
  name: string;
  email: string;
  phone: string;
  onContact: (type: 'phone' | 'email' | 'whatsapp', contact: string) => void;
}

export const OrderCustomerInfo = ({ 
  name, 
  email, 
  phone, 
  onContact 
}: OrderCustomerInfoProps) => {
  return (
    <div className="space-y-2">
      <div className="text-zinc-200 font-medium">{name}</div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full bg-zinc-800/50 hover:bg-zinc-800 hover:text-primary transition-colors"
          onClick={() => onContact('phone', phone)}
        >
          <Phone className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full bg-zinc-800/50 hover:bg-zinc-800 hover:text-primary transition-colors"
          onClick={() => onContact('email', email)}
        >
          <Mail className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 rounded-full bg-zinc-800/50 hover:bg-green-500/20 hover:text-green-400 transition-colors"
          onClick={() => onContact('whatsapp', phone)}
        >
          <MessageSquare className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};