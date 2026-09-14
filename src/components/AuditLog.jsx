import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user-context.js";

export default function AuditLog() {
  const { apiFetch } = useContext(UserContext);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiFetch("/api/audit-log").then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.message || "Unable to load audit log."); setLogs(data.logs || []); }).catch(err => setError(err.message)).finally(() => setLoading(false));
  }, [apiFetch]);
  return <main className="content-page"><section className="panel"><div className="page-heading"><div><h1>Audit log</h1><p>Recorded item actions, newest first.</p></div><span className="badge">Admin</span></div>{loading ? <p>Loading audit log…</p> : error ? <p className="auth-error" role="alert">{error}</p> : logs.length === 0 ? <p>No item actions recorded yet.</p> : <div className="table-wrap"><table><thead><tr><th>Time</th><th>Action</th><th>User</th><th>Item</th><th>Details</th></tr></thead><tbody>{logs.map(log => <tr key={String(log._id)}><td>{new Date(log.createdAt).toLocaleString()}</td><td><span className="action-badge">{log.action}</span></td><td>{log.user?.username || log.user?.email || log.userId}</td><td>{log.resourceId || "-"}</td><td>{log.details?.name || (log.details?.count != null ? `Listed ${log.details.count}` : log.details?.softDeleted ? "Soft deleted" : log.details?.fields?.join(", ") || "-" )}</td></tr>)}</tbody></table></div>}</section></main>;
}
