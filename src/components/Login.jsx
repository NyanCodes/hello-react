import { useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/user-context.js";

export default function Login() {
  const { login, isLoggedIn, isInitializing, loginErrorMsg, sessionError } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const location = useLocation();
  if (isInitializing) return <p className="session-loading" role="status">Checking your session…</p>;
  if (isLoggedIn) return <Navigate to={location.state?.from || "/items"} replace />;
  async function submit(event) {
    event.preventDefault();
    setPending(true);
    await login(email.trim(), password);
    setPending(false);
  }
  return <main className="login-page">
    <form className="login-card" onSubmit={submit}>
      <h1>Login</h1>
      <p>Sign in to manage your items.</p>
      <label htmlFor="username">Username or email</label>
      <input id="username" name="username" autoComplete="username" required
        value={email} onChange={event => setEmail(event.target.value)} disabled={pending} />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required
        value={password} onChange={event => setPassword(event.target.value)} disabled={pending} />
      <button type="submit" disabled={pending}>{pending ? "Signing in…" : "Login"}</button>
      {(loginErrorMsg || sessionError) && <p className="auth-error" role="alert">{loginErrorMsg || sessionError}</p>}
    </form>
  </main>;
}
