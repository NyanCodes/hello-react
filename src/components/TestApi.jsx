import { useEffect, useState } from "react";

// Base URL of the Next.js "hello API" from assignment Next JS 1.
// Override with a .env file (VITE_API_URL=...) if your backend runs elsewhere.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function TestApi() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/hello`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => setMessage(data.message))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1>Test API</h1>
      <p>Route: <code>/test_api</code> — reading "message" from the hello API.</p>

      {loading && <p>Loading…</p>}

      {error && (
        <p style={{ color: "crimson" }}>
          Error: {error}
        </p>
      )}

      {!loading && !error && (
        <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
          Message: {message}
        </p>
      )}
    </div>
  );
}
