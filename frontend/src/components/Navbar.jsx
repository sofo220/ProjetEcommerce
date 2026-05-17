import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { LogOut, Menu, ShoppingCart, User, Search, Store } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../services/api';

export default function Navbar() {
    const { token, user } = useSelector(state => state.auth);
    const { items } = useSelector(state => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const firstName = user?.name?.split(' ')?.[0];

    const categories = [
        { name: 'Toutes les catégories', path: '/products' },
        { name: 'Électronique', path: '/products?category=electronique' },
        { name: 'Vêtements', path: '/products?category=vetements' },
        { name: 'Maison', path: '/products?category=maison' },
        { name: 'Meilleures Ventes', path: '/products?sort=best-sellers' },
        { name: 'Nouveautés', path: '/products?sort=newest' },
    ];

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    const handleBecomeSeller = () => {
        if (!token) {
            navigate('/login');
            return;
        }
        navigate('/become-seller');
    };

    return (
        <header className="bg-slate-900 sticky top-0 z-50">
            {}
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">

                {}
                <Link to="/" className="text-3xl font-extrabold text-white flex items-center flex-shrink-0 group">
                    <ShoppingCart size={32} className="text-blue-500 mr-2 group-hover:scale-110 transition-transform" />
                    Shoppex
                </Link>

                {}
                <div className="hidden lg:flex flex-1 mx-8">
                    <SearchBar />
                </div>

                {}
                <div className="flex items-center space-x-6 text-white">
                    {}
                    {token ? (
                        <div className="relative group cursor-pointer flex flex-col items-center">
                            <div className="flex items-center space-x-1 hover:text-blue-400 transition">
                                <User size={24} />
                                <span className="hidden sm:block text-sm font-medium">Bonjour{firstName ? `, ${firstName}` : ''}</span>
                            </div>

                            {}
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 z-50">
                                <div className="p-3 border-b border-gray-100 font-semibold text-sm">Mon Compte</div>
                                <Link to="/account" className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-blue-600">Vos commandes</Link>
                                <Link to="/account" className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-blue-600">Vos informations</Link>
                                {user?.is_admin === true && (
                                    <Link to="/admin" className="block px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 font-medium">Dashboard Admin</Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center"
                                >
                                    <LogOut size={16} className="mr-2" /> Déconnexion
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center space-x-1 hover:text-blue-400 transition">
                            <User size={24} />
                            <div className="hidden sm:flex flex-col text-xs leading-tight">
                                <span>Bonjour, Identifiez-vous</span>
                                <span className="font-bold text-sm">Comptes et Listes</span>
                            </div>
                        </Link>
                    )}

                    {}
                    {token && user?.is_seller && (
                        <Link
                            to="/seller"
                            className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105 shadow-lg"
                        >
                            <Store size={18} />
                            <span className="hidden sm:block">Ma Boutique</span>
                        </Link>
                    )}

                    {}
                    {token && !user?.is_seller && (
                        <button
                            onClick={handleBecomeSeller}
                            className="flex items-center space-x-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all transform hover:scale-105 shadow-lg"
                        >
                            <Store size={18} />
                            <span className="hidden sm:block">Devenir Vendeur</span>
                        </button>
                    )}

                    {}
                    <Link to="/cart" className="flex items-center hover:text-blue-400 transition relative">
                        <div className="relative">
                            <ShoppingCart size={28} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-yellow-500 text-slate-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                        <span className="hidden sm:block font-bold mt-2 ml-1">Panier</span>
                    </Link>
                </div>
            </div>

            {}
            <div className="lg:hidden px-4 pb-3">
                <SearchBar />
            </div>

            {}
            <div className="bg-slate-800 text-white shadow-md">
                <div className="container mx-auto px-4">
                    <ul className="flex items-center space-x-6 overflow-x-auto py-2 whitespace-nowrap text-sm font-medium">
                        <li className="flex items-center space-x-1 cursor-pointer hover:text-gray-300">
                            <Menu size={18} />
                            <span>Catalogue</span>
                        </li>
                        {categories.map((cat, index) => (
                            <li key={index}>
                            <Link to={cat.path} className="hover:text-blue-300 transition-colors">
                                {cat.name}
                            </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </header>
    );
}

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const allProductsRef = useRef(null);
  const containerRef = useRef(null);

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    navigate(`/products?search=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return undefined;
    }

    const t = window.setTimeout(async () => {
      try {
        setLoading(true);
        if (!allProductsRef.current) {
          const res = await api.get('/products');
          allProductsRef.current = Array.isArray(res.data) ? res.data : [];
        }
        const items = allProductsRef.current;
        const qq = q.toLowerCase();
        const filtered = items
          .filter((p) => (p?.name || '').toLowerCase().includes(qq))
          .slice(0, 6);
        if (!cancelled) {
          setSuggestions(filtered);
          setOpen(true);
        }
      } catch (err) {
        if (!cancelled) {
          setSuggestions([]);
          setOpen(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [normalizedQuery, query]);

  return (
    <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl mx-4" ref={containerRef}>
      <div className="relative w-full flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          placeholder="Rechercher des produits..."
          className="w-full pl-4 pr-12 py-2.5 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-r-md transition-colors flex items-center justify-center"
        >
          <Search size={20} />
        </button>

        {open ? (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
            <div className="px-3 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
              {loading ? 'Recherche…' : suggestions.length > 0 ? 'Produits' : 'Aucun résultat'}
            </div>
            {suggestions.length > 0 ? (
              <ul className="max-h-80 overflow-auto">
                {suggestions.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setQuery('');
                        navigate(`/product/${p.id}`);
                      }}
                      className="w-full text-left px-3 py-3 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                        <img
                          src={p.image || 'https://via.placeholder.com/80?text=Img'}
                          alt={p.name}
                          className="h-full w-full object-contain p-1"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80?text=Img';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-gray-900 line-clamp-1">{p.name}</div>
                        <div className="text-xs text-gray-500 line-clamp-1">{p.category?.name || ''}</div>
                      </div>
                    </button>
                  </li>
                ))}
                <li className="border-t border-gray-100">
                  <button
                    type="submit"
                    className="w-full text-left px-3 py-3 hover:bg-gray-50 text-sm font-semibold text-blue-600"
                  >
                    Voir tous les résultats pour “{query.trim()}”
                  </button>
                </li>
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
};
