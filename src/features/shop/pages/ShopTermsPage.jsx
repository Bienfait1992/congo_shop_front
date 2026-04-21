import { useState } from "react";

export default function ShopTermsModal({ open, onClose, onAccept }) {
  const [scrolled, setScrolled] = useState(false);
  const [checked, setChecked] = useState(false);

  if (!open) return null;

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const progress = (scrollTop + clientHeight) / scrollHeight;

    if (progress > 0.85) {
      setScrolled(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">

      {/* MODAL CARD */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* HEADER FIXE */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-5 text-white">
          <h2 className="text-lg font-bold">
            Charte vendeur CongoShop
          </h2>
          <p className="text-sm opacity-90">
            Conditions d’utilisation de la plateforme
          </p>
        </div>

        {/* BODY SCROLLABLE */}
        <div
          onScroll={handleScroll}
          className="h-[380px] overflow-y-auto p-6 text-sm space-y-4 leading-relaxed"
        >
          <p className="font-semibold">
            En utilisant CongoShop, vous acceptez les règles suivantes :
          </p>

          <ul className="list-disc ml-5 space-y-2 text-gray-700">
            <li>Vente uniquement de produits légaux en RDC et à l’international</li>
            <li>Respect strict des délais de livraison</li>
            <li>Interdiction de fraude sur prix, stock ou commandes</li>
            <li>Obligation de qualité et conformité des produits</li>
            <li>Respect des commissions et règles de la plateforme</li>
            <li>Interdiction de produits dangereux ou contrefaits</li>
          </ul>

          <div className="text-gray-600 border-t pt-4">
            <p>
              Toute violation peut entraîner suspension immédiate de la boutique
              sans préavis.
            </p>

            <p className="text-red-500 font-semibold mt-3">
              Faites défiler jusqu’en bas pour continuer
            </p>
          </div>
        </div>

        {/* FOOTER FIXE */}
        <div className="p-5 border-t bg-gray-50 space-y-3">

          {/* CHECKBOX */}
          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              disabled={!scrolled}
              className="mt-1"
            />

            <span className={!scrolled ? "text-gray-400" : "text-gray-800"}>
              J’ai lu et j’accepte la charte vendeur
            </span>
          </label>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Annuler
            </button>

            <button
              onClick={onAccept}
              disabled={!checked}
              className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
                checked
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Accepter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}