import Navbar from "../components/Navbar";
import Footer from "./Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-5xl font-bold mb-6">Terms of Use</h1>
        <p className="text-gray-400 mb-8">
          By using Lost & Found, you agree to follow community guidelines and use the platform responsibly.
        </p>
        <section className="rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Use of the Platform</h2>
          <p className="text-gray-300 leading-relaxed">
            The service is for reporting lost or found campus items. Misuse, false reporting, or abusive behavior may result in account restrictions.
          </p>
        </section>
        <section className="mt-10 rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">User Responsibilities</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-300">
            <li>Provide accurate information in all reports.</li>
            <li>Respect privacy and safety during item coordination.</li>
            <li>Do not use the site for fraudulent or commercial activity.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
