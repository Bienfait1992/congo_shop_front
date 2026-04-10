// import React from "react";

// export default function Footer() {
//   const scrollToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   return (
//     <footer className="bg-gray-900 text-gray-300 mt-10 text-sm">
//       {/* Retour en haut */}
//       <div
//         onClick={scrollToTop}
//         className="bg-gray-800 text-center py-3 cursor-pointer hover:bg-gray-700"
//       >
//         Retour en haut
//       </div>

//       {/* Sections principales */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 md:px-20 py-10 border-b border-gray-700">
        
//         {/* Connaitre */}
//         <div>
//           <h3 className="font-semibold mb-3 text-white">Pour mieux nous connaître</h3>
//           <ul className="space-y-2">
//             <li>À propos d'Amazon</li>
//             <li>Carrières</li>
//             <li>Durabilité</li>
//             <li>Amazon Science</li>
//           </ul>
//         </div>

//         {/* Gagner argent */}
//         <div>
//           <h3 className="font-semibold mb-3 text-white">Gagnez de l'argent</h3>
//           <ul className="space-y-2">
//             <li>Vendez avec plus de 47.250 € d'avantages</li>
//             <li>Vendez sur Amazon Business</li>
//             <li>Vendez sur Amazon Handmade</li>
//             <li>Protégez votre marque</li>
//             <li>Devenez Partenaire</li>
//             <li>Expédié par Amazon</li>
//             <li>Livrer à Amazon</li>
//             <li>Vendez dans le monde entier</li>
//             <li>Faites la promotion de vos produits</li>
//             <li>Auto-publiez votre livre</li>
//             <li>Amazon Pay</li>
//           </ul>
//         </div>

//         {/* Paiement */}
//         <div>
//           <h3 className="font-semibold mb-3 text-white">Moyens de paiement Amazon</h3>
//           <ul className="space-y-2">
//             <li>Carte Amazon Business Amex</li>
//             <li>Cartes de paiement</li>
//             <li>Paiement en plusieurs fois</li>
//             <li>Convertisseur de devises</li>
//             <li>Cartes cadeaux</li>
//             <li>Recharge en ligne</li>
//             <li>Recharge en point de vente</li>
//           </ul>
//         </div>

//         {/* Aide */}
//         <div>
//           <h3 className="font-semibold mb-3 text-white">Besoin d'aide ?</h3>
//           <ul className="space-y-2">
//             <li>Voir ou suivre vos commandes</li>
//             <li>Tarifs et options de livraison</li>
//             <li>Amazon Prime</li>
//             <li>Retours et remplacements</li>
//             <li>Garantie légale</li>
//             <li>Rappels produits</li>
//             <li>Recyclage</li>
//             <li>Infos Marketplace</li>
//             <li>Application Mobile</li>
//             <li>Service Client</li>
//             <li>Accessibilité</li>
//             <li>Liste de cadeaux</li>
//             <li>Signaler un contenu illégal</li>
//           </ul>
//         </div>
//       </div>

//       {/* Ligne langue */}
//       <div className="text-center py-4 border-b border-gray-700">
//         Français | France
//       </div>

//       {/* Services */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-20 py-10 border-b border-gray-700 text-xs">
//         <div>
//           <p className="text-white">Amazon Music</p>
//           <p>Écoutez des millions de chansons</p>
//         </div>
//         <div>
//           <p className="text-white">Amazon Web Services</p>
//           <p>Cloud Computing Flexible</p>
//         </div>
//         <div>
//           <p className="text-white">Audible</p>
//           <p>Livres audio</p>
//         </div>
//         <div>
//           <p className="text-white">Shopbop</p>
//           <p>Mode & vêtements</p>
//         </div>
//         <div>
//           <p className="text-white">Amazon Business</p>
//           <p>Pour les professionnels</p>
//         </div>
//         <div>
//           <p className="text-white">Amazon Advertising</p>
//           <p>Fidélisez vos clients</p>
//         </div>
//       </div>

