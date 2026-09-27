import { Link, useNavigate } from "react-router-dom";
import Footer from "../pages/Footer";
import Navbar from "../components/Navbar";
import Tilt3DCard from "../components/Tilt3DCard";
import GlassBackground from "../components/GlassBackground";

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
      desc: "Post a quick lost-item notice with location details and a clear description so the right people can spot it fast.",
      link: "/report-lost",
      btnText: "Report Lost Item →",
    },
    {
      title: "Report Found Item",
      icon: "🎁",
      desc: "Found something? Share the details and let the owner connect with you without the usual back-and-forth.",
      link: "/report-found",
      btnText: "Report Found Item →",
    },
    {
      title: "Browse Campus Items",
      icon: "🗂️",
      desc: "Search recent entries by category, place, and time to narrow down the most likely matches.",
      link: "/items",
      btnText: "Browse Items →",
    },
    {
      title: "Direct Messaging",
      icon: "💬",
      desc: "Message directly with the person who posted the item or the finder to verify and arrange handoff.",
      link: "/messages",
      btnText: "Open Messages →",
    },
    {
      title: "Campus Coverage",
      icon: "📍",
      desc: "From libraries and labs to hostels and cafés, the board is built around real campus movement patterns.",
      link: "/items",
      btnText: "Explore Campus →",
    },
    {
      title: "Account Trust",
      icon: "🛡️",
      desc: "Verified student profiles make it easier to confirm identity and keep ownership claims more reliable.",
      link: "/dashboard",
      btnText: "Go to Dashboard →",
    },
  ];

  const campusUpdates = [
    { title: "Wallet found", location: "SAC Arena", time: "2 min ago" },
    { title: "Student ID lost", location: "Library entrance", time: "12 min ago" },
    { title: "AirPods found", location: "Mechanical block", time: "26 min ago" },
  ];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white overflow-x-hidden">
      <GlassBackground />
      <Navbar />

      <section className="relative z-10 w-full pt-8 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 text-[11px] font-semibold uppercase tracking-[0.18em]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Campus recovery network
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-[-0.06em] leading-[0.96] text-white">
              Lost something on
              <span className="block text-blue-400">campus?</span>
            </h1>

            <p className="max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed mx-auto lg:mx-0">
              A simple way to report lost items, reconnect with finders, and get help fast without the usual campus confusion.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <Link
                to="/report-lost"
                className="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-7 py-3.5 text-base font-semibold text-white shadow-[0_10px_30px_rgba(59,130,246,0.35)] transition hover:bg-blue-400"
              >
                Report Lost Item
              </Link>

              <Link
                to="/report-found"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/70 px-7 py-3.5 text-base font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800/80"
              >
                Report Found Item
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 max-w-lg mx-auto lg:mx-0 border-t border-slate-800">
              <div className="pt-4">
                <p className="text-xl font-semibold text-white">Fast</p>
                <p className="mt-1 text-sm text-slate-400">Quick updates</p>
              </div>
              <div className="pt-4">
                <p className="text-xl font-semibold text-white">Clear</p>
                <p className="mt-1 text-sm text-slate-400">Simple posting</p>
              </div>
              <div className="pt-4">
                <p className="text-xl font-semibold text-white">Trusted</p>
                <p className="mt-1 text-sm text-slate-400">Campus verified</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[28px] border border-slate-800 bg-slate-900/80 p-5 shadow-[0_30px_80px_rgba(15,23,42,0.7)] backdrop-blur-xl">
              <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Live updates</span>
              </div>

              <div className="space-y-3">
                {campusUpdates.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-lg text-blue-300">
                        {index === 0 ? "👜" : index === 1 ? "🪪" : "🎧"}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{item.title}</p>
                        <p className="text-sm text-slate-400">{item.location}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{item.time}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Today</p>
                <p className="mt-2 text-lg font-semibold text-white">A calmer, faster way to recover campus essentials.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-20 px-6 border-t border-slate-800 bg-slate-950/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">Recent reports</p>
              <h2 className="text-3xl font-bold tracking-tight text-white">Fresh campus updates</h2>
            </div>
            <button
              onClick={() => navigate("/items")}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              Explore all records →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentDemoItems.map((item) => (
              <Tilt3DCard
                key={item.id}
                onClick={() => navigate("/items")}
                className="cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 p-0 transition hover:border-slate-600"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                  <img src={item.image} alt={item.itemName} className="h-full w-full object-cover" />
                  <div className="absolute left-3 top-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                        item.type === "lost" ? "bg-rose-500/90 text-white" : "bg-emerald-500/90 text-white"
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-white">{item.itemName}</h3>
                    <span className="text-[10px] uppercase tracking-wide text-slate-400">{item.category}</span>
                  </div>
                  <p className="text-sm text-slate-300">{item.location}</p>
                  <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                    <span className="text-xs text-slate-400">{item.timeAgo}</span>
                    <span className="text-xs font-medium text-blue-300">Details</span>
                  </div>
                </div>
              </Tilt3DCard>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto py-20 px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">How it helps</p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Made for everyday campus life</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureCards.map((card) => (
            <div key={card.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:border-slate-600 hover:bg-slate-900">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-2xl">{card.icon}</div>
              <h3 className="mb-3 text-xl font-semibold text-white">{card.title}</h3>
              <p className="mb-5 text-sm leading-6 text-slate-300">{card.desc}</p>
              <Link to={card.link} className="inline-flex items-center text-sm font-medium text-blue-300 transition hover:text-blue-200">
                {card.btnText}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
