import { useState } from "react";
import { fetchJson } from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import GlassBackground from "../components/GlassBackground";
import Tilt3DCard from "../components/Tilt3DCard";

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.rollNumber) {
      alert("Please fill all fields");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await fetchJson("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      setUser(data.user);
      alert("Account created successfully");
      navigate("/");
    } catch (error) {
      alert(error.message || "Signup failed");
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

      <div className="relative z-10 w-full max-w-md">
        <Tilt3DCard className="p-8 sm:p-10 border border-white/20 bg-slate-900/70 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(37,99,235,0.35)]">
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 border border-purple-400/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-2">
              Registration Step {step} of 2
            </span>
            <h2 className="font-montserrat font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
              Create Student Profile
            </h2>
          </div>

          {/* Step Pill Indicators */}
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${step === 1 ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-110" : "bg-white/10 text-gray-400"}`}>
              1
            </div>
            <div className="w-8 h-0.5 bg-white/15" />
            <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${step === 2 ? "bg-blue-500 text-white shadow-lg shadow-blue-500/50 scale-110" : "bg-white/10 text-gray-400"}`}>
              2
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 block">Full Name</label>
                  <input
                    name="name"
                    placeholder="e.g. Ayush Gangwar"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full glass-input p-3 rounded-xl text-sm placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 block">Roll Number</label>
                  <input
                    name="rollNumber"
                    placeholder="e.g. 122CS0491"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    className="w-full glass-input p-3 rounded-xl text-sm placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 block">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="email@nitrkl.ac.in"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full glass-input p-3 rounded-xl text-sm placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 block">Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full glass-input p-3 rounded-xl text-sm placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full glass-button py-3.5 rounded-xl text-white font-bold text-base shadow-lg shadow-blue-500/30 mt-2"
                >
                  Continue to Contact →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1 block">Phone Number (Optional)</label>
                  <input
                    name="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full glass-input p-3 rounded-xl text-sm placeholder-gray-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 glass-button py-3 rounded-xl text-white font-bold text-sm shadow-lg shadow-blue-500/30"
                  >
                    Create Account
                  </button>
                </div>
              </>
            )}
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center text-xs text-gray-400">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="text-blue-400 font-bold cursor-pointer hover:underline">
              Sign In
            </span>
          </div>
        </Tilt3DCard>
      </div>
    </div>
  );
}
