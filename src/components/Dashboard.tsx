import { ApiKey, KeyStatus } from "../data/mockData";
import StatusBadge from "./StatusBadge";
import UsageBar from "./UsageBar";
import EnvTag from "./EnvTag";

interface Props {
  keys: ApiKey[];
  onSelectKey: (id: string) => void;
  onCreateKey: () => void;
}

function fmt(n: number) {
  if (n === 0) return "—";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return `${n}`;
}

function fmtCost(n: number) {
  if (n === 0) return "—";
  return `$${n.toFixed(2)}`;
}

function maskKey(key: string) {
  return key.slice(0, 14) + "••••••••";
}

const statusOrder: KeyStatus[] = ["critical", "warning", "active", "revoked"];

export default function Dashboard({ keys, onSelectKey, onCreateKey }: Props) {
  const sorted = [...keys].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );

  const criticalCount = keys.filter((k) => k.status === "critical").length;
  const warningCount = keys.filter((k) => k.status === "warning").length;
  const activeCount = keys.filter((k) => k.status === "active").length;
  const totalSpend = keys.reduce((s, k) => s + k.budgetUsed, 0);

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#F5F1E8", letterSpacing: "-0.02em" }}>
            API Keys
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
            {keys.length} keys across {new Set(keys.map((k) => k.service)).size} services
          </p>
        </div>
        <button
          onClick={onCreateKey}
          style={{
            padding: "8px 16px",
            background: "#F5F1E8",
            color: "#0B1220",
            border: "none",
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            letterSpacing: "-0.01em",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "0.85")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = "1")}
        >
          + New Key
        </button>
      </div>

      {/* Summary tiles */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 12,
          marginBottom: 28,
        }}
      >
        {[
          { label: "Critical", value: criticalCount, color: "#DC2626", sub: "need attention" },
          { label: "Warning", value: warningCount, color: "#D97706", sub: "near limit" },
          { label: "Active", value: activeCount, color: "#16A34A", sub: "healthy" },
          { label: "Monthly Spend", value: `$${totalSpend.toFixed(0)}`, color: "#F5F1E8", sub: "across all keys" },
        ].map((tile) => (
          <div
            key={tile.label}
            style={{
              background: "#111827",
              border: "1px solid #1E2D45",
              borderRadius: 8,
              padding: "16px 18px",
            }}
          >
            <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500 }}>
              {tile.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, color: tile.color, margin: "6px 0 2px", letterSpacing: "-0.02em" }}>
              {tile.value}
            </div>
            <div style={{ fontSize: 11, color: "#3B5270" }}>{tile.sub}</div>
          </div>
        ))}
      </div>

      {/* Alert banner */}
      {(criticalCount > 0 || warningCount > 0) && (
        <div
          style={{
            background: "#1c1004",
            border: "1px solid #D9770644",
            borderRadius: 6,
            padding: "10px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            color: "#D97706",
          }}
        >
          <span style={{ fontSize: 15 }}>◈</span>
          <span>
            {criticalCount > 0 && `${criticalCount} key${criticalCount > 1 ? "s are" : " is"} above 95% usage. `}
            {warningCount > 0 && `${warningCount} key${warningCount > 1 ? "s are" : " is"} above 80% usage.`}
            {" "}Consider rotating or increasing limits.
          </span>
        </div>
      )}

      {/* Keys table */}
      <div style={{ background: "#111827", border: "1px solid #1E2D45", borderRadius: 8, overflow: "hidden" }}>
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1.4fr 1fr",
            padding: "10px 20px",
            borderBottom: "1px solid #1E2D45",
            fontSize: 11,
            fontWeight: 500,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          }}
        >
          <span>Key / Service</span>
          <span>Environment</span>
          <span>Usage</span>
          <span>Spend</span>
          <span style={{ paddingLeft: 8 }}>Quota</span>
          <span>Status</span>
        </div>

        {sorted.map((k, i) => (
          <div
            key={k.id}
            onClick={() => onSelectKey(k.id)}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1.2fr 1fr 1fr 1.4fr 1fr",
              padding: "14px 20px",
              borderBottom: i < sorted.length - 1 ? "1px solid #1E2D45" : "none",
              cursor: "pointer",
              transition: "background 0.12s",
              alignItems: "center",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "#162032")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
          >
            {/* Name + key */}
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#F5F1E8", letterSpacing: "-0.01em" }}>
                {k.name}
              </div>
              <div style={{ fontSize: 11, color: "#64748B", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                {maskKey(k.key)}
              </div>
            </div>

            {/* Environment */}
            <div>
              <EnvTag env={k.environment} />
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 4 }}>{k.owner}</div>
            </div>

            {/* Requests */}
            <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "#F5F1E8" }}>
              {fmt(k.monthlyUsage)}
              {k.monthlyLimit > 0 && (
                <span style={{ color: "#64748B" }}> / {fmt(k.monthlyLimit)}</span>
              )}
            </div>

            {/* Spend */}
            <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: k.budgetUsed > 0 ? "#F5F1E8" : "#64748B" }}>
              {fmtCost(k.budgetUsed)}
              {k.budgetLimit > 0 && (
                <span style={{ color: "#64748B", fontSize: 11 }}> / ${k.budgetLimit}</span>
              )}
            </div>

            {/* Usage bar */}
            <div style={{ paddingLeft: 8 }}>
              <UsageBar used={k.monthlyUsage} limit={k.monthlyLimit} />
            </div>

            {/* Status */}
            <div>
              <StatusBadge status={k.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
