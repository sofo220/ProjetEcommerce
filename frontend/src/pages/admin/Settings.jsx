import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Store,
  Bell,
  Lock,
  Palette,
  CreditCard,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('store');
  const [saving, setSaving] = useState(false);

  const [storeSettings, setStoreSettings] = useState({
    name: 'Shoppex',
    email: 'contact@shoppex.com',
    phone: '+212 5 22 00 00 00',
    address: '123 Avenue Mohammed V, Casablanca',
    description: 'Votre destination shopping en ligne pour les meilleurs produits.',
    currency: 'MAD',
    timezone: 'Africa/Casablanca',
    taxRate: '20'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newOrder: true,
    lowStock: true,
    newCustomer: true,
    orderShipped: true,
    dailyReport: false,
    weeklyReport: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveStore = async () => {
    setSaving(true);

    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Paramètres de la boutique enregistrés');
  };

  const handleSaveNotifications = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Préférences de notification enregistrées');
  };

  const handleSaveSecurity = async () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (securitySettings.newPassword.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast.success('Mot de passe mis à jour');
    setSecuritySettings({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const tabs = [
    { id: 'store', label: 'Boutique', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Lock },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'payment', label: 'Paiement', icon: CreditCard },
  ];

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-500 mt-1">Configurez votre boutique et vos préférences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {}
        <div className="lg:w-64">
          <nav className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {}
            {activeTab === 'store' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Store size={20} />
                  Informations de la boutique
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom de la boutique
                    </label>
                    <input
                      type="text"
                      value={storeSettings.name}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email de contact
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="email"
                        value={storeSettings.email}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        value={storeSettings.phone}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Devise
                    </label>
                    <select
                      value={storeSettings.currency}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MAD">MAD - Dirham marocain</option>
                      <option value="USD">USD - Dollar américain</option>
                      <option value="EUR">EUR - Euro</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={storeSettings.address}
                        onChange={(e) => setStoreSettings(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={storeSettings.description}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Taux de TVA (%)
                    </label>
                    <input
                      type="number"
                      value={storeSettings.taxRate}
                      onChange={(e) => setStoreSettings(prev => ({ ...prev, taxRate: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveStore}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}

            {}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Bell size={20} />
                  Préférences de notification
                </h2>

                <div className="space-y-4">
                  {[
                    { key: 'newOrder', label: 'Nouvelle commande', desc: 'Recevoir une notification pour chaque nouvelle commande' },
                    { key: 'lowStock', label: 'Stock faible', desc: 'Être alerté quand un produit a un stock faible' },
                    { key: 'newCustomer', label: 'Nouveau client', desc: 'Recevoir une notification lors d\'une nouvelle inscription' },
                    { key: 'orderShipped', label: 'Commande expédiée', desc: 'Notification quand une commande est marquée comme expédiée' },
                    { key: 'dailyReport', label: 'Rapport journalier', desc: 'Recevoir un résumé quotidien des ventes' },
                    { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Recevoir un résumé hebdomadaire des performances' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <Toggle
                        checked={notificationSettings[item.key]}
                        onChange={(value) => setNotificationSettings(prev => ({ ...prev, [item.key]: value }))}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveNotifications}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}

            {}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Lock size={20} />
                  Sécurité du compte
                </h2>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mot de passe actuel
                    </label>
                    <input
                      type="password"
                      value={securitySettings.currentPassword}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={securitySettings.newPassword}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Minimum 8 caractères"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirmer le mot de passe
                    </label>
                    <input
                      type="password"
                      value={securitySettings.confirmPassword}
                      onChange={(e) => setSecuritySettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSaveSecurity}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saving ? 'Enregistrement...' : 'Mettre à jour le mot de passe'}
                  </button>
                </div>
              </div>
            )}

            {}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Palette size={20} />
                  Apparence
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thème de couleur
                    </label>
                    <div className="flex gap-3">
                      {['blue', 'purple', 'green', 'orange', 'red'].map(color => (
                        <button
                          key={color}
                          className={`w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-400 transition-colors`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo de la boutique
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <p className="text-gray-500">Cliquez pour télécharger ou faites glisser une image</p>
                      <p className="text-sm text-gray-400 mt-1">PNG, JPG jusqu'à 2MB</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => toast.success('Apparence enregistrée')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save size={18} />
                    Enregistrer
                  </button>
                </div>
              </div>
            )}

            
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard size={20} />
                  Modes de paiement
                </h2>

                <div className="space-y-4">
                  {[
                    { name: 'Paiement à la livraison', desc: 'Les clients paient lors de la réception', enabled: true },
                    { name: 'Carte bancaire', desc: 'Visa, Mastercard, etc.', enabled: false },
                    { name: 'PayPal', desc: 'Paiement via PayPal', enabled: false },
                  ].map((method, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{method.name}</p>
                        <p className="text-sm text-gray-500">{method.desc}</p>
                      </div>
                      <Toggle
                        checked={method.enabled}
                        onChange={() => toast.success(`${method.name} ${method.enabled ? 'désactivé' : 'activé'}`)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <button
                    onClick={() => toast.success('Paramètres de paiement enregistrés')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save size={18} />
                    Enregistrer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}