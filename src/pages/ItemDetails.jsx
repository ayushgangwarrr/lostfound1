import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchJson, resolveImageUrl } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function ItemDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await fetchJson(`/api/reports/${id}`);
        setReport(data.report);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadReport();
  }, [id]);

  const handleMessage = async () => {
    if (!report?.userId?._id) return;

    try {
      const data = await fetchJson("/api/chat/create-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId: report.userId._id }),
      });

      navigate(`/messages?conversationId=${data.conversation._id}`);
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to open chat with reporter");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="p-8 bg-slate-900 rounded-xl shadow-lg">Loading item details...</div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="p-8 bg-slate-900 rounded-xl shadow-lg">Item not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-10">
        <button onClick={() => navigate(-1)} className="text-blue-400 hover:text-blue-200 mb-6">
          ← Back to browse
        </button>
        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="bg-slate-800 rounded-3xl overflow-hidden shadow-lg">
            {report.image ? (
              <img src={resolveImageUrl(report.image)} alt={report.itemName} className="w-full h-96 object-cover" />
            ) : (
              <div className="h-96 w-full bg-slate-700 flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold">{report.itemName}</h1>
              <p className="text-gray-400">{report.description}</p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-blue-600 px-4 py-2 text-sm uppercase tracking-wide">{report.type}</span>
                <span className="rounded-full bg-slate-700 px-4 py-2 text-sm">{report.category || "Other"}</span>
                <span className="rounded-full bg-slate-700 px-4 py-2 text-sm">{new Date(report.dateLostOrFound || report.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-slate-800 rounded-2xl p-6">
                <p className="text-gray-400 uppercase text-xs">Location</p>
                <p className="mt-2 text-lg">{report.location}</p>
              </div>
              <div className="bg-slate-800 rounded-2xl p-6">
                <p className="text-gray-400 uppercase text-xs">Reported by</p>
                <p className="mt-2 text-lg">{report.userId?.name || report.personName || "Unknown"}</p>
                <p className="text-gray-400 mt-1 text-sm">Roll: {report.userId?.rollNumber || report.rollNumber || "N/A"}</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-slate-800 rounded-2xl p-6">
                <p className="text-gray-400 uppercase text-xs">Contact</p>
                <p className="mt-2 text-lg">{report.userId?.phone || report.phone}</p>
                <p className="text-gray-400 mt-1 text-sm">Email: {report.userId?.email || "Not shared"}</p>
              </div>
              <div className="bg-slate-800 rounded-2xl p-6">
                <p className="text-gray-400 uppercase text-xs">Roll Number</p>
                <p className="mt-2 text-lg">{report.userId?.rollNumber || report.rollNumber || "N/A"}</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={handleMessage} disabled={!user || !report.userId?._id} className="w-full bg-blue-600 hover:bg-blue-700 rounded-2xl px-6 py-4 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed">
                Message Reporter
              </button>
              <a href={`tel:${report.phone}`} className="w-full text-center bg-slate-700 hover:bg-slate-600 rounded-2xl px-6 py-4 font-semibold transition">
                Call Reporter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
