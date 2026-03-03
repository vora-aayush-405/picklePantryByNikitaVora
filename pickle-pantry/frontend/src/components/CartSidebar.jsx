import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';

const CartSidebar = ({ language }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getDeliveryCharge,
    getFinalTotal,
  } = useCart();

  const scrollToCheckout = () => {
    setIsCartOpen(false);
    setTimeout(() => {
      document.getElementById('checkout')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#ff8c19]" />
            <h2 className="text-xl font-bold text-gray-900">
              {language === 'en' ? 'Your Cart' : 'તમારી કાર્ટ'}
            </h2>
            <Badge variant="secondary" className="ml-2">
              {cartItems.length}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCartOpen(false)}
            className="hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg font-medium mb-2">
                {language === 'en' ? 'Your cart is empty' : 'તમારી કાર્ટ ખાલી છે'}
              </p>
              <p className="text-gray-400 text-sm mb-6">
                {language === 'en' 
                  ? 'Add some delicious pickles to get started!' 
                  : 'શરૂ કરવા માટે કેટલાક સ્વાદિષ્ટ અચાર ઉમેરો!'}
              </p>
              <Button
                onClick={() => {
                  setIsCartOpen(false);
                  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#ff8c19] hover:bg-[#fa551e]"
              >
                {language === 'en' ? 'Browse Products' : 'ઉત્પાદનો બ્રાઉઝ કરો'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={item.image}
                    alt={language === 'en' ? item.nameEn : item.nameGu}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {language === 'en' ? item.nameEn : item.nameGu}
                    </h3>
                    <p className="text-[#ff8c19] font-bold mt-1">
                      {item.price}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-bold text-gray-900 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="border-t p-6 bg-gray-50">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-gray-600">
                <span>{language === 'en' ? 'Subtotal' : 'સબટોટલ'}</span>
                <span className="font-semibold">₹{getCartTotal()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{language === 'en' ? 'Delivery' : 'ડિલિવરી'}</span>
                <span className="font-semibold">
                  {getDeliveryCharge() === 0 ? (
                    <span className="text-green-600">
                      {language === 'en' ? 'FREE' : 'મફત'}
                    </span>
                  ) : (
                    `₹${getDeliveryCharge()}`
                  )}
                </span>
              </div>
              {getCartTotal() < 500 && (
                <p className="text-xs text-gray-500">
                  {language === 'en' 
                    ? `Add ₹${500 - getCartTotal()} more for free delivery!`
                    : `મફત ડિલિવરી માટે ₹${500 - getCartTotal()} વધુ ઉમેરો!`}
                </p>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t">
                <span>{language === 'en' ? 'Total' : 'કુલ'}</span>
                <span className="text-[#ff8c19]">₹{getFinalTotal()}</span>
              </div>
            </div>
            
            <Button
              onClick={scrollToCheckout}
              className="w-full bg-[#ff8c19] hover:bg-[#fa551e] text-white py-6 text-lg"
            >
              {language === 'en' ? 'Proceed to Checkout' : 'ચેકઆઉટ પર આગળ વધો'}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
