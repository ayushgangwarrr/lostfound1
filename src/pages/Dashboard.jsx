import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson, resolveImageUrl } from "../utils/api.js";
import DashboardCards from "../components/DashboardCards";
import Navbar from "../components/Navbar";
import GlassBackground from "../components/GlassBackground";
import Tilt3DCard from "../components/Tilt3DCard";

export default function Dashboard() {
  const [myReports, setMyReports] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [myData, allData] = await Promise.all([
          fetchJson("/api/reports/user"),
          fetchJson("/api/reports"),
        ]);
        setMyReports(myData.reports || []);
        setRecentReports((allData.reports || []).slice(0, 8));
      } catch (error) {
        console.error(error);
        if (error.status === 401) {
          navigate("/login");
        }
      }
    };

    loadData();
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-slate-950 text-white pb-16 overflow-x-hidden">
      <GlassBackground />
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              User Activity Center
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base max-w-xl">
              Track your submitted reports, browse campus updates, and access quick actions.
            </p>
          </div>
        </div>

        {/* Quick Action 3D Cards */}
        <div className="mb-14">
          <DashboardCards />
        </div>

        {/* My Submitted Reports */}
        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 flex items-center gap-3">
            <span>📦</span> My Reports ({myReports.length})
          </h2>
          {myReports.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-gray-400 backdrop-blur-md">
              You haven't reported any items yet. Use the top bar or quick actions to submit a report.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {myReports.map((item) => (
                <Tilt3DCard key={item._id} className="overflow-hidden flex flex-col justify-between">
                  <div className="relative h-44 w-full bg-slate-950/60">
                    {item.image ? (
                      <img src={resolveImageUrl(item.image)} alt={item.itemName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">No Image</div>
                    )}
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-extrabold uppercase rounded-full backdrop-blur-md ${
                        item.type === "lost" ? "bg-rose-500/90 text-white" : "bg-emerald-500/90 text-white"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-lg text-white truncate">{item.itemName}</h3>
                    <p className="text-gray-300 text-xs flex items-center gap-1">
                      <span>📍</span> {item.location}
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                      <span>Roll: {item.rollNumber || item.userId?.rollNumber || "N/A"}</span>
                      <span className="text-blue-400 font-medium">{item.category || "General"}</span>
                    </div>
                  </div>
                </Tilt3DCard>
              ))}
            </div>
          )}
        </section>

        {/* Recently Reported Items */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <span>⚡</span> Recently Reported Items
            </h2>
            <button
              onClick={() => navigate("/items")}
              className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center gap-1"
            >
              View all →
            </button>
          </div>
          {recentReports.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-gray-400 backdrop-blur-md">
              No recent reports available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentReports.map((item) => (
                <Tilt3DCard
                  key={item._id}
                  onClick={() => navigate(`/items/${item._id}`)}
                  className="cursor-pointer overflow-hidden flex flex-col justify-between group"
                >
                  <div className="relative h-44 w-full bg-slate-950/60">
                    {item.image ? (
                      <img src={resolveImageUrl(item.image)} alt={item.itemName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm">No Image</div>
                    )}
                    <span
                      className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-extrabold uppercase rounded-full backdrop-blur-md ${
                        item.type === "lost" ? "bg-rose-500/90 text-white" : "bg-emerald-500/90 text-white"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors truncate">
                      {item.itemName}
                    </h3>
                    <p className="text-gray-300 text-xs flex items-center gap-1 truncate">
                      <span>📍</span> {item.location}
                    </p>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                      <span>By: {item.userId?.name || item.personName || "Anonymous"}</span>
                      <span className="text-blue-400 font-semibold group-hover:underline">View →</span>
                    </div>
                  </div>
                </Tilt3DCard>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
