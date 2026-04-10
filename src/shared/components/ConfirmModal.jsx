import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShow(true);
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onCancel, 200); // attendre la fin de l'animation
  };

  if (!isOpen && !show) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      ></div>

      <div
        className={`bg-white rounded-xl shadow-lg max-w-md w-full p-6 transform transition-all duration-200 ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        } z-50`}
      >
        <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
        <p className="mb-6">{message}</p>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={() => { onConfirm(); setShow(false); }}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}