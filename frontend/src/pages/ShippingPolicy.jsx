export default function ShippingPolicy() {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Politique de livraison</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-3xl text-gray-700 leading-relaxed space-y-3">
        <p>Nous livrons partout au Maroc.</p>
        <p><span className="font-semibold">Délais:</span> 24–48h selon la ville.</p>
        <p><span className="font-semibold">Suivi:</span> un statut de commande est disponible dans votre compte.</p>
      </div>
    </div>
  );
}

