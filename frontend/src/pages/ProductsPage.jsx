import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const normalizeText = (value) => {
  if (value == null) return '';
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
};

const categoryAliases = {
  electronique: ['electronique', 'electroniques', 'electronic', 'electronics', 'electro', 'electronique & high-tech'],
  vetements: ['vetements', 'vetement', 'clothing', 'clothes', 'fashion', 'mode'],
  maison: ['maison', 'home', 'house', 'home & living', 'maison & decoration', 'deco', 'decoration'],
};

const productMatchesCategory = (product, categorySlug) => {
  const wanted = normalizeText(categorySlug);
  if (!wanted) return true;

  const candidates = [
    product?.category?.slug,
    product?.category?.name,
    product?.category_slug,
    product?.category_name,
    product?.category,
  ]
    .flatMap((v) => (Array.isArray(v) ? v : [v]))
    .map(normalizeText)
    .filter(Boolean);

  const wantedSet = new Set([wanted, ...(categoryAliases[wanted] || []).map(normalizeText)]);
  return candidates.some((c) => wantedSet.has(c));
};

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get('category');
  const sortParam = searchParams.get('sort');
  const searchQuery = searchParams.get('search');

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {

        const res = await api.get('/products');
        setAllProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des produits", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categorySlug, sortParam, searchQuery]);

  let products = allProducts.filter((p) => productMatchesCategory(p, categorySlug));

  const q = normalizeText(searchQuery);
  if (q) {
    products = products.filter((p) => {
      const hay = [
        p?.name,
        p?.description,
        p?.category?.name,
        p?.category?.slug,
      ]
        .map(normalizeText)
        .filter(Boolean)
        .join(' ');
      return hay.includes(q);
    });
  }

  if (sortParam === 'newest') {
    products = products
      .slice()
      .sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0));
  }

  if (sortParam === 'best-sellers') {

    const score = (p) =>
      Number(p?.sold_count ?? p?.sales ?? p?.popularity ?? p?.rating_count ?? 0);
    products = products.slice().sort((a, b) => score(b) - score(a));
  }

  let title = "Tous nos produits";
  if (categorySlug === 'electronique') title = "Électronique";
  if (categorySlug === 'vetements') title = "Vêtements";
  if (categorySlug === 'maison') title = "Maison";
  if (sortParam === 'best-sellers') title = "Meilleures Ventes";
  if (sortParam === 'newest') title = "Nouveautés";
  if (q) title = `Résultats pour “${searchQuery}”`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <div className="text-sm text-gray-500">
            {products.length} produit(s) trouvé(s)
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Chargement des produits...</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-4">Aucun produit trouvé dans cette catégorie.</p>
            <Link to="/products" className="text-blue-600 hover:underline">Voir tous les produits</Link>
        </div>
      )}
    </div>
  );
}
