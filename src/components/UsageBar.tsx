interface Props {
  used: number;
  limit: number;
  label?: string;
}

export default function UsageBar({ used, limit, label }: Props) {
  if (limit === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 4, background: "#1E2D45", borderRadius: 2 }} />
        <span style={{ fontSize: 11, color: "#64748B", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
          Unlimited
        </span>
      </div>
    );
  }

  const pct = Math.min((used / limit) * 100, 100);
  const color = pct >= 95 ? "#DC2626" : pct >= 80 ? "#D97706" : "#16A34A";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        {label && <span style={{ fontSize: 11, color: "#64748B" }}>{label}</span>}
        <span style={{ fontSize: 11, color: "#64748B", fontFamily: "var(--font-mono)", marginLeft: "auto" }}>
          {pct.toFixed(0)}%
        </span>
      </div>
      <div style={{ height: 4, background: "#1E2D45", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 2,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
