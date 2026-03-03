import React from 'react';
import { Heart, Phone, Mail } from 'lucide-react';
import { Lock } from 'lucide-react';

const Footer = ({ language }) => {
  return (
    <footer className="bg-[#1e1919] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <h3 className="text-2xl font-bold text-[#ff8c19] mb-4">
              {language === 'en' ? 'Pickle Pantry' : 'પિકલ પેન્ટ્રી'}
            </h3>
            <p className="text-[#bbb5ae] mb-4">
              {language === 'en'
                ? 'by Nikita Vora'
                : 'નિકિતા વોરા દ્વારા'}
            </p>
            <p className="text-[#bbb5ae] text-sm">
              {language === 'en'
                ? 'Bringing you authentic homemade pickles with traditional flavors and love.'
                : 'પરંપરાગત સ્વાદ અને પ્રેમ સાથે અસલી ઘરેલુ અચાર તમારા માટે લાવી રહ્યા છીએ.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#ff8c19]">
              {language === 'en' ? 'Quick Links' : 'ઝડપી લિંક્સ'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => document.getElementById('home').scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#bbb5ae] hover:text-[#ff8c19] transition-colors duration-300"
                >
                  {language === 'en' ? 'Home' : 'હોમ'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#bbb5ae] hover:text-[#ff8c19] transition-colors duration-300"
                >
                  {language === 'en' ? 'About' : 'વિશે'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#bbb5ae] hover:text-[#ff8c19] transition-colors duration-300"
                >
                  {language === 'en' ? 'Products' : 'ઉત્પાદનો'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('order').scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#bbb5ae] hover:text-[#ff8c19] transition-colors duration-300"
                >
                  {language === 'en' ? 'Order' : 'ઓર્ડર'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                  className="text-[#bbb5ae] hover:text-[#ff8c19] transition-colors duration-300"
                >
                  {language === 'en' ? 'Contact' : 'સંપર્ક'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-[#ff8c19]">
              {language === 'en' ? 'Contact Us' : 'અમારો સંપર્ક કરો'}
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#ff8c19]" />
                <a
                  href="tel:8200401199"
                  className="text-[#bbb5ae] hover:text-[#ff8c19] transition-colors duration-300"
                >
                  +91 8200401199
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#ff8c19]" />
                <a
                  href="mailto:nikitavora.picklepantry@gmail.com"
                  className="text-[#bbb5ae] hover:text-[#ff8c19] transition-colors duration-300"
                >
                  nikitavora.picklepantry@gmail.com
                </a>
              </div>
            </div>

            {/* Admin Login Link */}
            <div className="mt-6 pt-6 border-t border-[#736c64]">
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.hash = 'admin';
                  window.location.reload();
                }}
                className="text-xs text-[#736c64] hover:text-[#ff8c19] transition-colors duration-300 flex items-center gap-2"
              >
                <Lock className="w-3 h-3" />
                {language === 'en' ? 'Admin Login' : 'એડમિન લોગિન'}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#736c64] mt-8 pt-8 text-center">
          <p className="text-[#bbb5ae] text-sm flex items-center justify-center gap-2">
            {language === 'en' ? 'Made with' : 'સાથે બનાવેલ'}
            <Heart className="w-4 h-4 text-[#ff8c19] fill-current" />
            {language === 'en' ? 'by Nikita Vora' : 'નિકિતા વોરા દ્વારા'}
          </p>
          <p className="text-[#736c64] text-xs mt-2">
            © {new Date().getFullYear()} {language === 'en' ? 'Pickle Pantry. All rights reserved.' : 'પિકલ પેન્ટ્રી. બધા અધિકારો અનામત.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;