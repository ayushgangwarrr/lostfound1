import { useState } from "react";

export default function Signup() {

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",  
    phone: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem(
      "user",
      JSON.stringify({ name: formData.name })
    );

    window.location.href = "/";
  };

  return (

    <div
      className="min-h-screen bg-slate-950 bg-cover bg-center flex items-center justify-center px-9"
    
    >

      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* signup card */}
      <div className="relative bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-medium text-left  mb-6">
          Create your  <h1 className="font-montserrat font-extrabold text-4xl tracking-tight">
          LosT  <span className="text-blue-500 font-medium text-2xl">& Found</span>
        </h1> profile
        </h2>

        {/* step indicator */}

        <div className="flex justify-center mb-6 gap-4">

          <div className={`w-8 h-8 flex items-center justify-center rounded-full 
          ${step === 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
            1
          </div>

          <div className={`w-8 h-8 flex items-center justify-center rounded-full 
          ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
            2
          </div>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* STEP 1 */}

          {step === 1 && (
            <>
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                name="password"
                type="password"
                placeholder="Password"
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

          {/* STEP 2 */}

          {step === 2 && (
            <>

              <input
                name="phone"
                placeholder="Phone Number"
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