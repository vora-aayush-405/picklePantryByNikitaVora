import React from 'react';
import { pickleVarieties } from '../mock';
import { Badge } from './ui/badge';

const Products = ({ language }) => {
  return (
    <section id="products" className="py-20 bg-gradient-to-br from-[#f7f5f2] via-white to-[#fff5e6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1e1919] mb-4">
            {language === 'en' ? 'Our Pickle Varieties' : 'અમારી અચારની વિવિધતાઓ'}
          </h2>
          <div className="w-24 h-1 bg-[#ff8c19] mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-[#736c64] max-w-2xl mx-auto">
            {language === 'en'
              ? 'Discover our authentic collection of traditional pickles, each with its unique flavor profile'
              : 'પરંપરાગત અચારના અમારા અસલી સંગ્રહને શોધો, દરેક તેની અનન્ય સ્વાદ પ્રોફાઇલ સાથે'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pickleVarieties.map((pickle, index) => (
            <div
              key={pickle.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#fff5e6] to-[#f7f5f2]">
                <img
                  src={pickle.image}
                  alt={language === 'en' ? pickle.nameEn : pickle.nameGu}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1e1919] mb-2">
                  {language === 'en' ? pickle.nameEn : pickle.nameGu}
                </h3>
                
                {language === 'en' && (
                  <p className="text-sm text-[#736c64] mb-3">{pickle.nameGu}</p>
                )}
                
                <p className="text-[#736c64] mb-4 text-sm leading-relaxed">
                  {language === 'en' ? pickle.descriptionEn : pickle.descriptionGu}
                </p>

                {/* Taste Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {pickle.taste.map((tag, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-[#ff8c19]/10 text-[#ff8c19] hover:bg-[#ff8c19]/20 transition-colors duration-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-4 border-t border-[#5f9dff66]">
                  <span className="text-2xl font-bold text-[#ff8c19]">{pickle.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;