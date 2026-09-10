export type KeyStatus = "active" | "warning" | "critical" | "revoked";
export type Environment = "production" | "staging" | "development";

export interface UsagePoint {
  date: string;
  requests: number;
  cost: number;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: string;
  environment: Environment;
  owner: string;
  status: KeyStatus;
  monthlyLimit: number;
  monthlyUsage: number;
  budgetLimit: number;
  budgetUsed: number;
  lastUsed: string;
  lastRotated: string;
  created: string;
  usageHistory: UsagePoint[];
}

function hist(base: number, cost: number): UsagePoint[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2026, 7, i + 1);
    const r = Math.round(base * (0.6 + Math.random() * 0.8));
    return {
      date: d.toISOString().slice(0, 10),
      requests: r,
      cost: parseFloat((r * cost).toFixed(2)),
    };
  });
}

export const apiKeys: ApiKey[] = [
  {
    id: "k1",
    name: "OpenAI Production",
    key: "sk_live_oA3kT9mP1qXrZ2yW",
    service: "OpenAI",
    environment: "production",
    owner: "Platform Team",
    status: "critical",
    monthlyLimit: 500000,
    monthlyUsage: 487200,
    budgetLimit: 1000,
    budgetUsed: 974.4,
    lastUsed: "2026-09-10",
    lastRotated: "2026-08-01",
    created: "2025-11-15",
    usageHistory: hist(16200, 0.00002),
  },
  {
    id: "k2",
    name: "Stripe Payments",
    key: "sk_live_bN7vH4cL6eUxM9oK",
    service: "Stripe",
    environment: "production",
    owner: "Billing Team",
    status: "active",
    monthlyLimit: 100000,
    monthlyUsage: 34210,
    budgetLimit: 0,
    budgetUsed: 0,
    lastUsed: "2026-09-10",
    lastRotated: "2026-07-15",
    created: "2025-04-03",
    usageHistory: hist(1100, 0),
  },
  {
    id: "k3",
    name: "Datadog Monitoring",
    key: "sk_live_dD2pR8fJ0tNwQ5sY",
    service: "Datadog",
    environment: "production",
    owner: "Ops Team",
    status: "warning",
    monthlyLimit: 50000,
    monthlyUsage: 43750,
    budgetLimit: 400,
    budgetUsed: 311.2,
    lastUsed: "2026-09-09",
    lastRotated: "2026-06-20",
    created: "2025-06-10",
    usageHistory: hist(1450, 0.0071),
  },
  {
    id: "k4",
    name: "SendGrid Email",
    key: "sk_live_sG5uI1nB3mKpA7vE",
    service: "SendGrid",
    environment: "production",
    owner: "Growth Team",
    status: "active",
    monthlyLimit: 200000,
    monthlyUsage: 62400,
    budgetLimit: 200,
    budgetUsed: 62.4,
    lastUsed: "2026-09-10",
    lastRotated: "2026-09-01",
    created: "2026-01-20",
    usageHistory: hist(2080, 0.001),
  },
  {
    id: "k5",
    name: "AWS S3 Staging",
    key: "sk_live_aW8cV3hX6kFjD0pL",
    service: "AWS",
    environment: "staging",
    owner: "Infrastructure",
    status: "active",
    monthlyLimit: 1000000,
    monthlyUsage: 128000,
    budgetLimit: 150,
    budgetUsed: 19.2,
    lastUsed: "2026-09-08",
    lastRotated: "2026-08-15",
    created: "2025-09-01",
    usageHistory: hist(4200, 0.00015),
  },
  {
    id: "k6",
    name: "Twilio SMS",
    key: "sk_live_tW4zO9eC7gRmB2hN",
    service: "Twilio",
    environment: "production",
    owner: "Product Team",
    status: "warning",
    monthlyLimit: 10000,
    monthlyUsage: 8800,
    budgetLimit: 300,
    budgetUsed: 264.0,
    lastUsed: "2026-09-09",
    lastRotated: "2026-05-01",
    created: "2025-12-05",
    usageHistory: hist(290, 0.03),
  },
  {
    id: "k7",
    name: "GitHub Actions",
    key: "sk_live_gH6yT2kW5nQrP8xM",
    service: "GitHub",
    environment: "development",
    owner: "DevEx Team",
    status: "active",
    monthlyLimit: 0,
    monthlyUsage: 0,
    budgetLimit: 0,
    budgetUsed: 0,
    lastUsed: "2026-09-10",
    lastRotated: "2026-03-01",
    created: "2025-03-01",
    usageHistory: hist(0, 0),
  },
  {
    id: "k8",
    name: "Sentry Error Tracking",
    key: "sk_live_sE3fA7vI9oLpU1qD",
    service: "Sentry",
    environment: "production",
    owner: "Platform Team",
    status: "revoked",
    monthlyLimit: 50000,
    monthlyUsage: 0,
    budgetLimit: 100,
    budgetUsed: 0,
    lastUsed: "2026-09-02",
    lastRotated: "2026-04-10",
    created: "2025-07-22",
    usageHistory: hist(0, 0),
  },
];
