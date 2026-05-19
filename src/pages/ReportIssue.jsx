import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "./Footer";
import { fetchJson } from "../utils/api.js";

export default function ReportIssue() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Bug");
  const [description, setDescription] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (screenshot) {
      formData.append("screenshot", screenshot);
    }

    try {
      await fetchJson("/api/issues", {
        method: "POST",
        body: formData,
      });
      setStatus({ type: "success", text: "Issue submitted successfully." });
      setTitle("");
      setCategory("Bug");
      setDescription("");
      setScreenshot(null);
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Unable to submit issue." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-5xl font-bold mb-6">Report an Issue</h1>
        <p className="text-gray-400 mb-10">
          Tell us about a bug, incorrect content, or any issue so the team can fix it quickly.
        </p>

        <div className="rounded-3xl bg-slate-900 p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Issue title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short summary"
                className="w-full rounded-2xl border border-gray-700 bg-slate-800 p-3 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-gray-700 bg-slate-800 p-3 text-white"
              >
                <option value="Bug">Bug</option>
                <option value="Content">Content</option>
                <option value="Support">Support</option>
                <option value="Feedback">Feedback</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue in detail"
                rows={5}
                className="w-full rounded-2xl border border-gray-700 bg-slate-800 p-3 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Screenshot (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-300 file:rounded-2xl file:border file:border-gray-700 file:bg-slate-800 file:px-4 file:py-2 file:text-white"
              />
            </div>

            <button className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 transition">
              Submit Issue
            </button>

            {status && (
              <p className={status.type === "success" ? "text-emerald-400" : "text-rose-400"}>
                {status.text}
              </p>
            )}
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
