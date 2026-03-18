import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getItems } from "../utils/items";

export default function Reporteditem() {

  const [myItems, setMyItems] = useState([]);

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    const items = getItems();

    const filteredItems = items.filter(
      (item) => item.contact === user?.contact
    );

    setMyItems(filteredItems);

  }, []);

  return (

    <div className="min-h-screen bg-slate-950 text-white p-6">

      <Navbar />

      <h1 className="text-5xl mb-10 text-center">
        My Reported Items
      </h1>

      {myItems.length === 0 ? (

        <p className="text-center text-gray-400">
          You haven't reported any items yet.
        </p>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {myItems.map((item) => (

            <div
              key={item.id}
              className="bg-slate-800 rounded-xl overflow-hidden hover:scale-105 transition shadow-lg"
            >

              {item.image && (
                <img
                  src={item.image}
                  className="h-40 w-full object-cover"
                />
              )}

              <div className="p-4">

                <h3 className="font-semibold text-lg">
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm">
                  {item.location}
                </p>

                <p className="text-gray-500 text-xs mt-2">
                  {item.type}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}
