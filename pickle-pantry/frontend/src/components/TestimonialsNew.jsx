import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsNew = ({ language }) => {
  const testimonials = [
    {
      id: 1,
      nameEn: 'Priya Shah',
      nameGu: 'પ્રિયા શાહ',
      textEn: 'The mango pickle is absolutely divine! Tastes exactly like my grandmother used to make. The quality and freshness are unmatched.',
      textGu: 'કેરીનું અચાર સંપૂર્ણપણે દૈવી છે! મારી દાદીમા બનાવતી હતી તેવો જ સ્વાદ આવે છે. ગુણવત્તા અને તાજગી બેજોડ છે.',
      rating: 5,
      location: 'Ahmedabad'
    },
    {
      id: 2,
      nameEn: 'Rajesh Patel',
      nameGu: 'રાજેશ પટેલ',
      textEn: 'Been ordering for 2 years now. Consistent quality, authentic taste, and excellent packaging. Highly recommended!',
      textGu: 'હવે 2 વર્ષથી ઓર્ડર કરી રહ્યો છું. સતત ગુણવત્તા, અસલી સ્વાદ અને શ્રેષ્ઠ પેકેજિંગ. અત્યંત ભલામણ કરું છું!',
      rating: 4.8,
      location: 'Vadodara'
    },
    {
      id: 3,
      nameEn: 'Meera Shukla',
      nameGu: 'મીરા શુક્લા',
      textEn: 'Perfect blend of spices! The garlic pickle is my favorite. Delivery was quick and the jars were perfectly sealed.',
      textGu: 'મસાલાનું સંપૂર્ણ મિશ્રણ! લસણનું અચાર મારું પસંદીદા છે. ડિલિવરી ઝડપી હતી અને બરણીઓ સંપૂર્ણ રીતે સીલ કરેલી હતી.',
      rating: 5,
      location: 'Surendranagar'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'What Our Customers Say' : 'અમારા ગ્રાહકો શું કહે છે'}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600 font-semibold text-lg">
              4.9/5
            </span>
          </div>
          <p className="text-gray-600">
            {language === 'en' ? 'Based on 500+ reviews' : '500+ સમીક્ષાઓ પર આધારિત'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Quote className="w-12 h-12 text-[#ff8c19]/20 absolute top-6 right-6" />
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed relative z-10">
                "{language === 'en' ? testimonial.textEn : testimonial.textGu}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#ff8c19] to-[#fa551e] rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {(language === 'en' ? testimonial.nameEn : testimonial.nameGu).charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {language === 'en' ? testimonial.nameEn : testimonial.nameGu}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsNew;
