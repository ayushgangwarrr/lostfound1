import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson, resolveImageUrl } from "../utils/api.js";
import DashboardCards from "../components/DashboardCards";
import Navbar from "../components/Navbar";

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
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <Navbar />

      <div className="mb-10">
        <h1 className="text-5xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-2">Your recent activity and latest reported items.</p>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">My Reports</h2>
        {myReports.length === 0 ? (
          <p className="text-gray-400">You haven't reported any items yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {myReports.map((item) => (
              <div key={item._id} className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition">
                {item.image ? (
                  <img src={resolveImageUrl(item.image)} alt={item.itemName} className="w-full h-40 object-cover" />
                ) : (
                  <div className="h-40 w-full bg-slate-700 flex items-center justify-center text-gray-400">No image</div>
                )}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{item.itemName}</h3>
                  <p className="text-gray-400 text-sm">{item.location}</p>
                  <p className="text-xs text-blue-400 uppercase">{item.type}</p>
                  <p className="text-gray-400 text-xs">Roll: {item.rollNumber || item.userId?.rollNumber || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mb-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h2 className="text-3xl font-semibold">Recently Reported Items</h2>
          <button onClick={() => navigate("/items")} className="text-blue-400 hover:text-blue-300 text-sm">
            View all items
          </button>
        </div>
        {recentReports.length === 0 ? (
          <p className="text-gray-400">No recent reports available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentReports.map((item) => (
              <div
                key={item._id}
                className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition cursor-pointer"
                onClick={() => navigate(`/items/${item._id}`)}
              >
                {item.image ? (
                  <img src={resolveImageUrl(item.image)} alt={item.itemName} className="w-full h-40 object-cover" />
                ) : (
                  <div className="h-40 w-full bg-slate-700 flex items-center justify-center text-gray-400">No image</div>
                )}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{item.itemName}</h3>
                  <p className="text-gray-400 text-sm">{item.location}</p>
                  <p className="text-xs text-blue-400 uppercase">{item.type}</p>
                  <p className="text-gray-400 text-xs">By: {item.userId?.name || item.personName || "Unknown"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-12">
        <DashboardCards />
      </div>
    </div>
  );
}
