export default function Faq() {
  const items = [
    { q: "Quels sont les délais de livraison ?", a: "En général 24–48h selon la ville et la disponibilité." },
    { q: "Le paiement est-il sécurisé ?", a: "Oui, nous utilisons des mécanismes de sécurité et un paiement sécurisé." },
    { q: "Puis-je retourner un produit ?", a: "Oui, selon les conditions de retour. Contacte le support pour lancer la procédure." },
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">FAQ</h1>
      <div className="max-w-3xl space-y-4">
        {items.map((it, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="font-bold text-gray-900">{it.q}</div>
            <div className="text-gray-700 mt-2">{it.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

