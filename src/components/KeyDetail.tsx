import { useState } from "react";
import { ApiKey } from "../data/mockData";
import StatusBadge from "./StatusBadge";
import UsageBar from "./UsageBar";
import EnvTag from "./EnvTag";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  apiKey: ApiKey;
  onBack: () => void;
  onRevoke: () => void;
  onRotate: () => void;
}

function maskKey(key: string) {
  return key.slice(0, 14) + "••••••••";
}

type ChartMode = "requests" | "cost";

export default function KeyDetail({ apiKey: k, onBack, onRevoke, onRotate }: Props) {
  const [showKey, setShowKey] = useState(false);
  const [chartMode, setChartMode] = useState<ChartMode>("requests");
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [copied, setCopied] = useState(false);

  function copyKey() {
    navigator.clipboard.writeText(k.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const pctRequests = k.monthlyLimit > 0 ? (k.monthlyUsage / k.monthlyLimit) * 100 : 0;
  const pctBudget = k.budgetLimit > 0 ? (k.budgetUsed / k.budgetLimit) * 100 : 0;

  const chartData = k.usageHistory.map((p) => ({
    date: p.date.slice(5),
    value: chartMode === "requests" ? p.requests : p.cost,
  }));

  const dataColor = pctRequests >= 95 ? "#DC2626" : pctRequests >= 80 ? "#D97706" : "#16A34A";

  return (
    <div style={{ padding: "32px 40px", maxWidth: 980 }}>
      {/* Back */}
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
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 24,
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#F5F1E8")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#64748B")}
      >
        ← Back to keys
      </button>

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#F5F1E8", letterSpacing: "-0.02em" }}>
              {k.name}
            </h1>
            <StatusBadge status={k.status} />
            <EnvTag env={k.environment} />
          </div>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "#64748B" }}>
            {k.service} · owned by {k.owner}
          </p>
        </div>

        {k.status !== "revoked" && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={onRotate}
              style={{
                padding: "8px 14px",
                background: "transparent",
                border: "1px solid #1E2D45",
                color: "#F5F1E8",
                borderRadius: 6,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#64748B";
                (e.currentTarget as HTMLButtonElement).style.background = "#162032";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#1E2D45";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              ↺ Rotate Key
            </button>
            {!confirmRevoke ? (
              <button
                onClick={() => setConfirmRevoke(true)}
                style={{
                  padding: "8px 14px",
                  background: "transparent",
                  border: "1px solid #DC262644",
                  color: "#DC2626",
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#1f0505")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
              >
                Revoke
              </button>
            ) : (
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#DC2626" }}>Confirm revoke?</span>
                <button
                  onClick={() => { onRevoke(); setConfirmRevoke(false); }}
                  style={{
                    padding: "6px 12px",
                    background: "#DC2626",
                    border: "none",
                    color: "#fff",
                    borderRadius: 5,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Yes, revoke
                </button>
                <button
                  onClick={() => setConfirmRevoke(false)}
                  style={{
                    padding: "6px 12px",
                    background: "transparent",
                    border: "1px solid #1E2D45",
                    color: "#64748B",
                    borderRadius: 5,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Key string */}
      <div
        style={{
          background: "#111827",
          border: "1px solid #1E2D45",
          borderRadius: 8,
          padding: "14px 18px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ fontSize: 11, color: "#64748B", minWidth: 40 }}>Key</span>
        <span
          style={{
            flex: 1,
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: "#F5F1E8",
            letterSpacing: "0.03em",
          }}
        >
          {showKey ? k.key : maskKey(k.key)}
        </span>
        <button
          onClick={() => setShowKey((v) => !v)}
          style={{
            background: "none",
            border: "1px solid #1E2D45",
            color: "#64748B",
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 4,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {showKey ? "Hide" : "Reveal"}
        </button>
        <button
          onClick={copyKey}
          style={{
            background: copied ? "#052e16" : "none",
            border: `1px solid ${copied ? "#16A34A44" : "#1E2D45"}`,
            color: copied ? "#16A34A" : "#64748B",
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 4,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Metrics grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {/* Requests quota */}
        <div style={{ background: "#111827", border: "1px solid #1E2D45", borderRadius: 8, padding: "18px 20px" }}>
          <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: 12 }}>
            Request Quota — This Month
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: "#F5F1E8", letterSpacing: "-0.02em", fontFamily: "var(--font-mono)" }}>
              {k.monthlyUsage.toLocaleString()}
            </span>
            {k.monthlyLimit > 0 && (
              <span style={{ fontSize: 13, color: "#64748B" }}>
                / {k.monthlyLimit.toLocaleString()} req
              </span>
            )}
          </div>
          <UsageBar used={k.monthlyUsage} limit={k.monthlyLimit} />
        </div>

        {/* Budget */}
        <div style={{ background: "#111827", border: "1px solid #1E2D45", borderRadius: 8, padding: "18px 20px" }}>
          <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: 12 }}>
            Budget — This Month
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 12 }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: "#F5F1E8", letterSpacing: "-0.02em", fontFamily: "var(--font-mono)" }}>
              ${k.budgetUsed.toFixed(2)}
            </span>
            {k.budgetLimit > 0 && (
              <span style={{ fontSize: 13, color: "#64748B" }}>/ ${k.budgetLimit} budget</span>
            )}
          </div>
          <UsageBar used={k.budgetUsed} limit={k.budgetLimit} />
        </div>
      </div>

      {/* Chart */}
      <div style={{ background: "#111827", border: "1px solid #1E2D45", borderRadius: 8, padding: "18px 20px", marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#F5F1E8" }}>30-Day History</div>
          <div style={{ display: "flex", gap: 6 }}>
            {(["requests", "cost"] as ChartMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setChartMode(m)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 4,
                  border: "1px solid #1E2D45",
                  background: chartMode === m ? "#162032" : "transparent",
                  color: chartMode === m ? "#F5F1E8" : "#64748B",
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textTransform: "capitalize",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={dataColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={dataColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#64748B", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
              interval={6}
            />
            <YAxis
              tick={{ fill: "#64748B", fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#162032",
                border: "1px solid #1E2D45",
                borderRadius: 6,
                fontSize: 12,
                color: "#F5F1E8",
                fontFamily: "var(--font-mono)",
              }}
              labelStyle={{ color: "#64748B" }}
              cursor={{ stroke: "#1E2D45" }}
              formatter={(v) => {
                const n = typeof v === "number" ? v : 0;
                return chartMode === "cost" ? [`$${n.toFixed(4)}`, "Cost"] : [n.toLocaleString(), "Requests"];
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={dataColor}
              strokeWidth={1.5}
              fill="url(#areaGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Metadata */}
      <div style={{ background: "#111827", border: "1px solid #1E2D45", borderRadius: 8, padding: "18px 20px" }}>
        <div style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: 14 }}>
          Key Details
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          {[
            { label: "Service", value: k.service },
            { label: "Owner", value: k.owner },
            { label: "Last Used", value: k.lastUsed },
            { label: "Last Rotated", value: k.lastRotated },
            { label: "Created", value: k.created },
            { label: "Environment", value: k.environment },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "#64748B", marginBottom: 3 }}>{label}</div>
              <div style={{ fontSize: 13, color: "#F5F1E8", fontFamily: "var(--font-mono)" }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
