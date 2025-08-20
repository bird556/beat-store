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

  // const addToCart = (item: CartItem) => {
  //   setItems((prev) => {
  //     const exists = prev.some((i) => i.id === item.id);
  //     if (exists) {
  //       return prev.map((i) => (i.id === item.id ? item : i));
  //     }
  //     // return [...prev, item];
  //     return [...prev, { ...item, effectivePrice: item.price }];
  //   });
  // };

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => (i.id === item.id ? { ...i, ...item } : i));
      }
      return [...prev, { ...item }]; // No need to set effectivePrice here initially
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
  };

  const totalItems = items.length;

  useEffect(() => {
    const nonExclusiveItems = items.filter(
      (item) => item.license.toLowerCase() !== 'exclusive'
    );
    const exclusiveItems = items.filter(
      (item) => item.license.toLowerCase() === 'exclusive'
    );

    // Group non-exclusive items by license type
    const groupedByLicense: { [key: string]: CartItem[] } = {};
    nonExclusiveItems.forEach((item) => {
      if (!groupedByLicense[item.license]) {
        groupedByLicense[item.license] = [];
      }
      groupedByLicense[item.license].push(item);
    });

    // Calculate BOGO discount for each license group
    const updatedItems = [
      ...exclusiveItems.map((item) => ({
        ...item,
        effectivePrice: item.price,
      })),
    ];

    Object.values(groupedByLicense).forEach((group) => {
      // Sort beats by price within each group
      const sortedGroup = [...group].sort((a, b) => a.price - b.price);
      const freeCount = Math.floor(sortedGroup.length / 2);

      // Apply the BOGO discount to the cheapest items in the group
      sortedGroup.forEach((item, index) => {
        const newEffectivePrice = index < freeCount ? 0 : item.price;
        updatedItems.push({ ...item, effectivePrice: newEffectivePrice });
      });
    });

    // Calculate totals from the new `updatedItems` array
    const calculatedOriginalTotal = updatedItems.reduce(
      (acc, item) => acc + item.price,
      0
    );
    const calculatedTotalPrice = updatedItems.reduce(
      (acc, item) => acc + item.effectivePrice,
      0
    );
    const calculatedBogoDiscount =
      calculatedOriginalTotal - calculatedTotalPrice;

    // Check if items have changed to avoid an infinite loop
    const hasChanged =
      items.length !== updatedItems.length ||
      items.some((item) => {
        const updatedItem = updatedItems.find((ui) => ui.id === item.id);
        return (
          updatedItem && updatedItem.effectivePrice !== item.effectivePrice
        );
      });

    if (hasChanged) {
      setItems(updatedItems);
    }

    setOriginalTotal(calculatedOriginalTotal);
    setTotalPrice(calculatedTotalPrice);
    setBogoDiscount(calculatedBogoDiscount);
  }, [items]); // The dependency remains `items` to react to all cart changes

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
