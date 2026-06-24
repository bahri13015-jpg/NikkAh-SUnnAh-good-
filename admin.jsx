import { useState } from "react";

const COLORS = {
  bg: "#0D1117",
  surface: "#141B24",
  surfaceAlt: "#1A2332",
  border: "#1E2D3D",
  gold: "#C9A84C",
  goldLight: "#E8C97A",
  goldDim: "#8A6E2F",
  emerald: "#1A4A3A",
  emeraldBright: "#2A6B54",
  text: "#E8E0D0",
  textMuted: "#8A9BAD",
  textDim: "#4A5A6A",
  red: "#C0392B",
  redSoft: "#2D1A1A",
  green: "#27AE60",
  greenSoft: "#1A2D1A",
  amber: "#E67E22",
  amberSoft: "#2D2010",
  blue: "#2980B9",
  blueSoft: "#0F1E2D",
};

const mockProfiles = [
  { id: 1, name: "Amina Khelifi", age: 27, city: "Lyon", joined: "12 jan 2025", status: "pending", photo: true, verified: false, reports: 0 },
  { id: 2, name: "Youssef Benali", age: 31, city: "Paris", joined: "8 jan 2025", status: "pending", photo: true, verified: false, reports: 0 },
  { id: 3, name: "Fatima Zahra", age: 24, city: "Marseille", joined: "15 jan 2025", status: "pending", photo: false, verified: false, reports: 0 },
  { id: 4, name: "Ibrahim Toure", age: 34, city: "Bruxelles", joined: "3 jan 2025", status: "active", photo: true, verified: true, reports: 1 },
  { id: 5, name: "Nadia Osman", age: 29, city: "Casablanca", joined: "20 déc 2024", status: "active", photo: true, verified: true, reports: 0 },
  { id: 6, name: "Karim Sebti", age: 28, city: "Toulouse", joined: "5 déc 2024", status: "banned", photo: true, verified: true, reports: 3 },
];

const mockReports = [
  { id: 1, reporter: "Nadia Osman", target: "Karim Sebti", reason: "Comportement irrespectueux", detail: "Messages à caractère inapproprié, harcèlement après refus de contact.", date: "18 jan 2025", status: "resolved", severity: "high" },
  { id: 2, reporter: "Fatima Zahra", target: "Ibrahim Toure", reason: "Faux profil suspecté", detail: "Photo ne correspond pas à la vérification d'identité soumise.", date: "20 jan 2025", status: "pending", severity: "medium" },
  { id: 3, reporter: "Amina Khelifi", target: "Utilisateur inconnu", reason: "Spam / sollicitation commerciale", detail: "Envoi de liens externes vers un service tiers non affilié.", date: "22 jan 2025", status: "pending", severity: "low" },
];

const mockSubscriptions = [
  { id: 1, name: "Amina Khelifi", plan: "Premium", start: "12 jan 2025", end: "12 avr 2025", amount: "29,99€", status: "active" },
  { id: 2, name: "Ibrahim Toure", plan: "Premium", start: "3 jan 2025", end: "3 avr 2025", amount: "29,99€", status: "suspended" },
  { id: 3, name: "Nadia Osman", plan: "Premium+", start: "20 déc 2024", end: "20 juin 2025", amount: "49,99€", status: "active" },
  { id: 4, name: "Youssef Benali", plan: "Découverte", start: "8 jan 2025", end: "8 fév 2025", amount: "9,99€", status: "active" },
];

const stats = [
  { label: "Membres actifs", value: "12 847", delta: "+124 ce mois", icon: "◆", color: COLORS.gold },
  { label: "Profils en attente", value: "38", delta: "À valider", icon: "◈", color: COLORS.amber },
  { label: "Signalements ouverts", value: "7", delta: "2 urgents", icon: "⚑", color: COLORS.red },
  { label: "Mariages réalisés", value: "934", delta: "+12 ce mois", icon: "✦", color: COLORS.green },
];

const navItems = [
  { id: "dashboard", label: "Vue d'ensemble", icon: "▦" },
  { id: "profiles", label: "Profils", icon: "◉", badge: 38 },
  { id: "reports", label: "Signalements", icon: "⚑", badge: 7 },
  { id: "subscriptions", label: "Abonnements", icon: "◈" },
];

