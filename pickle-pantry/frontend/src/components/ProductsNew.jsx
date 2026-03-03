import React from 'react';
import { ShoppingCart, Heart, Plus, Minus, Check } from 'lucide-react';
import { pickleVarieties } from '../mock';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '../context/CartContext';

const ProductsNew = ({ language }) => {
  const { addToCart, cartItems, updateQuantity } = useCart();

  const getProductQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (pickle) => {
    addToCart(pickle, language);
  };

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
            {language === 'en' ? '🌟 Our Collection' : '🌟 અમારો સંગ્રહ'}
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Premium Pickle Varieties' : 'પ્રીમિયમ અચારની વિવિધતાઓ'}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Handpicked ingredients, traditional recipes, and authentic flavors in every jar'
              : 'દરેક બરણીમાં હાથથી પસંદ કરેલા ઘટકો, પરંપરાગત વાનગીઓ અને અસલી સ્વાદ'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pickleVarieties.map((pickle, index) => {
            const quantity = getProductQuantity(pickle.id);
            
            return (
              <div
                key={pickle.id}
                className="group bg-white rounded-2xl border-2 border-gray-100 hover:border-[#ff8c19] overflow-hidden transition-all duration-300 hover:shadow-xl"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-yellow-50 aspect-square">
                  <img
                    src={pickle.image}
                    alt={language === 'en' ? pickle.nameEn : pickle.nameGu}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Wishlist Button */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 hover:fill-red-500 transition-colors" />
                  </button>

                  {/* Best Seller Badge */}
                  {index < 2 && (
                    <Badge className="absolute top-4 left-4 bg-[#ff8c19] text-white shadow-lg">
                      ⭐ {language === 'en' ? 'Best Seller' : 'બેસ્ટ સેલર'}
                    </Badge>
                  )}

                  {/* In Cart Badge */}
                  {quantity > 0 && (
                    <Badge className="absolute bottom-4 right-4 bg-green-500 text-white shadow-lg animate-in fade-in zoom-in duration-300">
                      <Check className="w-4 h-4 mr-1" />
                      {quantity} {language === 'en' ? 'in cart' : 'કાર્ટમાં'}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {language === 'en' ? pickle.nameEn : pickle.nameGu}
                  </h3>
                  
                  {language === 'en' && (
                    <p className="text-sm text-gray-500 mb-3">{pickle.nameGu}</p>
                  )}
                  
                  <p className="text-gray-600 mb-4 text-sm line-clamp-2 leading-relaxed">
                    {language === 'en' ? pickle.descriptionEn : pickle.descriptionGu}
                  </p>

                  {/* Taste Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pickle.taste.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price and Cart Controls */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-2xl font-bold text-[#ff8c19]">{pickle.price}</p>
                        <p className="text-xs text-gray-500">
                          {language === 'en' ? 'per jar (500g)' : 'પ્રતિ જાર (500g)'}
                        </p>
                      </div>
                    </div>

                    {quantity === 0 ? (
                      <Button
                        onClick={() => handleAddToCart(pickle)}
                        className="w-full bg-[#ff8c19] hover:bg-[#fa551e] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Add to Cart' : 'કાર્ટમાં ઉમેરો'}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(pickle.id, quantity - 1)}
                          className="flex-1 border-[#ff8c19] text-[#ff8c19] hover:bg-[#ff8c19] hover:text-white"
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <div className="flex-1 text-center">
                          <div className="text-2xl font-bold text-[#ff8c19]">{quantity}</div>
                          <div className="text-xs text-gray-500">
                            {language === 'en' ? 'in cart' : 'કાર્ટમાં'}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(pickle.id, quantity + 1)}
                          className="flex-1 border-[#ff8c19] text-[#ff8c19] hover:bg-[#ff8c19] hover:text-white"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-orange-50 to-yellow-50 px-8 py-6 rounded-2xl border-2 border-orange-200 shadow-lg">
            <div className="text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                💼 {language === 'en' ? 'Looking for bulk orders?' : 'બલ્ક ઓર્ડર શોધી રહ્યા છો?'}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Get special discounts on orders above ₹5000' 
                  : '₹5000 થી વધુના ઓર્ડર પર વિશેષ ડિસ્કાઉન્ટ મેળવો'}
              </p>
            </div>
            <a href="tel:8200401199">
              <Button className="bg-[#ff8c19] hover:bg-[#fa551e] whitespace-nowrap shadow-lg">
                📞 {language === 'en' ? 'Contact Us' : 'અમારો સંપર્ક કરો'}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsNew;
