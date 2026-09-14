import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user-context.js";

export default function Users() {
  const { apiFetch } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ email: "", username: "", firstname: "", lastname: "", password: "" });
  const [resetPasswords, setResetPasswords] = useState({});
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    try {
      const response = await apiFetch("/api/user");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load users.");
      setUsers(data.users || []); setError("");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [apiFetch]);
  useEffect(() => {
    // This effect synchronizes the admin table with the server when the page mounts.
    // oxlint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
  }, [loadUsers]);

  async function createUser(event) {
    event.preventDefault(); setMessage(""); setError("");
    try {
      const response = await apiFetch("/api/user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to create user.");
      setForm({ email: "", username: "", firstname: "", lastname: "", password: "" }); setMessage("User created successfully."); await loadUsers();
    } catch (err) { setError(err.message); }
  }

  async function resetPassword(id) {
    const password = resetPasswords[id] || "";
    if (!password) return;
    setMessage(""); setError("");
    try {
      const response = await apiFetch(`/api/user/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to reset password.");
      setResetPasswords(values => ({ ...values, [id]: "" })); setMessage("User password reset successfully.");
    } catch (err) { setError(err.message); }
  }

  return <main className="content-page">
    <section className="panel">
      <div className="page-heading"><div><h1>User management</h1><p>Admin-only tools for database users.</p></div><span className="badge">Admin</span></div>
      <form className="user-create-form" onSubmit={createUser}>
        <input type="email" placeholder="Email" aria-label="New user email" required value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} />
        <input placeholder="Username" aria-label="New username" required value={form.username} onChange={event => setForm({ ...form, username: event.target.value })} />
        <input placeholder="First name (optional)" aria-label="New user first name" value={form.firstname} onChange={event => setForm({ ...form, firstname: event.target.value })} />
        <input placeholder="Last name (optional)" aria-label="New user last name" value={form.lastname} onChange={event => setForm({ ...form, lastname: event.target.value })} />
        <input type="password" minLength="8" placeholder="Temporary password" aria-label="New user password" required value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} />
        <button type="submit">Create user</button>
      </form>
      {message && <p className="success-message" role="status">{message}</p>}
      {error && <p className="auth-error" role="alert">{error}</p>}
      {loading ? <p>Loading users…</p> : users.length === 0 ? <p>No database users yet.</p> : <div className="table-wrap"><table><thead><tr><th>Email</th><th>Username</th><th>Name</th><th>Reset password</th></tr></thead><tbody>{users.map(user => { const id = String(user._id); return <tr key={id}><td>{user.email}</td><td>{user.username || "-"}</td><td>{[user.firstname, user.lastname].filter(Boolean).join(" ") || "-"}</td><td className="reset-cell"><input type="password" minLength="8" placeholder="New password" aria-label={`Reset password for ${user.email}`} value={resetPasswords[id] || ""} onChange={event => setResetPasswords(values => ({ ...values, [id]: event.target.value }))} /><button type="button" onClick={() => resetPassword(id)}>Reset</button></td></tr>; })}</tbody></table></div>}
    </section>
  </main>;
}
