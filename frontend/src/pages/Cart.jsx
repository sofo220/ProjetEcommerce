import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShieldCheck } from 'lucide-react';
import { addToCart, clearCart } from '../store/cartSlice';

export default function Cart() {
  const { items, total } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fraisLivraison = total > 500 || total === 0 ? 0 : 49.00;
  const totalFinal = total + fraisLivraison;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="bg-white p-10 rounded-xl shadow-md text-center max-w-md w-full border border-gray-100">
            <img src="https://cdn-icons-png.flaticon.com/512/1132/1132903.png" alt="Panier vide" className="w-32 mx-auto mb-6 opacity-50" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Votre panier Shoppex est vide</h2>
            <p className="text-gray-500 mb-8">Découvrez nos produits et trouvez votre bonheur !</p>
            <Link to="/products" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors w-full inline-block">
            Continuer mes achats
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Votre Panier</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase">
                <div className="col-span-6">Produit</div>
                <div className="col-span-2 text-center">Prix unitaire</div>
                <div className="col-span-2 text-center">Quantité</div>
                <div className="col-span-2 text-right">Total</div>
            </div>

            <ul className="divide-y divide-gray-200">
              {items.map(item => (
                <li key={item.id} className="p-4 sm:p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-6 flex items-center w-full">
                        <Link to={`/product/${item.id}`} className="shrink-0 w-24 h-24 bg-gray-50 rounded-md overflow-hidden p-2 border border-gray-100">
                            <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-contain" />
                        </Link>
                        <div className="ml-4 flex-1">
                            <Link to={`/product/${item.id}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600 line-clamp-2">
                                {item.name}
                            </Link>
                            <p className="text-sm text-green-600 mt-1">En stock</p>
                            {}
                            <button onClick={() => {}} className="text-red-500 hover:text-red-700 text-sm flex items-center mt-2">
                                <Trash2 size={14} className="mr-1" /> Supprimer
                            </button>
                        </div>
                    </div>

                    <div className="col-span-2 text-center font-medium text-gray-700 w-full md:w-auto flex justify-between md:block">
                        <span className="md:hidden text-gray-500">Prix :</span>
                        {Number(item.price).toLocaleString('fr-FR')} DH
                    </div>

                    <div className="col-span-2 flex justify-center w-full md:w-auto">
                        <div className="flex items-center border border-gray-300 rounded bg-white">
                            <button className="p-1.5 hover:bg-gray-100 text-gray-600"><Minus size={14} /></button>
                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                            <button onClick={() => dispatch(addToCart(item))} className="p-1.5 hover:bg-gray-100 text-gray-600"><Plus size={14} /></button>
                        </div>
                    </div>

                    <div className="col-span-2 text-right font-bold text-gray-900 w-full md:w-auto flex justify-between md:block text-lg">
                        <span className="md:hidden text-gray-500 font-normal text-base">Sous-total :</span>
                        {(item.price * item.quantity).toLocaleString('fr-FR')} DH
                    </div>
                </li>
              ))}
            </ul>
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
                <button onClick={() => dispatch(clearCart())} className="text-sm text-gray-500 hover:text-red-600 border border-gray-300 px-4 py-2 rounded">Vider le panier</button>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>

            <div className="space-y-4 text-sm text-gray-600 mb-6 border-b border-gray-200 pb-6">
                <div className="flex justify-between">
                    <span>Sous-total ({items.reduce((acc, i)=>acc+i.quantity,0)} articles)</span>
                    <span className="font-medium text-gray-900">{total.toLocaleString('fr-FR')} DH</span>
                </div>
                <div className="flex justify-between">
                    <span>Frais de livraison</span>
                    <span className="font-medium text-gray-900">{fraisLivraison === 0 ? <span className="text-green-600 font-bold">Gratuit</span> : `${fraisLivraison.toLocaleString('fr-FR')} DH`}</span>
                </div>
            </div>

            <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-gray-900">Total TTC</span>
                <span className="text-2xl font-extrabold text-blue-600">{totalFinal.toLocaleString('fr-FR')} DH</span>
            </div>

            <button onClick={() => navigate('/checkout')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-full shadow transition-colors mb-4 text-lg">
              Passer la commande
            </button>

            <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
                <ShieldCheck size={16} className="mr-2 text-green-500" />
                Paiement 100% sécurisé au Maroc
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
