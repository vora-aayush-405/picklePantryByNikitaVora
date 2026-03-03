import React from 'react';
import { Heart, Award, Leaf } from 'lucide-react';

const About = ({ language }) => {
  const features = [
    {
      icon: Heart,
      titleEn: 'Made with Love',
      titleGu: 'પ્રેમથી બનાવેલ',
      descEn: 'Every jar is crafted with care and traditional family recipes',
      descGu: 'દરેક બરણી કાળજી અને પરંપરાગત કુટુંબ રેસિપી સાથે તૈયાર કરવામાં આવે છે'
    },
    {
      icon: Award,
      titleEn: 'Premium Quality',
      titleGu: 'પ્રીમિયમ ગુણવત્તા',
      descEn: 'Only the finest ingredients and authentic spices are used',
      descGu: 'ફક્ત શ્રેષ્ઠ ઘટકો અને અસલી મસાલાનો ઉપયોગ કરવામાં આવે છે'
    },
    {
      icon: Leaf,
      titleEn: 'Natural & Fresh',
      titleGu: 'કુદરતી અને તાજા',
      descEn: 'No preservatives, just pure homemade goodness',
      descGu: 'કોઈ પ્રિઝર્વેટિવ્સ નહીં, ફક્ત શુદ્ધ ઘરેલુ સારી ચીજો'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1e1919] mb-4">
            {language === 'en' ? 'About Us' : 'અમારા વિશે'}
          </h2>
          <div className="w-24 h-1 bg-[#ff8c19] mx-auto rounded-full"></div>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-gradient-to-br from-[#f7f5f2] to-[#fff5e6] rounded-2xl p-8 sm:p-12 shadow-lg">
            <p className="text-lg sm:text-xl text-[#1e1919] leading-relaxed text-center">
              {language === 'en'
                ? "Welcome to Pickle Pantry, where a mother's dream comes alive through the authentic flavors of traditional Indian pickles. Nikita Vora brings you generations of family recipes, crafted with love and the finest ingredients. Each jar tells a story of tradition, taste, and the warmth of home-cooked goodness."
                : 'પિકલ પેન્ટ્રીમાં આપનું સ્વાગત છે, જ્યાં એક માતાનું સ્વપ્ન પરંપરાગત ભારતીય અચારના અસલી સ્વાદ દ્વારા જીવંત થાય છે. નિકિતા વોરા તમારા માટે પ્રેમ અને શ્રેષ્ઠ સામગ્રી સાથે તૈયાર કરેલી પેઢીઓની કુટુંબ રેસિપી લાવે છે. દરેક બરણી પરંપરા, સ્વાદ અને ઘરે બનાવેલી સારી ચીજોની હૂંફની વાર્તા કહે છે.'}
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-xl p-8 shadow-md hover:shadow-xl border border-[#5f9dff66] transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[#ff8c19] to-[#fa551e] rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-[#1e1919] mb-3 text-center">
                  {language === 'en' ? feature.titleEn : feature.titleGu}
                </h3>
                <p className="text-[#736c64] text-center leading-relaxed">
                  {language === 'en' ? feature.descEn : feature.descGu}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;