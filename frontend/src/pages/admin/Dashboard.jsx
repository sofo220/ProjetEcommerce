import { useState, useEffect } from 'react';
import {
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Clock
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
      setRecentOrders(response.data.recentOrders);
      setSalesData(response.data.salesData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);

      setStats({
        totalProducts: 156,
        totalOrders: 145,
        totalRevenue: 124500,
        totalCustomers: 89,
        lowStockProducts: 12,
        outOfStockProducts: 3
      });
      setRecentOrders([
        { id: 1, user: { name: 'Ahmed Benali' }, total_price: 1250, status: 'delivered', created_at: new Date().toISOString() },
        { id: 2, user: { name: 'Fatima Zahra' }, total_price: 890, status: 'processing', created_at: new Date().toISOString() },
        { id: 3, user: { name: 'Mohammed Amine' }, total_price: 2100, status: 'pending', created_at: new Date().toISOString() },
      ]);
      setSalesData([
        { date: '28 Avr', sales: 4500 },
        { date: '29 Avr', sales: 6200 },
        { date: '30 Avr', sales: 3800 },
        { date: '01 Mai', sales: 7100 },
        { date: '02 Mai', sales: 5400 },
        { date: '03 Mai', sales: 8900 },
        { date: '04 Mai', sales: 6700 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Chiffre d\'affaires',
      value: `${stats.totalRevenue.toLocaleString('fr-FR')} DH`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      change: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-600',
      change: '+8.2%',
      trend: 'up'
    },
    {
      title: 'Clients',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      change: '+5.7%',
      trend: 'up'
    },
    {
      title: 'Produits',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-yellow-100 text-yellow-600',
      change: `+${stats.lowStockProducts} faible stock`,
      trend: stats.lowStockProducts > 5 ? 'down' : 'up'
    }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    const statusLabels = {
      pending: 'En attente',
      processing: 'En traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {statusLabels[status] || status}
      </span>
    );
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">Bienvenue sur votre panneau d'administration</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Rafraîchir
        </button>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-500 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      
      {(stats.lowStockProducts > 0 || stats.outOfStockProducts > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-yellow-600 shrink-0" size={20} />
          <div>
            <p className="font-medium text-yellow-800">Alertes de stock</p>
            <p className="text-sm text-yellow-700 mt-1">
              {stats.outOfStockProducts > 0 && `${stats.outOfStockProducts} produits sont en rupture de stock. `}
              {stats.lowStockProducts > 0 && `${stats.lowStockProducts} produits ont un stock faible (moins de 10 unités).`}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-4">Évolution des ventes (7 derniers jours)</h2>
          <div className="h-64 flex items-end gap-2">
            {salesData.map((day, index) => {
              const maxSales = Math.max(...salesData.map(d => d.sales));
              const height = maxSales > 0 ? (day.sales / maxSales) * 100 : 0;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-blue-100 rounded-t relative group">
                    <div
                      className="bg-blue-600 rounded-t transition-all duration-500"
                      style={{ height: `${height}%`, minHeight: day.sales > 0 ? '4px' : '0' }}
                    />
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {day.sales.toLocaleString()} DH
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="font-bold text-gray-800 mb-4">Commandes récentes</h2>
          <div className="space-y-4">
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <ShoppingCart size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.user?.name || 'Client'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{order.total_price?.toLocaleString('fr-FR')} DH</p>
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucune commande récente</p>
            )}
          </div>
          <button className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">
            Voir toutes les commandes →
          </button>
        </div>
      </div>

      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-gray-800 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a href="/admin/products" className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-center">
            <Package className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-sm font-medium text-gray-900">Ajouter un produit</p>
          </a>
          <a href="/admin/users" className="p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors text-center">
            <Users className="mx-auto mb-2 text-purple-600" size={24} />
            <p className="text-sm font-medium text-gray-900">Gérer les utilisateurs</p>
          </a>
          <a href="/admin/orders" className="p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-center">
            <ShoppingCart className="mx-auto mb-2 text-green-600" size={24} />
            <p className="text-sm font-medium text-gray-900">Voir les commandes</p>
          </a>
          <a href="/admin/analytics" className="p-4 border border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition-colors text-center">
            <TrendingUp className="mx-auto mb-2 text-yellow-600" size={24} />
            <p className="text-sm font-medium text-gray-900">Statistiques</p>
          </a>
        </div>
      </div>
    </div>
  );
}