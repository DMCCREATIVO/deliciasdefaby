export interface Collections {
  users: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'customer';
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
    };
  };
  
  products: {
    id: string;
    title: string;
    description?: string;
    price: number;
    category: string;
    stock?: number;
    imageUrl?: string;
    isActive: boolean;
  };
  
  orders: {
    id: string;
    user: string;
    items: Array<{
      productId: string;
      quantity: number;
      price: number;
    }>;
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    paymentMethod: 'cash' | 'mercadopago';
  };
  
  settings: {
    id: string;
    currency: 'CLP' | 'USD' | 'EUR' | 'BRL' | 'ARS' | 'MXN' | 'COP' | 'PEN';
    language: 'es' | 'en' | 'pt';
    businessName: string;
    whatsappNumber?: string;
    enableOnlinePayments: boolean;
  };
}