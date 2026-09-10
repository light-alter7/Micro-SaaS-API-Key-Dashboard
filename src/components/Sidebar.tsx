import { Screen } from "../App";

interface Props {
  screen: Screen;
  onNavigate: (s: Screen) => void;
}

function KeyholeLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#F5F1E8" />
      <circle cx="16" cy="13" r="4" fill="#0B1220" />
      <path d="M13 17h6l1.5 6H11.5L13 17z" fill="#0B1220" />
      <circle cx="25" cy="9" r="3.5" fill="#16A34A" />
    </svg>
  );
}

const navItems: { id: Screen; label: string; icon: string }[] = [
  { id: "dashboard", label: "API Keys", icon: "⊟" },
  { id: "alerts", label: "Alerts & Limits", icon: "◈" },
];

export default function Sidebar({ screen, onNavigate }: Props) {
  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: "#0d1628",
        borderRight: "1px solid #1E2D45",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
      }}
    >
      <div style={{ padding: "0 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <KeyholeLogo />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: "#F5F1E8", letterSpacing: "-0.01em" }}>
              KeyVault
            </div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>API Key Manager</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 12px", flex: 1 }}>
        <div style={{ fontSize: 10, color: "#64748B", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", padding: "0 8px 8px" }}>
          Management
        </div>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              width: "100%",
              padding: "8px 12px",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
              background: screen === item.id ? "#162032" : "transparent",
              color: screen === item.id ? "#F5F1E8" : "#64748B",
              fontSize: 13,
              fontWeight: screen === item.id ? 500 : 400,
              fontFamily: "inherit",
              textAlign: "left",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (screen !== item.id) {
                (e.currentTarget as HTMLButtonElement).style.color = "#F5F1E8";
                (e.currentTarget as HTMLButtonElement).style.background = "#111827";
              }
            }}
            onMouseLeave={(e) => {
              if (screen !== item.id) {
                (e.currentTarget as HTMLButtonElement).style.color = "#64748B";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }
            }}
          >
            <span style={{ fontSize: 15, opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 20px 0", borderTop: "1px solid #1E2D45", marginTop: 16 }}>
        <div style={{ fontSize: 11, color: "#64748B" }}>Acme Corp</div>
        <div style={{ fontSize: 11, color: "#3B5270", marginTop: 2 }}>Free plan · 8 keys</div>
      </div>
    </aside>
  );
}
