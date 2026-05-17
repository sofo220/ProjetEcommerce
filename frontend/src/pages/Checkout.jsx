import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { clearCart } from '../store/cartSlice';
import { CreditCard, Truck, Wallet } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Checkout() {
  const { items, total } = useSelector(state => state.cart);
  const { token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState('delivery');

  const fraisLivraison = total > 500 || total === 0 ? 0 : 49.00;
  const totalFinal = total + fraisLivraison;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
        dispatch(clearCart());
        toast.success("Commande validée avec succès sur Shoppex !", { autoClose: 5000 });
        navigate('/');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">

        <div className="lg:w-2/3 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">1</span> Adresse de livraison au Maroc</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                        <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                        <input required type="text" placeholder="Quartier, Rue, Immeuble..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                        <select required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="">Sélectionner une ville</option>
                            <option value="Casablanca">Casablanca</option>
                            <option value="Rabat">Rabat</option>
                            <option value="Marrakech">Marrakech</option>
                            <option value="Tanger">Tanger</option>
                            <option value="Fès">Fès</option>
                            <option value="Agadir">Agadir</option>
                        </select>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input required type="tel" placeholder="06 XX XX XX XX" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center"><span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm mr-3">2</span> Mode de paiement</h2>

                <div className="space-y-4">
                    <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'delivery' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <div className="flex items-center">
                            <input type="radio" name="payment" value="delivery" checked={paymentMethod === 'delivery'} onChange={() => setPaymentMethod('delivery')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <Wallet className="ml-3 mr-2 text-gray-600" />
                            <span className="font-medium text-gray-900">Paiement à la livraison (Cash en main)</span>
                        </div>
                    </label>

                    <label className={`block border rounded-lg p-4 cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <div className="flex items-center">
                            <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                            <CreditCard className="ml-3 mr-2 text-gray-600" />
                            <span className="font-medium text-gray-900">Carte Bancaire Marocaine / Internationale</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Résumé de la commande</h2>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map(item => (
                    <div key={item.id} className="flex items-center text-sm">
                        <img src={item.image || 'https://via.placeholder.com/50'} alt={item.name} className="w-12 h-12 object-contain rounded border border-gray-100" />
                        <div className="ml-3 flex-1">
                            <p className="font-medium text-gray-800 line-clamp-1">{item.name}</p>
                            <p className="text-gray-500">Qté: {item.quantity}</p>
                        </div>
                        <div className="font-medium">{(item.price * item.quantity).toLocaleString('fr-FR')} DH</div>
                    </div>
                ))}
            </div>

            <div className="space-y-3 text-sm text-gray-600 mb-6 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{total.toLocaleString('fr-FR')} DH</span>
                </div>
                <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>{fraisLivraison === 0 ? 'Gratuit' : `${fraisLivraison.toLocaleString('fr-FR')} DH`}</span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-8 border-t border-gray-200 pt-4">
                <span className="text-lg font-bold text-gray-900">Total à payer</span>
                <span className="text-2xl font-extrabold text-blue-600">{totalFinal.toLocaleString('fr-FR')} DH</span>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-lg shadow-md transition-all text-lg flex items-center justify-center">
              Confirmer la commande
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
