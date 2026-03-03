import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from './ui/button';

const Contact = ({ language }) => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-[#f7f5f2] via-white to-[#fff5e6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1e1919] mb-4">
            {language === 'en' ? 'Get In Touch' : 'સંપર્કમાં રહો'}
          </h2>
          <div className="w-24 h-1 bg-[#ff8c19] mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-[#736c64] max-w-2xl mx-auto">
            {language === 'en'
              ? 'Have questions or want to place a bulk order? Contact us anytime!'
              : 'પ્રશ્નો છે અથવા બલ્ક ઓર્ડર મૂકવા માંગો છો? કોઈપણ સમયે અમારો સંપર્ક કરો!'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Phone */}
            <div className="flex items-start gap-4 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#ff8c19] to-[#fa551e] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1e1919] mb-2">
                  {language === 'en' ? 'Phone' : 'ફોન'}
                </h3>
                <a
                  href="tel:8200401199"
                  className="text-[#736c64] hover:text-[#ff8c19] transition-colors duration-300 text-lg"
                >
                  +91 8200401199
                </a>
                <p className="text-sm text-[#736c64] mt-1">
                  {language === 'en' ? 'Available for calls and WhatsApp' : 'કૉલ અને વ્હોટ્સએપ માટે ઉપલબ્ધ'}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#b4dc19] to-[#8ab916] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1e1919] mb-2">
                  {language === 'en' ? 'Address' : 'સરનામું'}
                </h3>
                <p className="text-[#736c64] text-lg">
                  B1/94, Arjun Tower, CP-Nagar 2, Ghatlodia, Ahmedabad, Gujarat, India - 380061
                  <br />
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="flex items-start gap-4 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#61525a] to-[#4a3d44] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1e1919] mb-2">
                  {language === 'en' ? 'Business Hours' : 'વ્યવસાય સમય'}
                </h3>
                <p className="text-[#736c64] text-lg">
                  {language === 'en' ? 'Monday - Saturday' : 'સોમવાર - શનિવાર'}
                  <br />
                  9:00 AM - 7:00 PM
                </p>
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="flex items-start gap-4 group">
              <div className="w-14 h-14 bg-gradient-to-br from-[#5f9dff] to-[#4a7acc] rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1e1919] mb-2">
                  {language === 'en' ? 'Email' : 'ઈમેલ'}
                </h3>
                <a
                  href="mailto:nikitavora.picklepantry@gmail.com"
                  className="text-[#736c64] hover:text-[#ff8c19] transition-colors duration-300 text-lg"
                >
                  nikitavora.picklepantry@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Call to Action Card */}
          <div className="bg-gradient-to-br from-[#ff8c19] to-[#fa551e] rounded-2xl p-8 sm:p-12 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h3 className="text-3xl font-bold mb-4">
              {language === 'en' ? 'Ready to Order?' : 'ઓર્ડર કરવા તૈયાર છો?'}
            </h3>
            <p className="text-lg mb-8 opacity-90">
              {language === 'en'
                ? 'Call us now to place your order or discuss bulk requirements. We deliver fresh pickles right to your doorstep!'
                : 'તમારો ઓર્ડર મૂકવા અથવા બલ્ક જરૂરિયાતોની ચર્ચા કરવા માટે અમને હમણાં જ કૉલ કરો. અમે તમારા ઘર સુધી તાજા અચાર પહોંચાડીએ છીએ!'}
            </p>
            
            <div className="space-y-4">
              <a href="tel:8200401199" className="block">
                <Button className="w-full bg-white text-[#ff8c19] hover:bg-[#f7f5f2] py-6 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                  <Phone className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Call Now: 8200401199' : 'કૉલ કરો: 8200401199'}
                </Button>
              </a>
              
              <a href="https://wa.me/918200401199" target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-white text-[#b4dc19] hover:bg-[#f7f5f2] py-6 text-lg rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300">
                  {language === 'en' ? 'WhatsApp Us' : 'વ્હોટ્સએપ કરો'}
                </Button>
              </a>
            </div>

            {/* Decorative Pattern */}
            <div className="mt-8 flex items-center justify-center gap-2 opacity-50">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;