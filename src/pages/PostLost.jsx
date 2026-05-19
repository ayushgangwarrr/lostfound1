import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../utils/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const categories = ["Electronics", "Documents", "Clothing", "Accessories", "Other"];

export default function PostLost() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [category, setCategory] = useState("Other");
  const [contact, setContact] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.rollNumber) {
      setRollNumber(user.rollNumber);
    }
  }, [user]);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchJson("/api/reports");
        setRecentReports(data.reports.filter((report) => report.type === "lost"));
      } catch (error) {
        console.error(error);
      }
    };

    loadReports();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !location || !description || !contact) {
      alert("Please fill all fields");
      return;
    }

    if (contact.length !== 10 || !/^\d+$/.test(contact)) {
      alert("Please enter a valid 10-digit contact number");
      return;
    }

    const body = new FormData();
    body.append("type", "lost");
    body.append("itemName", title);
    body.append("description", description);
    body.append("personName", user?.name || "");
    body.append("rollNumber", rollNumber || user?.rollNumber || "");
    body.append("category", category);
    body.append("phone", contact);
    body.append("location", location);
    if (imageFile) {
      body.append("image", imageFile);
    }

    try {
      await fetchJson("/api/report", {
        method: "POST",
        body,
      });

      alert("Lost item reported successfully.");
      navigate("/");
    } catch (error) {
      alert(error.message || "Unable to submit report");
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <h1 onClick={() => navigate("/")} className="font-montserrat cursor-pointer font-extrabold text-5xl tracking-tight">
        LosT <span className="text-blue-500 font-medium text-3xl">& Found</span>
      </h1>
      <h1 className="text-4xl font-bold text-center mb-12">Report Lost Item</h1>
      <div className="max-w-4xl mx-auto bg-slate-900 p-8 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2">Item Title</label>
            <input
              type="text"
              placeholder="e.g. Black Wallet"
              className="w-full p-3 rounded bg-slate-800 border border-gray-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Location Lost</label>
            <input
              type="text"
              placeholder="e.g. SAC, Library"
              className="w-full p-3 rounded bg-slate-800 border border-gray-700"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Description</label>
            <textarea
              placeholder="Describe the item..."
              className="w-full p-3 rounded bg-slate-800 border border-gray-700"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2">Roll Number</label>
              <input
                type="text"
                placeholder="Enter roll number"
                className="w-full p-3 rounded bg-slate-800 border border-gray-700"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2">Category</label>
              <select
                className="w-full p-3 rounded bg-slate-800 border border-gray-700"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-2">Contact number</label>
            <input
              type="text"
              placeholder="e.g. Contact number"
              className="w-full p-3 rounded bg-slate-800 border border-gray-700"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-2">Upload Image</label>
            <input type="file" accept="image/*" onChange={handleImage} />
          </div>
          <button type="submit" className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700">
            Submit Report
          </button>
        </form>
      </div>
      <div className="max-w-7xl mx-auto mt-20">
        <h2 className="text-3xl font-bold mb-10 text-center">Other Lost Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {recentReports.length === 0 ? (
            <p className="text-gray-400">No lost reports available yet.</p>
          ) : (
            recentReports.slice(0, 4).map((report) => (
              <div key={report._id} className="bg-slate-800 rounded-xl overflow-hidden hover:scale-105 transition">
                {report.image ? (
                  <img
                    src={`${import.meta.env.VITE_API_URL || "http://localhost:5000"}${report.image}`}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-full bg-slate-700 flex items-center justify-center text-gray-400">No image</div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold">{report.itemName}</h3>
                  <p className="text-sm text-gray-400">{report.location}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
