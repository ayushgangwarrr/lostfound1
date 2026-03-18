import { useEffect, useState } from "react";
import { getItems } from "../utils/items";
import DashboardCards from "../components/DashboardCards";
import Navbar from "../components/Navbar";

export default function Dashboard() {

  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getItems());
  }, []);

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <Navbar />

      <h1 className="text-5xl mb-8">
        DashBoard
      </h1>

      {/* ITEMS GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {items.map(item => (

          <div
            key={item.id}
            className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition"
          >

            {/* IMAGE */}

            <img
              src={item.image ? item.image : "https://via.placeholder.com/300"}
              alt={item.title}
              className="w-full h-40 object-cover"
            />

            {/* CONTENT */}

            <div className="p-4 space-y-2">

              <h3 className="font-semibold text-lg">
                {item.title}
              </h3>

              <p className="text-sm text-gray-400">
                {item.location}
              </p>

              <p className="text-xs text-blue-400 uppercase">
                {item.type}
              </p>

              {/* CONTACT BUTTON */}

              <button
                onClick={() => alert("Contact: " + item.contact)}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm w-full mt-2"
              >
                Contact Owner
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* EXTRA DASHBOARD CARDS */}

      <div className="mt-12">
        <DashboardCards />
      </div>
      <button
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        className="bg-red-600 px-4 py-2 rounded"
      >
        Clear Data
      </button>
    </div>

  );
}