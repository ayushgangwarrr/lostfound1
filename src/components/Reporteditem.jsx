import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { fetchJson, resolveImageUrl } from "../utils/api.js";

export default function Reporteditem() {
  const [myItems, setMyItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadMyReports = async () => {
      try {
        const data = await fetchJson("/api/reports/user");
        setMyItems(data.reports);
      } catch (error) {
        console.error(error);
        if (error.status === 401) {
          navigate("/login");
        }
      }
    };

    loadMyReports();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <Navbar />
      <h1 className="text-5xl mb-10 text-center">My Reported Items</h1>
      {myItems.length === 0 ? (
        <p className="text-center text-gray-400">You haven't reported any items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {myItems.map((item) => (
            <div key={item._id} className="bg-slate-800 rounded-xl overflow-hidden hover:scale-105 transition shadow-lg">
              {item.image ? (
                <img src={resolveImageUrl(item.image)} className="h-40 w-full object-cover" />
              ) : (
                <div className="h-40 w-full bg-slate-700 flex items-center justify-center text-gray-400">No image</div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{item.itemName}</h3>
                <p className="text-gray-400 text-sm">{item.location}</p>
                <p className="text-gray-500 text-xs mt-2">{item.type}</p>
                <p className="text-gray-400 text-xs mt-1">Roll: {item.rollNumber || item.userId?.rollNumber || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
