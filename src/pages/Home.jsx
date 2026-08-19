import { Link, useNavigate } from "react-router-dom";
import Footer from "../pages/Footer";
import Navbar from "../components/Navbar";
import Tilt3DCard from "../components/Tilt3DCard";
import GlassBackground from "../components/GlassBackground";
import GlassHero3D from "../components/GlassHero3D";

export default function Home() {
  const navigate = useNavigate();

  const recentDemoItems = [
    {
      id: "card-1",
      itemName: "Black Leather Wallet",
      location: "Found near SAC Arena",
      timeAgo: "Posted 2 hours ago",
      type: "found",
      category: "Accessories",
      image: "/image/wallet.png",
    },
    {
      id: "card-2",
      itemName: "MacBook Pro Charger",
      location: "LT Building - Room 204",
      timeAgo: "Posted yesterday",
      type: "lost",
      category: "Electronics",
      image: "/image/mac.png",
    },
    {
      id: "card-3",
      itemName: "NIT Rourkela Student ID",
      location: "Central Library Entrance",
      timeAgo: "Posted 5 hours ago",
      type: "found",
      category: "Documents",
      image: "/image/id.png",
    },
    {
      id: "card-4",
      itemName: "Room Keys Set (Keyring #5)",
      location: "Hall 5 West Wing",
      timeAgo: "Posted 3 hours ago",
      type: "lost",
      category: "Keys",
      image: "/image/key.png",
    },
  ];

  const featureCards = [
    {
      title: "Report Lost Item",
      icon: "🔍",
      desc: "Instantly report lost belongings on campus with location tags and images for swift student tracking.",
      link: "/report-lost",
      btnText: "Report Lost Item →",
    },
    {
      title: "Report Found Item",
      icon: "🎁",
      desc: "Found an item? Post it securely so the owner can verify ownership and arrange pick up.",
      link: "/report-found",
      btnText: "Report Found Item →",
    },
    {
      title: "Browse All Items",
      icon: "🗂️",
      desc: "Search & filter through live lost and found records across all NIT Rourkela hostels & halls.",
      link: "/items",
      btnText: "Explore Directory →",
    },
    {
      title: "Direct Messaging",
      icon: "💬",
      desc: "Connect directly with finders or owners via encrypted real-time socket messaging.",
      link: "/messages",
      btnText: "Open Messages →",
    },
    {
      title: "Campus Locations",
      icon: "📍",
      desc: "Categorized by Library, SAC, Lecture Halls, Cafeteria, and Hostels for pinpoint recovery.",
      link: "/items",
      btnText: "View Map Locations →",
    },
    {
      title: "Secure Verification",
      icon: "🛡️",
      desc: "Roll-number verified accounts ensure items are safely returned to genuine owners.",
      link: "/dashboard",
      btnText: "Go to Dashboard →",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white overflow-x-hidden">
      {/* 3D Ambient Glass Background */}
      <GlassBackground />

      {/* Floating Glass Navbar */}
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 w-full pt-10 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Call To Action */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              Official Campus Recovery Portal
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Lost Something on{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_10px_25px_rgba(59,130,246,0.3)]">
                Campus?
              </span>
            </h1>

            <p className="text-gray-300 text-lg sm:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              A high-performance 3D glass platform for NIT Rourkela students to report lost belongings, return found items, and reconnect in real-time.
            </p>

            {/* 3D Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-2">
              <Link
                to="/report-lost"
                className="glass-button px-8 py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 group"
              >
                <span>Report Lost Item</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                to="/report-found"
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/15 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-white/10 hover:border-blue-400/40 backdrop-blur-xl transition shadow-xl"
              >
                <span>Report Found Item</span>
                <span>✨</span>
              </Link>
            </div>

            {/* Live Stats Quick Pill Grid */}
            <div className="grid grid-cols-3 gap-4 pt-8 max-w-md mx-auto lg:mx-0 border-t border-white/10">
              <div className="text-left">
                <p className="text-2xl font-extrabold text-white">99%</p>
                <p className="text-xs text-gray-400 font-medium">Campus Match Rate</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-extrabold text-blue-400">1,500+</p>
                <p className="text-xs text-gray-400 font-medium">Items Recovered</p>
              </div>
              <div className="text-left">
                <p className="text-2xl font-extrabold text-cyan-400">&lt; 24h</p>
                <p className="text-xs text-gray-400 font-medium">Average Claim Time</p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Hero Canvas Visual */}
          <div className="lg:col-span-5">
            <GlassHero3D />
          </div>
        </div>
      </section>

      {/* ================= RECENTLY REPORTED ITEMS TICKER/GRID ================= */}
      <section className="relative z-10 py-20 px-6 border-t border-white/10 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                Live Feed
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                RECENTLY REPORTED ITEMS
              </h2>
            </div>
            <button
              onClick={() => navigate("/items")}
              className="text-blue-400 hover:text-blue-300 font-semibold text-sm flex items-center gap-1.5 group"
            >
              <span>Explore all records</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          {/* 3D Glass Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentDemoItems.map((item) => (
              <Tilt3DCard
                key={item.id}
                onClick={() => navigate("/items")}
                className="cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-950/60">
                  <img
                    src={item.image}
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
                    <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-900/80 text-slate-300 border border-white/10 backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">
                      {item.itemName}
                    </h3>
                    <p className="text-slate-300 text-xs mt-1.5 flex items-center gap-1.5">
                      <span className="text-blue-400">📍</span>
                      <span className="truncate">{item.location}</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span>{item.timeAgo}</span>
                    <span className="text-blue-400 font-semibold group-hover:underline">Details →</span>
                  </div>
                </div>
              </Tilt3DCard>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3D FEATURE HIGHLIGHT CARDS ================= */}
      <section className="relative z-10 max-w-7xl mx-auto py-24 px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-bold uppercase tracking-wider">
            Features & Capabilities
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Designed for Campus Reconnection
          </h2>
          <p className="text-gray-300 text-base sm:text-lg">
            Experience ultra-responsive search, real-time messaging, and verified campus item matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((card) => (
            <Tilt3DCard key={card.title} className="p-8 flex flex-col justify-between group">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-white/15 flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {card.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  {card.desc}
                </p>
              </div>

              <Link
                to={card.link}
                className="text-blue-400 font-semibold text-sm flex items-center gap-1 group-hover:text-blue-300 transition"
              >
                <span>{card.btnText}</span>
              </Link>
            </Tilt3DCard>
          ))}
        </div>
      </section>

      {/* ================= MARQUEE BANNER ================= */}
      <section className="relative z-10 py-16 bg-slate-950/80 border-y border-white/10 backdrop-blur-xl">
        <div className="relative overflow-hidden w-full">
          <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
          <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />

          <div className="flex whitespace-nowrap gap-16 text-xl font-bold tracking-widest text-blue-400/90 animate-marquee uppercase">
            <span>✨ Report Lost Items</span>
            <span>⚡ Real-Time Socket Chat</span>
            <span>📍 NIT Rourkela Campus Coverage</span>
            <span>📦 Instant Found Item Posting</span>
            <span>🛡️ Verified Student Profiles</span>

            <span>✨ Report Lost Items</span>
            <span>⚡ Real-Time Socket Chat</span>
            <span>📍 NIT Rourkela Campus Coverage</span>
            <span>📦 Instant Found Item Posting</span>
            <span>🛡️ Verified Student Profiles</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
