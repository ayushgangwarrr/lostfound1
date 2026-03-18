import Navbar from "./Navbar";
import Footer from "../pages/Footer";

export default function CommunityRules() {
  return (

    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-20">

        <h1 className="text-4xl font-bold mb-8 text-blue-500">
          Community Rules
        </h1>

        <p className="text-gray-300 mb-10">
          Our Lost & Found platform is built to help students reconnect with their
          belongings. To keep the platform safe and helpful for everyone,
          please follow these community rules.
        </p>

        <div className="space-y-6">

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">
              1. Post Genuine Items Only
            </h2>
            <p className="text-gray-400">
              Only report items that are truly lost or found on campus. Fake
              reports or misleading information are not allowed.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">
              2. Respect Other Users
            </h2>
            <p className="text-gray-400">
              Be polite and respectful when communicating with others. The
              platform is meant to support a helpful campus community.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">
              3. Protect Personal Information
            </h2>
            <p className="text-gray-400">
              Do not share sensitive personal information publicly. Use the
              contact option responsibly when connecting with other users.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">
              4. Verify Ownership
            </h2>
            <p className="text-gray-400">
              Before returning an item, make sure the person claiming it can
              correctly describe it to confirm ownership.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
            <h2 className="text-xl font-semibold mb-2">
              5. Meet in Safe Locations
            </h2>
            <p className="text-gray-400">
              Always arrange item returns in safe and public places on campus
              such as the library, lecture halls, or student activity center.
            </p>
          </div>

        </div>

      </div>

      <Footer />

    </div>

  );
}