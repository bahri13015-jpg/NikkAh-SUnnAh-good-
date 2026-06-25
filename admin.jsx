import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ⚠️ SUPABASE CLIENT
const supabase = createClient(
  "https://hozxklpzfzmrswzbamye.supabase.co",
  "sb_publishable_MurlKY4clW48vcHYcuXCMw_WrbuhDIA"
);

export default function Admin() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 CHARGER PROFILS
  const fetchProfiles = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("profils")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setProfiles(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  // ✅ VALIDER PROFIL
  const validateProfile = async (id) => {
    await supabase
      .from("profils")
      .update({ profil_valide: true, profil_en_revue: false })
      .eq("utilisateur_id", id);

    fetchProfiles();
  };

  // ❌ SUPPRIMER PROFIL
  const deleteProfile = async (id) => {
    await supabase
      .from("profils")
      .delete()
      .eq("utilisateur_id", id);

    fetchProfiles();
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Chargement...</div>;
  }

  return (
    <div style={{ padding: 20, background: "#0d1117", color: "white", minHeight: "100vh" }}>
      <h1>Admin Panel</h1>

      {profiles.length === 0 && <p>Aucun profil trouvé</p>}

      {profiles.map((p) => (
        <div
          key={p.utilisateur_id}
          style={{
            background: "#161b22",
            padding: 15,
            marginBottom: 10,
            borderRadius: 8,
          }}
        >
          <h3>{p.prenom || "Sans nom"}</h3>
          <p>{p.ville} - {p.pays}</p>
          <p>Âge : {p.age}</p>
          <p>Statut : {p.profil_valide ? "VALIDÉ" : "EN ATTENTE"}</p>

          <button onClick={() => validateProfile(p.utilisateur_id)}>
            Valider
          </button>

          <button onClick={() => deleteProfile(p.utilisateur_id)} style={{ marginLeft: 10 }}>
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
}
