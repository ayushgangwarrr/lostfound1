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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/items/${item._id}`)}
                className="group cursor-pointer rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xl flex flex-col justify-between overflow-hidden hover:scale-[1.02] hover:-translate-y-1.5 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                {/* Image Container with Fixed Height */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950 flex-shrink-0">
                  <img
                    src={resolveImageUrl(item.image)}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span
                      className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider rounded-full backdrop-blur-md shadow-md ${
                        item.type === "lost"
                          ? "bg-rose-500/90 text-white"
                          : "bg-emerald-500/90 text-white"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
                      {item.category || "Other"}
                    </span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-snug group-hover:text-blue-400 transition-colors">
                      {item.itemName}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1.5 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="truncate">{item.location}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="truncate">By {item.userId?.name || item.personName || "Student"}</span>
                    <span className="text-blue-400 font-semibold group-hover:underline shrink-0">View details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
