import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 gap-10">
      <div>
        <h1 className="font-montserrat font-extrabold text-5xl tracking-tight text-white">
          LosT <span className="text-blue-500 text-3xl font-medium">& Found</span>
        </h1>
      </div>
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-10 border border-blue-200">
        <h1 className="text-center font-montserrat font-extrabold text-4xl tracking-tight">
          Welcome <span className="text-blue-500 text-2xl font-medium">Back</span>
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-6">Hey! Good to see you again</p>
        <div className="text-center text-sm text-gray-500 mb-4">Sign in with email and password</div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="w-full py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition font-semibold">
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
          <span onClick={() => navigate("/forgot-password")} className="text-blue-600 cursor-pointer hover:underline">
            Forgot password?
          </span>
        </p>
        <p className="text-center text-sm mt-6 text-gray-600">
          Don't have an account?
          <span onClick={() => navigate("/signup")} className="text-blue-600 cursor-pointer ml-1 hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
