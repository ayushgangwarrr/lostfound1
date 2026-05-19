import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main className="flex min-h-[calc(100vh-160px)] flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-7xl font-bold mb-4">404</h1>
        <p className="text-gray-400 mb-6">Nothing to see here. The page you are looking for does not exist.</p>
        <Link to="/" className="rounded-2xl bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-500 transition">
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
