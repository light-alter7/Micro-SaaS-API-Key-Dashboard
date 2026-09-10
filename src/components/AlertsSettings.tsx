import { useState } from "react";
import { ApiKey } from "../data/mockData";
import StatusBadge from "./StatusBadge";

interface Props {
  keys: ApiKey[];
  onBack: () => void;
}

interface AlertRule {
  id: string;
  keyId: string;
  type: "usage" | "budget";
  threshold: number;
  enabled: boolean;
}

export default function AlertsSettings({ keys }: Props) {
  const activeKeys = keys.filter((k) => k.status !== "revoked");

  const [rules, setRules] = useState<AlertRule[]>([
    ...activeKeys.slice(0, 6).flatMap((k) => [
      {
        id: `${k.id}-usage`,
        keyId: k.id,
        type: "usage" as const,
        threshold: 80,
        enabled: true,
      },
      {
        id: `${k.id}-budget`,
        keyId: k.id,
        type: "budget" as const,
        threshold: 90,
        enabled: k.budgetLimit > 0,
      },
    ]),
  ]);

  const [globalEmail, setGlobalEmail] = useState("ops-team@acmecorp.io");
  const [saved, setSaved] = useState(false);

  function toggleRule(id: string) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  }

  function updateThreshold(id: string, val: number) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, threshold: val } : r)));
  }

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const usageRules = rules.filter((r) => r.type === "usage");
  const budgetRules = rules.filter((r) => r.type === "budget" && r.enabled !== false);

  function RuleRow({ rule }: { rule: AlertRule }) {
    const key = keys.find((k) => k.id === rule.keyId);
    if (!key) return null;
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.5fr 1fr 100px",
          padding: "12px 20px",
          alignItems: "center",
          borderBottom: "1px solid #1E2D45",
          opacity: rule.enabled ? 1 : 0.45,
          transition: "opacity 0.15s",
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: "#F5F1E8", fontWeight: 500 }}>{key.name}</div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{key.service} · {key.owner}</div>
        </div>
        <div>
          <StatusBadge status={key.status} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="range"
            min={50}
            max={99}
            value={rule.threshold}
            onChange={(e) => updateThreshold(rule.id, parseInt(e.target.value))}
            style={{ width: 80, accentColor: rule.threshold >= 90 ? "#DC2626" : "#D97706" }}
          />
          <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: rule.threshold >= 90 ? "#DC2626" : "#D97706", minWidth: 30 }}>
            {rule.threshold}%
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={() => toggleRule(rule.id)}
            style={{
              width: 36,
              height: 20,
              borderRadius: 10,
              background: rule.enabled ? "#16A34A" : "#1E2D45",
              border: "none",
              cursor: "pointer",
              position: "relative",
              transition: "background 0.2s",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: 2,
                left: rule.enabled ? 18 : 2,
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: "#F5F1E8",
                transition: "left 0.2s",
              }}
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 860 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#F5F1E8", letterSpacing: "-0.02em" }}>
          Alerts & Limits
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>
          Configure per-key alerts. Notifications sent to the team email below.
        </p>
      </div>

      {/* Notification target */}
      <div
        style={{
          background: "#111827",
          border: "1px solid #1E2D45",
          borderRadius: 8,
          padding: "18px 20px",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: 12 }}>
          Notification Target
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            value={globalEmail}
            onChange={(e) => setGlobalEmail(e.target.value)}
            style={{
              flex: 1,
              background: "#0d1628",
              border: "1px solid #1E2D45",
              borderRadius: 6,
              padding: "8px 12px",
              color: "#F5F1E8",
              fontSize: 13,
              fontFamily: "var(--font-mono)",
              outline: "none",
            }}
            onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "#64748B")}
            onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "#1E2D45")}
          />
          <span style={{ fontSize: 12, color: "#64748B" }}>+ Slack webhook (coming soon)</span>
        </div>
      </div>

      {/* Usage alerts */}
      <div
        style={{
          background: "#111827",
          border: "1px solid #1E2D45",
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1fr 100px",
            padding: "10px 20px",
            borderBottom: "1px solid #1E2D45",
            fontSize: 11,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            fontWeight: 500,
          }}
        >
          <span>Key</span>
          <span>Status</span>
          <span>Request Alert At</span>
          <span style={{ textAlign: "right" }}>Enabled</span>
        </div>
        {usageRules.map((r) => <RuleRow key={r.id} rule={r} />)}
      </div>

      {/* Budget alerts */}
      <div
        style={{
          background: "#111827",
          border: "1px solid #1E2D45",
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1.5fr 1fr 100px",
            padding: "10px 20px",
            borderBottom: "1px solid #1E2D45",
            fontSize: 11,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            fontWeight: 500,
          }}
        >
          <span>Key</span>
          <span>Status</span>
          <span>Budget Alert At</span>
          <span style={{ textAlign: "right" }}>Enabled</span>
        </div>
        {budgetRules.map((r) => <RuleRow key={r.id} rule={r} />)}
      </div>

      <button
        onClick={save}
        style={{
          padding: "9px 24px",
          background: saved ? "#052e16" : "#F5F1E8",
          color: saved ? "#16A34A" : "#0B1220",
          border: saved ? "1px solid #16A34A44" : "none",
          borderRadius: 6,
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "all 0.2s",
        }}
      >
        {saved ? "✓ Saved" : "Save Settings"}
      </button>
    </div>
  );
}
