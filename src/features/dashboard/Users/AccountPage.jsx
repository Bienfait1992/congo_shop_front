import { useNavigate } from "react-router-dom";
import {
  Package,
  Shield,
  CreditCard,
  MapPin,
  Gift,
  MessageSquare,
  Phone,
  Smartphone,
  Settings,
  Users,
  Store,
} from "lucide-react";

export default function AccountPage() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Vos commandes",
      description: "Suivre, retourner ou acheter à nouveau",
      icon: <Package size={28} />,
      path: "/orders",
    },
    {
      title: "Connexion & sécurité",
      description: "Modifier l'adresse e-mail, le nom et le numéro",
      icon: <Shield size={28} />,
      path: "/security",
    },
    {
      title: "Vos paiements",
      description: "Gérer les modes de paiement",
      icon: <CreditCard size={28} />,
      path: "/payments",
    },
    {
      title: "Adresses",
      description: "Modifier les adresses et préférences",
      icon: <MapPin size={28} />,
      path: "/delivery-address",
    },
    {
      title: "Cartes cadeaux",
      description: "Voir votre solde ou recharger",
      icon: <Gift size={28} />,
      path: "/gift-cards",
    },
    {
      title: "Centre de messagerie",
      description: "Messages Amazon et vendeurs",
      icon: <MessageSquare size={28} />,
      path: "/messages",
    },
    {
      title: "Nous contacter",
      description: "Service client par téléphone ou chat",
      icon: <Phone size={28} />,
      path: "/support",
    },
    {
      title: "Application Mobile",
      description: "Télécharger l'application",
      icon: <Smartphone size={28} />,
      path: "/app",
    },
    {
      title: "Paramètres",
      description: "Préférences et configuration",
      icon: <Settings size={28} />,
      path: "/settings",
    },
    {
      title: "Votre compte professionnel",
      description: "Acheter pour votre entreprise",
      icon: <Users size={28} />,
      path: "/business",
    },

    {
  title: "Mes boutiques",
  description: "Gérer vos boutiques et produits",
  icon: <Store size={28} />,
  path: "/my-shops",
},
  ];

  const handleNavigate = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Votre compte</h1>

        {/* GRID CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => handleNavigate(card.path)}
              className="bg-white p-5 rounded-lg shadow hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-200 flex gap-4 items-start"
            >
              <div className="text-yellow-500">{card.icon}</div>

              <div>
                <h2 className="font-semibold text-lg">{card.title}</h2>
                <p className="text-sm text-gray-500">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION LONGUE */}
        <div className="mt-10 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">
            Contenu numérique et appareils
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <p>Amazon Drive</p>
            <p>Applis et plus</p>
            <p>Contenu et appareils Kindle</p>
            <p>Gérer la livraison numérique</p>
            <p>Paramètres de musique</p>
            <p>Forum Numérique et Appareils</p>
          </div>
        </div>

        {/* AUTRES SECTIONS */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">
            Paramètres et préférences
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
            <p>Cookies et choix publicitaires</p>
            <p>Préférences de communication</p>
            <p>Vos transactions</p>
            <p>Paramètres de langue</p>
            <p>Commandes archivées</p>
            <p>Vos préférences d'achat</p>
            <p>Gérer vos données</p>
            <p>Fermez votre compte</p>
          </div>
        </div>
      </div>
    </div>
  );
}