import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Lock, LogOut, TrendingUp, ShoppingBag, DollarSign, CheckCircle, Clock, Download, Eye, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminDashboard = ({ language }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    try {
      // Prefer backend (MongoDB) orders
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        return;
      }
    } catch (err) {
      console.error('Failed to load orders from backend, falling back to localStorage', err);
    }

    // Fallback to localStorage if backend is unavailable
    const savedOrders = JSON.parse(localStorage.getItem('pickleOrders') || '[]');
    setOrders(savedOrders);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'admin', password }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        alert(language === 'en' ? 'Invalid password!' : 'અમાન્ય પાસવર્ડ!');
      }
    } catch (err) {
      console.error('Admin login failed', err);
      alert(language === 'en' ? 'Login failed. Please try again.' : 'લોગિન નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  const verifyPayment = (orderId) => {
    const updatedOrders = orders.map(order =>
      order.orderId === orderId
        ? { ...order, payment: { ...order.payment, status: 'verified' }, orderStatus: 'verified' }
        : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('pickleOrders', JSON.stringify(updatedOrders));
  };

  const getFilteredOrders = () => {
    const now = new Date();
    return orders.filter(order => {
      const orderDate = new Date(order.timestamp);
      if (filter === 'today') {
        return orderDate.toDateString() === now.toDateString();
      } else if (filter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return orderDate >= weekAgo;
      } else if (filter === 'month') {
        return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const getStats = () => {
    const filtered = getFilteredOrders();
    const totalRevenue = filtered.reduce((sum, order) => {
      // Add null checks for order structure
      if (order && order.pricing && typeof order.pricing.total === 'number') {
        return sum + order.pricing.total;
      }
      return sum;
    }, 0);
    
    const pendingCount = filtered.filter(o => 
      o && o.payment && o.payment.status === 'pending_verification'
    ).length;
    
    const verifiedCount = filtered.filter(o => 
      o && o.payment && o.payment.status === 'verified'
    ).length;
    
    const avgOrderValue = filtered.length > 0 ? Math.round(totalRevenue / filtered.length) : 0;

    return {
      totalOrders: filtered.length,
      totalRevenue,
      pendingCount,
      verifiedCount,
      avgOrderValue
    };
  };

  const getRevenueChartData = () => {
    const last7Days = [];
    const revenueByDay = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last7Days.push(dateStr);
      revenueByDay[dateStr] = 0;
    }

    orders.forEach(order => {
      const orderDate = new Date(order.timestamp);
      const dateStr = orderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (revenueByDay.hasOwnProperty(dateStr)) {
        revenueByDay[dateStr] += order.pricing.total;
      }
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: language === 'en' ? 'Revenue (₹)' : 'આવક (₹)',
          data: last7Days.map(day => revenueByDay[day]),
          borderColor: '#ff8c19',
          backgroundColor: 'rgba(255, 140, 25, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const getProductSalesData = () => {
    const productSales = {};
    
    orders.forEach(order => {
      order.items.forEach(item => {
        if (productSales[item.nameEn]) {
          productSales[item.nameEn] += item.quantity;
        } else {
          productSales[item.nameEn] = item.quantity;
        }
      });
    });

    const sortedProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return {
      labels: sortedProducts.map(([name]) => name),
      datasets: [
        {
          label: language === 'en' ? 'Units Sold' : 'વેચાણ એકમો',
          data: sortedProducts.map(([, qty]) => qty),
          backgroundColor: [
            '#ff8c19',
            '#fa551e',
            '#b4dc19',
            '#61525a',
            '#5f9dff',
          ],
        },
      ],
    };
  };

  const exportToCSV = () => {
    const filtered = getFilteredOrders();
    const csv = [
      ['Order ID', 'Receipt ID', 'Date', 'Customer', 'Phone', 'Total', 'UPI Ref', 'Status'].join(','),
      ...filtered.map(order => [
        order.orderId,
        order.receiptId,
        new Date(order.timestamp).toLocaleString(),
        order.customer.name,
        order.customer.phone,
        order.pricing.total,
        order.payment.upiTransactionId,
        order.payment.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${filter}_${Date.now()}.csv`;
    a.click();
  };

  const stats = getStats();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-2xl max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-[#ff8c19] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {language === 'en' ? 'Admin Login' : 'એડમિન લોગિન'}
            </h1>
            <p className="text-gray-600">
              {language === 'en' ? 'Pickle Pantry Dashboard' : 'પિકલ પેન્ટ્રી ડેશબોર્ડ'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === 'en' ? 'Enter password' : 'પાસવર્ડ દાખલ કરો'}
                className="text-center text-lg py-6"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-[#ff8c19] hover:bg-[#fa551e] py-6 text-lg">
              {language === 'en' ? 'Login' : 'લોગિન'}
            </Button>
            {/* <p className="text-xs text-center text-gray-500">
              {language === 'en' ? 'Default password: admin123' : 'ડિફૉલ્ટ પાસવર્ડ: admin123'}
            </p> */}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {language === 'en' ? 'Admin Dashboard' : 'એડમિન ડેશબોર્ડ'}
              </h1>
              <p className="text-gray-600 mt-1">
                {language === 'en' ? 'Pickle Pantry Order Management' : 'પિકલ પેન્ટ્રી ઓર્ડર મેનેજમેન્ટ'}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2">
              <LogOut className="w-4 h-4" />
              {language === 'en' ? 'Logout' : 'લોગઆઉટ'}
            </Button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {['all', 'today', 'week', 'month'].map((f) => (
              <Button
                key={f}
                onClick={() => setFilter(f)}
                variant={filter === f ? 'default' : 'outline'}
                className={filter === f ? 'bg-[#ff8c19] hover:bg-[#fa551e]' : ''}
              >
                {language === 'en' 
                  ? f.charAt(0).toUpperCase() + f.slice(1)
                  : f === 'all' ? 'બધા' : f === 'today' ? 'આજે' : f === 'week' ? 'અઠવાડિયું' : 'મહિનો'}
              </Button>
            ))}
            <Button onClick={exportToCSV} variant="outline" className="ml-auto gap-2">
              <Download className="w-4 h-4" />
              {language === 'en' ? 'Export CSV' : 'CSV નિકાસ'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">{language === 'en' ? 'Total Orders' : 'કુલ ઓર્ડર'}</h3>
              <ShoppingBag className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">{language === 'en' ? 'Total Revenue' : 'કુલ આવક'}</h3>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">₹{stats.totalRevenue}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">{language === 'en' ? 'Verified' : 'ચકાસેલા'}</h3>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.verifiedCount}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">{language === 'en' ? 'Pending' : 'બાકી'}</h3>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingCount}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-[#ff8c19]" />
              {language === 'en' ? 'Revenue Trend (Last 7 Days)' : 'આવક વલણ (છેલ્લા 7 દિવસ)'}
            </h3>
            <Line data={getRevenueChartData()} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {language === 'en' ? 'Top 5 Products' : 'ટોચના 5 ઉત્પાદનો'}
            </h3>
            <Bar data={getProductSalesData()} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {language === 'en' ? 'Recent Orders' : 'તાજેતરના ઓર્ડર'}
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    {language === 'en' ? 'Order ID' : 'ઓર્ડર ID'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    {language === 'en' ? 'Customer' : 'ગ્રાહક'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    {language === 'en' ? 'Date' : 'તારીખ'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    {language === 'en' ? 'Amount' : 'રકમ'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    {language === 'en' ? 'Status' : 'સ્થિતિ'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    {language === 'en' ? 'Actions' : 'ક્રિયાઓ'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {getFilteredOrders().reverse().map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-mono text-gray-900">{order.orderId}</td>
                    <td className="px-4 py-4 text-sm">
                      <div className="font-medium text-gray-900">{order.customer.name}</div>
                      <div className="text-gray-500">{order.customer.phone}</div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {new Date(order.timestamp).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-gray-900">₹{order.pricing.total}</td>
                    <td className="px-4 py-4 text-sm">
                      <Badge
                        className={
                          order.payment.status === 'verified'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        }
                      >
                        {order.payment.status === 'verified' 
                          ? (language === 'en' ? 'Verified' : 'ચકાસેલ')
                          : (language === 'en' ? 'Pending' : 'બાકી')}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-sm space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {order.payment.status === 'pending_verification' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => verifyPayment(order.orderId)}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {getFilteredOrders().length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {language === 'en' ? 'No orders found' : 'કોઈ ઓર્ડર મળ્યા નથી'}
              </div>
            )}
          </div>
        </div>

        {/* Order Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {language === 'en' ? 'Order Details' : 'ઓર્ડર વિગતો'}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">{language === 'en' ? 'Order ID' : 'ઓર્ડર ID'}</p>
                  <p className="font-mono font-bold">{selectedOrder.orderId}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">{language === 'en' ? 'Customer' : 'ગ્રાહક'}</p>
                  <p className="font-semibold">{selectedOrder.customer.name}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.phone}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">{language === 'en' ? 'Address' : 'સરનામું'}</p>
                  <p className="text-sm">{selectedOrder.customer.address}</p>
                  <p className="text-sm">Pincode: {selectedOrder.customer.pincode}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">{language === 'en' ? 'Items' : 'વસ્તુઓ'}</p>
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-2 border-b">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-semibold">₹{item.total}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-sm text-gray-500">{language === 'en' ? 'UPI Transaction ID' : 'UPI ટ્રાન્ઝેક્શન ID'}</p>
                  <p className="font-mono">{selectedOrder.payment.upiTransactionId}</p>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{language === 'en' ? 'Total' : 'કુલ'}</span>
                    <span className="text-[#ff8c19]">₹{selectedOrder.pricing.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
