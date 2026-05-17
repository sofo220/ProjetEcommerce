import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3
} from 'lucide-react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { toast } from 'react-toastify';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Déconnecté avec succès');
    navigate('/login');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
    { to: '/admin/products', icon: Package, label: 'Produits' },
    { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Commandes' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Statistiques' },
    { to: '/admin/settings', icon: Settings, label: 'Paramètres' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl">Shoppex</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
          </div>

          {}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email || 'admin@shoppex.com'}</p>
              </div>
            </div>
          </div>

          {}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {}
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}