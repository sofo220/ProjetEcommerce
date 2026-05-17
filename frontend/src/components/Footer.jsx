import { Link } from 'react-router-dom';
import { AtSign, CreditCard, Globe, Share2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 pt-12 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-gray-700 pb-8">

          {}
          <div>
            <Link to="/" className="text-3xl font-extrabold text-white flex items-center flex-shrink-0 mb-4">
                <span className="text-blue-500 mr-1">Shoppex</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Votre boutique en ligne au Maroc. Nous proposons les meilleurs produits aux meilleurs prix, avec une livraison express partout dans le royaume.
            </p>
          </div>

          {}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition">À propos de nous</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contactez-nous</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">Foire aux questions (FAQ)</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition">Politique de livraison</Link></li>
            </ul>
          </div>

          {}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Nos Catégories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products?category=electronique" className="hover:text-white transition">Électronique</Link></li>
              <li><Link to="/products?category=vetements" className="hover:text-white transition">Vêtements</Link></li>
              <li><Link to="/products?category=maison" className="hover:text-white transition">Maison & Décoration</Link></li>
              <li><Link to="/products?sort=newest" className="hover:text-white transition">Nouveautés</Link></li>
            </ul>
          </div>

          {}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="hover:text-blue-400 transition" aria-label="Site"><Globe size={24} /></a>
              <a href="#" className="hover:text-pink-400 transition" aria-label="Instagram"><AtSign size={24} /></a>
              <a href="#" className="hover:text-blue-300 transition" aria-label="Partager"><Share2 size={24} /></a>
            </div>

            <h3 className="text-white text-sm font-bold mb-2">Paiement 100% sécurisé</h3>
            <div className="flex space-x-3 mb-4">
              <CreditCard size={32} className="text-gray-400" />
              <ShieldCheck size={32} className="text-gray-400" />
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Shoppex. Tous droits réservés. Maroc.</p>
          <div className="mt-2 md:mt-0 space-x-4">
            <Link to="/terms" className="hover:text-white">CGV</Link>
            <Link to="/privacy" className="hover:text-white">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
