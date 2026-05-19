import Navbar from "../components/Navbar";
import Footer from "./Footer";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-5xl font-bold mb-6">How It Works</h1>
        <p className="text-gray-400 mb-8">
          Lost & Found helps students report missing items, share found belongings, and connect safely on campus.
        </p>

        <section className="mb-10 rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Report a Lost Item</h2>
          <p className="text-gray-400 leading-relaxed">
            Fill in the item details, location, and your contact information. Once submitted, the entry is visible to the campus community and searchable in the browse section.
          </p>
          <ul className="mt-4 space-y-2 text-gray-300 list-disc list-inside">
            <li>Enter the item name, location and description clearly.</li>
            <li>Provide a contact number and roll number for faster recovery.</li>
            <li>Upload a photo when available for quick recognition.</li>
          </ul>
        </section>

        <section className="mb-10 rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Report a Found Item</h2>
          <p className="text-gray-400 leading-relaxed">
            Share found belongings so the original owner can locate them. The platform notifies interested students and helps match reports with lost items.
          </p>
          <ul className="mt-4 space-y-2 text-gray-300 list-disc list-inside">
            <li>Provide the location where the item was found and a clear description.</li>
            <li>Use the browse filters to match returned items with open lost reports.</li>
            <li>Keep communication within the app to protect student privacy.</li>
          </ul>
        </section>

        <section className="rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Contact and Messaging</h2>
          <p className="text-gray-400 leading-relaxed">
            Message report owners directly, arrange pickup details, and confirm safe handover on campus. Use the built-in chat to keep conversations organized and documented.
          </p>
          <ul className="mt-4 space-y-2 text-gray-300 list-disc list-inside">
            <li>Open a conversation from the item details page when you want to contact a reporter.</li>
            <li>Use the messages page to track all threads and unread replies.</li>
            <li>Choose a public campus location for meetups and stay aware of common safety practices.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
