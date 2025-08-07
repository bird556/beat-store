// src/contexts/cart-context.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

export interface CartItem {
  id: string;
  title: string;
  artist: string;
  price: number;
  license: string;
  image: string;
  key: string;
  bpm: number;
  duration: string;
  audioUrl: string;
  dateAdded: string;
  licenses: object[];
  s3_mp3_url: string;
  s3_image_url: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  // const addToCart = (item: CartItem) => {
  //   // setItems((prev) => [...prev, { ...item, id: `${item.id}-${Date.now()}` }]);
  //   setItems((prev) => [...prev, { ...item, id: item.id }]);
  // };

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => (i.id === item.id ? item : i));
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.length;

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  // 🧠 Load cart items from localStorage on initial render
  useEffect(() => {
    const stored = localStorage.getItem('cartItems');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      } catch (e) {
        console.error(e);
      }
    }
    setHydrated(true);
  }, []);

  // 💾 Save cart items to localStorage whenever items change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('cartItems', JSON.stringify(items));
      // console.log('Saving to localStorage:', items);
    }
  }, [items, hydrated]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
