import Navbar from "../components/Navbar";
import Footer from "./Footer";

export default function CommunityRules() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-5xl font-bold mb-6">Community Rules</h1>
        <p className="text-gray-400 mb-8">
          Help keep the campus lost and found community trustworthy, respectful, and useful for everyone.
        </p>

        <section className="mb-10 rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Respectful Use</h2>
          <ul className="space-y-3 text-gray-300 list-disc list-inside">
            <li>Be polite and professional in all conversations.</li>
            <li>Use the platform only for genuine lost and found activity.</li>
            <li>Keep messages relevant to the item and exchange details.</li>
          </ul>
        </section>

        <section className="mb-10 rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">No Fake Reports</h2>
          <p className="text-gray-400 leading-relaxed">
            False or misleading reports reduce trust and waste time. Always provide accurate item details and location information.
          </p>
        </section>

        <section className="rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Proper Reporting Ethics</h2>
          <ul className="space-y-3 text-gray-300 list-disc list-inside">
            <li>Report items honestly, including any limitations or missing details.</li>
            <li>Update or remove your report once an item is returned.</li>
            <li>Avoid sharing unnecessary personal information in public reports.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
