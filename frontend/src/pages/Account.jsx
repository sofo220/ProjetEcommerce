import { useSelector } from 'react-redux';
import { Package, User as UserIcon, MapPin } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export default function Account() {
  const { user, token } = useSelector(state => state.auth);

  const mockUser = user || { name: "Client Test", email: "client@test.com" };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon Compte</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start space-x-4 cursor-pointer hover:bg-gray-50 transition">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><UserIcon size={32} /></div>
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Connexion & Sécurité</h2>
                <p className="text-gray-500 text-sm mt-1">{mockUser.name}</p>
                <p className="text-gray-500 text-sm">{mockUser.email}</p>
            </div>
        </div>

        {}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start space-x-4 cursor-pointer hover:bg-gray-50 transition">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><Package size={32} /></div>
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Vos Commandes</h2>
                <p className="text-gray-500 text-sm mt-1">Suivre, retourner ou acheter à nouveau des articles</p>
            </div>
        </div>

        {}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-start space-x-4 cursor-pointer hover:bg-gray-50 transition">
            <div className="p-3 bg-green-100 text-green-600 rounded-full"><MapPin size={32} /></div>
            <div>
                <h2 className="text-xl font-semibold text-gray-800">Vos Adresses</h2>
                <p className="text-gray-500 text-sm mt-1">Modifier les adresses et préférences de livraison</p>
            </div>
        </div>

      </div>

      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">Historique des commandes (Simulation)</h2>
        </div>
        <div className="p-6">
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex flex-wrap justify-between items-center border-b pb-3 mb-3 text-sm text-gray-600">
                    <div>
                        <span className="block font-semibold uppercase">Commande effectuée le</span>
                        12 Mai 2026
                    </div>
                    <div>
                        <span className="block font-semibold uppercase">Total</span>
                        139.99 €
                    </div>
                    <div>
                        <span className="block font-semibold uppercase">N° de commande</span>
                        #114-1234567-890123
                    </div>
                </div>
                <div className="flex items-center">
                    <img src="https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&auto=format&fit=crop&q=60" className="w-16 h-16 object-cover border rounded mr-4" />
                    <div>
                        <p className="font-semibold text-blue-600 hover:underline cursor-pointer">Veste d'hiver en duvet</p>
                        <p className="text-green-600 text-sm font-bold mt-1">Livré le 14 Mai 2026</p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
