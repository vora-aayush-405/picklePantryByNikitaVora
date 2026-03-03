import React, { useState } from 'react';
import { Menu, X, Phone, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';

const Header = ({ language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount, setIsCartOpen } = useCart();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="text-2xl font-bold text-[#ff8c19]">
              {language === 'en' ? 'Pickle Pantry' : 'પિકલ પેન્ટ્રી'}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-700 hover:text-[#ff8c19] font-medium transition-colors duration-200"
            >
              {language === 'en' ? 'Home' : 'હોમ'}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-[#ff8c19] font-medium transition-colors duration-200"
            >
              {language === 'en' ? 'About' : 'વિશે'}
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="text-gray-700 hover:text-[#ff8c19] font-medium transition-colors duration-200"
            >
              {language === 'en' ? 'Products' : 'ઉત્પાદનો'}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-[#ff8c19] font-medium transition-colors duration-200"
            >
              {language === 'en' ? 'Contact' : 'સંપર્ક'}
            </button>
            
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
              className="border-gray-300 hover:border-[#ff8c19] hover:text-[#ff8c19]"
            >
              {language === 'en' ? 'ગુ' : 'En'}
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative hover:bg-[#ff8c19]/10"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-[#ff8c19] hover:bg-[#fa551e]">
                  {getCartCount()}
                </Badge>
              )}
            </Button>
            
            <a href="tel:8200401199">
              <Button size="sm" className="bg-[#ff8c19] hover:bg-[#fa551e]">
                <Phone className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Call' : 'કૉલ'}
              </Button>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#ff8c19]">
                  {getCartCount()}
                </Badge>
              )}
            </Button>
            <button
              className="text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t space-y-3">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left py-2 text-gray-700 hover:text-[#ff8c19]"
            >
              {language === 'en' ? 'Home' : 'હોમ'}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left py-2 text-gray-700 hover:text-[#ff8c19]"
            >
              {language === 'en' ? 'About' : 'વિશે'}
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="block w-full text-left py-2 text-gray-700 hover:text-[#ff8c19]"
            >
              {language === 'en' ? 'Products' : 'ઉત્પાદનો'}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left py-2 text-gray-700 hover:text-[#ff8c19]"
            >
              {language === 'en' ? 'Contact' : 'સંપર્ક'}
            </button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
              className="w-full"
            >
              {language === 'en' ? 'ગુજરાતી' : 'English'}
            </Button>
            
            <a href="tel:8200401199" className="block">
              <Button size="sm" className="w-full bg-[#ff8c19] hover:bg-[#fa551e]">
                <Phone className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Call Now' : 'કૉલ કરો'}
              </Button>
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
