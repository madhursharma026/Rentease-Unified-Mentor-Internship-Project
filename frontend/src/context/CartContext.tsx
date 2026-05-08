import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { CartItem, Product } from '../types';

type CartContextValue = {
  items: CartItem[];
  addItem: (product: Product, tenureMonths: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  totalMonthlyRent: number;
  totalDeposit: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const value = useMemo<CartContextValue>(() => {
    const totalMonthlyRent = items.reduce((sum, item) => sum + Number(item.product.monthlyRent) * item.quantity, 0);
    const totalDeposit = items.reduce((sum, item) => sum + Number(item.product.deposit) * item.quantity, 0);
    return {
      items,
      totalMonthlyRent,
      totalDeposit,
      addItem(product, tenureMonths) {
        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id && item.tenureMonths === tenureMonths);
          if (existing) {
            return current.map((item) =>
              item.product.id === product.id && item.tenureMonths === tenureMonths ? { ...item, quantity: item.quantity + 1 } : item
            );
          }
          return [...current, { product, quantity: 1, tenureMonths }];
        });
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.product.id !== productId));
      },
      clear() {
        setItems([]);
      }
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
