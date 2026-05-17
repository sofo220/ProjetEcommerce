import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Store, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { loginSuccess } from '../store/authSlice';

export default function BecomeSeller() {
  const { token, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    seller_store_name: user?.seller_store_name || '',
    seller_phone: user?.seller_phone || '',
    seller_city: user?.seller_city || '',
    seller_description: user?.seller_description || ''
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.seller_store_name.trim() || !formData.seller_phone.trim() || !formData.seller_city.trim()) {
      toast.error('Merci de remplir le nom de boutique, le téléphone et la ville');
      return;
    }

    try {
      setLoading(true);
      const response = await api.post('/become-seller', formData);
      dispatch(loginSuccess({ user: response.data.user, token }));
      toast.success('Votre espace vendeur est prêt');
      navigate('/seller');
    } catch (error) {
      if (error.response?.status === 400) {
        navigate('/seller');
        return;
      }
      toast.error(error.response?.data?.message || 'Impossible de créer votre espace vendeur');
    } finally {
      setLoading(false);
    }
  };

  if (user?.is_seller) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-xl mx-auto text-center">
          <Store className="mx-auto text-blue-600 mb-4" size={44} />
          <h1 className="text-2xl font-bold text-gray-900">Vous êtes déjà vendeur</h1>
          <Link to="/seller" className="inline-flex mt-6 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Ouvrir mon dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
        <ArrowLeft size={18} className="mr-2" />
        Retour
      </Link>

      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Store size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Devenir vendeur</h1>
            <p className="text-gray-500">Remplissez les informations de votre boutique.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom de la boutique *</label>
            <input
              value={formData.seller_store_name}
              onChange={(e) => updateField('seller_store_name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ex: Boutique Amal"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
              <input
                value={formData.seller_phone}
                onChange={(e) => updateField('seller_phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+212 6 00 00 00 00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
              <input
                value={formData.seller_city}
                onChange={(e) => updateField('seller_city', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Casablanca"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.seller_description}
              onChange={(e) => updateField('seller_description', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Présentez votre boutique et vos produits."
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
            >
              <Save size={18} />
              {loading ? 'Création...' : 'Créer mon espace vendeur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
