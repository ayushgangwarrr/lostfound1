import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || {
    name: "",
    email: "",
    phone: "",
    rollNumber: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        setProfile(user);
        return;
      }
      try {
        const data = await fetchJson("/api/auth/profile");
        setProfile(data.profile);
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    loadProfile();
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center px-6">
      <div className="w-full max-w-3xl bg-slate-900 rounded-xl p-8 shadow-lg">
        <h1 onClick={() => navigate("/")} className="font-montserrat cursor-pointer font-extrabold text-5xl tracking-tight">
          LosT <span className="text-blue-500 font-medium text-3xl">& Found</span>
        </h1>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="p-4 bg-slate-800 rounded-xl">
            <p className="text-gray-400 uppercase tracking-wide text-sm">Name</p>
            <p className="mt-2 text-lg">{profile.name}</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl">
            <p className="text-gray-400 uppercase tracking-wide text-sm">Email</p>
            <p className="mt-2 text-lg">{profile.email}</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl">
            <p className="text-gray-400 uppercase tracking-wide text-sm">Roll Number</p>
            <p className="mt-2 text-lg">{profile.rollNumber || "Not provided"}</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl">
            <p className="text-gray-400 uppercase tracking-wide text-sm">Phone</p>
            <p className="mt-2 text-lg">{profile.phone || "Not provided"}</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl">
            <p className="text-gray-400 uppercase tracking-wide text-sm">User ID</p>
            <p className="mt-2 text-lg">{profile._id || "N/A"}</p>
          </div>
          <div className="p-4 bg-blue-950 rounded-xl border border-blue-700">
            <p className="text-gray-400 uppercase tracking-wide text-sm">Messages</p>
            <p className="mt-2 text-lg">Chat with students and reporters directly.</p>
            <button
              onClick={() => navigate("/messages")}
              className="mt-4 rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-500 transition"
            >
              Open Messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
