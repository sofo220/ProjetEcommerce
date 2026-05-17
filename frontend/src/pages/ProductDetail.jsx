import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { Star, Truck, ShieldCheck, ArrowLeft, Plus, Minus, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

const FALLBACK_IMG = 'https://via.placeholder.com/500?text=Produit';
const SERVIETTES_IMG = 'https://images.unsplash.com/photo-1617957743103-310accdf7005?w=900&auto=format&fit=crop&q=80';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [imgSrc, setImgSrc] = useState(FALLBACK_IMG);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
        setQuantity(1);
        const name = String(res.data?.name || '').toLowerCase();
        if (name.includes('serviettes') && name.includes('bain')) setImgSrc(SERVIETTES_IMG);
        else setImgSrc(res.data?.image || FALLBACK_IMG);
        window.scrollTo(0, 0);

        const allRes = await api.get('/products');
        const similar = allRes.data.filter(p => p.category_id === res.data.category_id && p.id !== res.data.id).slice(0, 4);
        setSimilarProducts(similar);
      } catch (error) {
        console.error("Produit introuvable", error);
        toast.error("Produit introuvable.");
        navigate('/');
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    for(let i=0; i<quantity; i++){
        dispatch(addToCart(product));
    }
    toast.success(`${quantity} x ${product.name} ajouté(s) au panier !`, { position: "bottom-right", autoClose: 2000 });
  };

  if (!product) return <div className="text-center py-20">Chargement...</div>;

  const rating = 4.5;
  const reviews = 124;

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft size={16} className="mr-1" /> Retour
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-12">

          <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4 h-96">
            <img
              src={imgSrc}
              alt={product.name}
              className="max-w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              onError={() => setImgSrc(FALLBACK_IMG)}
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < Math.floor(rating) ? "currentColor" : "none"} />
                ))}
              </div>
              <span className="text-sm text-blue-600 ml-2 hover:underline cursor-pointer">
                {reviews} évaluations
              </span>
            </div>

            <div className="text-4xl font-extrabold text-gray-900 mb-6 border-b border-gray-200 pb-6">
              {Number(product.price).toLocaleString('fr-FR')} <span className="text-2xl text-gray-600">DH</span>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description du produit</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• Qualité garantie Shoppex</li>
                <li>• Livraison express Maroc</li>
                <li>• Retours sous 14 jours</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-auto">
                <div className="flex items-center mb-6">
                    <span className="font-semibold mr-4 text-gray-700">Quantité :</span>
                    <div className="flex items-center border border-gray-300 rounded bg-white">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 text-gray-600"><Minus size={16} /></button>
                        <input type="number" readOnly value={quantity} className="w-12 text-center font-bold outline-none" />
                        <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 text-gray-600"><Plus size={16} /></button>
                    </div>
                </div>

                <div className="flex flex-col space-y-3">
                    <button onClick={handleAddToCart} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow transition-colors flex items-center justify-center">
                        <ShoppingCart size={20} className="mr-2" /> Ajouter au panier
                    </button>
                    <button onClick={() => { handleAddToCart(); navigate('/checkout'); }} className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-full shadow transition-colors">
                        Acheter cet article
                    </button>
                </div>

                <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center"><Truck size={16} className="mr-2 text-blue-600" /> Livraison partout au Maroc</div>
                    <div className="flex items-center"><ShieldCheck size={16} className="mr-2 text-green-600" /> Transaction 100% sécurisée</div>
                    <div className="flex items-center"><span className="text-green-600 font-bold mr-2 text-lg">•</span> En stock ({product.stock} disponibles)</div>
                </div>
            </div>

          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">Les clients ont aussi regardé</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {similarProducts.map(p => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
      )}

    </div>
  );
}
