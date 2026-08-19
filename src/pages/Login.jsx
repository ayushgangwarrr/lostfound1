import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import GlassBackground from "../components/GlassBackground";
import Tilt3DCard from "../components/Tilt3DCard";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const data = await fetchJson("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      setUser(data.user);
      alert("Logged in successfully");
      navigate("/");
    } catch (error) {
      alert(error.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 py-12 text-white overflow-hidden">
      <GlassBackground />

      {/* Header Logo */}
      <div className="relative z-10 mb-8 cursor-pointer" onClick={() => navigate("/")}>
        <h1 className="font-montserrat font-extrabold text-4xl sm:text-5xl tracking-tight text-white flex items-center justify-center gap-1.5">
          <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.5)]">
            LosT
          </span>
          <span className="text-blue-500 font-semibold text-3xl">&</span>
          <span className="text-gray-100">Found</span>
        </h1>
      </div>

      {/* Frosted 3D Glass Form Container */}
      <div className="relative z-10 w-full max-w-md">
        <Tilt3DCard className="p-8 sm:p-10 border border-white/20 bg-slate-900/70 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(37,99,235,0.35)]">
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
              Campus Account Access
            </span>
            <h2 className="font-montserrat font-extrabold text-3xl text-white tracking-tight">
              Welcome <span className="text-blue-400">Back</span>
            </h2>
            <p className="text-gray-300 text-sm mt-1.5">
              Enter your NIT Rourkela email credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 block">
                Student Email
              </label>
              <input
                type="email"
                placeholder="name@nitrkl.ac.in"
                className="w-full glass-input p-3.5 rounded-xl text-sm placeholder-gray-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full glass-input p-3.5 rounded-xl text-sm placeholder-gray-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="w-full glass-button py-3.5 rounded-xl text-white font-bold text-base shadow-lg shadow-blue-500/30 mt-2">
              Sign In to Portal →
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-3 text-sm">
            <p>
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-blue-400 cursor-pointer hover:underline text-xs font-medium"
              >
                Forgot your password?
              </span>
            </p>
            <p className="text-gray-400 text-xs">
              Don't have a student account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-blue-400 font-bold cursor-pointer hover:underline"
              >
                Create Profile
              </span>
            </p>
          </div>
        </Tilt3DCard>
      </div>
    </div>
  );
}

export default Login;
