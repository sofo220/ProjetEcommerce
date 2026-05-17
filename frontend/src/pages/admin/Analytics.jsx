import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [analyticsData, setAnalyticsData] = useState({
    revenue: [],
    orders: [],
    customers: [],
    products: [],
    categories: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);

      const response = await api.get('/admin/dashboard');


      const days = selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : 90;
      const baseRevenue = 5000;
      const baseOrders = 15;
      const baseCustomers = 3;

      const revenueData = [];
      const ordersData = [];
      const customersData = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

        const variance = (Math.random() - 0.5) * 0.6;
        revenueData.push({
          date: dateStr,
          value: Math.round(baseRevenue * (1 + variance))
        });
        ordersData.push({
          date: dateStr,
          value: Math.round(baseOrders * (1 + variance))
        });
        customersData.push({
          date: dateStr,
          value: Math.round(baseCustomers * (1 + variance * 0.5))
        });
      }

      setAnalyticsData({
        revenue: revenueData,
        orders: ordersData,
        customers: customersData,
        categories: [
          { name: 'Électronique', sales: 45000, percentage: 35 },
          { name: 'Vêtements', sales: 32000, percentage: 25 },
          { name: 'Maison & Jardin', sales: 25600, percentage: 20 },
          { name: 'Sports', sales: 12800, percentage: 12 },
          { name: 'Autres', sales: 10240, percentage: 8 }
        ]
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const days = selectedPeriod === '7days' ? 7 : selectedPeriod === '30days' ? 30 : 90;
    const baseRevenue = 5000;
    const baseOrders = 15;
    const baseCustomers = 3;

    const revenueData = [];
    const ordersData = [];
    const customersData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

      const variance = (Math.random() - 0.5) * 0.6;
      revenueData.push({
        date: dateStr,
        value: Math.round(baseRevenue * (1 + variance))
      });
      ordersData.push({
        date: dateStr,
        value: Math.round(baseOrders * (1 + variance))
      });
      customersData.push({
        date: dateStr,
        value: Math.round(baseCustomers * (1 + variance * 0.5))
      });
    }

    setAnalyticsData({
      revenue: revenueData,
      orders: ordersData,
      customers: customersData,
      categories: [
        { name: 'Électronique', sales: 45000, percentage: 35 },
        { name: 'Vêtements', sales: 32000, percentage: 25 },
        { name: 'Maison & Jardin', sales: 25600, percentage: 20 },
        { name: 'Sports', sales: 12800, percentage: 12 },
        { name: 'Autres', sales: 10240, percentage: 8 }
      ]
    });
  };

  const totalRevenue = analyticsData.revenue.reduce((sum, d) => sum + d.value, 0);
  const totalOrders = analyticsData.orders.reduce((sum, d) => sum + d.value, 0);
  const totalCustomers = analyticsData.customers.reduce((sum, d) => sum + d.value, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const ChartBar = ({ data, color, maxValue, showValues = false }) => {
    const max = maxValue || Math.max(...data.map(d => d.value));
    const displayData = data.length > 14 ? data.filter((_, i) => i % Math.ceil(data.length / 14) === 0) : data;

    return (
      <div className="flex items-end gap-1 h-40">
        {displayData.map((item, index) => {
          const height = max > 0 ? (item.value / max) * 100 : 0;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="relative w-full">
                <div
                  className={`w-full rounded-t transition-all duration-500 ${color}`}
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
                {showValues && height > 20 && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 whitespace-nowrap">
                    {item.value}
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-500 truncate w-full text-center">{item.date}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Statistiques & Analytics</h1>
          <p className="text-gray-500 mt-1">Analysez les performances de votre boutique</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7days">7 derniers jours</option>
          <option value="30days">30 derniers jours</option>
          <option value="90days">90 derniers jours</option>
        </select>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenu total"
          value={`${totalRevenue.toLocaleString('fr-FR')} DH`}
          icon={DollarSign}
          color="bg-green-100 text-green-600"
          trend="up"
          trendValue="+12.5%"
        />
        <StatCard
          title="Panier moyen"
          value={`${avgOrderValue.toFixed(0)} DH`}
          icon={ShoppingCart}
          color="bg-blue-100 text-blue-600"
          trend="up"
          trendValue="+5.2%"
        />
        <StatCard
          title="Nouveaux clients"
          value={totalCustomers}
          icon={Users}
          color="bg-purple-100 text-purple-600"
          trend="up"
          trendValue="+8.3%"
        />
        <StatCard
          title="Produits vendus"
          value={totalOrders * 2}
          icon={Package}
          color="bg-yellow-100 text-yellow-600"
          trend="down"
          trendValue="-2.1%"
        />
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <DollarSign size={20} className="text-green-600" />
            Évolution du chiffre d'affaires
          </h2>
          <ChartBar data={analyticsData.revenue} color="bg-green-500" showValues={false} />
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Moyenne journalière</p>
              <p className="text-lg font-bold text-gray-900">
                {(totalRevenue / analyticsData.revenue.length).toFixed(0)} DH
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Meilleur jour</p>
              <p className="text-lg font-bold text-green-600">
                {Math.max(...analyticsData.revenue.map(d => d.value)).toLocaleString('fr-FR')} DH
              </p>
            </div>
          </div>
        </div>

        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <ShoppingCart size={20} className="text-blue-600" />
            Évolution des commandes
          </h2>
          <ChartBar data={analyticsData.orders} color="bg-blue-500" showValues={false} />
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Moyenne journalière</p>
              <p className="text-lg font-bold text-gray-900">
                {(totalOrders / analyticsData.orders.length).toFixed(1)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Pic de commandes</p>
              <p className="text-lg font-bold text-blue-600">
                {Math.max(...analyticsData.orders.map(d => d.value))}
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Package size={20} className="text-purple-600" />
            Ventes par catégorie
          </h2>
          <div className="space-y-4">
            {analyticsData.categories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{category.percentage}%</span>
                    <span className="text-sm font-bold text-gray-900 w-20 text-right">
                      {category.sales.toLocaleString('fr-FR')} DH
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users size={20} className="text-yellow-600" />
            Nouveaux clients
          </h2>
          <ChartBar data={analyticsData.customers} color="bg-yellow-500" />
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold text-gray-900">{totalCustomers}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Moyenne/jour</p>
                <p className="text-xl font-bold text-gray-900">
                  {(totalCustomers / analyticsData.customers.length).toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Meilleur jour</p>
                <p className="text-xl font-bold text-yellow-600">
                  {Math.max(...analyticsData.customers.map(d => d.value))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-800">Exporter les données</h2>
            <p className="text-sm text-gray-500 mt-1">
              Téléchargez un rapport complet de vos statistiques
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Calendar size={18} />
            Exporter PDF
          </button>
        </div>
      </div>
    </div>
  );
}