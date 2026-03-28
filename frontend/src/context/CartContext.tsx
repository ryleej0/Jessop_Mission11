import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Book, CartItem } from '../types/Book';

interface CartContextType {
  cart: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookID: number) => void;
  clearCart: () => void;
  totalQuantity: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Loads cart data from sessionStorage so the cart persists across page navigations during the session
function loadCart(): CartItem[] {
  const stored = sessionStorage.getItem('cart');
  return stored ? JSON.parse(stored) : [];
}

// Provides cart state and actions to all child components.
// Uses sessionStorage so the cart survives navigation but clears when the browser tab is closed.
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(loadCart);

  // Sync cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Adds a book to the cart; increments quantity if the book is already present
  const addToCart = (book: Book) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.bookID === book.bookID);
      if (existing) {
        return prev.map((item) =>
          item.book.bookID === book.bookID
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  // Removes a book entirely from the cart
  const removeFromCart = (bookID: number) => {
    setCart((prev) => prev.filter((item) => item.book.bookID !== bookID));
  };

  const clearCart = () => setCart([]);

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, totalQuantity, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for accessing cart context — throws if used outside CartProvider
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
