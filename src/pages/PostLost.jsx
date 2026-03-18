import { useState } from "react";
import { addItem } from "../utils/items";
import { findMatches } from "../utils/matchItems";
import { getItems } from "../utils/items";
import { useNavigate } from "react-router-dom";
export default function PostLost() {

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {

    e.preventDefault();
    if(!title || !location || !description || !contact) {
      alert("Please fill all fields");
      return;
    }

    const item = {
      id: Date.now(),
      title,
      location,
      description,
      contact,
      image,
      type: "lost"
    };

    addItem(item);

    const allItems = getItems();

    const matches = findMatches(item, allItems);

    
    if(contact.length !== 10 || !/^\d+$/.test(contact)) {
      alert("Please enter a valid 10-digit contact number");
      return;
    }

     if (matches.length > 0) {
    alert(`⚡ Possible match found with ${matches.length} lost item(s)!`);
  } else {
    alert("Found item reported successfully.");
  }

    setTitle("");
    setLocation("");
    setDescription("");
    setContact("");
    setImage("");
    navigate("/");

  };

  if (!localStorage.getItem("user")) {
    alert("Please login to report lost items");
    window.location.href = "/login";
  }
  const handleImage = (e) => {

    const file = e.target.files[0];
    
    const reader = new FileReader();
    
    reader.onloadend = () => {
    setImage(reader.result);
    };
    
    reader.readAsDataURL(file);
    
    };


  return (


    <div className="min-h-screen bg-slate-950 text-white px-6 py-10">

      {/* PAGE TITLE */}
      <h1 onClick={()=>navigate("/")} className="font-montserrat cursor-pointer font-extrabold text-5xl tracking-tight">
          LosT  <span className="text-blue-500 font-medium text-3xl">& Found</span>
        </h1>

      <h1 className="text-4xl font-bold text-center mb-12">
        Report Lost Item
      </h1>


      {/* FORM */}

      <div className="max-w-4xl mx-auto bg-slate-900 p-8 rounded-xl shadow-lg">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}

          <div>
            <label className="block mb-2">Item Title</label>

            <input
              type="text"
              placeholder="e.g. Black Wallet"
              className="w-full p-3 rounded bg-slate-800 border border-gray-700"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>


          {/* Location */}

          <div>
            <label className="block mb-2">Location Lost</label>

            <input
              type="text"
              placeholder="e.g. SAC, Library"
              className="w-full p-3 rounded bg-slate-800 border border-gray-700"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>


          {/* Description */}

          <div>
            <label className="block mb-2">Description</label>

            <textarea
              placeholder="Describe the item..."
              className="w-full p-3 rounded bg-slate-800 border border-gray-700"
              rows="4"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>


          <div>
            <label className="block mb-2">Contact number</label>

            <input
              type="text"
              placeholder="e.g. Contact number"
              className="w-full p-3 rounded bg-slate-800 border border-gray-700"
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          {/* Image */}

          <div>
            <label className="block mb-2">Upload Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
            />
          </div>


          {/* Submit */}

          <button
            type="submit"
            className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700"
          >
            Submit Report
          </button>

        </form>

      </div>


      {/* LOST ITEMS GRID */}

      <div className="max-w-7xl mx-auto mt-20">

        <h2 className="text-3xl font-bold mb-10 text-center">
          Other Lost Items
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">


          {/* CARD */}

          <div className="bg-slate-800 rounded-xl overflow-hidden hover:scale-105 transition">

            <img
              src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc"
              className="h-40 w-full object-cover"
            />

            <div className="p-4">

              <h3 className="font-semibold">Black Wallet</h3>

              <p className="text-sm text-gray-400">
                Lost near SAC
              </p>

            </div>

          </div>


          <div className="bg-slate-800 rounded-xl overflow-hidden hover:scale-105 transition">

            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8"
              className="h-40 w-full object-cover"
            />

            <div className="p-4">

              <h3 className="font-semibold">Laptop Charger</h3>

              <p className="text-sm text-gray-400">
                Lost near Library
              </p>

            </div>

          </div>


        </div>

      </div>

      {/* <form onSubmit={handleSubmit}>
        <input onChange={(e) => setTitle(e.target.value)} placeholder="Item" />
        <input onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <textarea onChange={(e) => setDescription(e.target.value)} />

        <button type="submit">Submit</button>
      </form> */}
    </div>

  );
}