import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useChat } from "../context/ChatContext.jsx";
import { fetchJson } from "../utils/api.js";

export default function Navbar() {
  const { user, setUser, authLoading } = useAuth();
  const { unreadCount } = useChat();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = async () => {
    try {
      await fetchJson("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 mb-8">
      <div className="rounded-2xl border border-white/15 bg-slate-950/75 backdrop-blur-2xl px-6 py-4 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Brand Logo with 3D glowing glass feel */}
        <h1
          onClick={() => navigate("/")}
          className="cursor-pointer font-montserrat font-extrabold text-3xl sm:text-4xl tracking-tight text-white flex items-center gap-1.5 transition-transform hover:scale-105"
        >
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            LosT
          </span>
          <span className="text-blue-500 font-semibold text-2xl sm:text-3xl">&</span>
          <span className="text-gray-100 font-bold">Found</span>
        </h1>

        {/* Navigation Links with Glass Hover Pill */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide">
          <Link
            to="/items"
            className={`relative py-1.5 px-3 rounded-xl transition-all duration-300 ${
              isActive("/items")
                ? "text-blue-400 bg-white/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            BROWSE ITEMS
          </Link>

          <Link
            to="/report-lost"
            className={`relative py-1.5 px-3 rounded-xl transition-all duration-300 ${
              isActive("/report-lost")
                ? "text-blue-400 bg-white/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            REPORT LOST
          </Link>

          <Link
            to="/report-found"
            className={`relative py-1.5 px-3 rounded-xl transition-all duration-300 ${
              isActive("/report-found")
                ? "text-blue-400 bg-white/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            REPORT FOUND
          </Link>

          <Link
            to="/dashboard"
            className={`relative py-1.5 px-3 rounded-xl transition-all duration-300 ${
              isActive("/dashboard")
                ? "text-blue-400 bg-white/10 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            }`}
          >
            DASHBOARD
          </Link>

          {user?.isAdmin && (
            <Link
              to="/admin"
              className={`relative py-1.5 px-3 rounded-xl transition-all duration-300 ${
                isActive("/admin")
                  ? "text-purple-400 bg-purple-500/10 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "text-purple-300 hover:text-purple-200 hover:bg-white/5"
              }`}
            >
              ADMIN
            </Link>
          )}
        </ul>

        {/* User Status / Action Controls */}
        <div className="flex items-center gap-4">
          {authLoading ? (
            <div className="flex items-center gap-4 text-gray-400">
              <div className="h-4 w-24 bg-slate-800 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-slate-800 rounded animate-pulse"></div>
            </div>
          ) : user ? (
            <div className="relative flex items-center gap-3" ref={menuRef}>
              <Link
                to="/messages"
                className="relative inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 p-2.5 text-slate-200 hover:bg-white/10 hover:border-blue-400/40 transition shadow-inner"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5 text-blue-400"
                >
                  <path d="M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h15A2.25 2.25 0 0 1 21.75 4.5v12a2.25 2.25 0 0 1-2.25 2.25H7.31l-4.28 2.02A.75.75 0 0 1 2 19.74V4.5zM4.5 3.75a.75.75 0 0 0-.75.75v13.38l3.28-1.55a.75.75 0 0 1 .69 0l3.37 1.69H19.5a.75.75 0 0 0 .75-.75V4.5a.75.75 0 0 0-.75-.75H4.5z" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white shadow-lg shadow-rose-500/50">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/5 border border-white/15 hover:border-blue-400/40 hover:bg-white/10 transition text-sm font-medium text-white shadow-lg"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  {(user.name || user.email)?.charAt(0)?.toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate">{user.name || user.email}</span>
                <span className="text-xs text-gray-400">▼</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-3 w-52 rounded-2xl border border-white/15 bg-slate-900/90 backdrop-blur-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl text-left text-sm text-gray-200 hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                  >
                    👤 Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/my-items");
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl text-left text-sm text-gray-200 hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                  >
                    📦 Reported Items
                  </button>
                  <button
                    onClick={() => {
                      navigate("/messages");
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl text-left text-sm text-gray-200 hover:bg-white/10 hover:text-white transition flex items-center gap-2"
                  >
                    💬 Messages
                  </button>
                  <div className="my-1 border-t border-white/10" />
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2.5 rounded-xl text-left text-sm text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition flex items-center gap-2 font-medium"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <button className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-200 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition">
                  Login
                </button>
              </Link>

              <Link to="/signup">
                <button className="glass-button px-5 py-2 rounded-xl text-sm font-semibold text-white">
                  Sign up →
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}