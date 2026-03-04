import { useState, useEffect } from "react";
import { users as mockUsers } from "@/lib/mockData";
import { fetchUsers } from "@/lib/supabaseService";

const roles = ["todos", "ciclista", "creador", "comercio"];
const roleStyles: Record<string, string> = { ciclista: "bg-primary/15 text-primary", creador: "bg-secondary/15 text-secondary", comercio: "bg-accent/15 text-accent" };
const statusStyles: Record<string, string> = { activo: "bg-success/15 text-success", suspendido: "bg-error/15 text-error" };

export default function UserManagement() {
  const [userList, setUserList] = useState(mockUsers);
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    fetchUsers().then(setUserList);
  }, []);

  const filtered = filter === "todos" ? userList : userList.filter(u => u.role === filter);

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-2xl font-bold">👥 Gestión de Usuarios</h1>
      <div className="flex gap-2">
        {roles.map((r) => (
          <button key={r} onClick={() => setFilter(r)}
            className={`px-3 py-1.5 rounded-pill text-xs font-medium capitalize transition-colors ${filter === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {r}
          </button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-lg shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Usuario</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Rol</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Rutas</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Registro</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 flex items-center gap-2"><img src={u.avatar} className="h-7 w-7 rounded-full" /><span className="font-medium">{u.name}</span></td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-pill text-xs font-bold capitalize ${roleStyles[u.role]}`}>{u.role}</span></td>
                <td className="px-4 py-3 text-right">{u.routesCompleted}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.registeredDate}</td>
                <td className="px-4 py-3"><span className={`px-2.5 py-0.5 rounded-pill text-xs font-bold capitalize ${statusStyles[u.status]}`}>{u.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
