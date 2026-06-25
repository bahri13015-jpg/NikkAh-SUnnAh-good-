import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://hozxklpzfzmrswzbamye.supabase.co",
  "sb_publishable_MurlKY4clW48vcHYcuXCMw_WrbuhDIA"
);

const COLORS = {
  bg: "#0D1117",
  surface: "#141B24",
  text: "#E8E0D0",
  muted: "#8A9BAD",
  gold: "#C9A84C",
  green: "#27AE60",
  red: "#C0392B",
  amber: "#E67E22",
};

function Status({ children, color }) {
  return (
    <span style={{
      padding: "2px 8px",
      borderRadius: 4,
      fontSize: 12,
      background: color + "22",
      color,
      border: `1px solid ${color}44`
    }}>
      {children}
    </span>
  );
}

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================
  // CHARGER USERS
  // ========================
  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("utilisateurs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ========================
  // VALIDER PROFIL
  // ========================
  const validateUser = async (id) => {
    await supabase
      .from("utilisateurs")
      .update({ admin_valide: true })
      .eq("id", id);

    fetchUsers();
  };

  // ========================
  // BANNIR USER
  // ========================
  const banUser = async (id) => {
    await supabase
      .from("utilisateurs")
      .update({ compte_actif: false })
      .eq("id", id);

    fetchUsers();
  };

  // ========================
  // DELETE USER
  // ========================
  const deleteUser = async (id) => {
    await supabase
      .from("utilisateurs")
      .delete()
      .eq("id", id);

    fetchUsers();
  };

  return (
    <div style={{ padding: 20, background: COLORS.bg, minHeight: "100vh", color: COLORS.text }}>

      <h2>Admin Panel</h2>

      {loading && <p>Chargement...</p>}

      {!loading && (
        <table width="100%" style={{ marginTop: 20, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #333" }}>
              <th>Email</th>
              <th>Genre</th>
              <th>Statut</th>
              <th>Admin validé</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #222" }}>

                <td>{u.email}</td>
                <td>{u.genre}</td>

                <td>
                  {u.compte_actif ? (
                    <Status color={COLORS.green}>Actif</Status>
                  ) : (
                    <Status color={COLORS.red}>Banni</Status>
                  )}
                </td>

                <td>
                  {u.admin_valide ? (
                    <Status color={COLORS.green}>Validé</Status>
                  ) : (
                    <Status color={COLORS.amber}>En attente</Status>
                  )}
                </td>

                <td style={{ display: "flex", gap: 8 }}>

                  {!u.admin_valide && (
                    <button onClick={() => validateUser(u.id)}>
                      Valider
                    </button>
                  )}

                  {u.compte_actif && (
                    <button onClick={() => banUser(u.id)}>
                      Bannir
                    </button>
                  )}

                  <button onClick={() => deleteUser(u.id)}>
                    Supprimer
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
}
