import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../utils/api.js";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await fetchJson("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setSubmitted(true);
      setResetLink(data.resetLink || "");
      alert(data.message || "Password reset link sent to your email");
    } catch (error) {
      alert(error.message || "Failed to send reset email");
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

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-700 font-semibold">Email sent successfully!</p>
            <p className="text-green-600 text-sm mt-2">Check your email for the password reset link.</p>
            {resetLink && (
              <div className="mt-4 p-4 bg-white border border-blue-200 rounded-lg text-left text-sm break-words">
                <p className="font-semibold text-slate-700">Development reset link:</p>
                <p className="text-blue-600 mt-2">{resetLink}</p>
              </div>
            )}
            <button
              onClick={() => navigate("/login")}
              className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <input
                type="email"
                required
                className="w-full mt-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition font-semibold disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <p className="text-center text-sm mt-6 text-gray-600">
          Remember your password?
          <span onClick={() => navigate("/login")} className="text-blue-600 cursor-pointer ml-1 hover:underline">
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
