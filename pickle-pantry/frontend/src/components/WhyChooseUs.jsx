import React from 'react';
import { Heart, Award, Leaf, Truck, Shield, Clock } from 'lucide-react';

const WhyChooseUs = ({ language }) => {
  const features = [
    {
      icon: Heart,
      titleEn: 'Made with Love',
      titleGu: 'પ્રેમથી બનાવેલ',
      descEn: 'Every jar is handcrafted with traditional family recipes passed through generations',
      descGu: 'દરેક બરણી પરંપરાગત કુટુંબ રેસીપી સાથે હાથથી બનાવેલી છે જે પેઢીઓથી પસાર થઈ છે',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Shield,
      titleEn: '100% Natural',
      titleGu: '100% કુદરતી',
      descEn: 'No preservatives, no artificial colors - just pure, authentic ingredients',
      descGu: 'કોઈ પ્રિઝર્વેટિવ્સ નથી, કોઈ કૃત્રિમ રંગો નથી - ફક્ત શુદ્ધ, અસલી ઘટકો',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      titleEn: 'FSSAI Certified',
      titleGu: 'FSSAI પ્રમાણિત',
      descEn: 'Government certified for quality and hygiene standards',
      descGu: 'ગુણવત્તા અને સ્વચ્છતા ધોરણો માટે સરકાર દ્વારા પ્રમાણિત',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Leaf,
      titleEn: 'Fresh Ingredients',
      titleGu: 'તાજા ઘટકો',
      descEn: 'Sourced directly from local farms for maximum freshness and flavor',
      descGu: 'મહત્તમ તાજગી અને સ્વાદ માટે સ્થાનિક ખેતરોમાંથી સીધા મેળવેલા',
      color: 'from-green-600 to-lime-500'
    },
    {
      icon: Truck,
      titleEn: 'Fast Delivery',
      titleGu: 'ઝડપી ડિલિવરી',
      descEn: 'Quick and safe delivery to your doorstep with proper packaging',
      descGu: 'યોગ્ય પેકેજિંગ સાથે તમારા ઘર સુધી ઝડપી અને સુરક્ષિત ડિલિવરી',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Clock,
      titleEn: 'Long Shelf Life',
      titleGu: 'લાંબો શેલ્ફ લાઇફ',
      descEn: 'Traditional preservation methods ensure long-lasting freshness',
      descGu: 'પરંપરાગત સંરક્ષણ પદ્ધતિઓ લાંબા સમય સુધી તાજગી સુનિશ્ચિત કરે છે',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Why Choose Pickle Pantry?' : 'શા માટે પિકલ પેન્ટ્રી પસંદ કરો?'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Quality, tradition, and taste that brings back childhood memories'
              : 'ગુણવત્તા, પરંપરા અને સ્વાદ જે બાળપણની યાદો પાછી લાવે છે'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border-2 border-gray-100 hover:border-[#ff8c19] transition-all duration-300 hover:shadow-xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {language === 'en' ? feature.titleEn : feature.titleGu}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {language === 'en' ? feature.descEn : feature.descGu}
                </p>

                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#ff8c19]/20 rounded-tr-2xl group-hover:border-[#ff8c19] transition-colors"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-[#ff8c19] mb-2">20+</div>
            <div className="text-gray-600">
              {language === 'en' ? 'Pickle Varieties' : 'અચારની વિવિધતાઓ'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#ff8c19] mb-2">500+</div>
            <div className="text-gray-600">
              {language === 'en' ? 'Happy Customers' : 'ખુશ ગ્રાહકો'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#ff8c19] mb-2">5+</div>
            <div className="text-gray-600">
              {language === 'en' ? 'Years Experience' : 'વર્ષોનો અનુભવ'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-[#ff8c19] mb-2">100%</div>
            <div className="text-gray-600">
              {language === 'en' ? 'Natural Ingredients' : 'કુદરતી ઘટકો'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
