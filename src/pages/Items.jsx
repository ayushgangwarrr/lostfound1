import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import GlassBackground from "../components/GlassBackground";
import Tilt3DCard from "../components/Tilt3DCard";
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
    <div className="relative min-h-screen bg-slate-950 text-white pb-20 overflow-x-hidden">
      <GlassBackground />
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header Title */}
        <div className="mb-10 p-8 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              Campus Directory
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Browse Lost & Found Items
            </h1>
            <p className="text-gray-300 mt-2 text-sm sm:text-base max-w-2xl">
              Search and filter reported items across NIT Rourkela hostels, labs, SAC, and libraries.
            </p>
          </div>

          {locationFilter !== "all" && (
            <div className="inline-flex items-center gap-3 rounded-2xl bg-blue-500/10 border border-blue-400/30 px-4 py-2 text-sm text-blue-200 backdrop-blur-md">
              <span>Filtering: {locationMap[locationFilter]}</span>
              <button
                onClick={() => {
                  setLocationFilter("all");
                  navigate("/items");
                }}
                className="rounded-xl bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/20 transition"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* 3D Glass Filter Bar */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/15 backdrop-blur-xl shadow-xl mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <input
                placeholder="Search by item, location, roll number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full glass-input p-3.5 rounded-xl text-sm placeholder-gray-400 focus:outline-none"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="glass-input p-3.5 rounded-xl text-sm focus:outline-none bg-slate-900"
            >
              {filterTypes.map((type) => (
                <option key={type} value={type} className="bg-slate-900 text-white">
                  {type === "all" ? "All Status Types" : type.toUpperCase()}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="glass-input p-3.5 rounded-xl text-sm focus:outline-none bg-slate-900"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-slate-900 text-white">
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="glass-input p-3.5 rounded-xl text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Items Display Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl bg-white/5 border border-white/10 p-6 animate-pulse h-80" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 rounded-3xl bg-slate-900/60 border border-white/15 backdrop-blur-xl text-center space-y-3">
            <span className="text-4xl">🔍</span>
            <h3 className="text-xl font-bold text-white">No Matching Items Found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Try adjusting your search criteria or date filter to discover reported belongings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Tilt3DCard
                key={item._id}
                onClick={() => navigate(`/items/${item._id}`)}
                className="cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-950/60">
                  {item.image ? (
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-500 text-sm font-medium">
                      No Image Provided
                    </div>
                  )}
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
                    <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-900/80 text-slate-300 border border-white/10 backdrop-blur-md">
                      {item.category || "General"}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="text-white font-bold text-lg leading-snug group-hover:text-blue-400 transition-colors">
                      {item.itemName}
                    </h3>
                    <p className="text-gray-300 text-xs mt-1.5 flex items-center gap-1.5">
                      <span className="text-blue-400">📍</span>
                      <span className="truncate">{item.location}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span className="truncate">By {item.userId?.name || item.personName || "Student"}</span>
                    <span className="text-blue-400 font-semibold group-hover:underline shrink-0">Details →</span>
                  </div>
                </div>
              </Tilt3DCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
