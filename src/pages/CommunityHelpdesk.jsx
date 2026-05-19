import Navbar from "../components/Navbar";
import Footer from "./Footer";

export default function CommunityHelpdesk() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-5xl font-bold mb-6">Campus Help Desk</h1>
        <p className="text-gray-400 mb-8">
          The help desk is available for campus support, safety guidance, and help resolving questions about the platform.
        </p>
        <section className="rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Support Resources</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-300">
            <li>Get help with lost item coordination and safe meetups.</li>
            <li>Find official campus contact details for urgent support.</li>
            <li>Report suspicious or fraudulent behavior to campus authorities.</li>
          </ul>
        </section>
        <section className="mt-10 rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Contact Information</h2>
          <p className="text-gray-300 leading-relaxed">
            Visit the campus help desk in person or use the platform support channels to get prompt assistance.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
