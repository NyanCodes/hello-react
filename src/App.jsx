import { useContext, useState } from "react";
import { Routes, Route, Navigate, Link, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "./context/user-context.js";
import TestApi from "./components/TestApi.jsx";
import Items from "./components/Items.jsx";
import Login from "./components/Login.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import Users from "./components/Users.jsx";
import AuditLog from "./components/AuditLog.jsx";
import "./App.css";

function Home() {
  const { user, isLoggedIn, isInitializing, logout, sessionError } = useContext(UserContext);
  const isAdmin = user?.id === "-1";
  const [pending, setPending] = useState(false);
  const location = useLocation();
  if (isInitializing) return <p className="session-loading" role="status">Checking your session…</p>;
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return <>
    <nav className="app-nav">
      <Link to="/test_api">Test API</Link>
      <Link to="/items">Items</Link>
      <Link to="/change-password">Change password</Link>
      {isAdmin && <><Link to="/users">Users</Link><Link to="/audit-log">Audit log</Link></>}
      <span className="user-name">{user.username || user.email}</span>
      <button disabled={pending} onClick={async () => {
        setPending(true);
        await logout();
        setPending(false);
      }}>{pending ? "Logging out…" : "Logout"}</button>
    </nav>
    {sessionError && <p className="auth-error" role="alert">{sessionError}</p>}
    <Outlet />
  </>;
}

export default function App() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<Home />}>
      <Route path="/" element={<Navigate to="/items" replace />} />
      <Route path="/test_api" element={<TestApi />} />
      <Route path="/items" element={<Items />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/users" element={isAdminRoute(<Users />)} />
      <Route path="/audit-log" element={isAdminRoute(<AuditLog />)} />
      <Route path="*" element={<Navigate to="/items" replace />} />
    </Route>
  </Routes>;
}

function isAdminRoute(element) {
  return <AdminRoute>{element}</AdminRoute>;
}

function AdminRoute({ children }) {
  const { user } = useContext(UserContext);
  return user?.id === "-1" ? children : <Navigate to="/items" replace />;
}
