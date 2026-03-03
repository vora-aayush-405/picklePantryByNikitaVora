import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import HeaderNew from "./components/HeaderNew";
import HeroNew from "./components/HeroNew";
import About from "./components/About";
import ProductsNew from "./components/ProductsNew";
import WhyChooseUs from "./components/WhyChooseUs";
import TestimonialsNew from "./components/TestimonialsNew";
import CheckoutSimplified from "./components/CheckoutSimplified";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import AdminDashboard from "./components/AdminDashboard";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [language, setLanguage] = useState('en');
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    // Check if URL hash is #admin 
    if (window.location.hash === '#admin') {
      setShowAdmin(true);
    }

    // Listen for hash changes
    const handleHashChange = () => {
      setShowAdmin(window.location.hash === '#admin');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (showAdmin) {
    return (
      <div className="App">
        <BrowserRouter>
          <AdminDashboard language={language} />
          <Toaster />
        </BrowserRouter>
      </div>
    );
  }

  return (
    <CartProvider>
      <div className="App">
        <BrowserRouter>
          <HeaderNew language={language} setLanguage={setLanguage} />
          <HeroNew language={language} />
          <About language={language} />
          <ProductsNew language={language} />
          <WhyChooseUs language={language} />
          <TestimonialsNew language={language} />
          <CheckoutSimplified language={language} />
          <Contact language={language} />
          <Footer language={language} />
          <CartSidebar language={language} />
          <Toaster />
        </BrowserRouter>
      </div>
    </CartProvider>
  );
}

export default App;
