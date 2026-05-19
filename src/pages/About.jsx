import Navbar from "../components/Navbar";
import Footer from "./Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-5xl font-bold mb-6">About Platform</h1>
        <p className="text-gray-400 mb-8">
          Lost & Found is a campus-first reporting platform built to help students reconnect with misplaced items quickly and securely.
        </p>
        <section className="rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            We make it easier for students to report lost items, share found belongings, and communicate in a trusted campus environment.
            The platform combines searchable reports, location filters, and messaging to keep item recovery fast and transparent.
          </p>
        </section>
        <section className="mt-10 rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">What We Offer</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-300">
            <li>Fast reporting for lost and found items.</li>
            <li>Searchable campus-wide item listings.</li>
            <li>Built-in messaging for safe coordination.</li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
