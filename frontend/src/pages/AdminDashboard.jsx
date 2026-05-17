import { Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 145, revenue: 124500, customers: 89 });
  const [products, setProducts] = useState([]);

  useEffect(() => {

    api.get('/products').then(res => {
        setProducts(res.data);
        setStats(prev => ({ ...prev, totalProducts: res.data.length }));
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">

      <div className="w-full md:w-64 bg-slate-900 text-white rounded-xl overflow-hidden shrink-0 h-fit">
        <div className="p-4 bg-blue-600 font-bold text-lg border-b border-blue-700 flex items-center">
            <ShoppingCart size={20} className="mr-2" /> Shoppex Admin
        </div>
        <ul className="flex flex-col py-2">
            <li className="px-4 py-3 hover:bg-slate-800 cursor-pointer border-l-4 border-blue-500 bg-slate-800">Vue d'ensemble</li>
            <li className="px-4 py-3 hover:bg-slate-800 cursor-pointer border-l-4 border-transparent text-gray-300">Gestion Produits</li>
            <li className="px-4 py-3 hover:bg-slate-800 cursor-pointer border-l-4 border-transparent text-gray-300">Commandes clients</li>
            <li className="px-4 py-3 hover:bg-slate-800 cursor-pointer border-l-4 border-transparent text-gray-300">Rapports & Ventes</li>
        </ul>
      </div>

      <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full mr-4"><DollarSign size={24} /></div>
                <div>
                    <p className="text-gray-500 text-sm">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.revenue.toLocaleString('fr-FR')} DH</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
                <div className="p-3 bg-green-100 text-green-600 rounded-full mr-4"><ShoppingCart size={24} /></div>
                <div>
                    <p className="text-gray-500 text-sm">Commandes</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-full mr-4"><Users size={24} /></div>
                <div>
                    <p className="text-gray-500 text-sm">Clients</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.customers}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full mr-4"><Package size={24} /></div>
                <div>
                    <p className="text-gray-500 text-sm">Produits Actifs</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="font-bold text-gray-800">Inventaire Produits (Réel API)</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">+ Ajouter</button>
            </div>
            <div className="overflow-x-auto max-h-[400px]">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-white">
                        <tr className="text-gray-500 text-sm border-b">
                            <th className="p-4 font-semibold">ID</th>
                            <th className="p-4 font-semibold">Produit</th>
                            <th className="p-4 font-semibold">Catégorie</th>
                            <th className="p-4 font-semibold">Prix (DH)</th>
                            <th className="p-4 font-semibold text-center">Stock</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {products.map(p => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 text-gray-500">#{p.id}</td>
                            <td className="p-4 font-medium flex items-center">
                                <img src={p.image || 'https://via.placeholder.com/30'} className="w-8 h-8 rounded mr-3 object-cover border" />
                                {p.name}
                            </td>
                            <td className="p-4">{p.category?.name || '-'}</td>
                            <td className="p-4 font-bold">{Number(p.price).toLocaleString('fr-FR')}</td>
                            <td className="p-4 text-center">
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${p.stock > 20 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                    {p.stock}
                                </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <button className="text-blue-600 hover:underline">Éditer</button>
                                <button className="text-red-600 hover:underline">Suppr</button>
                            </td>
                        </tr>
                        ))}
                        {products.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">Aucun produit en base de données.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
}
