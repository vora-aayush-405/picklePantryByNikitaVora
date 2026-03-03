import React from 'react';
import { Star, Award, Shield, Truck } from 'lucide-react';
import { Badge } from './ui/badge';

const HeroNew = ({ language }) => {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative pt-24 pb-16 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start mb-6">
              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2">
                <Shield className="w-4 h-4 mr-1" />
                100% Natural
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2">
                <Award className="w-4 h-4 mr-1" />
                FSSAI Certified
              </Badge>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2">
                <Truck className="w-4 h-4 mr-1" />
                {language === 'en' ? 'Free Delivery ₹500+' : 'મફત ડિલિવરી ₹500+'}
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {language === 'en' ? (
                <>
                  <div className="text-5xl sm:text-6xl lg:text-7xl mb-2">Pickle Pantry</div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#ff8c19]">
                    by Nikita Vora
                  </div>
                </>
              ) : (
                <>
                  <div className="text-5xl sm:text-6xl lg:text-7xl mb-2">પિકલ પેન્ટ્રી</div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-normal text-[#ff8c19]">
                    નિકિતા વોરા દ્વારા
                  </div>
                </>
              )}
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              {language === 'en'
                ? 'Authentic Homemade Pickles with Love. Preserving tradition in every jar with authentic recipes passed down through generations.'
                : 'પ્રેમ સાથે અસલી ઘરેલુ અચાર. પેઢીઓથી ચાલતી આવતી અસલી રેસીપી સાથે દરેક બરણીમાં પરંપરાનું સંરક્ષણ.'}
            </p>

            {/* Rating */}
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600 font-medium">
                4.9 {language === 'en' ? '(500+ Reviews)' : '(500+ સમીક્ષાઓ)'}
              </span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={scrollToProducts}
                className="px-8 py-4 bg-[#ff8c19] hover:bg-[#fa551e] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {language === 'en' ? 'Shop Now' : 'હમણાં ખરીદી કરો'}
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-[#ff8c19] transform hover:scale-105 transition-all duration-200"
              >
                {language === 'en' ? 'Learn More' : 'વધુ જાણો'}
              </button>
            </div>
          </div>

          {/* Right Content - Product Showcase */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              {/* Featured Products */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src="https://i.ibb.co/23mDWftm/Keri-Khaatu-Athaanu.png"
                    alt="Mango Pickle"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-gray-900 mb-1">
                    {language === 'en' ? 'Mango Pickle' : 'કેરી - ખાટુ અથાણું'}
                  </h3>
                  <p className="text-[#ff8c19] font-bold">₹300/jar</p>
                </div>
              </div>
              <div className="space-y-6 mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <img
                    src="https://iili.io/qB6tVcX.md.png"
                    alt="Mango Chhundo"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-bold text-gray-900 mb-1">
                    {language === 'en' ? 'Mango Chhundo' : 'કેરી - છુંદો'}
                  </h3>
                  <p className="text-[#ff8c19] font-bold">₹300/jar</p>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-xl border-2 border-orange-100">
              <p className="text-sm font-bold text-gray-900">
                {language === 'en' ? '🎉 20+ Varieties Available' : '🎉 20+ પ્રકારો ઉપલબ્ધ'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;
