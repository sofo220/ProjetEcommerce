import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { ShoppingCart, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const FALLBACK_IMG = 'https://via.placeholder.com/300?text=Produit';
const SERVIETTES_IMG = 'https://images.pexels.com/photos/4210373/pexels-photo-4210373.jpeg?auto=compress&cs=tinysrgb&w=900';

const normalize = (v) => String(v || '').trim().toLowerCase();
const getPreferredImage = (product) => {
  const name = normalize(product?.name);
  if (name.includes('serviettes') && name.includes('bain')) return SERVIETTES_IMG;
  return product?.image || '';
};

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [imgSrc, setImgSrc] = useState(getPreferredImage(product) || FALLBACK_IMG);

  useEffect(() => {
    setImgSrc(getPreferredImage(product) || FALLBACK_IMG);
  }, [product]);

  const rating = 4.5;
  const reviews = Math.floor(Math.random() * 200) + 10;

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.name} ajouté au panier !`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full relative"
    >
      <Link to={`/product/${product.id}`} className="relative h-56 overflow-hidden group p-4 flex justify-center items-center bg-gray-50">
        <img
          src={imgSrc}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
          onError={() => setImgSrc(FALLBACK_IMG)}
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mt-2 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < Math.floor(rating) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-2">
            ({reviews})
          </span>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-gray-900">{Number(product.price).toLocaleString('fr-FR')} <span className="text-lg">DH</span></span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-md transition-colors"
            title="Ajouter au panier"
          >
            <ShoppingCart size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
