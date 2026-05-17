import { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Eye,
  X,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);

      setOrders([
        {
          id: 1,
          user: { name: 'Ahmed Benali', email: 'ahmed@example.com' },
          total_price: 12500,
          status: 'delivered',
          created_at: '2024-05-01T10:30:00Z',
          items: [
            { product: { name: 'Smartphone XYZ', price: 8000 }, quantity: 1 },
            { product: { name: 'Coque de protection', price: 150 }, quantity: 2 }
          ]
        },
        {
          id: 2,
          user: { name: 'Fatima Zahra', email: 'fatima@example.com' },
          total_price: 4500,
          status: 'processing',
          created_at: '2024-05-02T14:15:00Z',
          items: [
            { product: { name: 'Montre connectée', price: 4500 }, quantity: 1 }
          ]
        },
        {
          id: 3,
          user: { name: 'Mohammed Amine', email: 'mohammed@example.com' },
          total_price: 2100,
          status: 'pending',
          created_at: '2024-05-03T09:00:00Z',
          items: [
            { product: { name: 'Écouteurs sans fil', price: 700 }, quantity: 3 }
          ]
        },
        {
          id: 4,
          user: { name: 'Khadija El Mansouri', email: 'khadija@example.com' },
          total_price: 8900,
          status: 'shipped',
          created_at: '2024-05-02T16:45:00Z',
          items: [
            { product: { name: 'Tablette 10"', price: 8900 }, quantity: 1 }
          ]
        },
        {
          id: 5,
          user: { name: 'Youssef Bennani', email: 'youssef@example.com' },
          total_price: 3200,
          status: 'cancelled',
          created_at: '2024-05-01T11:20:00Z',
          items: [
            { product: { name: 'Enceinte Bluetooth', price: 1600 }, quantity: 2 }
          ]
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm);
    const matchesStatus = !selectedStatus || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Statut mis à jour avec succès');
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      processing: { label: 'En traitement', color: 'bg-blue-100 text-blue-800', icon: Package },
      shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: Truck },
      delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: XCircle },
    };
    return statusMap[status] || statusMap.pending;
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total_price || 0), 0)
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des commandes</h1>
          <p className="text-gray-500 mt-1">{orders.length} commandes au total</p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <ShoppingCart size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total commandes</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">En attente</p>
              <p className="text-xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Package size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">En traitement</p>
              <p className="text-xl font-bold text-gray-900">{stats.processing}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <CreditCard size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Revenu total</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString('fr-FR')} DH</p>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher (ID, nom, email)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="processing">En traitement</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </select>
          </div>
        </div>
      </div>

      {}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Commande</th>
                <th className="p-4 font-semibold text-gray-600">Client</th>
                <th className="p-4 font-semibold text-gray-600">Date</th>
                <th className="p-4 font-semibold text-gray-600">Statut</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Total</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-medium text-gray-900">
                        #{order.id.toString().padStart(4, '0')}
                      </span>
                      <p className="text-sm text-gray-500">
                        {order.items?.length || 0} article(s)
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-gray-900">{order.user?.name || 'Inconnu'}</p>
                      <p className="text-sm text-gray-500">{order.user?.email || '-'}</p>
                    </td>
                    <td className="p-4 text-gray-500 text-sm">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <statusInfo.icon size={14} />
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold text-gray-900">
                      {order.total_price?.toLocaleString('fr-FR')} DH
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openOrderDetails(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    {searchTerm || selectedStatus ? 'Aucune commande ne correspond à votre recherche' : 'Aucune commande'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Commande #{selectedOrder.id.toString().padStart(4, '0')}
                </h2>
                <p className="text-sm text-gray-500">{formatDate(selectedOrder.created_at)}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Informations client</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p className="font-medium text-gray-900">{selectedOrder.user?.name || 'Inconnu'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{selectedOrder.user?.email || '-'}</p>
                  </div>
                </div>
              </div>

              {}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Articles commandés</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium text-gray-600">Produit</th>
                        <th className="p-3 text-center text-sm font-medium text-gray-600">Qté</th>
                        <th className="p-3 text-right text-sm font-medium text-gray-600">Prix</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="p-3 text-gray-900">{item.product?.name || 'Produit inconnu'}</td>
                          <td className="p-3 text-center text-gray-500">{item.quantity}</td>
                          <td className="p-3 text-right font-medium text-gray-900">
                            {item.product?.price?.toLocaleString('fr-FR')} DH
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Statut de la commande</h3>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="pending">En attente</option>
                  <option value="processing">En traitement</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>

              {}
              <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total de la commande</span>
                <span className="text-2xl font-bold text-blue-600">
                  {selectedOrder.total_price?.toLocaleString('fr-FR')} DH
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}