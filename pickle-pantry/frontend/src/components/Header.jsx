import React, { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from './ui/button';

const Header = ({ language, setLanguage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#5f9dff66]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#61525a]">
              {language === 'en' ? 'Pickle Pantry' : 'પિકલ પેન્ટ્રી'}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-[#1e1919] hover:text-[#ff8c19] transition-colors duration-300"
            >
              {language === 'en' ? 'Home' : 'હોમ'}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-[#1e1919] hover:text-[#ff8c19] transition-colors duration-300"
            >
              {language === 'en' ? 'About' : 'વિશે'}
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="text-[#1e1919] hover:text-[#ff8c19] transition-colors duration-300"
            >
              {language === 'en' ? 'Products' : 'ઉત્પાદનો'}
            </button>
            <button
              onClick={() => scrollToSection('order')}
              className="text-[#1e1919] hover:text-[#ff8c19] transition-colors duration-300"
            >
              {language === 'en' ? 'Order' : 'ઓર્ડર'}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-[#1e1919] hover:text-[#ff8c19] transition-colors duration-300"
            >
              {language === 'en' ? 'Contact' : 'સંપર્ક'}
            </button>
            
            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
              className="border-[#61525a] text-[#61525a] hover:bg-[#61525a] hover:text-white transition-all duration-300"
            >
              {language === 'en' ? 'ગુજરાતી' : 'English'}
            </Button>
            
            <a href="tel:8200401199">
              <Button className="bg-[#ff8c19] hover:bg-[#fa551e] text-white transition-all duration-300">
                <Phone className="w-4 h-4 mr-2" />
                {language === 'en' ? 'Call Now' : 'કૉલ કરો'}
              </Button>
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#61525a]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-4">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-[#1e1919] hover:text-[#ff8c19] transition-colors duration-300"
            >
              {language === 'en' ? 'Home' : 'હોમ'}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-[#1e1919] hover:text-[#ff8c19] transition-colors duration-300"
            >
              {language === 'en' ? 'About' : 'વિશે'}
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="block w-full text-left text-[#1e1919] hover:text-[#ff8c19] transition-colors duration-300"
            >
              {language === 'en' ? 'Products' : 'ઉત્પાદનો'}
            </button>
            <button
              onClick={() => scrollToSection('order')}
              className="block w-full text-left text-[#1e1919] hover:text-[#ff8c19] transition-colors duration-300"
            >
              {language === 'en' ? 'Order' : 'ઓર્ડર'}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="block w-full text-left text-[#1e1919] hover:text-[#ff8c19] transition-colors duration-300"
            >
              {language === 'en' ? 'Contact' : 'સંપર્ક'}
            </button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'gu' : 'en')}
              className="w-full border-[#61525a] text-[#61525a] hover:bg-[#61525a] hover:text-white transition-all duration-300"
            >
              {language === 'en' ? 'ગુજરાતી' : 'English'}
            </Button>
            
            <a href="tel:8200401199" className="block">
              <Button className="w-full bg-[#ff8c19] hover:bg-[#fa551e] text-white transition-all duration-300">
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