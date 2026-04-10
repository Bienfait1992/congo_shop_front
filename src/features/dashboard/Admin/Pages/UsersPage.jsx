import { useEffect, useState } from "react";
import { api } from "../../../../shared/services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    api.get("/auth/users").then(res => setUsers(res.data)).catch(console.error);
  }, []);

  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="bg-white p-4 shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2>Utilisateurs</h2>
        <input
          type="text"
          placeholder="Rechercher..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        />
      </div>

      <ul>
        {filteredUsers.map(u => (
          <li key={u.id} className="flex justify-between py-1 border-b">
            <span>{u.name} ({u.email})</span>
            <span className="text-sm text-gray-500">{u.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}