function Badge({ children, color, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "2px 8px",
      borderRadius: 4, fontSize: 11, fontWeight: 600, letterSpacing: "0.05em",
      color, background: bg, border: `1px solid ${color}22`,
    }}>{children}</span>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: { label: "En attente", color: COLORS.amber, bg: COLORS.amberSoft },
    active: { label: "Actif", color: COLORS.green, bg: COLORS.greenSoft },
    banned: { label: "Banni", color: COLORS.red, bg: COLORS.redSoft },
    suspended: { label: "Suspendu", color: COLORS.amber, bg: COLORS.amberSoft },
    resolved: { label: "Résolu", color: COLORS.green, bg: COLORS.greenSoft },
    high: { label: "Urgent", color: COLORS.red, bg: COLORS.redSoft },
    medium: { label: "Modéré", color: COLORS.amber, bg: COLORS.amberSoft },
    low: { label: "Faible", color: COLORS.textMuted, bg: COLORS.border },
  };
  const s = map[status] || map.pending;
  return <Badge color={s.color} bg={s.bg}>{s.label}</Badge>;
}

function Avatar({ name, size = 36 }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const hue = name.charCodeAt(0) * 7 % 360;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `hsl(${hue}, 30%, 25%)`,
      border: `1px solid hsl(${hue}, 40%, 35%)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.35, fontWeight: 700, color: `hsl(${hue}, 60%, 70%)`,
      flexShrink: 0,
    }}>{initials}</div>
  );
}

function ActionBtn({ onClick, color, bg, children }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        padding: "5px 12px", borderRadius: 4, border: `1px solid ${color}44`,
        background: hover ? color + "22" : bg || "transparent",
        color, fontSize: 12, fontWeight: 600, cursor: "pointer",
        transition: "all 0.15s", letterSpacing: "0.03em",
      }}>{children}</button>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: COLORS.surface, border: `1px solid ${COLORS.border}`,
        borderRadius: 12, padding: 28, width: "100%", maxWidth: 480,
        boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ color: COLORS.text, fontSize: 16, fontWeight: 600 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 20 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profiles, setProfiles] = useState(mockProfiles);
  const [reports, setReports] = useState(mockReports);
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [modal, setModal] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleValidate = (id) => {
    setProfiles(p => p.map(pr => pr.id === id ? { ...pr, status: "active", verified: true } : pr));
    showToast("Profil validé avec succès");
    setModal(null);
  };

  const handleDelete = (id) => {
    setProfiles(p => p.filter(pr => pr.id !== id));
    showToast("Profil supprimé", "warning");
    setModal(null);
  };

  const handleBan = (id) => {
    setProfiles(p => p.map(pr => pr.id === id ? { ...pr, status: "banned" } : pr));
    setSubscriptions(s => s.map(sub => {
      const profile = mockProfiles.find(pr => pr.id === id);
      return profile && sub.name === profile.name ? { ...sub, status: "suspended" } : sub;
    }));
    showToast("Utilisateur banni", "error");
    setModal(null);
  };

  const handleResolve = (id) => {
    setReports(r => r.map(rep => rep.id === id ? { ...rep, status: "resolved" } : rep));
    showToast("Signalement résolu");
  };

  const handleCancelSub = (id) => {
    setSubscriptions(s => s.map(sub => sub.id === id ? { ...sub, status: "suspended" } : sub));
    showToast("Abonnement suspendu", "warning");
  };

  const pendingCount = profiles.filter(p => p.status === "pending").length;
  const openReports = reports.filter(r => r.status === "pending").length;

  const navWithBadges = navItems.map(n => ({
    ...n,
    badge: n.id === "profiles" ? pendingCount : n.id === "reports" ? openReports : null,
  }));

  return (
    <div style={{ display: "flex", height: "100vh", background: COLORS.bg, fontFamily: "'Inter', -apple-system, sans-serif", color: COLORS.text, overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? 240 : 64, flexShrink: 0, background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column",
        transition: "width 0.25s ease", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${COLORS.emerald}, ${COLORS.emeraldBright})`,
            border: `1px solid ${COLORS.gold}44`, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, color: COLORS.gold, flexShrink: 0,
          }}>✦</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, letterSpacing: "0.02em" }}>Nour Al Zawwaj</div>
              <div style={{ fontSize: 10, color: COLORS.gold, letterSpacing: "0.1em", textTransform: "uppercase" }}>Administration</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {navWithBadges.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "10px 10px", borderRadius: 8, marginBottom: 2, cursor: "pointer",
              background: activeTab === item.id ? `${COLORS.gold}15` : "transparent",
              border: activeTab === item.id ? `1px solid ${COLORS.gold}30` : "1px solid transparent",
              color: activeTab === item.id ? COLORS.goldLight : COLORS.textMuted,
              fontSize: 13, fontWeight: activeTab === item.id ? 600 : 400, textAlign: "left",
              transition: "all 0.15s", whiteSpace: "nowrap", overflow: "hidden",
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ flex: 1 }}>{item.label}</span>}
              {sidebarOpen && item.badge > 0 && (
                <span style={{
                  background: COLORS.gold, color: COLORS.bg, borderRadius: 10,
                  fontSize: 10, fontWeight: 700, padding: "1px 6px", flexShrink: 0,
                }}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Admin user */}
        <div style={{ padding: "12px 10px", borderTop: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name="Admin Sys" size={32} />
          {sidebarOpen && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>Administrateur</div>
              <div style={{ fontSize: 10, color: COLORS.gold }}>Super Admin</div>
            </div>
          )}
        </div>

        <button onClick={() => setSidebarOpen(o => !o)} style={{
          margin: "0 8px 8px", padding: "8px", borderRadius: 6, border: `1px solid ${COLORS.border}`,
          background: "transparent", color: COLORS.textMuted, cursor: "pointer", fontSize: 12,
        }}>{sidebarOpen ? "← Réduire" : "→"}</button>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <header style={{
          padding: "16px 28px", background: COLORS.surface, borderBottom: `1px solid ${COLORS.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: 0 }}>
              {navItems.find(n => n.id === activeTab)?.label || "Vue d'ensemble"}
            </h1>
            <p style={{ fontSize: 12, color: COLORS.textMuted, margin: "2px 0 0" }}>
              {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {openReports > 0 && (
              <button onClick={() => setActiveTab("reports")} style={{
                padding: "6px 14px", borderRadius: 6, border: `1px solid ${COLORS.red}44`,
                background: COLORS.redSoft, color: COLORS.red, fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>⚑ {openReports} signalement{openReports > 1 ? "s" : ""}</button>
            )}
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: COLORS.emerald,
              border: `1px solid ${COLORS.emeraldBright}`, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 16, color: COLORS.gold, cursor: "pointer",
            }}>◉</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: 28 }}>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
                {stats.map((s, i) => (
                  <div key={i} style={{
                    background: COLORS.surface, border: `1px solid ${COLORS.border}`,
                    borderRadius: 10, padding: "20px 22px",
                    borderTop: `2px solid ${s.color}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6, letterSpacing: "0.05em" }}>{s.label}</div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.text }}>{s.value}</div>
                        <div style={{ fontSize: 11, color: s.color, marginTop: 4 }}>{s.delta}</div>
                      </div>
                      <span style={{ fontSize: 22, color: s.color, opacity: 0.6 }}>{s.icon}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* Recent pending */}
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Profils en attente</span>
                    <button onClick={() => setActiveTab("profiles")} style={{ background: "none", border: "none", color: COLORS.gold, fontSize: 12, cursor: "pointer" }}>Voir tout →</button>
                  </div>
                  <div style={{ padding: "8px 0" }}>
                    {profiles.filter(p => p.status === "pending").slice(0, 4).map(p => (
                      <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px" }}>
                        <Avatar name={p.name} size={32} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{p.city} · {p.joined}</div>
                        </div>
                        <ActionBtn color={COLORS.green} onClick={() => handleValidate(p.id)}>Valider</ActionBtn>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent reports */}
                <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>Signalements récents</span>
                    <button onClick={() => setActiveTab("reports")} style={{ background: "none", border: "none", color: COLORS.gold, fontSize: 12, cursor: "pointer" }}>Voir tout →</button>
                  </div>
                  <div style={{ padding: "8px 0" }}>
                    {reports.slice(0, 4).map(r => (
                      <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px" }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: r.severity === "high" ? COLORS.redSoft : COLORS.amberSoft, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: r.severity === "high" ? COLORS.red : COLORS.amber }}>⚑</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.reason}</div>
                          <div style={{ fontSize: 11, color: COLORS.textMuted }}>Contre {r.target}</div>
                        </div>
                        <StatusBadge status={r.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILES */}
          {activeTab === "profiles" && (
            <div>
              <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
                {["all", "pending", "active", "banned"].map(f => (
                  <button key={f} style={{
                    padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                    background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.textMuted,
                  }}>
                    {{ all: "Tous", pending: "En attente", active: "Actifs", banned: "Bannis" }[f]}
                  </button>
                ))}
                <div style={{ flex: 1 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 12px" }}>
                  <span style={{ color: COLORS.textMuted, fontSize: 13 }}>🔍</span>
                  <input placeholder="Rechercher un profil…" style={{ background: "none", border: "none", color: COLORS.text, fontSize: 13, outline: "none", width: 180 }} />
                </div>
              </div>

              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      {["Membre", "Ville", "Inscrit le", "Photo", "Statut", "Signalements", "Actions"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textAlign: "left", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((p, i) => (
                      <tr key={p.id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? "transparent" : `${COLORS.surfaceAlt}40` }}>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Avatar name={p.name} size={32} />
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                              <div style={{ fontSize: 11, color: COLORS.textMuted }}>{p.age} ans</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: COLORS.textMuted }}>{p.city}</td>
                        <td style={{ padding: "14px 16px", fontSize: 12, color: COLORS.textMuted }}>{p.joined}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 13, color: p.photo ? COLORS.green : COLORS.textDim }}>{p.photo ? "✓" : "—"}</span>
                        </td>
                        <td style={{ padding: "14px 16px" }}><StatusBadge status={p.status} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          {p.reports > 0
                            ? <span style={{ color: COLORS.red, fontSize: 13, fontWeight: 600 }}>{p.reports}</span>
                            : <span style={{ color: COLORS.textDim, fontSize: 13 }}>0</span>}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", gap: 6, flexWrap: "nowrap" }}>
                            {p.status === "pending" && (
                              <ActionBtn color={COLORS.green} onClick={() => setModal({ type: "validate", profile: p })}>Valider</ActionBtn>
                            )}
                            {p.status !== "banned" && (
                              <ActionBtn color={COLORS.amber} onClick={() => setModal({ type: "ban", profile: p })}>Bannir</ActionBtn>
                            )}
                            <ActionBtn color={COLORS.red} onClick={() => setModal({ type: "delete", profile: p })}>Supprimer</ActionBtn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REPORTS */}
          {activeTab === "reports" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Ouverts", value: reports.filter(r => r.status === "pending").length, color: COLORS.amber },
                  { label: "Résolus", value: reports.filter(r => r.status === "resolved").length, color: COLORS.green },
                  { label: "Urgents", value: reports.filter(r => r.severity === "high").length, color: COLORS.red },
                ].map((s, i) => (
                  <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "16px 20px" }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {reports.map(r => (
                  <div key={r.id} style={{
                    background: COLORS.surface, border: `1px solid ${r.status === "pending" && r.severity === "high" ? COLORS.red + "44" : COLORS.border}`,
                    borderRadius: 10, padding: "20px 24px",
                    borderLeft: `3px solid ${r.severity === "high" ? COLORS.red : r.severity === "medium" ? COLORS.amber : COLORS.textDim}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 600 }}>{r.reason}</span>
                          <StatusBadge status={r.severity} />
                          <StatusBadge status={r.status} />
                        </div>
                        <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 10px", lineHeight: 1.5 }}>{r.detail}</p>
                        <div style={{ display: "flex", gap: 20, fontSize: 12, color: COLORS.textDim }}>
                          <span>Signalé par <strong style={{ color: COLORS.textMuted }}>{r.reporter}</strong></span>
                          <span>Contre <strong style={{ color: COLORS.textMuted }}>{r.target}</strong></span>
                          <span>{r.date}</span>
                        </div>
                      </div>
                      {r.status === "pending" && (
                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                          <ActionBtn color={COLORS.green} onClick={() => handleResolve(r.id)}>Résoudre</ActionBtn>
                          <ActionBtn color={COLORS.red} onClick={() => {
                            const p = profiles.find(pr => pr.name === r.target);
                            if (p) setModal({ type: "ban", profile: p });
                          }}>Bannir l'utilisateur</ActionBtn>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBSCRIPTIONS */}
          {activeTab === "subscriptions" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
                {[
                  { label: "Abonnements actifs", value: subscriptions.filter(s => s.status === "active").length, sub: "ce mois", color: COLORS.gold },
                  { label: "Revenus mensuels", value: "89,97€", sub: "4 abonnements", color: COLORS.green },
                  { label: "Suspendus", value: subscriptions.filter(s => s.status === "suspended").length, sub: "à examiner", color: COLORS.amber },
                ].map((s, i) => (
                  <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "16px 20px", borderTop: `2px solid ${s.color}` }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 2 }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 10, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                      {["Membre", "Formule", "Début", "Expiration", "Montant", "Statut", "Action"].map(h => (
                        <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 600, color: COLORS.textMuted, textAlign: "left", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((s, i) => (
                      <tr key={s.id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: i % 2 === 0 ? "transparent" : `${COLORS.surfaceAlt}40` }}>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <Avatar name={s.name} size={30} />
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.gold, background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}30`, padding: "2px 8px", borderRadius: 4 }}>{s.plan}</span>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 12, color: COLORS.textMuted }}>{s.start}</td>
                        <td style={{ padding: "14px 16px", fontSize: 12, color: COLORS.textMuted }}>{s.end}</td>
                        <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: COLORS.text }}>{s.amount}</td>
                        <td style={{ padding: "14px 16px" }}><StatusBadge status={s.status} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          {s.status === "active"
                            ? <ActionBtn color={COLORS.amber} onClick={() => handleCancelSub(s.id)}>Suspendre</ActionBtn>
                            : <ActionBtn color={COLORS.green} onClick={() => setSubscriptions(prev => prev.map(sub => sub.id === s.id ? { ...sub, status: "active" } : sub))}>Réactiver</ActionBtn>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {modal?.type === "validate" && (
        <Modal title="Valider ce profil" onClose={() => setModal(null)}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20, padding: 16, background: COLORS.greenSoft, borderRadius: 8, border: `1px solid ${COLORS.green}33` }}>
            <Avatar name={modal.profile.name} size={44} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{modal.profile.name}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>{modal.profile.age} ans · {modal.profile.city}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>Inscrit le {modal.profile.joined}</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 20, lineHeight: 1.6 }}>
            En validant ce profil, vous confirmez que l'identité a été vérifiée et que le contenu respecte la charte de Nour Al Zawwaj.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <ActionBtn color={COLORS.textMuted} onClick={() => setModal(null)}>Annuler</ActionBtn>
            <button onClick={() => handleValidate(modal.profile.id)} style={{
              padding: "8px 20px", borderRadius: 6, border: "none", background: COLORS.green,
              color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}>✓ Valider le profil</button>
          </div>
        </Modal>
      )}

      {modal?.type === "ban" && (
        <Modal title="Bannir cet utilisateur" onClose={() => setModal(null)}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20, padding: 16, background: COLORS.redSoft, borderRadius: 8, border: `1px solid ${COLORS.red}33` }}>
            <Avatar name={modal.profile.name} size={44} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{modal.profile.name}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>{modal.profile.city}</div>
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>Motif du bannissement</label>
            <select style={{ width: "100%", padding: "8px 12px", background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, borderRadius: 6, color: COLORS.text, fontSize: 13 }}>
              <option>Comportement irrespectueux</option>
              <option>Faux profil / usurpation d'identité</option>
              <option>Contenu inapproprié</option>
              <option>Harcèlement</option>
              <option>Non-respect de la charte</option>
            </select>
          </div>
          <p style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 20 }}>
            L'utilisateur sera immédiatement suspendu et ne pourra plus accéder à la plateforme. Son abonnement sera également suspendu.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <ActionBtn color={COLORS.textMuted} onClick={() => setModal(null)}>Annuler</ActionBtn>
            <button onClick={() => handleBan(modal.profile.id)} style={{
              padding: "8px 20px", borderRadius: 6, border: "none", background: COLORS.red,
              color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}>Bannir définitivement</button>
          </div>
        </Modal>
      )}

      {modal?.type === "delete" && (
        <Modal title="Supprimer ce profil" onClose={() => setModal(null)}>
          <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            <p style={{ fontSize: 14, color: COLORS.text, fontWeight: 600, marginBottom: 8 }}>Supprimer <em>{modal.profile.name}</em> ?</p>
            <p style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>
              Cette action est irréversible. Toutes les données, conversations et correspondances de ce membre seront définitivement effacées.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <ActionBtn color={COLORS.textMuted} onClick={() => setModal(null)}>Annuler</ActionBtn>
            <button onClick={() => handleDelete(modal.profile.id)} style={{
              padding: "8px 20px", borderRadius: 6, border: "none", background: COLORS.red,
              color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}>Supprimer définitivement</button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 2000,
          background: toast.type === "error" ? COLORS.redSoft : toast.type === "warning" ? COLORS.amberSoft : COLORS.greenSoft,
          border: `1px solid ${toast.type === "error" ? COLORS.red : toast.type === "warning" ? COLORS.amber : COLORS.green}44`,
          color: toast.type === "error" ? COLORS.red : toast.type === "warning" ? COLORS.amber : COLORS.green,
          padding: "12px 20px", borderRadius: 8, fontSize: 13, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          animation: "fadeIn 0.2s ease",
        }}>
          {toast.type === "error" ? "✕" : toast.type === "warning" ? "⚠" : "✓"} {toast.msg}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2A3A4A; border-radius: 3px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
