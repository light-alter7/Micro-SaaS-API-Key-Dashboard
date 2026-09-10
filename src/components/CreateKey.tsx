import { useState } from "react";
import { ApiKey, Environment } from "../data/mockData";

interface Props {
  onBack: () => void;
  onCreate: (key: ApiKey) => void;
}

const SERVICES = ["OpenAI", "Stripe", "AWS", "Datadog", "SendGrid", "Twilio", "GitHub", "Sentry", "Other"];
const ENVS: Environment[] = ["production", "staging", "development"];

export default function CreateKey({ onBack, onCreate }: Props) {
  const [name, setName] = useState("");
  const [service, setService] = useState("OpenAI");
  const [env, setEnv] = useState<Environment>("production");
  const [owner, setOwner] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [step, setStep] = useState<"form" | "done">("form");
  const [generatedKey, setGeneratedKey] = useState("");
  const [copied, setCopied] = useState(false);

  function handleCreate() {
    const key = `sk_live_${Math.random().toString(36).slice(2, 18)}`;
    setGeneratedKey(key);
    setStep("done");

    const pct = Math.random() * 0.3;
    const limit = parseInt(monthlyLimit) || 0;
    const budget = parseFloat(budgetLimit) || 0;
    const usage = limit > 0 ? Math.floor(limit * pct) : 0;
    const used = budget > 0 ? parseFloat((budget * pct).toFixed(2)) : 0;

    onCreate({
      id: `k${Date.now()}`,
      name,
      key,
      service,
      environment: env,
      owner: owner || "Unassigned",
      status: "active",
      monthlyLimit: limit,
      monthlyUsage: usage,
      budgetLimit: budget,
      budgetUsed: used,
      lastUsed: "—",
      lastRotated: new Date().toISOString().slice(0, 10),
      created: new Date().toISOString().slice(0, 10),
      usageHistory: [],
    });
  }

  function copyKey() {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const inputStyle = {
    width: "100%",
    background: "#0d1628",
    border: "1px solid #1E2D45",
    borderRadius: 6,
    padding: "9px 12px",
    color: "#F5F1E8",
    fontSize: 13,
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    color: "#64748B",
    marginBottom: 6,
    fontWeight: 500,
  };

  const valid = name.trim().length > 0;

  if (step === "done") {
    return (
      <div style={{ padding: "32px 40px", maxWidth: 560 }}>
        <div
          style={{
            background: "#111827",
            border: "1px solid #1E2D45",
            borderRadius: 8,
            padding: "32px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              background: "#052e16",
              border: "1px solid #16A34A33",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              margin: "0 auto 16px",
            }}
          >
            ✓
          </div>
          <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600, color: "#F5F1E8", letterSpacing: "-0.02em" }}>
            Key created
          </h2>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#64748B" }}>
            Copy this key now — it won't be shown again.
          </p>

          <div
            style={{
              background: "#0d1628",
              border: "1px solid #1E2D45",
              borderRadius: 6,
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <span style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 12, color: "#F5F1E8", wordBreak: "break-all", textAlign: "left" }}>
              {generatedKey}
            </span>
            <button
              onClick={copyKey}
              style={{
                flexShrink: 0,
                padding: "6px 12px",
                background: copied ? "#052e16" : "#162032",
                border: `1px solid ${copied ? "#16A34A44" : "#1E2D45"}`,
                color: copied ? "#16A34A" : "#64748B",
                borderRadius: 4,
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <button
            onClick={onBack}
            style={{
              padding: "9px 20px",
              background: "#F5F1E8",
              color: "#0B1220",
              border: "none",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            View all keys →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 560 }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#64748B",
          fontSize: 13,
          cursor: "pointer",
          padding: 0,
          fontFamily: "inherit",
          marginBottom: 24,
        }}
      >
        ← Back
      </button>

      <h1 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 600, color: "#F5F1E8", letterSpacing: "-0.02em" }}>
        New API Key
      </h1>
      <p style={{ margin: "0 0 28px", fontSize: 13, color: "#64748B" }}>
        Configure the key's service, owner, and usage limits.
      </p>

      <div
        style={{
          background: "#111827",
          border: "1px solid #1E2D45",
          borderRadius: 8,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div>
          <label style={labelStyle}>Key Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. OpenAI Production"
            style={inputStyle}
            onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "#64748B")}
            onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "#1E2D45")}
          />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <label style={labelStyle}>Service</label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Environment</label>
            <select
              value={env}
              onChange={(e) => setEnv(e.target.value as Environment)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {ENVS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Owner / Team</label>
          <input
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="e.g. Platform Team"
            style={inputStyle}
            onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "#64748B")}
            onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "#1E2D45")}
          />
        </div>

        <div
          style={{
            borderTop: "1px solid #1E2D45",
            paddingTop: 18,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 14,
          }}
        >
          <div>
            <label style={labelStyle}>Monthly Request Limit</label>
            <input
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              placeholder="e.g. 500000 (0 = unlimited)"
              type="number"
              style={inputStyle}
              onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "#64748B")}
              onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "#1E2D45")}
            />
          </div>
          <div>
            <label style={labelStyle}>Monthly Budget ($)</label>
            <input
              value={budgetLimit}
              onChange={(e) => setBudgetLimit(e.target.value)}
              placeholder="e.g. 500 (0 = no limit)"
              type="number"
              style={inputStyle}
              onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "#64748B")}
              onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderColor = "#1E2D45")}
            />
          </div>
        </div>

        <div style={{ paddingTop: 4, display: "flex", gap: 10 }}>
          <button
            onClick={handleCreate}
            disabled={!valid}
            style={{
              padding: "9px 20px",
              background: valid ? "#F5F1E8" : "#1E2D45",
              color: valid ? "#0B1220" : "#3B5270",
              border: "none",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: valid ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              transition: "opacity 0.15s",
            }}
          >
            Generate Key
          </button>
          <button
            onClick={onBack}
            style={{
              padding: "9px 16px",
              background: "transparent",
              border: "1px solid #1E2D45",
              color: "#64748B",
              borderRadius: 6,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
