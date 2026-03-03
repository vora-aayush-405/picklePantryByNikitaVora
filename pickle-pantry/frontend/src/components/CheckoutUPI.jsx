import React, { useState } from 'react';
import { Mail, MessageCircle, CheckCircle, Loader2, Download, Printer, Share2, CreditCard, Smartphone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import { useCart } from '../context/CartContext';
import emailjs from 'emailjs-com';
import { QRCodeSVG } from 'qrcode.react';

const UPI_ID = 'nikitavora@paytm'; // Replace with actual UPI ID
const BUSINESS_NAME = 'Pickle Pantry';

const CheckoutUPI = ({ language }) => {
  const { toast } = useToast();
  const { cartItems, getCartTotal, getDeliveryCharge, getFinalTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    pincode: '',
    upiTransactionId: '',
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${dateStr}-${random}`;
  };

  const generateReceiptNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `RCP-${dateStr}-${random}`;
  };

  const generateUPILink = () => {
    const amount = getFinalTotal();
    const orderNote = `Order from ${formData.name || 'Customer'}`;
    return `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(BUSINESS_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderNote)}`;
  };

  const generateQRCodeURL = () => {
    const upiLink = generateUPILink();
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiLink)}`;
  };

  const openGPay = () => {
    const upiLink = generateUPILink();
    window.location.href = `gpay://upi/${upiLink.replace('upi://', '')}`;
    
    setTimeout(() => {
      window.location.href = upiLink;
    }, 1000);
  };

  const openPhonePe = () => {
    const upiLink = generateUPILink();
    window.location.href = `phonepe://pay${upiLink.replace('upi://pay', '')}`;
    
    setTimeout(() => {
      window.location.href = upiLink;
    }, 1000);
  };

  const formatReceiptForWhatsApp = (receipt) => {
    const items = receipt.items.map((item, idx) => 
      `${idx + 1}. ${item.name} × ${item.quantity} = ₹${item.total}`
    ).join('\n');
    
    return language === 'en' 
      ? `🎉 *ORDER CONFIRMED!*\n\n*${BUSINESS_NAME}*\nReceipt: #${receipt.receiptId}\nOrder: #${receipt.orderId}\nDate: ${new Date(receipt.timestamp).toLocaleString()}\n\n━━━━━━━━━━━━━━━━━\n📦 *ORDER DETAILS*\n\n${items}\n\n━━━━━━━━━━━━━━━━━\n💰 *PAYMENT SUMMARY*\n\nSubtotal: ₹${receipt.pricing.subtotal}\nDelivery: ${receipt.pricing.deliveryCharge === 0 ? 'FREE' : '₹' + receipt.pricing.deliveryCharge}\n*Total Paid: ₹${receipt.pricing.total}*\n\nPayment: UPI\nTransaction ID: ${receipt.payment.upiTransactionId}\nStatus: ✅ Received (Verification Pending)\n\n━━━━━━━━━━━━━━━━━\n📍 *DELIVERY ADDRESS*\n${receipt.customer.address}\nPincode: ${receipt.customer.pincode}\n\n━━━━━━━━━━━━━━━━━\n🚚 Estimated Delivery: 3-5 days\n📞 Contact: 8200401199\n\nThank you for your order! 🙏`
      : `🎉 *ઓર્ડર કન્ફર્મ થયો!*\n\n*${BUSINESS_NAME}*\nરસીદ: #${receipt.receiptId}\nઓર્ડર: #${receipt.orderId}\nતારીખ: ${new Date(receipt.timestamp).toLocaleString()}\n\n━━━━━━━━━━━━━━━━━\n📦 *ઓર્ડર વિગતો*\n\n${items}\n\n━━━━━━━━━━━━━━━━━\n💰 *ચુકવણી સારાંશ*\n\nસબટોટલ: ₹${receipt.pricing.subtotal}\nડિલિવરી: ${receipt.pricing.deliveryCharge === 0 ? 'મફત' : '₹' + receipt.pricing.deliveryCharge}\n*કુલ ચુકવણી: ₹${receipt.pricing.total}*\n\nચુકવણી: UPI\nટ્રાન્ઝેક્શન ID: ${receipt.payment.upiTransactionId}\nસ્થિતિ: ✅ પ્રાપ્ત (ચકાસણી બાકી)\n\n━━━━━━━━━━━━━━━━━\n📍 *ડિલિવરી સરનામું*\n${receipt.customer.address}\nપિનકોડ: ${receipt.customer.pincode}\n\n━━━━━━━━━━━━━━━━━\n🚚 અંદાજિત ડિલિવરી: 3-5 દિવસ\n📞 સંપર્ક: 8200401199\n\nતમારા ઓર્ડર માટે આભાર! 🙏`;
  };

  const shareToWhatsApp = () => {
    if (receiptData) {
      const message = formatReceiptForWhatsApp(receiptData);
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const openReceiptInNewTab = (receipt) => {
    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) return;

    const itemsRows = receipt.items
      .map(
        (item, idx) => `
          <tr>
            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:center;">${idx + 1}</td>
            <td style="padding:8px;border-bottom:1px solid #ddd;">${item.name}</td>
            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:center;">${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;">₹${item.price}</td>
            <td style="padding:8px;border-bottom:1px solid #ddd;text-align:right;font-weight:600;">₹${item.total}</td>
          </tr>
        `
      )
      .join('');

    const statusLabel =
      language === 'en' ? 'Confirmed' : 'કન્ફર્મ થયું';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Order Receipt - ${BUSINESS_NAME}</title>
          <style>
            body { font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; padding: 24px; background: #f3f4f6; }
            .card { max-width: 800px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 24px 32px; box-shadow: 0 10px 25px rgba(15,23,42,0.12); }
            .header { text-align: center; border-bottom: 2px solid #e5e7eb; padding-bottom: 16px; margin-bottom: 24px; }
            .title { font-size: 28px; font-weight: 700; color: #f97316; margin-bottom: 4px; }
            .subtitle { font-size: 12px; color: #6b7280; }
            .section-title { font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #111827; }
            .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; }
            .label { font-size: 12px; color: #6b7280; margin-bottom: 2px; }
            .value { font-size: 14px; font-weight: 600; color: #111827; }
            .status { color: #16a34a; font-weight: 700; font-size: 14px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
            th { text-align: left; padding: 8px; font-size: 12px; font-weight: 600; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
            .summary-row { display: flex; justify-content: space-between; font-size: 14px; margin-top: 4px; }
            .summary-label { color: #4b5563; }
            .summary-value { font-weight: 600; }
            .total-row { border-top: 1px solid #e5e7eb; margin-top: 8px; padding-top: 8px; font-size: 18px; font-weight: 700; color: #f97316; }
            .footer { text-align: center; font-size: 12px; color: #6b7280; margin-top: 24px; }
            .muted { font-size: 11px; color: #9ca3af; margin-top: 8px; }
            .actions { margin-top: 24px; text-align: center; }
            .btn-print { display: inline-block; padding: 8px 16px; background: #2563eb; color: white; border-radius: 999px; border: none; font-size: 14px; cursor: pointer; }
            @media print {
              body { background: white; padding: 0; }
              .card { box-shadow: none; border-radius: 0; }
              .actions { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="title">${BUSINESS_NAME}</div>
              <div class="subtitle">by Nikita Vora</div>
              <div style="margin-top:12px;font-size:18px;font-weight:700;">${language === 'en' ? 'ORDER RECEIPT' : 'ઓર્ડર રસીદ'}</div>
            </div>

            <div class="grid">
              <div>
                <div class="label">${language === 'en' ? 'Receipt No.' : 'રસીદ નં.'}</div>
                <div class="value">${receipt.receiptId}</div>
              </div>
              <div>
                <div class="label">${language === 'en' ? 'Order No.' : 'ઓર્ડર નં.'}</div>
                <div class="value">${receipt.orderId}</div>
              </div>
              <div>
                <div class="label">${language === 'en' ? 'Date' : 'તારીખ'}</div>
                <div class="value">${new Date(receipt.timestamp).toLocaleString()}</div>
              </div>
              <div>
                <div class="label">${language === 'en' ? 'Status' : 'સ્થિતિ'}</div>
                <div class="status">✅ ${statusLabel}</div>
              </div>
            </div>

            <div style="margin-bottom:24px;">
              <div class="section-title">${language === 'en' ? 'Bill To:' : 'બિલ:'}</div>
              <div style="background:#f9fafb;padding:12px;border-radius:8px;">
                <div class="value">${receipt.customer.name}</div>
                <div style="font-size:12px;color:#6b7280;">${receipt.customer.phone}</div>
                <div style="font-size:12px;color:#6b7280;">${receipt.customer.email}</div>
                <div style="font-size:12px;color:#6b7280;margin-top:4px;">${receipt.customer.address}</div>
                <div style="font-size:12px;color:#6b7280;">Pincode: ${receipt.customer.pincode}</div>
              </div>
            </div>

            <div style="margin-bottom:24px;">
              <div class="section-title">${language === 'en' ? 'Order Items' : 'ઓર્ડર વસ્તુઓ'}</div>
              <table>
                <thead>
                  <tr>
                    <th style="width:40px;">#</th>
                    <th>${language === 'en' ? 'Item' : 'વસ્તુ'}</th>
                    <th style="text-align:center;">${language === 'en' ? 'Qty' : 'જથ્થો'}</th>
                    <th style="text-align:right;">${language === 'en' ? 'Price' : 'કિંમત'}</th>
                    <th style="text-align:right;">${language === 'en' ? 'Total' : 'કુલ'}</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsRows}
                </tbody>
              </table>
            </div>

            <div>
              <div class="summary-row">
                <span class="summary-label">${language === 'en' ? 'Subtotal' : 'સબટોટલ'}:</span>
                <span class="summary-value">₹${receipt.pricing.subtotal}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">${language === 'en' ? 'Delivery Charge' : 'ડિલિવરી ચાર્જ'}:</span>
                <span class="summary-value">${receipt.pricing.deliveryCharge === 0 ? (language === 'en' ? 'FREE' : 'મફત') : '₹' + receipt.pricing.deliveryCharge}</span>
              </div>
              <div class="summary-row total-row">
                <span>${language === 'en' ? 'Total' : 'કુલ'}:</span>
                <span>₹${receipt.pricing.total}</span>
              </div>
            </div>

            <div style="margin-top:16px;">
              <div class="section-title">${language === 'en' ? 'Payment Details' : 'ચુકવણી વિગતો'}</div>
              <div style="font-size:13px;color:#374151;margin-top:4px;">
                <div>${language === 'en' ? 'Method:' : 'પદ્ધતિ:'} UPI (Google Pay / UPI)</div>
                <div>${language === 'en' ? 'Transaction ID:' : 'ટ્રાન્ઝેક્શન ID:'} ${receipt.payment.upiTransactionId}</div>
              </div>
            </div>

            <div class="footer">
              <div>${language === 'en' ? 'Thank you for your order!' : 'તમારા ઓર્ડર માટે આભાર!'}</div>
              <div>${language === 'en' ? 'Estimated Delivery: 3-5 business days' : 'અંદાજિત ડિલિવરી: 3-5 વ્યવસાય દિવસ'}</div>
              <div>${language === 'en' ? 'Contact: 8200401199' : 'સંપર્ક: 8200401199'}</div>
              <div class="muted">${language === 'en' ? 'This is a computer-generated receipt' : 'આ કમ્પ્યુટર દ્વારા જનરેટ થયેલ રસીદ છે'}</div>
            </div>

            <div class="actions">
              <button class="btn-print" onclick="window.print()">
                ${language === 'en' ? 'Print Receipt' : 'રસીદ છાપો'}
              </button>
            </div>
          </div>
        </body>
      </html>
    `;

    win.document.open();
    win.document.write(html);
    win.document.close();
    win.focus();
  };

  const printReceipt = () => {
    const receiptElement = document.getElementById('receipt');
    if (!receiptElement) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const receiptHtml = receiptElement.outerHTML;

    // Copy stylesheet links so Tailwind/styles apply in the print window
    const stylesheetTags = Array.from(
      document.querySelectorAll('link[rel="stylesheet"]')
    )
      .map((link) => `<link rel="stylesheet" href="${link.href}" />`)
      .join('');

    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Order Receipt</title>
          ${stylesheetTags}
        </head>
        <body>
          ${receiptHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.email || !formData.address || !formData.pincode) {
      toast({
        title: language === 'en' ? 'Missing Information' : 'માહિતી ખૂટે છે',
        description: language === 'en' ? 'Please fill in all required fields' : 'કૃપા કરીને બધા જરૂરી ક્ષેત્રો ભરો',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.upiTransactionId) {
      toast({
        title: language === 'en' ? 'UPI Transaction ID Required' : 'UPI ટ્રાન્ઝેક્શન ID જરૂરી છે',
        description: language === 'en' ? 'Please enter your UPI transaction ID' : 'કૃપા કરીને તમારો UPI ટ્રાન્ઝેક્શન ID દાખલ કરો',
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
      const orderId = generateOrderNumber();
      const receiptId = generateReceiptNumber();
      const timestamp = Date.now();

      const receipt = {
        orderId,
        receiptId,
        timestamp,
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          pincode: formData.pincode
        },
        items: cartItems.map(item => ({
          name: language === 'en' ? item.nameEn : item.nameGu,
          nameEn: item.nameEn,
          nameGu: item.nameGu,
          quantity: item.quantity,
          price: parseInt(item.price.replace(/[^0-9]/g, '')),
          total: parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity
        })),
        payment: {
          method: 'UPI',
          upiTransactionId: formData.upiTransactionId,
          amount: getFinalTotal(),
          status: 'pending_verification'
        },
        pricing: {
          subtotal: getCartTotal(),
          deliveryCharge: getDeliveryCharge(),
          total: getFinalTotal()
        },
        orderStatus: 'pending_verification',
        specialInstructions: formData.notes || 'None'
      };

      // Save to localStorage (Admin Dashboard will read this)
      const orders = JSON.parse(localStorage.getItem('pickleOrders') || '[]');
      orders.push(receipt);
      localStorage.setItem('pickleOrders', JSON.stringify(orders));

      // Also persist to backend (MongoDB)
      try {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(receipt),
        });
      } catch (err) {
        console.error('Failed to save order to backend', err);
      }

      setReceiptData(receipt);
      setOrderSuccess(true);
      setShowReceipt(true);

      // Open printable receipt in a separate tab/page
      openReceiptInNewTab(receipt);
      
      toast({
        title: language === 'en' ? 'Order Placed Successfully!' : 'ઓર્ડર સફળતાપૂર્વક મૂકાયો!',
        description: language === 'en' 
          ? `Order #${orderId} - Payment verification pending` 
          : `ઓર્ડર #${orderId} - ચુકવણી ચકાસણી બાકી છે`,
      });

      // Clear form and cart after delay
      setTimeout(() => {
        clearCart();
        setFormData({ name: '', phone: '', email: '', address: '', pincode: '', upiTransactionId: '', notes: '' });
      }, 5000);
    } catch (error) {
      console.error('Order error:', error);
      toast({
        title: language === 'en' ? 'Order Failed' : 'ઓર્ડર નિષ્ફળ',
        description: language === 'en' ? 'Unable to place order. Please try again.' : 'ઓર્ડર મૂકવામાં અસમર્થ. કૃપા કરીને ફરી પ્રયાસ કરો.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showReceipt && receiptData) {
    return (
      <section id="checkout" className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Receipt */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-12 print:shadow-none" id="receipt">
            {/* Header */}
            <div className="text-center mb-8 pb-8 border-b-2 border-gray-200">
              <h1 className="text-4xl font-bold text-[#ff8c19] mb-2">{BUSINESS_NAME}</h1>
              <p className="text-sm text-gray-600">by Nikita Vora</p>
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  {language === 'en' ? 'ORDER RECEIPT' : 'ઓર્ડર રસીદ'}
                </h2>
              </div>
            </div>

            {/* IDs and Date */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-sm text-gray-500">{language === 'en' ? 'Receipt No.' : 'રસીદ નં.'}</p>
                <p className="font-bold text-lg">{receiptData.receiptId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{language === 'en' ? 'Order No.' : 'ઓર્ડર નં.'}</p>
                <p className="font-bold text-lg">{receiptData.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{language === 'en' ? 'Date' : 'તારીખ'}</p>
                <p className="font-semibold">{new Date(receiptData.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">{language === 'en' ? 'Status' : 'સ્થિતિ'}</p>
                <p className="font-semibold text-orange-600">
                  {language === 'en' ? 'Pending Verification' : 'ચકાસણી બાકી'}
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3 text-gray-900">
                {language === 'en' ? 'Bill To:' : 'બિલ:'}
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">{receiptData.customer.name}</p>
                <p className="text-sm text-gray-600">{receiptData.customer.phone}</p>
                <p className="text-sm text-gray-600">{receiptData.customer.email}</p>
                <p className="text-sm text-gray-600 mt-2">{receiptData.customer.address}</p>
                <p className="text-sm text-gray-600">Pincode: {receiptData.customer.pincode}</p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">#</th>
                    <th className="text-left p-3 text-sm font-semibold">{language === 'en' ? 'Item' : 'વસ્તુ'}</th>
                    <th className="text-center p-3 text-sm font-semibold">{language === 'en' ? 'Qty' : 'જથ્થો'}</th>
                    <th className="text-right p-3 text-sm font-semibold">{language === 'en' ? 'Price' : 'કિંમત'}</th>
                    <th className="text-right p-3 text-sm font-semibold">{language === 'en' ? 'Total' : 'કુલ'}</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData.items.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3 text-sm">{idx + 1}</td>
                      <td className="p-3 text-sm">{item.name}</td>
                      <td className="p-3 text-sm text-center">{item.quantity}</td>
                      <td className="p-3 text-sm text-right">₹{item.price}</td>
                      <td className="p-3 text-sm text-right font-semibold">₹{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Summary */}
            <div className="border-t-2 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>{language === 'en' ? 'Subtotal' : 'સબટોટલ'}:</span>
                <span className="font-semibold">₹{receiptData.pricing.subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{language === 'en' ? 'Delivery Charge' : 'ડિલિવરી ચાર્જ'}:</span>
                <span className="font-semibold">
                  {receiptData.pricing.deliveryCharge === 0 ? (
                    <span className="text-green-600">{language === 'en' ? 'FREE' : 'મફત'}</span>
                  ) : (
                    `₹${receiptData.pricing.deliveryCharge}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-[#ff8c19] pt-2 border-t">
                <span>{language === 'en' ? 'Total:' : 'કુલ:'}</span>
                <span>₹{receiptData.pricing.total}</span>
              </div>
            </div>

            {/* Payment Info */}
            <div className="mt-8 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-sm mb-2">
                {language === 'en' ? 'Payment Details' : 'ચુકવણી વિગતો'}
              </h4>
              <div className="space-y-1 text-sm">
                <p><span className="font-semibold">{language === 'en' ? 'Method:' : 'પદ્ધતિ:'}</span> UPI</p>
                <p><span className="font-semibold">{language === 'en' ? 'Transaction ID:' : 'ટ્રાન્ઝેક્શન ID:'}</span> {receiptData.payment.upiTransactionId}</p>
                <p><span className="font-semibold">{language === 'en' ? 'Status:' : 'સ્થિતિ:'}</span> <span className="text-orange-600">{language === 'en' ? 'Pending Verification' : 'ચકાસણી બાકી'}</span></p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
              <p className="mb-2">{language === 'en' ? 'Thank you for your order!' : 'તમારા ઓર્ડર માટે આભાર!'}</p>
              <p className="mb-4">{language === 'en' ? 'Estimated Delivery: 3-5 business days' : 'અંદાજિત ડિલિવરી: 3-5 વ્યવસાય દિવસ'}</p>
              <p>{language === 'en' ? 'Contact: 8200401199' : 'સંપર્ક: 8200401199'}</p>
              <p className="mt-4 text-xs">{language === 'en' ? 'This is a computer-generated receipt' : 'આ કમ્પ્યુટર દ્વારા જનરેટ થયેલ રસીદ છે'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8 print:hidden">
            <Button onClick={openReceiptInNewTab} className="flex-1 bg-blue-600 hover:bg-blue-700">
              <Printer className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Print Receipt' : 'રસીદ છાપો'}
            </Button>
            <Button onClick={shareToWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700">
              <Share2 className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Share to WhatsApp' : 'WhatsApp પર શેર કરો'}
            </Button>
            <Button
              onClick={() => {
                setShowReceipt(false);
                setOrderSuccess(false);
                setReceiptData(null);
              }}
              variant="outline"
              className="flex-1"
            >
              {language === 'en' ? 'Close' : 'બંધ કરો'}
            </Button>
          </div>
        </div>
      </section>
    );
  }

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
              ? 'Pay via UPI and enter your transaction ID to complete the order' 
              : 'UPI દ્વારા ચુકવણી કરો અને ઓર્ડર પૂર્ણ કરવા તમારો ટ્રાન્ઝેક્શન ID દાખલ કરો'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* UPI Payment Section */}
          <div className="space-y-6">
            {/* QR Code Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <Smartphone className="w-6 h-6 mr-2 text-[#ff8c19]" />
                {language === 'en' ? 'Scan to Pay' : 'ચુકવણી માટે સ્કેન કરો'}
              </h3>
              
              <div className="bg-gray-50 p-6 rounded-xl mb-6 inline-block">
                <QRCodeSVG value={generateUPILink()} size={200} />
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">{language === 'en' ? 'UPI ID' : 'UPI ID'}</p>
                <div className="bg-gray-100 px-4 py-2 rounded-lg inline-flex items-center gap-2">
                  <code className="font-mono font-semibold">{UPI_ID}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(UPI_ID);
                      toast({ title: language === 'en' ? 'UPI ID Copied!' : 'UPI ID કૉપિ થયો!' });
                    }}
                    className="h-8"
                  >
                    📋
                  </Button>
                </div>
              </div>

              <div className="text-3xl font-bold text-[#ff8c19] mb-6">
                ₹{getFinalTotal()}
              </div>

              {/* UPI App Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={openGPay}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Pay with Google Pay' : 'Google Pay થી ચુકવણી'}
                </Button>
                
                <Button
                  onClick={openPhonePe}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-6"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Pay with PhonePe' : 'PhonePe થી ચુકવણી'}
                </Button>

                <Button
                  onClick={() => window.location.href = generateUPILink()}
                  variant="outline"
                  className="w-full border-2 border-gray-300 py-6"
                >
                  {language === 'en' ? 'Other UPI Apps' : 'અન્ય UPI એપ્સ'}
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
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
            </div>
          </div>

          {/* Customer Details Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'en' ? 'Customer Details' : 'ગ્રાહક વિગતો'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">{language === 'en' ? 'Phone' : 'ફોન'} *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit number"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">{language === 'en' ? 'Pincode' : 'પિનકોડ'} *</Label>
                  <Input
                    id="pincode"
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="6-digit pincode"
                    className="mt-2"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">{language === 'en' ? 'Email' : 'ઈમેલ'} *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={language === 'en' ? 'your@email.com' : 'તમારો@ઈમેલ.com'}
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
                  placeholder={language === 'en' ? 'Complete address with landmark' : 'લેન્ડમાર્ક સાથે સંપૂર્ણ સરનામું'}
                  className="mt-2"
                  rows={3}
                  required
                />
              </div>

              <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                <Label htmlFor="upiTxnId" className="text-yellow-900">
                  💳 {language === 'en' ? 'UPI Transaction ID' : 'UPI ટ્રાન્ઝેક્શન ID'} *
                </Label>
                <Input
                  id="upiTxnId"
                  type="text"
                  value={formData.upiTransactionId}
                  onChange={(e) => setFormData({ ...formData, upiTransactionId: e.target.value })}
                  placeholder={language === 'en' ? 'Enter 12-digit UPI Ref ID' : '12-અંકનો UPI Ref ID દાખલ કરો'}
                  className="mt-2 bg-white"
                  required
                />
                <p className="text-xs text-yellow-800 mt-2">
                  {language === 'en' 
                    ? 'After payment, enter the transaction/reference ID from your UPI app' 
                    : 'ચુકવણી પછી, તમારી UPI એપમાંથી ટ્રાન્ઝેક્શન/સંદર્ભ ID દાખલ કરો'}
                </p>
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
                    <CheckCircle className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'Submit Order' : 'ઓર્ડર સબમિટ કરો'}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutUPI;
