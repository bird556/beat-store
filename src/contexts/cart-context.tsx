// src/contexts/cart-context.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import toast from 'react-hot-toast';
import type { Track } from '../types';
import { useTheme } from './theme-provider';
interface CartItem extends Track {
  license: string;
  effectivePrice: number; // Added to store price after BOGO
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  // totalPrice: number;
  originalTotal: number; // Added for original sum before discounts
  bogoDiscount: number; // Added for BOGO discount amount
  totalPrice: number; // Now represents total after BOGO
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [originalTotal, setOriginalTotal] = useState(0); // Added
  const [bogoDiscount, setBogoDiscount] = useState(0); // Added
  const [totalPrice, setTotalPrice] = useState(0); // Added

  const { theme } = useTheme();

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => (i.id === item.id ? item : i));
      }
      // return [...prev, item];
      return [...prev, { ...item, effectivePrice: item.price }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.error('Beat removed from cart.', {
      style: {
        background: theme === 'dark' ? '#333' : '#fff',
        color: theme === 'dark' ? '#fff' : '#333',
      },
    });
  };

  const clearCart = () => {
    setItems([]);
    // toast.error('Cart cleared.', {
    //   style: {
    //     background: theme === 'dark' ? '#333' : '#fff',
    //     color: theme === 'dark' ? '#fff' : '#333',
    //   },
    // });
  };

  const totalItems = items.length;

  // const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  // // Added: Compute originalTotal, bogoDiscount, and totalPrice whenever items change
  // useEffect(() => {
  //   const sum = items.reduce((acc, item) => acc + item.price, 0);

  //   // Compute BOGO: Group by license (exclude Exclusive), sort prices ascending, free the cheapest floor(count/2)
  //   const groups: { [key: string]: number[] } = {};
  //   items.forEach((item) => {
  //     if (item.license === 'Exclusive') return;
  //     if (!groups[item.license]) groups[item.license] = [];
  //     groups[item.license].push(item.price);
  //   });

  //   let discount = 0;
  //   Object.values(groups).forEach((prices) => {
  //     if (prices.length < 2) return;
  //     const sorted = [...prices].sort((a, b) => a - b);
  //     const free = Math.floor(sorted.length / 2);
  //     for (let i = 0; i < free; i++) {
  //       discount += sorted[i];
  //     }
  //   });

  //   setOriginalTotal(sum);
  //   setBogoDiscount(discount);
  //   setTotalPrice(sum - discount);
  // }, [items]);

  // Compute originalTotal, bogoDiscount, totalPrice, and effectivePrice per item
  useEffect(() => {
    const sum = items.reduce((acc, item) => acc + item.price, 0);

    // Compute BOGO: Group by license (exclude Exclusive), sort prices ascending, free the cheapest floor(count/2)
    const groups: { [key: string]: CartItem[] } = {};
    items.forEach((item) => {
      if (item.license === 'Exclusive') return;
      if (!groups[item.license]) groups[item.license] = [];
      groups[item.license].push(item);
    });

    // Create a new items array with effectivePrice
    const updatedItems = [...items];
    Object.values(groups).forEach((groupItems) => {
      if (groupItems.length < 2) return;
      // Sort items by price ascending
      groupItems.sort((a, b) => a.price - b.price);
      const freeCount = Math.floor(groupItems.length / 2);
      groupItems.forEach((item, index) => {
        const itemIndex = updatedItems.findIndex((i) => i.id === item.id);
        if (itemIndex !== -1) {
          updatedItems[itemIndex].effectivePrice =
            index < freeCount ? 0 : item.price;
        }
      });
    });

    // Set effectivePrice for Exclusive licenses or single items
    updatedItems.forEach((item, index) => {
      if (
        item.license === 'Exclusive' ||
        !groups[item.license] ||
        groups[item.license].length < 2
      ) {
        updatedItems[index].effectivePrice = item.price;
      }
    });

    // Calculate discount and total
    const discount = updatedItems.reduce(
      (acc, item) => acc + (item.price - item.effectivePrice),
      0
    );
    setItems(updatedItems); // Update items with effectivePrice
    setOriginalTotal(sum);
    setBogoDiscount(discount);
    setTotalPrice(sum - discount);
  }, [items.length]); // Trigger on items length change to avoid infinite loops

  // 🧠 Load cart items from localStorage on initial render
  useEffect(() => {
    const stored = localStorage.getItem('cartItems');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // if (Array.isArray(parsed)) setItems(parsed);
        if (Array.isArray(parsed)) {
          // Ensure effectivePrice is set for stored items
          setItems(
            parsed.map((item: CartItem) => ({
              ...item,
              effectivePrice: item.price,
            }))
          );
        }
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
        // totalPrice,
        originalTotal, // Added
        bogoDiscount, // Added
        totalPrice, // Updated meaning
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
