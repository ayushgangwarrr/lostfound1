import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {

  const [profile, setProfile] = useState({
    name: "",
    roll: "",
    branch: "",
    email: "",
    phone: "",
    contact: "",
    photo: ""
  });
  

  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profile"));
    if (savedProfile) {
      setProfile(savedProfile);
    }
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile({ ...profile, photo: reader.result });
    };

    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    localStorage.setItem("profile", JSON.stringify(profile));
    alert("Profile saved!");
  };
const navigate = useNavigate();
  return (

    <div className="min-h-screen bg-slate-950 text-white flex justify-center items-center px-6">
 
      <div className="w-full max-w-3xl bg-slate-900 rounded-xl p-8 shadow-lg">
      <h1 onClick={() => navigate("/")} className="font-montserrat cursor-pointer font-extrabold text-5xl tracking-tight">
          LosT  <span className="text-blue-500 font-medium text-3xl">& Found</span>
        </h1>

        {/* Profile Photo */}

        <div className="flex flex-col items-center mb-8">

          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500">

            {profile.photo ? (
              <img
                src={profile.photo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-slate-800">
                Photo
              </div>
            )}

          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="mt-3 text-sm"
          />

        </div>


        {/* Profile Fields */}

        <div className="grid md:grid-cols-2 gap-6">

          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="p-3 rounded bg-slate-800"
          />

          <input
            name="roll"
            value={profile.roll}
            onChange={handleChange}
            placeholder="Roll Number"
            className="p-3 rounded bg-slate-800"
          />

          <input
            name="branch"
            value={profile.branch}
            onChange={handleChange}
            placeholder="Branch"
            className="p-3 rounded bg-slate-800"
          />

          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            placeholder="Gmail"
            className="p-3 rounded bg-slate-800"
          />

          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="p-3 rounded bg-slate-800"
          />

          <input
            name="contact"
            value={profile.contact}
            onChange={handleChange}
            placeholder="Other Contact Details"
            className="p-3 rounded bg-slate-800"
          />

        </div>

        {/* Save Button */}

        <button
          onClick={handleSave}
          className="mt-8 w-full bg-blue-600 py-3 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>

      </div>

    </div>
  );
}