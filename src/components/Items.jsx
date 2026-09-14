import { useCallback, useContext, useEffect, useState } from "react";

import { UserContext } from "../context/user-context.js";

export default function Items() {
  const { apiFetch } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/item`);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = await res.json();
      setItems(data.items || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiFetch]);

  useEffect(() => {
    // This effect synchronizes the server-backed list when the page mounts.
    // oxlint-disable-next-line react-hooks/set-state-in-effect
    loadItems();
  }, [loadItems]);

  async function addItem(e) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      const res = await apiFetch(`/api/item`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      setName("");
      loadItems();
    } catch (err) {
      setError(err.message);
    }
  }

  // Soft delete: calls DELETE, which sets status to "DELETED" on the backend.
  async function deleteItem(id) {
    try {
      const res = await apiFetch(`/api/item/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      loadItems(); // item disappears from list because GET hides DELETED
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "2rem", maxWidth: 560 }}>
      <h1>Items (soft delete)</h1>
      <p>Route: <code>/items</code> — GET hides items whose status is "DELETED".</p>

      <form onSubmit={addItem} style={{ display: "flex", gap: "0.5rem", margin: "1rem 0" }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New item name"
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Add</button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

      {!loading && !error && items.length === 0 && <p>No items yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((it) => (
          <li
            key={it._id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.5rem 0.75rem",
              border: "1px solid #ddd",
              borderRadius: 6,
              marginBottom: "0.5rem",
            }}
          >
            <span>
              {it.name}{" "}
              <small style={{ color: "#888" }}>({it.status})</small>
            </span>
            <button onClick={() => deleteItem(it._id)} style={{ padding: "0.35rem 0.75rem" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
