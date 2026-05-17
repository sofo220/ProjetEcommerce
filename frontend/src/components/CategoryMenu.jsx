import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

export default function CategoryMenu() {
  const categories = [
    { name: 'Toutes les catégories', slug: 'all' },
    { name: 'Électronique', slug: 'electronique' },
    { name: 'Vêtements', slug: 'vetements' },
    { name: 'Maison', slug: 'maison' },
    { name: 'Meilleures Ventes', slug: 'bestsellers' },
    { name: 'Nouveautés', slug: 'new' },
  ];

  return (
    <div className="bg-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <ul className="flex items-center space-x-6 overflow-x-auto py-2 whitespace-nowrap text-sm font-medium">
          <li className="flex items-center space-x-1 cursor-pointer hover:text-gray-300">
            <Menu size={18} />
            <span>Catalogue</span>
          </li>
          {categories.map((cat, index) => (
            <li key={index}>
              <Link to={`/category/${cat.slug}`} className="hover:text-blue-300 transition-colors">
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
