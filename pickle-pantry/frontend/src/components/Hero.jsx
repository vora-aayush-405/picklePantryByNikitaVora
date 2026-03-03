import React from 'react';
import { ArrowDown } from 'lucide-react';
import { Button } from './ui/button';

const Hero = ({ language }) => {
  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#f7f5f2] via-[#fef8f0] to-[#fff5e6]">
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#ff8c19]/10 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#b4dc19]/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1e1919] leading-tight">
              {language === 'en' ? (
                <>
                  Pickle Pantry
                  <br />
                  <span className="text-[#ff8c19]">by Nikita Vora</span>
                </>
              ) : (
                <>
                  પિકલ પેન્ટ્રી
                  <br />
                  <span className="text-[#ff8c19]">નિકિતા વોરા દ્વારા</span>
                </>
              )}
            </h1>
            
            <p className="text-xl sm:text-2xl text-[#736c64] max-w-3xl mx-auto">
              {language === 'en'
                ? 'Tangy! Sweet! Tasty! Authentic homemade pickles made with love and traditional recipes'
                : 'ખાટુ! મીઠુ! સ્વાદિષ્ટ! પ્રેમ અને પરંપરાગત રેસિપી સાથે બનાવેલ અસલી ઘરેલુ અચાર'}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button
              onClick={scrollToProducts}
              className="bg-[#ff8c19] hover:bg-[#fa551e] text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              {language === 'en' ? 'Explore Varieties' : 'વિવિધતાઓ જુઓ'}
            </Button>
            
            <Button
              onClick={() => document.getElementById('order').scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="border-2 border-[#61525a] text-[#61525a] hover:bg-[#61525a] hover:text-white px-8 py-6 text-lg rounded-lg transform hover:scale-105 transition-all duration-300"
            >
              {language === 'en' ? 'Place Order' : 'ઓર્ડર કરો'}
            </Button>
          </div>

          {/* Scroll Indicator */}
          <div className="pt-12 animate-bounce">
            <ArrowDown className="w-8 h-8 mx-auto text-[#ff8c19]" />
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;