import Navbar from "../components/Navbar";
import Footer from "./Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">
          We value your privacy and only use information necessary to support report submission and communication on the platform.
        </p>
        <section className="rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Information We Collect</h2>
          <p className="text-gray-300 leading-relaxed">
            We may collect your name, email, roll number, phone number, and report details to deliver core functionality and to help reunite items with owners.
          </p>
        </section>
        <section className="mt-10 rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">How We Use It</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-300">
            <li>Support item listing and management.</li>
            <li>Enable chat and contact between students.</li>
            <li>Handle issue reports and support requests.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
