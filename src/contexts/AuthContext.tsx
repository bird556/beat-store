// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
// Define the shape of your user object
interface User {
  name: string;
  email: string;
}

// Define the shape of your context value
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Create the provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Persist the login state across page reloads
  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    // Add a check to ensure storedUser is a valid JSON string
    if (storedUser && storedUser !== 'undefined') {
      // <-- The fix is here
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e);
        // Optional: Clear the invalid item from localStorage
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    // Store user data in local storage
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Clear user data from local storage
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
