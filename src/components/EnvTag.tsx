import { Environment } from "../data/mockData";

const styles: Record<Environment, { color: string; bg: string }> = {
  production: { color: "#F5F1E8", bg: "#162032" },
  staging: { color: "#D97706", bg: "#1c1004" },
  development: { color: "#64748B", bg: "#111827" },
};

export default function EnvTag({ env }: { env: Environment }) {
  const s = styles[env];
  return (
    <span
      style={{
        padding: "1px 6px",
        borderRadius: 3,
        background: s.bg,
        color: s.color,
        fontSize: 10,
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontFamily: "var(--font-mono)",
        border: "1px solid #1E2D45",
      }}
    >
      {env}
    </span>
  );
}
