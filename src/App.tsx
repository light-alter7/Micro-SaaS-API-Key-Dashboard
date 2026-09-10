import { useState } from "react";
import Dashboard from "./components/Dashboard";
import KeyDetail from "./components/KeyDetail";
import CreateKey from "./components/CreateKey";
import AlertsSettings from "./components/AlertsSettings";
import Sidebar from "./components/Sidebar";
import { apiKeys as initialKeys, ApiKey } from "./data/mockData";

export type Screen = "dashboard" | "detail" | "create" | "alerts";

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);

  const selectedKey = keys.find((k) => k.id === selectedKeyId) ?? null;

  function openDetail(id: string) {
    setSelectedKeyId(id);
    setScreen("detail");
  }

  function revokeKey(id: string) {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k))
    );
  }

  function rotateKey(id: string) {
    setKeys((prev) =>
      prev.map((k) =>
        k.id === id
          ? {
              ...k,
              key: `sk_live_${Math.random().toString(36).slice(2, 18)}`,
              lastRotated: new Date().toISOString().slice(0, 10),
            }
          : k
      )
    );
  }

  function createKey(newKey: ApiKey) {
    setKeys((prev) => [newKey, ...prev]);
    setScreen("dashboard");
  }

  return (
    <div className="flex h-full" style={{ fontFamily: "var(--font-sans)" }}>
      <Sidebar
        screen={screen}
        onNavigate={(s) => {
          setScreen(s);
          if (s !== "detail") setSelectedKeyId(null);
        }}
      />
      <main className="flex-1 overflow-auto">
        {screen === "dashboard" && (
          <Dashboard keys={keys} onSelectKey={openDetail} onCreateKey={() => setScreen("create")} />
        )}
        {screen === "detail" && selectedKey && (
          <KeyDetail
            apiKey={selectedKey}
            onBack={() => setScreen("dashboard")}
            onRevoke={() => revokeKey(selectedKey.id)}
            onRotate={() => rotateKey(selectedKey.id)}
          />
        )}
        {screen === "create" && (
          <CreateKey onBack={() => setScreen("dashboard")} onCreate={createKey} />
        )}
        {screen === "alerts" && (
          <AlertsSettings keys={keys} onBack={() => setScreen("dashboard")} />
        )}
      </main>
    </div>
  );
}
