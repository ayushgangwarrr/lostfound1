import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../utils/api.js";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    try {
      const data = await fetchJson("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setSuccess(true);
      if (data.resetLink) {
        setResetUrl(data.resetLink);
      } else {
        setTimeout(() => navigate("/login"), 4000);
      }
    } catch (error) {
      setError(error.message || "Failed to send reset email. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
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
          Reset <span className="text-blue-500 text-2xl font-medium">Password</span>
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-6">Enter your email to receive a password reset link</p>

        {success ? (
          <div className="bg-green-50 border border-green-300 text-green-800 px-5 py-4 rounded-xl mb-4 space-y-3">
            <p className="font-bold text-lg">Reset Link Generated!</p>
            <p className="text-sm text-green-700">A password reset request was created for your account.</p>
            {resetUrl && (
              <a
                href={resetUrl}
                className="inline-block w-full text-center py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
              >
                Click Here to Reset Password Now →
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition font-semibold disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-6 text-gray-600">
          Remember your password?
          <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer ml-1 hover:underline">
            Sign in
          </span>
        </p>
        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account?
          <span onClick={() => navigate("/signup")} className="text-blue-600 cursor-pointer ml-1 hover:underline">
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
