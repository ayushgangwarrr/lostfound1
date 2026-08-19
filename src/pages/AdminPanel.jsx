import { useEffect, useState, useMemo } from "react";
import { fetchJson, resolveImageUrl } from "../utils/api.js";
import Navbar from "../components/Navbar";
import GlassBackground from "../components/GlassBackground";
import Tilt3DCard from "../components/Tilt3DCard";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "users" | "reports"
  const [userSearch, setUserSearch] = useState("");
  const [reportSearch, setReportSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState({ open: false, type: null, id: null, name: "" });

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersRes, reportsRes] = await Promise.all([
        fetchJson("/api/admin/users"),
        fetchJson("/api/admin/reports"),
      ]);
      setUsers(usersRes.users || []);
      setReports(reportsRes.reports || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to load admin data");
    } fontally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
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
    fetchData();
  }, []);

  const promptDeleteUser = (id, name) => {
    setConfirmModal({ open: true, type: "user", id, name });
  };

  const promptDeleteReport = (id, title) => {
    setConfirmModal({ open: true, type: "report", id, name: title });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = confirmModal;
    setConfirmModal({ open: false, type: null, id: null, name: "" });
    try {
      if (type === "user") {
        await fetchJson(`/api/admin/users/${id}`, { method: "DELETE" });
      } else if (type === "report") {
        await fetchJson(`/api/report/${id}`, { method: "DELETE" });
      }
      // Refresh list
      const [usersRes, reportsRes] = await Promise.all([
        fetchJson("/api/admin/users"),
        fetchJson("/api/admin/reports"),
      ]);
      setUsers(usersRes.users || []);
      setReports(reportsRes.reports || []);
    } catch (err) {
      alert(err.message || "Action failed");
    }
  };

  // Metrics computation
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalReports = reports.length;
    const lostCount = reports.filter((r) => r.type === "lost").length;
    const foundCount = reports.filter((r) => r.type === "found").length;
    const adminCount = users.filter((u) => u.isAdmin).length;
    return { totalUsers, totalReports, lostCount, foundCount, adminCount };
  }, [users, reports]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = userSearch.toLowerCase();
      return (
        (u.name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.rollNumber || "").toLowerCase().includes(q)
      );
    });
  }, [users, userSearch]);

  // Filtered Reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const q = reportSearch.toLowerCase();
      return (
        (r.itemName || "").toLowerCase().includes(q) ||
        (r.location || "").toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q) ||
        (r.userId?.name || "").toLowerCase().includes(q)
      );
    });
  }, [reports, reportSearch]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white pb-20 overflow-x-hidden">
      <GlassBackground />
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Admin Header Title Panel */}
        <div className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/30 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              Executive System Control
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Admin Command Portal
            </h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base max-w-xl">
              Monitor registered campus profiles, resolve reported items, and manage platform integrity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setLoading(true);
                Promise.all([fetchJson("/api/admin/users"), fetchJson("/api/admin/reports")])
                  .then(([uRes, rRes]) => {
                    setUsers(uRes.users || []);
                    setReports(rRes.reports || []);
                  })
                  .finally(() => setLoading(false));
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-semibold text-white hover:bg-white/20 transition backdrop-blur-md flex items-center gap-2"
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* 3D Glass Executive Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Tilt3DCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Users</p>
                <h3 className="text-3xl font-extrabold text-white mt-1">{stats.totalUsers}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-2xl">
                👥
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-blue-300 flex justify-between">
              <span>{stats.adminCount} Administrators</span>
              <span>Active</span>
            </div>
          </Tilt3DCard>

          <Tilt3DCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Reports</p>
                <h3 className="text-3xl font-extrabold text-cyan-400 mt-1">{stats.totalReports}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-2xl">
                📦
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-cyan-300 flex justify-between">
              <span>Campus Records</span>
              <span>Live Database</span>
            </div>
          </Tilt3DCard>

          <Tilt3DCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lost Reports</p>
                <h3 className="text-3xl font-extrabold text-rose-400 mt-1">{stats.lostCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-2xl">
                🚨
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-rose-300 flex justify-between">
              <span>Awaiting Recovery</span>
              <span>Priority</span>
            </div>
          </Tilt3DCard>

          <Tilt3DCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Found Reports</p>
                <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.foundCount}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl">
                🎁
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 text-xs text-emerald-300 flex justify-between">
              <span>Ready for Claim</span>
              <span>Verified</span>
            </div>
          </Tilt3DCard>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center gap-3 mb-8 p-1.5 rounded-2xl bg-slate-900/70 border border-white/15 backdrop-blur-xl w-fit">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "overview"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            📊 System Overview
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "users"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            👥 User Directory ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === "reports"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            📦 Reports Feed ({reports.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Quick Actions Panel */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-xl space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>⚡</span> Admin Quick Commands
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab("users")}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/40 hover:bg-white/10 transition text-left space-y-1"
                >
                  <p className="text-sm font-bold text-white">Manage All Users</p>
                  <p className="text-xs text-gray-400">View roll numbers, delete accounts</p>
                </button>
                <button
                  onClick={() => setActiveTab("reports")}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/40 hover:bg-white/10 transition text-left space-y-1"
                >
                  <p className="text-sm font-bold text-white">Moderate Reports</p>
                  <p className="text-xs text-gray-400">Inspect spam or resolved items</p>
                </button>
              </div>
            </div>

            {/* Platform Status */}
            <div className="p-8 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-xl space-y-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🛡️</span> Platform Health
              </h2>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span>Backend API Server</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Operational
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span>Real-time Socket Gateway</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Connected
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <span>Cloudinary Media Pipeline</span>
                  <span className="text-blue-400 font-bold">Synced</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS DIRECTORY */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Search filter for users */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-xl">
              <input
                placeholder="Search users by name, email, or roll number..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full glass-input p-3.5 rounded-xl text-sm placeholder-gray-400 focus:outline-none"
              />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="h-44 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-gray-400">
                No user profiles match your search criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((u) => (
                  <Tilt3DCard key={u._id} className="p-6 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
                            {(u.name || u.email)?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-base leading-snug">{u.name || "Student User"}</h4>
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">{u.email}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full ${
                            u.isAdmin ? "bg-purple-500/20 text-purple-300 border border-purple-400/30" : "bg-blue-500/10 text-blue-300 border border-blue-400/20"
                          }`}
                        >
                          {u.isAdmin ? "Admin" : "Student"}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-gray-300 pt-2 border-t border-white/10">
                        <p><span className="text-gray-400">Roll:</span> {u.rollNumber || "Not specified"}</p>
                        <p><span className="text-gray-400">Phone:</span> {u.phone || "Not provided"}</p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
                      <button
                        onClick={() => promptDeleteUser(u._id, u.name || u.email)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500 hover:text-white transition shadow-sm"
                      >
                        Delete User
                      </button>
                    </div>
                  </Tilt3DCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REPORTS FEED */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Search filter for reports */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-xl">
              <input
                placeholder="Search reports by item name, location, reporter..."
                value={reportSearch}
                onChange={(e) => setReportSearch(e.target.value)}
                className="w-full glass-input p-3.5 rounded-xl text-sm placeholder-gray-400 focus:outline-none"
              />
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="h-40 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
                ))}
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-gray-400">
                No reported items match your search criteria.
              </div>
            ) : (
              <div className="space-y-6">
                {filteredReports.map((report) => (
                  <div
                    key={report._id}
                    className="p-6 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-3 py-0.5 text-xs font-extrabold uppercase rounded-full ${
                              report.type === "lost" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            }`}
                          >
                            {report.type}
                          </span>
                          <span className="text-xs text-blue-300 font-semibold px-2.5 py-0.5 rounded-lg bg-white/5 border border-white/10">
                            {report.category || "General"}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-1">{report.itemName}</h3>
                        <p className="text-xs text-gray-300 flex items-center gap-1">
                          <span>📍</span> {report.location}
                        </p>
                      </div>

                      <button
                        onClick={() => promptDeleteReport(report._id, report.itemName)}
                        className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500 hover:text-white transition shadow-sm self-start sm:self-center"
                      >
                        Delete Report
                      </button>
                    </div>

                    {report.description && (
                      <p className="text-gray-300 text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                        {report.description}
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-white/10 text-xs text-gray-400">
                      <span>Reported by: <strong className="text-gray-200">{report.userId?.name || report.userId?.email || "Unknown"}</strong></span>
                      {report.image && (
                        <a
                          href={resolveImageUrl(report.image)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>🖼️ View Attached Image</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-white/20 shadow-2xl space-y-5">
            <h3 className="text-xl font-bold text-white">Confirm Deletion</h3>
            <p className="text-sm text-gray-300">
              Are you sure you want to permanently delete{" "}
              <strong className="text-rose-400">{confirmModal.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setConfirmModal({ open: false, type: null, id: null, name: "" })}
                className="px-4 py-2 rounded-xl bg-white/10 text-gray-300 hover:text-white text-xs font-semibold hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition shadow-lg shadow-rose-600/30"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
