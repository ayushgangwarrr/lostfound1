import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchJson, resolveImageUrl } from "../utils/api.js";

const filterTypes = ["all", "lost", "found"];
const locationMap = {
  library: "Library",
  "lecture-halls": "Lecture Halls",
  sac: "Student Activity Centre",
  hostels: "Hostels",
  cafeteria: "Campus Cafeteria",
};

export default function Items() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const data = await fetchJson("/api/reports");
        setItems(data.reports || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const locationParam = params.get("location") || "all";
    setLocationFilter(locationMap[locationParam] ? locationParam : "all");
  }, [location.search]);

  const categories = useMemo(() => {
    const values = new Set();
    items.forEach((item) => {
      if (item.category) values.add(item.category);
    });
    return ["all", ...Array.from(values)];
  }, [items]);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (typeFilter !== "all" && item.type !== typeFilter) return false;
        if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
        if (locationFilter !== "all") {
          const normalizedLocation = (item.location || "").toLowerCase();
          const targetLocation = (locationMap[locationFilter] || locationFilter).toLowerCase();
          if (!normalizedLocation.includes(targetLocation)) return false;
        }
        if (dateFilter) {
          const itemDate = new Date(item.dateLostOrFound || item.createdAt);
          const filterDate = new Date(dateFilter);
          if (itemDate < filterDate) return false;
        }
        const normalized = [item.itemName, item.location, item.description, item.userId?.name, item.userId?.rollNumber]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return normalized.includes(search.toLowerCase());
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [items, search, typeFilter, categoryFilter, dateFilter, locationFilter]);

  return (
    <div className="p-10 bg-slate-950 min-h-screen text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-2">Browse Items</h1>
            <p className="text-gray-400">Search and filter recent lost and found reports across campus.</p>
            {locationFilter !== "all" && (
              <div className="mt-4 inline-flex flex-wrap items-center gap-3 rounded-full bg-slate-800 px-4 py-2 text-sm text-blue-100">
                <span>Filtering by: {locationMap[locationFilter]}</span>
                <button
                  onClick={() => {
                    setLocationFilter("all");
                    navigate("/browse");
                  }}
                  className="rounded-full bg-slate-700 px-3 py-1 text-xs text-white hover:bg-slate-600 transition"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_300px] mb-8">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <input
              placeholder="Search by item, location, roll number or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-3 rounded-2xl bg-slate-800 border-gray-700 flex-1"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border p-3 rounded-2xl bg-slate-800 border-gray-700"
            >
              {filterTypes.map((type) => (
                <option key={type} value={type}>{type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border p-3 rounded-2xl bg-slate-800 border-gray-700"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category === "all" ? "All Categories" : category}</option>
              ))}
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border p-3 rounded-2xl bg-slate-800 border-gray-700"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="bg-slate-800 rounded-xl p-6 animate-pulse h-80" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <p className="text-gray-400">No items match your search or filters.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <button
                key={item._id}
                onClick={() => navigate(`/items/${item._id}`)}
                className="text-left bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
              >
                {item.image ? (
                  <img src={resolveImageUrl(item.image)} alt={item.itemName} className="w-full h-44 object-cover" />
                ) : (
                  <div className="h-44 w-full bg-slate-700 flex items-center justify-center text-gray-400">No image</div>
                )}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-lg">{item.itemName}</h3>
                  <p className="text-gray-400 text-sm mt-1">{item.location}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs uppercase tracking-wide text-blue-400">{item.type}</span>
                    <span className="text-xs uppercase tracking-wide text-gray-400">{item.category || "Other"}</span>
                  </div>
                  <p className="text-gray-400 text-xs mt-2">Reported by {item.userId?.name || item.personName || "Unknown"}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
