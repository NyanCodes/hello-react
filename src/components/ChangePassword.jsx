import { useContext, useState } from "react";
import { UserContext } from "../context/user-context.js";

export default function ChangePassword() {
  const { apiFetch } = useContext(UserContext);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) { setError("New passwords do not match."); return; }
    setPending(true);
    try {
      const response = await apiFetch("/api/auth/change-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Password change failed.");
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setMessage(data.message);
    } catch (err) { setError(err.message); }
    finally { setPending(false); }
  }

  return <main className="content-page">
    <section className="panel narrow-panel">
      <h1>Change password</h1>
      <p>Use a password with at least 8 characters.</p>
      <form className="stack-form" onSubmit={submit}>
        <label htmlFor="current-password">Current password</label>
        <input id="current-password" type="password" autoComplete="current-password" required
          value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} disabled={pending} />
        <label htmlFor="new-password">New password</label>
        <input id="new-password" type="password" autoComplete="new-password" minLength="8" required
          value={newPassword} onChange={event => setNewPassword(event.target.value)} disabled={pending} />
        <label htmlFor="confirm-password">Confirm new password</label>
        <input id="confirm-password" type="password" autoComplete="new-password" minLength="8" required
          value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} disabled={pending} />
        <button type="submit" disabled={pending}>{pending ? "Saving…" : "Change password"}</button>
        {message && <p className="success-message" role="status">{message}</p>}
        {error && <p className="auth-error" role="alert">{error}</p>}
      </form>
    </section>
  </main>;
}
