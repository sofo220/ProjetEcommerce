import { useState } from 'react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Contact</h1>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {}
          <div>
            <p className="text-gray-700 mb-4">
              Besoin d’aide ? Contacte-nous et on te répond rapidement.
            </p>
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
              <div className="text-sm text-gray-500 mb-3">Informations Shoppex</div>
              <ul className="text-gray-800 space-y-2">
                <li><span className="font-semibold">Email:</span> support@shoppex.ma</li>
                <li><span className="font-semibold">Téléphone:</span> +212 6 00 00 00 00</li>
                <li><span className="font-semibold">Horaires:</span> Lun–Sam, 9h–18h</li>
              </ul>
            </div>
          </div>

          {}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Envoyer un message</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                setName('');
                setEmail('');
                setMessage('');
                window.setTimeout(() => setSent(false), 4000);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="vous@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Expliquez votre besoin…"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg"
                >
                  Envoyer
                </button>
                {sent ? (
                  <div className="text-sm text-green-600 font-semibold">
                    Message envoyé. Merci !
                  </div>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

