import Navbar from "../components/Navbar";
import Footer from "./Footer";

export default function SafetyGuidelines() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-5xl font-bold mb-6">Safety Guidelines</h1>
        <p className="text-gray-400 mb-8">
          Follow these best practices to stay safe while coordinating pickup and dropoff of lost or found items.
        </p>

        <section className="mb-10 rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Safe Meetup Instructions</h2>
          <ul className="space-y-3 text-gray-300 list-decimal list-inside">
            <li>Choose a public, well-lit campus location for exchanges.</li>
            <li>Bring a friend or visit during business hours for added safety.</li>
            <li>Confirm details in chat before meeting in person.</li>
          </ul>
        </section>

        <section className="mb-10 rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Verification Tips</h2>
          <ul className="space-y-3 text-gray-300 list-decimal list-inside">
            <li>Ask for the exact location, item description, or roll number already shared in the report.</li>
            <li>Share only the minimum personal information needed to confirm identity.</li>
            <li>Do not transfer money or share sensitive data for lost item recovery.</li>
          </ul>
        </section>

        <section className="rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Fraud Prevention</h2>
          <ul className="space-y-3 text-gray-300 list-decimal list-inside">
            <li>Verify the report details against the item description before handing anything over.</li>
            <li>If a report feels suspicious, stop communication and report it using the issue page.</li>
            <li>Only use the website messaging channel; outside offers are not supported by the platform.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
