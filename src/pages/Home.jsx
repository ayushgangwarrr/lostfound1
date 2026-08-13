import { Link, useNavigate } from "react-router-dom";
import Footer from "../pages/Footer";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion as Motion, useScroll, useSpring, useTransform } from "framer-motion";
import { fetchJson } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";




export default function Home() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetchJson("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error(error);
    }
    setUser(null);
    navigate("/login");
  };

  const { scrollY } = useScroll();

  // small vertical movement
  const y1 = useTransform(scrollY, [0, 600], [0, -20]);
  const y2 = useTransform(scrollY, [0, 600], [0, 20]);
  const y3 = useTransform(scrollY, [0, 600], [0, -20]);
  const y4 = useTransform(scrollY, [0, 600], [0, 20]);

  // tiny horizontal drift (~2px)
  const x1 = useTransform(scrollY, [0, 600], [0, 2]);
  const x2 = useTransform(scrollY, [0, 600], [0, -2]);
  const x3 = useTransform(scrollY, [0, 600], [0, 2]);
  const x4 = useTransform(scrollY, [0, 600], [0, -2]);

  
  const smoothY1 = useSpring(y1, { stiffness: 40, damping: 25 });
  const smoothY2 = useSpring(y2, { stiffness: 40, damping: 25 });
  const smoothY3 = useSpring(y3, { stiffness: 40, damping: 25 });
  const smoothY4 = useSpring(y4, { stiffness: 40, damping: 25 });

  const smoothX1 = useSpring(x1, { stiffness: 40, damping: 25 });
  const smoothX2 = useSpring(x2, { stiffness: 40, damping: 25 });
  const smoothX3 = useSpring(x3, { stiffness: 40, damping: 25 });
  const smoothX4 = useSpring(x4, { stiffness: 40, damping: 25 });
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 overflow-x-hidden">

      {/* ================= NAVBAR ================= */}

      <div className="bg-slate-950 text-white p-6 mb-3.5 flex items-center justify-between flex-wrap">

        <h1 onClick={() => navigate("/")} className="font-montserrat cursor-pointer font-extrabold text-5xl tracking-tight">
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

        </ul>





        <div className="flex gap-4">
        {/* <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-bold">
  {user.name?.charAt(0)}
</div> */}

          {user ? (

            <div className="flex items-center gap-4">

              <div  ref={ref} className=" relative">

                {/* USER NAME */}
                <button
                  onClick={() => setOpen(!open)}
                  className="font-semibold hover:text-blue-400"
                >
                  {user.name || user.email}
                </button>

                {/* DROPDOWN */}

                <AnimatePresence>
                  {open && (

                    <Motion.div
                      initial={{ opacity: 0, rotateX: -90 }}
                      animate={{ opacity: 1, rotateX: 0 }}
                      exit={{ opacity: 0, rotateX: -90 }}
                      transition={{ duration: 0.3 }}
                      className="absolute right-0 mt-3 w-52 bg-slate-900 border border-gray-700 rounded-xl shadow-lg p-2"
                    >

                      <button
                        onClick={() => navigate("/profile")}
                        className="block w-full text-left px-4 py-2 hover:bg-slate-800 rounded"
                      >
                        Profile
                      </button>

                      <button
                        onClick={() => navigate("/my-items")}
                        className="block w-full text-left px-4 py-2 hover:bg-slate-800 rounded"
                      >
                        Reported Items
                      </button>

                      <button
                        onClick={() => navigate("/messages")}
                        className="block w-full text-left px-4 py-2 hover:bg-slate-800 rounded"
                      >
                        Messages
                      </button>

                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-red-600 rounded"
                      >
                        Logout
                      </button>

                    </Motion.div>

                  )}
                </AnimatePresence>

              </div>

              <button
                onClick={handleLogout}
                className="border px-4 py-2 rounded hover:text-blue-500"
              >
                Logout
              </button>

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

      {/* ================= HERO SECTION ================= */}

      <section className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-28 gap-16">

          {/* LEFT CONTENT */}

          <div className="max-w-xl text-center md:text-left space-y-8">

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Lost Something on
              <span className="text-blue-500"> Campus?</span>
            </h1>

            <p className="text-gray-300 text-lg">
              A simple platform for NIT Rourkela students to report lost items,
              return found belongings, and reconnect people with what matters.
            </p>

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">

              <Link
                to="/report-lost"
                className="bg-slate-950 hover:bg-blue-700 px-8 py-3 rounded-xl text-white font-semibold shadow-lg shadow-blue-600/30 transition"
              >
                Report Lost
              </Link>

              <Link
                to="/report-found"
                className="bg-slate-950 hover:bg-blue-700 px-8 py-3 rounded-xl text-white font-semibold shadow-lg shadow-blue-600/30 transition"
              >
                Report Found
              </Link>

            </div>

          </div>

          {/* RIGHT IMAGE */}

          <div className="relative">

            <img
              src="/image/nit.png"
              alt="campus"
              className="w-[520px] max-w-full rounded-xl shadow-2xl"
            />

            {/* glow background */}
            <div className="absolute -z-10 w-96 h-96 bg-blue-600 blur-[120px] opacity-30 top-10 left-10"></div>

          </div>

        </div>

      </section>

      <section className="bg-slate-950 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
              RECENTLY REPORTED ITEMS
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Help students recover their belongings on campus.
            </p>
          </div>

          {/* Items Grid - Perfectly Symmetric */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
            {[
              {
                id: "card-1",
                itemName: "Black Wallet",
                location: "Found near SAC",
                timeAgo: "Posted 2 hours ago",
                type: "found",
                category: "Accessories",
                image: "/image/wallet.png",
              },
              {
                id: "card-2",
                itemName: "MacBook Charger",
                location: "LT Building",
                timeAgo: "Posted yesterday",
                type: "lost",
                category: "Electronics",
                image: "/image/mac.png",
              },
              {
                id: "card-3",
                itemName: "Student ID Card",
                location: "Library Entrance",
                timeAgo: "Posted 5 hours ago",
                type: "found",
                category: "Documents",
                image: "/image/id.png",
              },
              {
                id: "card-4",
                itemName: "Room Keys",
                location: "Hall 5",
                timeAgo: "Posted 3 hours ago",
                type: "lost",
                category: "Keys",
                image: "/image/key.png",
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => navigate("/items")}
                className="group cursor-pointer rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-xl flex flex-col justify-between overflow-hidden hover:scale-[1.02] hover:-translate-y-1.5 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              >
                {/* Image Container with Fixed Height & Aspect Ratio */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-950 flex-shrink-0">
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
                    <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-md bg-slate-900/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
                      {item.category}
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
                    <span>{item.timeAgo}</span>
                    <span className="text-blue-400 font-semibold group-hover:underline">View details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-16 px-6">

        {[
          {
            title: "Report Lost Item",
            desc: "Quickly report items you lost on campus and notify other students to help locate them."
          },
          {
            title: "Report Found Item",
            desc: "Found something on campus? Post it here so the rightful owner can claim it."
          },
          {
            title: "Browse Lost Items",
            desc: "Search through recently reported lost items across campus locations."
          },
          {
            title: "Browse Found Items",
            desc: "Check items that others have found and posted to reconnect with your belongings."
          },
          {
            title: "Campus Locations",
            desc: "Track items reported from hostels, lecture halls, library, and common campus spots."
          },
          {
            title: "Secure Recovery",
            desc: "Connect safely with the person who found your item and arrange a pickup."
          }
        ].map((card) => (
          <div
            key={card.title}
            className="border  rounded-lg p-6 transition duration-300 group hover:-translate-y-2 hover:shadow-xl hover:border-blue-500 bg-slate-950"
          >

            <h3 className="text-xl font-semibold mb-3 group-hover:text-blue-600 transition">
              {card.title}
            </h3>

            <p className="text-gray-600 mb-4">
              {card.desc}
            </p>

            <a className="text-blue-600 font-semibold cursor-pointer">
              Learn More →
            </a>

          </div>
        ))}

      </section>
      <div className="bg-slate-950 h-max w-full flex items-center justify-center gap-10 py-20">

        <div className="max-w-5xl mx-auto px-6 leading-tight text-left">
          <h1 className="text-white font-bold text-4xl leading-tight">
            The smart <span className="text-blue-600">Lost & Found</span> platform for your campus
          </h1>
        </div>


        <div className="relative overflow-hidden py-10 bg-slate-950 w-full">

          {/* Blur edges */}
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-slate-950 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-slate-950 to-transparent z-10"></div>

          {/* Scrolling text */}
          <div className="flex whitespace-nowrap gap-16 text-xl font-semibold text-blue-500 animate-marquee">

            <span>Report Lost Items</span>
            <span>Report Found Items</span>
            <span>Browse Campus Items</span>
            <span>Recover Your Belongings</span>
            <span>Connect With Students</span>

            {/* duplicate for infinite loop */}
            <span>Report Lost Items</span>
            <span>Report Found Items</span>
            <span>Browse Campus Items</span>
            <span>Recover Your Belongings</span>
            <span>Connect With Students</span>

          </div>

        </div>

      </div>
      <Footer />
      {/* <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6">

        <h1 className="text-4xl font-bold">
          Lost & Found Platform
        </h1>

        <div className="flex gap-6">

          <Link to="/report-lost" className="bg-blue-600 px-5 py-3 rounded">
            Report Lost
          </Link>

          <Link to="/report-found" className="bg-green-600 px-5 py-3 rounded">
            Report Found
          </Link>

          <Link to="/items" className="bg-purple-600 px-5 py-3 rounded">
            Browse Items
          </Link>

          <Link to="/dashboard" className="bg-yellow-600 px-5 py-3 rounded">
            Dashboard
          </Link>

        </div>

      </div> */}

    </div>
  );
}
