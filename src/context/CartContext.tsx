import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface CartItem {
  id: string | number;
  title: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (id: string | number, title: string, price: number) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((id: string | number, title: string, price: number) => {
    console.log('CartContext: Adding to cart:', { id, title, price });
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === id);
      const newItems = existingItem
        ? currentItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...currentItems, { id, title, price, quantity: 1 }];
      
      console.log('CartContext: New cart state:', newItems);
      return newItems;
    });
  }, []);

  const removeFromCart = useCallback((id: string | number) => {
    console.log('CartContext: Removing from cart:', id);
    setItems(currentItems => {
      const newItems = currentItems.filter(item => item.id !== id);
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((id: string | number, quantity: number) => {
    console.log('CartContext: Updating quantity:', { id, quantity });
    setItems(currentItems => {
      const newItems = quantity <= 0
        ? currentItems.filter(item => item.id !== id)
        : currentItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          );
      
      console.log('CartContext: New cart state after quantity update:', newItems);
      return newItems;
    });
  }, []);

  const clearCart = useCallback(() => {
    console.log('CartContext: Clearing cart');
    setItems([]);
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart,
        total, 
        itemCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};