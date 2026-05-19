import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "./Footer";
import { fetchJson } from "../utils/api.js";

export default function Support() {
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [status, setStatus] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus(null);

    try {
      await fetchJson("/api/issues", {
        method: "POST",
        body: JSON.stringify({
          title: subject || "Support request",
          description: message,
          category: "Support",
        }),
        headers: { "Content-Type": "application/json" },
      });
      setStatus({ type: "success", text: "Your support request has been submitted." });
      setSubject("");
      setMessage("");
    } catch (error) {
      setStatus({ type: "error", text: error.message || "Unable to send support request." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-5xl font-bold mb-6">Support Center</h1>
        <p className="text-gray-400 mb-10">
          Find answers to common questions, access helpful guidance, and submit a request if you need direct assistance.
        </p>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] mb-12">
          <section className="rounded-3xl bg-slate-900 p-8 shadow-lg">
            <h2 className="text-3xl font-semibold mb-5">Frequently Asked Questions</h2>
            <div className="space-y-5 text-gray-300">
              <div>
                <h3 className="font-semibold">How do I report a lost item?</h3>
                <p className="text-gray-400">Use the report lost page, provide item details, and upload a photo if available.</p>
              </div>
              <div>
                <h3 className="font-semibold">How can I claim a found item?</h3>
                <p className="text-gray-400">Open the item details and message the reporter directly from the messaging page.</p>
              </div>
              <div>
                <h3 className="font-semibold">How do I update my report?</h3>
                <p className="text-gray-400">Visit your reported items page and edit or remove the entry if the item is returned.</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-slate-900 p-8 shadow-lg">
            <h2 className="text-3xl font-semibold mb-5">Help Section</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              If you still need help, send us your request below and we will respond as soon as possible.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Request subject"
                className="w-full rounded-2xl border border-gray-700 bg-slate-800 p-3 text-white"
                required
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question"
                rows={6}
                className="w-full rounded-2xl border border-gray-700 bg-slate-800 p-3 text-white"
                required
              />
              <button className="rounded-2xl bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 transition">
                Submit Request
              </button>
              {status && (
                <p className={status.type === "success" ? "text-emerald-400" : "text-rose-400"}>
                  {status.text}
                </p>
              )}
            </form>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
