import React, { useState } from "react";
import ClientSidebar from "./ClientSidebar";

export default function ClientDashboard() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen">
      <ClientSidebar isOpen={isOpen} />
      <div className="flex-1 p-6 bg-gray-100">
        <button
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setIsOpen(!isOpen)}
        >
          Toggle Sidebar
        </button>
        <h1 className="text-2xl font-bold">Bienvenue sur le Dashboard Client</h1>
        {/* Contenu du client */}
      </div>
    </div>
  );
}