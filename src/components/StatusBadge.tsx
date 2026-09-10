import { KeyStatus } from "../data/mockData";

const config: Record<KeyStatus, { label: string; color: string; bg: string; dot: string }> = {
  active: { label: "Active", color: "#16A34A", bg: "#052e16", dot: "#16A34A" },
  warning: { label: "Warning", color: "#D97706", bg: "#1c1004", dot: "#D97706" },
  critical: { label: "Critical", color: "#DC2626", bg: "#1f0505", dot: "#DC2626" },
  revoked: { label: "Revoked", color: "#64748B", bg: "#111827", dot: "#64748B" },
};

export default function StatusBadge({ status }: { status: KeyStatus }) {
  const c = config[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "2px 8px",
        borderRadius: 4,
        background: c.bg,
        border: `1px solid ${c.color}22`,
        fontSize: 11,
        fontWeight: 500,
        color: c.color,
        letterSpacing: "0.03em",
        textTransform: "uppercase",
        fontFamily: "var(--font-mono)",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {c.label}
    </span>
  );
}
