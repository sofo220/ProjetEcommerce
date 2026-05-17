import { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { ArrowLeft, ArrowRight, BadgePercent, Headset, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const formatPriceMAD = (value) => {
    const n = Number(value);
    if (Number.isNaN(n)) return '';
    return `${n.toLocaleString('fr-FR')} DH`;
};

export default function Home() {
    const navigate = useNavigate();
    const [newProducts, setNewProducts] = useState([]);
    const [popularProducts, setPopularProducts] = useState([]);
    const [heroIndex, setHeroIndex] = useState(0);

    const categoriesList = [
        { id: 1, name: 'Électronique', slug: 'electronique', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60' },
        { id: 2, name: 'Vêtements', slug: 'vetements', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60' },
        { id: 3, name: 'Maison', slug: 'maison', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop&q=60' }
    ];

    useEffect(() => {
        const fetchProducts = async () => {
            try {

                const res = await api.get('/products');
                const products = Array.isArray(res.data) ? res.data : [];

                setNewProducts(products.slice().reverse().slice(0, 4));

                setPopularProducts(products.slice(0, 4));
            } catch (err) {
                console.error("Erreur API Home", err);
            }
        };
        fetchProducts();
    }, []);

    const heroProducts = useMemo(() => {
        const combined = [...popularProducts, ...newProducts];
        const uniq = [];
        const seen = new Set();
        for (const p of combined) {
            if (!p?.id || seen.has(p.id)) continue;
            seen.add(p.id);
            uniq.push(p);
        }
        return uniq.slice(0, 6);
    }, [popularProducts, newProducts]);

    useEffect(() => {
        if (heroProducts.length <= 1) return;
        const id = window.setInterval(() => {
            setHeroIndex((i) => (i + 1) % heroProducts.length);
        }, 4500);
        return () => window.clearInterval(id);
    }, [heroProducts.length]);

    useEffect(() => {
        if (heroProducts.length === 0) return;
        if (heroIndex >= heroProducts.length) setHeroIndex(0);
    }, [heroIndex, heroProducts.length]);

    const activeHeroProduct = heroProducts[heroIndex];
    const goPrev = () => {
        if (heroProducts.length === 0) return;
        setHeroIndex((i) => (i - 1 + heroProducts.length) % heroProducts.length);
    };
    const goNext = () => {
        if (heroProducts.length === 0) return;
        setHeroIndex((i) => (i + 1) % heroProducts.length);
    };

    return (
        <div className="pb-12">
            {}
            <section className="relative w-full overflow-hidden mb-12">
                <div className="relative w-full h-[440px] md:h-[520px] bg-slate-950">
                    <img
                        src={
                            activeHeroProduct?.image ||
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&auto=format&fit=crop&q=80"
                        }
                        alt={activeHeroProduct?.name || "Shoppex"}
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/70 to-blue-900/40" />

                    <div className="absolute inset-0">
                        <div className="container mx-auto px-4 h-full flex items-center">
                            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                                <div className="text-white">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm mb-5">
                                        <BadgePercent size={16} />
                                        <span>Offres du moment • Livraison partout au Maroc</span>
                                    </div>

                                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                                        {activeHeroProduct?.name || "Bienvenue sur Shoppex"}
                                    </h1>

                                    <p className="text-white/80 mt-4 text-lg md:text-xl max-w-xl">
                                        {activeHeroProduct?.description ||
                                            "Votre boutique en ligne au Maroc. Découvrez nos meilleures offres et nouveautés."}
                                    </p>

                                    {activeHeroProduct ? (
                                        <div className="mt-6 flex flex-wrap items-center gap-4">
                                            <div className="text-3xl font-extrabold">
                                                {formatPriceMAD(activeHeroProduct.price)}
                                            </div>
                                            <div className="text-white/70 text-sm">
                                                Catégorie: <span className="text-white">{activeHeroProduct?.category?.name || "—"}</span>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="mt-8 flex flex-wrap gap-3">
                                        {activeHeroProduct ? (
                                            <button
                                                onClick={() => navigate(`/product/${activeHeroProduct.id}`)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-7 rounded-full shadow-lg transition-transform hover:scale-[1.02]"
                                            >
                                                Voir le produit
                                            </button>
                                        ) : null}
                                        <button
                                            onClick={() => navigate('/products')}
                                            className="bg-white/10 hover:bg-white/15 text-white font-semibold py-3 px-7 rounded-full border border-white/20"
                                        >
                                            Voir les produits
                                        </button>
                                    </div>

                                    <div className="mt-7 flex items-center gap-6 text-white/80 text-sm">
                                        <div className="flex items-center gap-2"><Truck size={18} /> Livraison rapide</div>
                                        <div className="flex items-center gap-2"><ShieldCheck size={18} /> Paiement sécurisé</div>
                                    </div>
                                </div>

                                <div className="hidden lg:flex justify-center">
                                    <div className="w-full max-w-md bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-sm">
                                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                                            <img
                                                src={activeHeroProduct?.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"}
                                                alt={activeHeroProduct?.name || "Produit"}
                                                className="w-full h-full object-contain p-6"
                                            />
                                        </div>
                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="text-white font-semibold line-clamp-1">{activeHeroProduct?.name || "Produit"}</div>
                                            <div className="text-white font-bold">{activeHeroProduct ? formatPriceMAD(activeHeroProduct.price) : ""}</div>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {heroProducts.map((p, idx) => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => setHeroIndex(idx)}
                                                        className={`h-2.5 rounded-full transition-all ${idx === heroIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/60'}`}
                                                        aria-label={`Aller au produit ${idx + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {}
                    {heroProducts.length > 1 ? (
                        <>
                            <button
                                type="button"
                                onClick={goPrev}
                                className="group absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30 h-14 w-14 md:h-16 md:w-16 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-all hover:scale-[1.05] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 flex items-center justify-center text-white"
                                aria-label="Produit précédent"
                            >
                                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <ArrowLeft size={24} className="relative" />
                            </button>
                            <button
                                type="button"
                                onClick={goNext}
                                className="group absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30 h-14 w-14 md:h-16 md:w-16 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 transition-all hover:scale-[1.05] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/40 flex items-center justify-center text-white"
                                aria-label="Produit suivant"
                            >
                                <span className="absolute inset-0 rounded-full bg-gradient-to-l from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <ArrowRight size={24} className="relative" />
                            </button>
                        </>
                    ) : null}

                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />
                </div>
            </section>

            <div className="container mx-auto px-4 space-y-16 relative -mt-20 z-10">

                {}
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {categoriesList.map(cat => (
                            <Link key={cat.id} to={`/products?category=${cat.slug}`} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow flex flex-col items-center text-center group cursor-pointer">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600">{cat.name}</h3>
                                <div className="w-full h-40 overflow-hidden rounded-md mb-4">
                                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <span className="text-blue-600 font-medium text-sm">Explorer la catégorie</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {}
                <section>
                    <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                        <h2 className="text-2xl font-bold text-gray-800">Meilleures Ventes</h2>
                        <Link to="/products?sort=best-sellers" className="text-blue-600 hover:underline font-medium">Voir tout</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {popularProducts.length > 0 ? popularProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        )) : <p>Chargement...</p>}
                    </div>
                </section>

                {}
                <section className="rounded-2xl overflow-hidden shadow-xl border border-blue-100 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                        <div className="lg:col-span-3 p-8 md:p-12">
                            <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Livraison Express Partout au Maroc</h2>
                            <p className="opacity-90 mb-7 max-w-2xl">
                                Casablanca, Rabat, Marrakech… et partout au royaume. Des produits sélectionnés, un paiement sécurisé, et un support réactif.
                            </p>

                            <div className="flex flex-wrap gap-3 mb-7">
                                <div className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm inline-flex items-center gap-2">
                                    <Truck size={18} /> 24–48h selon la ville
                                </div>
                                <div className="px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm inline-flex items-center gap-2">
                                    <ShieldCheck size={18} /> Paiement sécurisé
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => navigate('/products')}
                                    className="bg-white text-blue-700 font-bold py-3 px-7 rounded-full shadow hover:bg-gray-100"
                                >
                                    Acheter maintenant
                                </button>
                                <Link
                                    to="/products?sort=newest"
                                    className="bg-white/10 hover:bg-white/15 text-white font-semibold py-3 px-7 rounded-full border border-white/20"
                                >
                                    Voir les nouveautés
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-2 relative min-h-[260px]">
                            <img
                                src="https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&auto=format&fit=crop&q=80"
                                alt="Shopping"
                                className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/70 via-slate-950/10 to-transparent" />

                            <div className="relative p-6 h-full flex flex-col justify-end">
                                <div className="text-sm font-semibold mb-3">Pourquoi Shoppex ?</div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="rounded-xl bg-white/10 border border-white/15 p-4">
                                        <div className="font-bold inline-flex items-center gap-2"><RotateCcw size={18} /> Retours simples</div>
                                        <div className="text-white/85 text-sm mt-1">Échange/retour facile selon nos conditions.</div>
                                    </div>
                                    <div className="rounded-xl bg-white/10 border border-white/15 p-4">
                                        <div className="font-bold inline-flex items-center gap-2"><Headset size={18} /> Support réactif</div>
                                        <div className="text-white/85 text-sm mt-1">On vous répond rapidement sur vos demandes.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {}
                <section>
                    <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                        <h2 className="text-2xl font-bold text-gray-800">Nouveautés</h2>
                        <Link to="/products?sort=newest" className="text-blue-600 hover:underline font-medium">Voir tout</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {newProducts.length > 0 ? newProducts.map(p => (
                            <ProductCard key={p.id} product={p} />
                        )) : <p>Chargement...</p>}
                    </div>
                </section>
            </div>
        </div>
    );
}
