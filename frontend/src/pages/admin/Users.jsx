import { useState, useEffect } from 'react';
import {
  Users as UsersIcon,
  Search,
  Shield,
  ShieldCheck,
  Trash2,
  X,
  Save,
  UserCheck,
  ShoppingBag,
  Download
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);

      setUsers([
        { id: 1, name: 'Ahmed Benali', email: 'ahmed@example.com', is_admin: false, created_at: '2024-01-15', total_orders: 12, total_spent: 15600 },
        { id: 2, name: 'Fatima Zahra', email: 'fatima@example.com', is_admin: false, created_at: '2024-02-20', total_orders: 8, total_spent: 9200 },
        { id: 3, name: 'Mohammed Amine', email: 'mohammed@example.com', is_admin: true, created_at: '2024-01-10', total_orders: 0, total_spent: 0 },
        { id: 4, name: 'Khadija El Mansouri', email: 'khadija@example.com', is_admin: false, created_at: '2024-03-05', total_orders: 25, total_spent: 32500 },
        { id: 5, name: 'Youssef Bennani', email: 'youssef@example.com', is_admin: false, created_at: '2024-02-28', total_orders: 3, total_spent: 4100 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole ||
                       (selectedRole === 'admin' && user.is_admin) ||
                       (selectedRole === 'customer' && !user.is_admin);
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (user) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir ${user.is_admin ? 'retirer les droits admin' : 'donner les droits admin'} à "${user.name}" ?`)) return;

    try {
      await api.put(`/admin/users/${user.id}/role`, { is_admin: !user.is_admin });
      toast.success('Rôle mis à jour avec succès');
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${user.name}" ?`)) return;

    try {
      await api.delete(`/admin/users/${user.id}`);
      toast.success('Utilisateur supprimé avec succès');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const openUserDetails = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const stats = {
    total: users.length,
    admins: users.filter(u => u.is_admin).length,
    customers: users.filter(u => !u.is_admin).length,
    totalRevenue: users.reduce((sum, u) => sum + (u.total_spent || 0), 0)
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-500 mt-1">{users.length} utilisateurs inscrits</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Download size={20} />
          Exporter CSV
        </button>
      </div>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <UsersIcon size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Administrateurs</p>
              <p className="text-xl font-bold text-gray-900">{stats.admins}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <UserCheck size={20} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Clients</p>
              <p className="text-xl font-bold text-gray-900">{stats.customers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <ShoppingBag size={20} />
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
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Tous les rôles</option>
              <option value="admin">Administrateurs</option>
              <option value="customer">Clients</option>
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
                <th className="p-4 font-semibold text-gray-600">Utilisateur</th>
                <th className="p-4 font-semibold text-gray-600">Rôle</th>
                <th className="p-4 font-semibold text-gray-600">Inscrit le</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Commandes</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Dépensé</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                      user.is_admin
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.is_admin ? <ShieldCheck size={14} /> : <UserCheck size={14} />}
                      {user.is_admin ? 'Admin' : 'Client'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">
                    {formatDate(user.created_at)}
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {user.total_orders || 0}
                    </span>
                  </td>
                  <td className="p-4 text-center font-bold text-gray-900">
                    {(user.total_spent || 0).toLocaleString('fr-FR')} DH
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openUserDetails(user)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <UsersIcon size={18} />
                      </button>
                      <button
                        onClick={() => handleRoleChange(user)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title={user.is_admin ? 'Retirer admin' : 'Donner admin'}
                      >
                        {user.is_admin ? <Shield size={18} /> : <ShieldCheck size={18} />}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    {searchTerm || selectedRole ? 'Aucun utilisateur ne correspond à votre recherche' : 'Aucun utilisateur'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Détails de l'utilisateur</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <span className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    selectedUser.is_admin
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.is_admin ? 'Administrateur' : 'Client'}
                  </span>
                </div>
              </div>

              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Total commandes</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedUser.total_orders || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Total dépensé</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(selectedUser.total_spent || 0).toLocaleString('fr-FR')} DH
                  </p>
                </div>
              </div>

              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-500 text-sm">Date d'inscription</p>
                <p className="font-medium text-gray-900">{formatDate(selectedUser.created_at)}</p>
              </div>

              {}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleRoleChange(selectedUser)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ShieldCheck size={18} />
                  {selectedUser.is_admin ? 'Retirer admin' : 'Donner admin'}
                </button>
                <button
                  onClick={() => handleDelete(selectedUser)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 size={18} />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}