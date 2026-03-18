import Navbar from "./Navbar";
import Footer from "../pages/Footer";

export default function HowItWorks() {
  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-20">

        <h1 className="text-4xl font-bold mb-8 text-blue-500">
          How It Works
        </h1>

        <p className="text-gray-300 mb-10">
          The Lost & Found platform helps students reconnect with their
          belongings easily. Follow these simple steps to report or recover items.
        </p>

        <div className="space-y-6">

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">
              1. Report a Lost Item
            </h2>
            <p className="text-gray-400">
              If you lose something on campus, go to the "Report Lost" section
              and fill in details like item name, location, and description.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">
              2. Report a Found Item
            </h2>
            <p className="text-gray-400">
              If you find an item on campus, post it in the "Report Found"
              section so the rightful owner can identify and claim it.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">
              3. Browse Items
            </h2>
            <p className="text-gray-400">
              Use the "Browse Items" page to search through recently reported
              lost and found items on campus.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">
              4. Contact the Owner
            </h2>
            <p className="text-gray-400">
              If you find your item or recognize something, click the
              "Contact Owner" button to connect with the person who posted it.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">
              5. Recover Your Item
            </h2>
            <p className="text-gray-400">
              Arrange a safe meeting point on campus and successfully recover
              the lost item.
            </p>
          </div>

        </div>

      </div>

      <Footer />

    </div>
  );
}
