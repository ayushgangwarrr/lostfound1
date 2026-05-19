import Navbar from "../components/Navbar";
import Footer from "./Footer";

export default function CommunityStudents() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-14">
        <h1 className="text-5xl font-bold mb-6">Student Community</h1>
        <p className="text-gray-400 mb-8">
          Join the student network for fast item recovery, friendly coordination, and shared campus support.
        </p>
        <section className="rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Community Interaction</h2>
          <p className="text-gray-300 leading-relaxed">
            Students can browse lost and found listings, message report owners, and respond quickly when items are located.
          </p>
        </section>
        <section className="mt-10 rounded-3xl bg-slate-900 p-8 shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Messaging System</h2>
          <p className="text-gray-300 leading-relaxed">
            Use the built-in conversation tools to arrange safe exchanges and keep item recovery communication centralized.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
