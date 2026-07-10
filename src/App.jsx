import { useState, useEffect, useCallback } from "react";

// 
// useFetch — Custom Hook

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setData(null);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error };
}

// Demo App
// 
const ENDPOINTS = [
  { label: "Posts", url: "https://jsonplaceholder.typicode.com/posts?_limit=5" },
  { label: "Users", url: "https://jsonplaceholder.typicode.com/users?_limit=5" },
  { label: "Todos", url: "https://jsonplaceholder.typicode.com/todos?_limit=5" },
  { label: "Bad URL (Error)", url: "https://jsonplaceholder.typicode.com/nonexistent" },
];

function Badge({ children, color }) {
  const colors = {
    blue: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
    green: { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
    red: { bg: "#FEF2F2", text: "#B91C1C", border: "#FECACA" },
    gray: { bg: "#F9FAFB", text: "#374151", border: "#E5E7EB" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 99, fontSize: 12, fontWeight: 600,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {children}
    </span>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "32px 0" }}>
      <div style={{
        width: 36, height: 36, borderRadius: "50%",
        border: "3px solid #E5E7EB",
        borderTopColor: "#6366F1",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function DataCard({ item, index }) {
  const keys = Object.keys(item).slice(0, 4);
  return (
    <div style={{
      background: "#fff", border: "1px solid #E5E7EB", borderRadius: 10,
      padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      transition: "box-shadow 0.15s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
        <span style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>
          #{item.id ?? index + 1}
        </span>
        <Badge color="blue">Entry</Badge>
      </div>
      {keys.map((k) => (
        <div key={k} style={{ display: "flex", gap: 8, fontSize: 13 }}>
          <span style={{ color: "#9CA3AF", minWidth: 70, fontWeight: 500 }}>{k}</span>
          <span style={{
            color: "#374151", flex: 1,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {typeof item[k] === "object" ? JSON.stringify(item[k]) : String(item[k])}
          </span>
        </div>
      ))}
    </div>
  );
}
function HookVisualizer({ data, loading, error }) {
  return (
    <div style={{
      background: "#0F172A", borderRadius: 10, padding: "16px 20px",
      fontFamily: "monospace", fontSize: 13, lineHeight: 1.7,
      color: "#94A3B8", marginBottom: 20,
    }}>
      <div style={{ color: "#64748B", marginBottom: 6, fontSize: 11, letterSpacing: 1 }}>HOOK STATE</div>
      <div><span style={{ color: "#7DD3FC" }}>loading</span>{" = "}
        <span style={{ color: loading ? "#86EFAC" : "#FCA5A5" }}>{String(loading)}</span>
      </div>
      <div><span style={{ color: "#7DD3FC" }}>error</span>{" = "}
        <span style={{ color: error ? "#FCA5A5" : "#86EFAC" }}>
          {error ? `"${error}"` : "null"}
        </span>
      </div>
      <div><span style={{ color: "#7DD3FC" }}>data</span>{" = "}
        <span style={{ color: data ? "#86EFAC" : "#94A3B8" }}>
          {data ? `Array(${Array.isArray(data) ? data.length : 1})` : "null"}
        </span>
      </div>
    </div>
  );
}
export default function App() {
  const [activeIdx, setActiveIdx] = useState(0);
  const endpoint = ENDPOINTS[activeIdx];
  const { data, loading, error } = useFetch(endpoint.url);

  const items = Array.isArray(data) ? data : data ? [data] : [];

  return (
    <div style={{
      minHeight: "100vh", background: "#F8FAFC",
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      display: "flex", justifyContent: "center", padding: "32px 16px",
    }}>
      <div style={{ width: "100%", maxWidth: 700 }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              background: "#6366F1", color: "#fff", borderRadius: 8,
              padding: "6px 12px", fontSize: 13, fontWeight: 700, letterSpacing: 0.3,
            }}>
              useFetch
            </div>
            <Badge color="green">Custom Hook</Badge>
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#111827" }}>
            React Data Fetching Hook
          </h1>
          <p style={{ margin: "6px 0 0", color: "#6B7280", fontSize: 14 }}>
            A reusable hook returning <code style={{ background: "#F3F4F6", padding: "1px 6px", borderRadius: 4 }}>data</code>,{" "}
            <code style={{ background: "#F3F4F6", padding: "1px 6px", borderRadius: 4 }}>loading</code>, and{" "}
            <code style={{ background: "#F3F4F6", padding: "1px 6px", borderRadius: 4 }}>error</code>.
          </p>
        </div>

        {/* Endpoint Selector */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", letterSpacing: 0.8, marginBottom: 8 }}>
            SELECT ENDPOINT
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ENDPOINTS.map((ep, i) => (
              <button key={i} onClick={() => setActiveIdx(i)} style={{
                padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s",
                border: activeIdx === i ? "2px solid #6366F1" : "2px solid #E5E7EB",
                background: activeIdx === i ? "#EEF2FF" : "#fff",
                color: activeIdx === i ? "#4338CA" : "#6B7280",
              }}>
                {ep.label}
              </button>
            ))}
          </div>
          <div style={{
            marginTop: 10, fontSize: 12, color: "#9CA3AF",
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <span style={{ fontWeight: 600, color: "#6B7280" }}>URL:</span>
            <code style={{ color: "#6366F1", wordBreak: "break-all" }}>{endpoint.url}</code>
          </div>
        </div>
        {/* Live Hook State */}
        <HookVisualizer data={data} loading={loading} error={error} />

        {/* Output */}
        <div>
          {loading && <Spinner />}

          {error && !loading && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 10, padding: "16px 20px",
              display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <div>
                <div style={{ fontWeight: 700, color: "#B91C1C", fontSize: 14 }}>Fetch Error</div>
                <div style={{ color: "#991B1B", fontSize: 13, marginTop: 2 }}>{error}</div>
              </div>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", letterSpacing: 0.8 }}>
                  RESULTS
                </div>
                <Badge color="green">✓ {items.length} items loaded</Badge>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {items.map((item, i) => (
                  <DataCard key={item.id ?? i} item={item} index={i} />
                ))}
              </div>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div style={{
              textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: 14,
            }}>
              Select an endpoint above to fetch data.
            </div>
          )}
        </div>

        {/* Code snippet */}
        <div style={{
          marginTop: 32, background: "#0F172A", borderRadius: 10,
          padding: "20px 24px", color: "#94A3B8", fontFamily: "monospace", fontSize: 13, lineHeight: 1.8,
        }}>
          <div style={{ color: "#64748B", fontSize: 11, letterSpacing: 1, marginBottom: 10 }}>USAGE</div>
          <div>
            <span style={{ color: "#C084FC" }}>const</span>{" "}
            <span style={{ color: "#7DD3FC" }}>{"{ data, loading, error }"}</span>{" = "}
            <span style={{ color: "#86EFAC" }}>useFetch</span>
            <span style={{ color: "#FDE68A" }}>(url)</span>;
          </div>
        </div>

      </div>
    </div>
  );
}