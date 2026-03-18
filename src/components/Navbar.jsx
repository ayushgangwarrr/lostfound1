import { Link, Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
export default function Navbar() {
const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };
  const navigate = useNavigate();

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

      </ul>





      <div className="flex gap-4">

        {user ? (

          <div className="flex items-center gap-4">

            <p className="font-semibold">
              {user.name || user.email}
            </p>

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
    )
  }