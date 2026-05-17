import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../store/authSlice';
import api from '../services/api';
import { toast } from 'react-toastify';
import { ShoppingCart } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getErrorMessage = (err) => {
    const data = err?.response?.data;
    if (typeof data?.message === 'string' && data.message.trim()) return data.message;
    const firstField = data?.errors && Object.keys(data.errors)[0];
    const firstError = firstField && data.errors[firstField]?.[0];
    if (typeof firstError === 'string' && firstError.trim()) return firstError;
    if (err?.response?.status === 401) return "Identifiants incorrects";
    return "Erreur lors de la connexion";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      dispatch(loginSuccess(response.data));
      toast.success("Connexion réussie !");
      navigate('/');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link to="/" className="inline-flex items-center text-3xl font-extrabold text-blue-600">
            <ShoppingCart size={32} className="mr-2" />
            Shoppex
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Connectez-vous à votre compte</h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
              <div className="mt-1">
                <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="mt-1">
                <input required type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Nouveau sur Shoppex ?</span></div>
            </div>
            <div className="mt-6">
              <Link to="/register" className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Créer votre compte Shoppex
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
