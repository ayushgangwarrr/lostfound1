import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useChat } from "../context/ChatContext.jsx";
import { fetchJson } from "../utils/api.js";

export default function Navbar() {
  const { user, setUser, authLoading } = useAuth();
  const { unreadCount } = useChat();
  const navigate = useNavigate();
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

  return (


      <div className="bg-slate-950 text-white p-6 mb-3.5 flex items-center justify-between flex-wrap">

      <h1 onClick={() => navigate("/")} className="cursor-pointer font-montserrat font-extrabold text-5xl tracking-tight">
        LosT  <span className="text-blue-500 font-medium text-3xl">& Found</span>
      </h1>


      <ul className="hidden md:flex gap-8 text-1xl font-semibold">

        <Link className="relative group hover:text-blue-500 transition-all" to="/items">
          BROWSE ITEMS
          <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-blue-500 transition-all duration-[1000ms] group-hover:w-full"></span>
        </Link>

        <Link className="relative group hover:text-blue-500 transition-all" to="/report-lost">
          REPORT LOST
          <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-blue-500 transition-all duration-[1000ms] group-hover:w-full"></span>
        </Link>

        <Link className="relative group hover:text-blue-500 transition-all" to="/report-found">
          REPORT FOUND
          <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-blue-500 transition-all duration-[1000ms] group-hover:w-full"></span>
        </Link>

        <Link className="relative group hover:text-blue-500 transition-all" to="/dashboard">
          DASHBOARD
          <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-blue-500 transition-all duration-[1000ms] group-hover:w-full"></span>
        </Link>
        {user?.isAdmin && (
          <Link className="relative group hover:text-blue-500 transition-all" to="/admin">
            ADMIN
            <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-blue-500 transition-all duration-[1000ms] group-hover:w-full"></span>
          </Link>
        )}

      </ul>





      <div className="flex gap-4">

        {authLoading ? (
          <div className="flex items-center gap-4 text-gray-300">
            <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-slate-700 rounded animate-pulse"></div>
          </div>
        ) : user ? (

          <div className="relative flex items-center gap-4" ref={menuRef}>
            <Link to="/messages" className="relative inline-flex items-center justify-center rounded-full bg-slate-800 p-3 text-slate-200 hover:bg-slate-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h15A2.25 2.25 0 0 1 21.75 4.5v12a2.25 2.25 0 0 1-2.25 2.25H7.31l-4.28 2.02A.75.75 0 0 1 2 19.74V4.5zM4.5 3.75a.75.75 0 0 0-.75.75v13.38l3.28-1.55a.75.75 0 0 1 .69 0l3.37 1.69H19.5a.75.75 0 0 0 .75-.75V4.5a.75.75 0 0 0-.75-.75H4.5z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-semibold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen((open) => !open)}
              className="font-semibold flex items-center gap-2 hover:text-blue-500"
            >
              {user.name || user.email}
              <span className="text-xs">▼</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-3 w-48 rounded-2xl border border-gray-700 bg-slate-900 shadow-xl">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-slate-800"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/my-items");
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-slate-800"
                >
                  Reported Items
                </button>
                <button
                  onClick={() => {
                    navigate("/messages");
                    setMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-slate-800"
                >
                  Messages
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-3 text-left text-sm text-rose-400 hover:bg-slate-800"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

        ) : (

          <>
            <Link to="/login">
              <button className="bg-slate-950 hover:bg-blue-700 px-8 py-3 rounded-xl text-white font-semibold shadow-lg shadow-blue-500/30 transition">
                Login
              </button>
            </Link>

            <Link to="/signup">
              <button className="bg-slate-950 hover:bg-blue-700 px-8 py-3 rounded-xl text-white font-semibold shadow-lg shadow-blue-500/30 transition">
                Sign up →
              </button>
            </Link>
          </>

        )}

      </div>

    </div>
    )
  }