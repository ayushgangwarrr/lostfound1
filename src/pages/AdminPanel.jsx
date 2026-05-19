import { useEffect, useState } from "react";
import { fetchJson } from "../utils/api.js";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [usersRes, reportsRes] = await Promise.all([
        fetchJson("/api/admin/users"),
        fetchJson("/api/admin/reports"),
      ]);
      setUsers(usersRes.users || []);
      setReports(reportsRes.reports || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!confirm("Delete this user and their reports?")) return;
    await fetchJson(`/api/admin/users/${id}`, { method: "DELETE" });
    loadAdminData();
  };

  const handleDeleteReport = async (id) => {
    if (!confirm("Delete this report?")) return;
    await fetchJson(`/api/report/${id}`, { method: "DELETE" });
    loadAdminData();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
      {loading ? (
        <p>Loading admin dashboard...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-10">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Users</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {users.map((user) => (
                <div key={user._id} className="border rounded-xl p-4 shadow-sm bg-white">
                  <p className="font-semibold">{user.name || user.email}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <p className="text-sm">Phone: {user.phone || "Not provided"}</p>
                  <p className="text-sm">Admin: {user.isAdmin ? "Yes" : "No"}</p>
                  <button
                    className="mt-3 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete user
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Reports</h2>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report._id} className="border rounded-xl p-4 shadow-sm bg-white">
                  <div className="flex flex-wrap gap-4 justify-between items-start">
                    <div>
                      <p className="font-semibold text-lg">{report.itemName}</p>
                      <p className="text-sm text-slate-600">{report.type.toUpperCase()} | {report.location}</p>
                      <p className="text-sm">Reported by: {report.userId?.name || report.userId?.email}</p>
                    </div>
                    <button
                      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      onClick={() => handleDeleteReport(report._id)}
                    >
                      Delete report
                    </button>
                  </div>
                  <p className="mt-2">{report.description}</p>
                  {report.image && (
                    <img src={report.image} alt={report.itemName} className="mt-3 h-48 w-full object-cover rounded-lg" />
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
