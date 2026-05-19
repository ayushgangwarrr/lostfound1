import { useState } from "react";
import { fetchJson } from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

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
    if (!formData.name || !formData.email || !formData.password || !formData.rollNumber || !formData.phone) {
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
    <div className="min-h-screen bg-slate-950 bg-cover bg-center flex items-center justify-center px-9">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-medium text-left mb-6">
          Create your
          <h1 className="font-montserrat font-extrabold text-4xl tracking-tight">
            LosT <span className="text-blue-500 font-medium text-2xl">& Found</span>
          </h1>
          profile
        </h2>
        <div className="flex justify-center mb-6 gap-4">
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step === 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>1</div>
          <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>2</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                name="rollNumber"
                placeholder="enter your roll number"
                value={formData.rollNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={nextStep}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Continue
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
              <button
                type="submit"
                className="w-full py-3 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Create Account
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
