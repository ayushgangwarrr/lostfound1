import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson } from "../utils/api.js";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      alert("Invalid reset link. Please request a new password reset.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      await fetchJson("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      setSuccess(true);
      alert("Password reset successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      alert(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 gap-10">
        <div>
          <h1 className="font-montserrat font-extrabold text-5xl tracking-tight text-white">
            LosT <span className="text-blue-500 text-3xl font-medium">& Found</span>
          </h1>
        </div>
        <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-10 border border-green-200">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-700 font-semibold text-lg">Password Reset Successfully!</p>
            <p className="text-green-600 text-sm mt-2">Redirecting to login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 px-4 gap-10">
      <div>
        <h1 className="font-montserrat font-extrabold text-5xl tracking-tight text-white">
          LosT <span className="text-blue-500 text-3xl font-medium">& Found</span>
        </h1>
      </div>
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl p-10 border border-blue-200">
        <h1 className="text-center font-montserrat font-extrabold text-4xl tracking-tight">
          Create New <span className="text-blue-500 text-2xl font-medium">Password</span>
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-6">Enter your new password below</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">New Password</label>
            <input
              type="password"
              required
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Confirm Password</label>
            <input
              type="password"
              required
              className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition font-semibold disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-600">
          <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer hover:underline">
            Back to login
          </span>
        </p>
      </div>
    </div>
  );
}
