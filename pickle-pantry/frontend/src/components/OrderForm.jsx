import React, { useState } from 'react';
import { pickleVarieties } from '../mock';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useToast } from '../hooks/use-toast';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const OrderForm = ({ language }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    orders: []
  });

  const [selectedPickles, setSelectedPickles] = useState({});

  const handlePickleToggle = (pickleId) => {
    setSelectedPickles(prev => ({
      ...prev,
      [pickleId]: prev[pickleId] ? { ...prev[pickleId] } : { quantity: 1 }
    }));
  };

  const handleQuantityChange = (pickleId, change) => {
    setSelectedPickles(prev => {
      const current = prev[pickleId]?.quantity || 1;
      const newQuantity = Math.max(1, current + change);
      return {
        ...prev,
        [pickleId]: { quantity: newQuantity }
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.address) {
      toast({
        title: language === 'en' ? 'Missing Information' : 'માહિતી ખૂટે છે',
        description: language === 'en' ? 'Please fill in all fields' : 'કૃપા કરીને બધા ક્ષેત્રો ભરો',
        variant: 'destructive'
      });
      return;
    }

    if (Object.keys(selectedPickles).length === 0) {
      toast({
        title: language === 'en' ? 'No Pickles Selected' : 'અચાર પસંદ નથી',
        description: language === 'en' ? 'Please select at least one pickle variety' : 'કૃપા કરીને ઓછામાં ઓછી એક અચારની જાત પસંદ કરો',
        variant: 'destructive'
      });
      return;
    }

    // Build order summary
    const orderItems = Object.entries(selectedPickles).map(([pickleId, { quantity }]) => {
      const pickle = pickleVarieties.find(p => p.id === parseInt(pickleId));
      return `${pickle.nameEn} (${pickle.nameGu}) - ${quantity} jar(s)`;
    });

    // Store in localStorage (mock backend)
    const orders = JSON.parse(localStorage.getItem('pickleOrders') || '[]');
    orders.push({
      ...formData,
      orders: orderItems,
      date: new Date().toISOString()
    });
    localStorage.setItem('pickleOrders', JSON.stringify(orders));

    toast({
      title: language === 'en' ? 'Order Placed Successfully!' : 'ઓર્ડર સફળતાપૂર્વક મૂકવામાં આવ્યો!',
      description: language === 'en' ? 'We will contact you soon' : 'અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું',
    });

    // Reset form
    setFormData({ name: '', phone: '', address: '', orders: [] });
    setSelectedPickles({});
  };

  return (
    <section id="order" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#1e1919] mb-4">
            {language === 'en' ? 'Place Your Order' : 'તમારો ઓર્ડર મૂકો'}
          </h2>
          <div className="w-24 h-1 bg-[#ff8c19] mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-[#736c64] max-w-2xl mx-auto">
            {language === 'en'
              ? 'Select your favorite pickles and fill in your details. We will contact you to confirm your order.'
              : 'તમારા મનપસંદ અચાર પસંદ કરો અને તમારી વિગતો ભરો. અમે તમારો ઓર્ડર કન્ફર્મ કરવા માટે સંપર્ક કરીશું.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Pickle Selection */}
          <div>
            <h3 className="text-2xl font-bold text-[#1e1919] mb-6 flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2 text-[#ff8c19]" />
              {language === 'en' ? 'Select Pickles' : 'અચાર પસંદ કરો'}
            </h3>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {pickleVarieties.map((pickle) => (
                <div
                  key={pickle.id}
                  className={`border rounded-xl p-4 transition-all duration-300 ${
                    selectedPickles[pickle.id]
                      ? 'border-[#ff8c19] bg-[#fff5e6]'
                      : 'border-[#5f9dff66] hover:border-[#ff8c19]/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={!!selectedPickles[pickle.id]}
                      onCheckedChange={() => handlePickleToggle(pickle.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-[#1e1919]">
                            {language === 'en' ? pickle.nameEn : pickle.nameGu}
                          </h4>
                          <p className="text-sm text-[#736c64]">{pickle.price}</p>
                        </div>
                      </div>
                      
                      {selectedPickles[pickle.id] && (
                        <div className="flex items-center gap-3 mt-3">
                          <span className="text-sm text-[#736c64]">
                            {language === 'en' ? 'Quantity:' : 'જથ્થો:'}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(pickle.id, -1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-bold text-[#1e1919] min-w-[2rem] text-center">
                              {selectedPickles[pickle.id].quantity}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(pickle.id, 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Details Form */}
          <div>
            <h3 className="text-2xl font-bold text-[#1e1919] mb-6">
              {language === 'en' ? 'Your Details' : 'તમારી વિગતો'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-[#1e1919]">
                  {language === 'en' ? 'Full Name' : 'પૂરું નામ'} *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2 border-[#5f9dff66] focus:border-[#ff8c19]"
                  placeholder={language === 'en' ? 'Enter your name' : 'તમારું નામ દાખલ કરો'}
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-[#1e1919]">
                  {language === 'en' ? 'Phone Number' : 'ફોન નંબર'} *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2 border-[#5f9dff66] focus:border-[#ff8c19]"
                  placeholder={language === 'en' ? 'Enter your phone number' : 'તમારો ફોન નંબર દાખલ કરો'}
                />
              </div>

              <div>
                <Label htmlFor="address" className="text-[#1e1919]">
                  {language === 'en' ? 'Delivery Address' : 'ડિલિવરી સરનામું'} *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-2 border-[#5f9dff66] focus:border-[#ff8c19] min-h-[120px]"
                  placeholder={language === 'en' ? 'Enter your complete address' : 'તમારું સંપૂર્ણ સરનામું દાખલ કરો'}
                />
              </div>

              {/* Order Summary */}
              {Object.keys(selectedPickles).length > 0 && (
                <div className="bg-[#f7f5f2] rounded-lg p-4">
                  <h4 className="font-bold text-[#1e1919] mb-3">
                    {language === 'en' ? 'Order Summary' : 'ઓર્ડર સારાંશ'}
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(selectedPickles).map(([pickleId, { quantity }]) => {
                      const pickle = pickleVarieties.find(p => p.id === parseInt(pickleId));
                      return (
                        <div key={pickleId} className="flex justify-between text-sm">
                          <span className="text-[#736c64]">
                            {language === 'en' ? pickle.nameEn : pickle.nameGu}
                          </span>
                          <span className="font-bold text-[#1e1919]">{quantity} jar(s)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-[#ff8c19] hover:bg-[#fa551e] text-white py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {language === 'en' ? 'Place Order' : 'ઓર્ડર મૂકો'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f7f5f2;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff8c19;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #fa551e;
        }
      `}</style>
    </section>
  );
};

export default OrderForm;