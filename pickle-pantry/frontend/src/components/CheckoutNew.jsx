import React, { useState } from 'react';
import { Mail, MessageCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import { useCart } from '../context/CartContext';
import emailjs from 'emailjs-com';

const CheckoutNew = ({ language }) => {
  const { toast } = useToast();
  const { cartItems, getCartTotal, getDeliveryCharge, getFinalTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // EmailJS Configuration (User needs to replace these)
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS Service ID
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS Template ID
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS Public Key

  const generateOrderNumber = () => {
    return 'PP' + Date.now().toString().slice(-8);
  };

  const formatCartForEmail = () => {
    return cartItems.map(item => 
      `${language === 'en' ? item.nameEn : item.nameGu} x ${item.quantity} - ${item.price}`
    ).join('\n');
  };

  const formatCartForWhatsApp = () => {
    const items = cartItems.map(item =>
      `• ${language === 'en' ? item.nameEn : item.nameGu} x ${item.quantity}`
    ).join('\n');
    
    const message = language === 'en' 
      ? `*New Order from Pickle Pantry*\n\n*Customer Details:*\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\n\n*Order Items:*\n${items}\n\n*Order Summary:*\nSubtotal: ₹${getCartTotal()}\nDelivery: ₹${getDeliveryCharge()}\n*Total: ₹${getFinalTotal()}*\n\n*Delivery Address:*\n${formData.address}\n\n${formData.notes ? `*Special Instructions:*\n${formData.notes}` : ''}`
      : `*પિકલ પેન્ટ્રીથી નવો ઓર્ડર*\n\n*ગ્રાહક વિગતો:*\nનામ: ${formData.name}\nફોન: ${formData.phone}\nઈમેલ: ${formData.email}\n\n*ઓર્ડર આઇટમ્સ:*\n${items}\n\n*ઓર્ડર સારાંશ:*\nસબટોટલ: ₹${getCartTotal()}\nડિલિવરી: ₹${getDeliveryCharge()}\n*કુલ: ₹${getFinalTotal()}*\n\n*ડિલિવરી સરનામું:*\n${formData.address}\n\n${formData.notes ? `*વિશેષ સૂચનાઓ:*\n${formData.notes}` : ''}`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: language === 'en' ? 'Missing Information' : 'માહિતી ખૂટે છે',
        description: language === 'en' ? 'Please fill in all required fields' : 'કૃપા કરીને બધા જરૂરી ક્ષેત્રો ભરો',
        variant: 'destructive'
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: language === 'en' ? 'Cart is Empty' : 'કાર્ટ ખાલી છે',
        description: language === 'en' ? 'Please add items to cart first' : 'કૃપા કરીને પહેલા કાર્ટમાં આઇટમ્સ ઉમેરો',
        variant: 'destructive'
      });
      return;
    }

    const whatsappMessage = formatCartForWhatsApp();
    const whatsappUrl = `https://wa.me/918200401199?text=${whatsappMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: language === 'en' ? 'Redirecting to WhatsApp' : 'WhatsApp પર રીડાયરેક્ટ કરી રહ્યું છે',
      description: language === 'en' ? 'Complete your order on WhatsApp' : 'WhatsApp પર તમારો ઓર્ડર પૂર્ણ કરો',
    });
  };

  const handleEmailOrder = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email || !formData.address) {
      toast({
        title: language === 'en' ? 'Missing Information' : 'માહિતી ખૂટે છે',
        description: language === 'en' ? 'Please fill in all required fields' : 'કૃપા કરીને બધા જરૂરી ક્ષેત્રો ભરો',
        variant: 'destructive'
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: language === 'en' ? 'Cart is Empty' : 'કાર્ટ ખાલી છે',
        description: language === 'en' ? 'Please add items to cart first' : 'કૃપા કરીને પહેલા કાર્ટમાં આઇટમ્સ ઉમેરો',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = generateOrderNumber();
      const orderDate = new Date().toLocaleString();

      // EmailJS template parameters
      const templateParams = {
        order_number: orderNumber,
        order_date: orderDate,
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        delivery_address: formData.address,
        order_items: formatCartForEmail(),
        subtotal: getCartTotal(),
        delivery_charge: getDeliveryCharge(),
        total_amount: getFinalTotal(),
        special_notes: formData.notes || 'None',
        reply_to: formData.email
      };

      // Check if EmailJS credentials are configured
      if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' || 
          EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || 
          EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        
        // Mock email for demo purposes
        console.log('EmailJS not configured. Order details:', templateParams);
        
        // Simulate email sending
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
          title: language === 'en' ? 'Demo Mode - Email Not Sent' : 'ડેમો મોડ - ઈમેલ મોકલાયો નથી',
          description: language === 'en' 
            ? 'Please configure EmailJS credentials in CheckoutNew.jsx' 
            : 'કૃપા કરીને CheckoutNew.jsx માં EmailJS ક્રેડેન્શિયલ્સ ગોઠવો',
          variant: 'destructive'
        });
      } else {
        // Send email using EmailJS
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );

        setOrderSuccess(true);
        toast({
          title: language === 'en' ? 'Order Placed Successfully!' : 'ઓર્ડર સફળતાપૂર્વક મૂકાયો!',
          description: language === 'en' 
            ? `Order #${orderNumber} - Check your email for confirmation` 
            : `ઓર્ડર #${orderNumber} - પુષ્ટિકરણ માટે તમારો ઈમેલ તપાસો`,
        });

        // Clear form and cart after successful order
        setTimeout(() => {
          clearCart();
          setFormData({ name: '', phone: '', email: '', address: '', notes: '' });
          setOrderSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Email error:', error);
      toast({
        title: language === 'en' ? 'Order Failed' : 'ઓર્ડર નિષ્ફળ',
        description: language === 'en' 
          ? 'Unable to send email. Please try WhatsApp order.' 
          : 'ઈમેલ મોકલવામાં અસમર્થ. કૃપા કરીને WhatsApp ઓર્ડર અજમાવો.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <section id="checkout" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-10 h-10 text-[#ff8c19]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Your cart is empty' : 'તમારી કાર્ટ ખાલી છે'}
            </h2>
            <p className="text-gray-600 mb-8">
              {language === 'en' 
                ? 'Add some delicious pickles to get started with your order' 
                : 'તમારા ઓર્ડર સાથે શરૂઆત કરવા માટે કેટલાક સ્વાદિષ્ટ અચાર ઉમેરો'}
            </p>
            <Button
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-[#ff8c19] hover:bg-[#fa551e]"
            >
              {language === 'en' ? 'Browse Products' : 'ઉત્પાદનો બ્રાઉઝ કરો'}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="checkout" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'en' ? 'Complete Your Order' : 'તમારો ઓર્ડર પૂર્ણ કરો'}
          </h2>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Fill in your details and choose your preferred ordering method' 
              : 'તમારી વિગતો ભરો અને તમારી પસંદગીની ઓર્ડરિંગ પદ્ધતિ પસંદ કરો'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Customer Details' : 'ગ્રાહક વિગતો'}
            </h3>
            
            <form onSubmit={handleEmailOrder} className="space-y-6">
              <div>
                <Label htmlFor="name">{language === 'en' ? 'Full Name' : 'પૂરું નામ'} *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={language === 'en' ? 'Enter your name' : 'તમારું નામ દાખલ કરો'}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">{language === 'en' ? 'Phone Number' : 'ફોન નંબર'} *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={language === 'en' ? 'Enter your phone' : 'તમારો ફોન દાખલ કરો'}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">{language === 'en' ? 'Email Address' : 'ઈમેલ સરનામું'} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={language === 'en' ? 'Enter your email' : 'તમારો ઈમેલ દાખલ કરો'}
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">{language === 'en' ? 'Delivery Address' : 'ડિલિવરી સરનામું'} *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={language === 'en' ? 'Enter complete address' : 'સંપૂર્ણ સરનામું દાખલ કરો'}
                  className="mt-2"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="notes">{language === 'en' ? 'Special Instructions (Optional)' : 'વિશેષ સૂચનાઓ (વૈકલ્પિક)'}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={language === 'en' ? 'Any special requests?' : 'કોઈ વિશેષ વિનંતી?'}
                  className="mt-2"
                  rows={2}
                />
              </div>

              {/* Order Buttons */}
              <div className="space-y-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || orderSuccess}
                  className="w-full bg-[#ff8c19] hover:bg-[#fa551e] py-6 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {language === 'en' ? 'Processing...' : 'પ્રક્રિયા કરી રહ્યું છે...'}
                    </>
                  ) : orderSuccess ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      {language === 'en' ? 'Order Placed!' : 'ઓર્ડર મૂકાયો!'}
                    </>
                  ) : (
                    <>
                      <Mail className="w-5 h-5 mr-2" />
                      {language === 'en' ? 'Place Order via Email' : 'ઈમેલ દ્વારા ઓર્ડર મૂકો'}
                    </>
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      {language === 'en' ? 'OR' : 'અથવા'}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Order via WhatsApp' : 'WhatsApp દ્વારા ઓર્ડર કરો'}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {language === 'en' ? 'Order Summary' : 'ઓર્ડર સારાંશ'}
              </h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={language === 'en' ? item.nameEn : item.nameGu}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {language === 'en' ? item.nameEn : item.nameGu}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {language === 'en' ? 'Quantity' : 'જથ્થો'}: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>{language === 'en' ? 'Subtotal' : 'સબટોટલ'}</span>
                  <span className="font-semibold">₹{getCartTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{language === 'en' ? 'Delivery Charge' : 'ડિલિવરી ચાર્જ'}</span>
                  <span className="font-semibold">
                    {getDeliveryCharge() === 0 ? (
                      <span className="text-green-600">{language === 'en' ? 'FREE' : 'મફત'}</span>
                    ) : (
                      `₹${getDeliveryCharge()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                  <span>{language === 'en' ? 'Total' : 'કુલ'}</span>
                  <span className="text-[#ff8c19]">₹{getFinalTotal()}</span>
                </div>
              </div>

              {getCartTotal() < 500 && (
                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    {language === 'en' 
                      ? `Add ₹${500 - getCartTotal()} more to get FREE delivery!`
                      : `મફત ડિલિવરી મેળવવા માટે ₹${500 - getCartTotal()} વધુ ઉમેરો!`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
          <h4 className="font-bold text-blue-900 mb-2">
            📧 EmailJS Setup Instructions (For Admin):
          </h4>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Sign up at <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="underline">emailjs.com</a></li>
            <li>Create an Email Service and get Service ID</li>
            <li>Create an Email Template and get Template ID</li>
            <li>Get your Public Key from Account settings</li>
            <li>Replace the placeholder values in <code className="bg-blue-100 px-2 py-1 rounded">CheckoutNew.jsx</code></li>
          </ol>
        </div>
      </div>
    </section>
  );
};

export default CheckoutNew;
