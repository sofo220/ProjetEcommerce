import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess } from '../store/authSlice';
import api from '../services/api';
import { toast } from 'react-toastify';
import { ShoppingCart } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
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
    return "Erreur lors de l'inscription";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/register', { name, email, password });
      dispatch(loginSuccess(response.data));
      toast.success("Compte créé avec succès !");
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
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Créer un compte</h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Votre nom</label>
              <div className="mt-1">
                <input required type="text" value={name} onChange={(e)=>setName(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
              <div className="mt-1">
                <input required type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="mt-1">
                <input required minLength="6" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Au moins 6 caractères" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                {loading ? 'Création...' : 'Créer votre compte'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Vous avez déjà un compte ? </span>
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Connectez-vous</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
