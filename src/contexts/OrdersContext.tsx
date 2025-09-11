// src/contexts/OrdersContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import axios from 'axios';

export interface Order {
  id: string;
  orderId: string;
  customerInfo: {
    name: string;
    email: string;
  };
  items: {
    beatId: string;
    licenseType: string;
    price: number;
    title: string;
    artist: string;
    s3_image_url?: string;
    s3_file_url: string;
  }[];
  paymentType: string;
  totalPrice: number;
  status: string;
  createdAt: Date;
}

interface OrdersContextType {
  orders: Order[];
  isLoaded: boolean;
  fetchOrders: () => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL_BACKEND}/api/orders`,
        {
          params: { limit: 1000 }, // Fetch up to 1000 orders for client-side pagination/filtering
        }
      );
      const fetchedOrders = response.data.orders.map((order: any) => ({
        ...order,
        id: order._id,
        createdAt: new Date(order.createdAt),
      }));
      setOrders(fetchedOrders);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setTimeout(() => fetchOrders(), 5000);

      setIsLoaded(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    console.log('Orders:', orders);
  }, [fetchOrders]);

  return (
    <OrdersContext.Provider value={{ orders, isLoaded, fetchOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};
