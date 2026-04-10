import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaCar,
  FaMapMarkerAlt,
  FaBuilding,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

export default function AdminDeliveryRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const token = localStorage.getItem("token");

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/deliveryman", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRequests(data);
    } catch (err) {
      toast.error("Erreur chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, approve) => {
    try {
      setActionLoading(id);

      const res = await fetch(
        `http://localhost:3000/api/deliveryman/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ approve }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success(approve ? "Approuvé" : "Rejeté");

      fetchRequests();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-50 text-yellow-600 border border-yellow-200";
      case "APPROVED":
        return "bg-green-50 text-green-600 border border-green-200";
      case "REJECTED":
        return "bg-red-50 text-red-600 border border-red-200";
      default:
        return "bg-gray-50 text-gray-500";
    }
  };

  const filteredRequests =
    filter === "ALL"
      ? requests
      : requests.filter((r) => r.status === filter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-gray-500">
          Chargement des demandes...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestion des livreurs
          </h1>
          <p className="text-gray-500 text-sm">
            Valider ou rejeter les demandes
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard title="Total" value={requests.length} />
        <StatCard
          title="En attente"
          value={requests.filter((r) => r.status === "PENDING").length}
        />
        <StatCard
          title="Approuvés"
          value={requests.filter((r) => r.status === "APPROVED").length}
        />
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-6">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === f
                ? "bg-black text-white"
                : "bg-white border hover:bg-gray-100"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {filteredRequests.map((d) => (
          <div
            key={d.id}
            className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition border"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-3 rounded-full">
                  <FaUser className="text-gray-600" />
                </div>

                <div>
                  <p className="font-semibold text-gray-800">
                    {d.user?.name}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaEnvelope />
                    <span>{d.user?.email}</span>
                  </div>
                </div>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyle(
                  d.status
                )}`}
              >
                {d.status}
              </span>
            </div>

            {/* INFOS */}
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
              <InfoItem icon={<FaCar />} text={d.vehicleType} />
              <InfoItem
                icon={<FaMapMarkerAlt />}
                text={`${d.latitude}, ${d.longitude}`}
              />
              <InfoItem
                icon={<FaBuilding />}
                text={d.company?.name || "Individuel"}
              />
            </div>

            {/* ACTIONS */}
            {d.status === "PENDING" && (
              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(d.id, true)}
                  disabled={actionLoading === d.id}
                  className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2 rounded-xl hover:opacity-90 transition"
                >
                  <FaCheck />
                  {actionLoading === d.id ? "..." : "Approuver"}
                </button>

                <button
                  onClick={() => handleAction(d.id, false)}
                  disabled={actionLoading === d.id}
                  className="flex-1 flex items-center justify-center gap-2 border py-2 rounded-xl hover:bg-gray-100 transition"
                >
                  <FaTimes />
                  {actionLoading === d.id ? "..." : "Rejeter"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 🔹 Composants UI
function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

function InfoItem({ icon, text }) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
      <div className="text-gray-500">{icon}</div>
      <span>{text}</span>
    </div>
  );
}