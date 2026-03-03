import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('pickleCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pickleCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, language) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      toast({
        title: language === 'en' ? 'Quantity Updated' : 'જથ્થો અપડેટ થયો',
        description: language === 'en' 
          ? `${product.nameEn} quantity increased` 
          : `${product.nameGu} જથ્થો વધાર્યો`,
      });
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
      toast({
        title: language === 'en' ? 'Added to Cart!' : 'કાર્ટમાં ઉમેર્યું!',
        description: language === 'en' 
          ? `${product.nameEn} added to cart` 
          : `${product.nameGu} કાર્ટમાં ઉમેર્યું`,
      });
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^0-9]/g, ''));
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const getDeliveryCharge = () => {
    const total = getCartTotal();
    return total >= 500 ? 0 : 0; //later add 50 here
  };

  const getFinalTotal = () => {
    return getCartTotal() + getDeliveryCharge();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getDeliveryCharge,
        getFinalTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