//       {/* Bas */}
//       <div className="text-center text-xs py-6 space-y-2">
//         <div className="space-x-3">
//           <span>Conditions générales de vente</span>
//           <span>Vos informations personnelles</span>
//           <span>Cookies</span>
//           <span>Annonces basées sur vos centres d’intérêt</span>
//         </div>
//         <p>©2026, Amazon.com Inc. ou ses affiliés</p>
//       </div>
//     </footer>
//   );
// }

import React from "react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-10 text-sm">
      {/* Retour en haut */}
      <div
        onClick={scrollToTop}
        className="bg-gray-800 text-center py-3 cursor-pointer hover:bg-gray-700"
      >
        Retour en haut
      </div>

      {/* Sections principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 md:px-20 py-10 border-b border-gray-700">
        
        {/* Connaitre */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Pour mieux nous connaître</h3>
          <ul className="space-y-2">
            <li>À propos de CongoShop</li>
            <li>Carrières</li>
            <li>Durabilité</li>
            <li>CongoShop Science</li>
          </ul>
        </div>

        {/* Gagner argent */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Gagnez de l'argent</h3>
          <ul className="space-y-2">
            <li>Vendez avec plus de 47.250 € d'avantages</li>
            <li>Vendez sur CongoShop Business</li>
            <li>Vendez sur CongoShop Handmade</li>
            <li>Protégez votre marque</li>
            <li>Devenez Partenaire</li>
            <li>Expédié par CongoShop</li>
            <li>Livrer à CongoShop</li>
            <li>Vendez dans le monde entier</li>
            <li>Faites la promotion de vos produits</li>
            <li>Auto-publiez votre livre</li>
            <li>CongoShop Pay</li>
          </ul>
        </div>

        {/* Paiement */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Moyens de paiement CongoShop</h3>
          <ul className="space-y-2">
            <li>Carte CongoShop Business</li>
            <li>Cartes de paiement</li>
            <li>Paiement en plusieurs fois</li>
            <li>Convertisseur de devises</li>
            <li>Cartes cadeaux</li>
            <li>Recharge en ligne</li>
            <li>Recharge en point de vente</li>
          </ul>
        </div>

        {/* Aide */}
        <div>
          <h3 className="font-semibold mb-3 text-white">Besoin d'aide ?</h3>
          <ul className="space-y-2">
            <li>Voir ou suivre vos commandes</li>
            <li>Tarifs et options de livraison</li>
            <li>CongoShop Prime</li>
            <li>Retours et remplacements</li>
            <li>Garantie légale</li>
            <li>Rappels produits</li>
            <li>Recyclage</li>
            <li>Infos Marketplace</li>
            <li>Application Mobile</li>
            <li>Service Client</li>
            <li>Accessibilité</li>
            <li>Liste de cadeaux</li>
            <li>Signaler un contenu illégal</li>
          </ul>
        </div>
      </div>

      {/* Ligne langue */}
      <div className="text-center py-4 border-b border-gray-700">
        Français | RDC
      </div>

      {/* Services */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-20 py-10 border-b border-gray-700 text-xs">
        <div>
          <p className="text-white">CongoShop Music</p>
          <p>Écoutez des millions de chansons</p>
        </div>
        <div>
          <p className="text-white">CongoShop Cloud</p>
          <p>Cloud Computing Flexible</p>
        </div>
        <div>
          <p className="text-white">CongoShop Audio</p>
          <p>Livres audio</p>
        </div>
        <div>
          <p className="text-white">CongoShop Fashion</p>
          <p>Mode & vêtements</p>
        </div>
        <div>
          <p className="text-white">CongoShop Business</p>
          <p>Pour les professionnels</p>
        </div>
        <div>
          <p className="text-white">CongoShop Advertising</p>
          <p>Fidélisez vos clients</p>
        </div>
      </div>

      {/* Bas */}
      <div className="text-center text-xs py-6 space-y-2">
        <div className="space-x-3">
          <span>Conditions générales de vente</span>
          <span>Vos informations personnelles</span>
          <span>Cookies</span>
          <span>Annonces basées sur vos centres d’intérêt</span>
        </div>
        <p>©2026, CongoShop Inc. ou ses affiliés</p>
      </div>
    </footer>
  );
}