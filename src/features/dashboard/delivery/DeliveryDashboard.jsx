import React, { useState } from "react";
import DeliverySidebar from "./DeliverySidebar";

export default function DeliveryDashboard() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <DeliverySidebar isOpen={isOpen} />
      <div className="flex-1 p-6 bg-gray-100">
        <button
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setIsOpen(!isOpen)}
        >
          Toggle Sidebar
        </button>
        <h1 className="text-2xl font-bold">Bienvenue sur le Dashboard Livreur</h1>
        {/* Contenu livreur */}
      </div>
    </div>
  );
}