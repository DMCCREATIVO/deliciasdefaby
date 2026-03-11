import { OrderItem } from "../OrdersList";

interface OrderItemsListProps {
  items: OrderItem[];
}

export const OrderItemsList = ({ items }: OrderItemsListProps) => {
  return (
    <div className="space-y-1.5">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="flex justify-between items-center text-sm bg-zinc-800/30 rounded-md p-2 transition-colors hover:bg-zinc-800/50"
        >
          <div className="flex flex-col">
            <span className="text-zinc-300">{item.title}</span>
            <span className="text-xs text-zinc-500">${item.price.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
          </div>
          <span className="text-zinc-400 font-medium">x{item.quantity}</span>
        </div>
      ))}
    </div>
  );
};