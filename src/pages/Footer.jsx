import { Link } from "react-router-dom";

import { useEffect } from "react";
function Footer() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <footer className="bg-slate-900 text-gray-300 pt-16 pb-10">

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Platform Info */}

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Lost & Found</h2>

          <p className="text-sm leading-relaxed">
            Lost & Found is a campus platform designed to help students report
            lost items and return found belongings quickly and safely.
          </p>

          <p className="text-sm mt-4">
            Our goal is to reconnect students with their valuable belongings
            and build a helpful campus community.
          </p>
        </div>


        {/* Quick Links */}

        <div>
          <h3 className="font-semibold text-white mb-4">QUICK LINKS</h3>

          <ul className="space-y-2 text-sm">
          <li>
              <Link
                className="hover:text-blue-500 transition"
                to="/"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-blue-500 transition"
                to="/items"
              >
                Browse Items
              </Link>
            </li>

            <li>
              <Link
                className="hover:text-blue-500 transition"
                to="/report-lost"
              >
                Report Lost
              </Link>
            </li>

            <li>
              <Link
                className="hover:text-blue-500 transition"
                to="/report-found"
              >
                Report Found
              </Link>
            </li>

            <li>
              <Link
                className="hover:text-blue-500 transition"
                to="/dashboard"
              >
                Dashboard
              </Link>
            </li>

          </ul>
        </div>


        {/* Campus Locations */}

        <div>
          <h3 className="font-semibold text-white mb-4">POPULAR LOCATIONS</h3>

          <ul className="space-y-2 text-sm">

            <li className="hover:text-blue-500 cursor-pointer">Library</li>
            <li className="hover:text-blue-500 cursor-pointer">Lecture Halls</li>
            <li className="hover:text-blue-500 cursor-pointer">Student Activity Centre</li>
            <li className="hover:text-blue-500 cursor-pointer">Hostels</li>
            <li className="hover:text-blue-500 cursor-pointer">Campus Cafeteria</li>

          </ul>
        </div>


        {/* Resources */}

        <div>
          <h3 className="font-semibold text-white mb-4">RESOURCES</h3>

          <ul className="space-y-2 text-sm">

            <li className="hover:text-blue-500 cursor-pointer"> <Link to="/work">
              How It Works
            </Link></li>
            <li className="hover:text-blue-500 cursor-pointer"><Link to="/Guide">
              Safety Guidelines
            </Link></li>
            <li className="hover:text-blue-500 cursor-pointer"> <Link to="/Rules">
              Community Rules
            </Link></li>

          </ul>

          <h3 className="font-semibold text-white mt-6 mb-4">CONTACT</h3>

          <ul className="space-y-2 text-sm">

            <li className="hover:text-blue-500 cursor-pointer">Support</li>
            <li className="hover:text-blue-500 cursor-pointer">Report Issue</li>

          </ul>
        </div>


        {/* About */}

        <div>
          <h3 className="font-semibold text-white mb-4">ABOUT</h3>

          <ul className="space-y-2 text-sm">

            <li className="hover:text-blue-500 cursor-pointer">About Platform</li>
            <li className="hover:text-blue-500 cursor-pointer">Privacy Policy</li>
            <li className="hover:text-blue-500 cursor-pointer">Terms of Use</li>

          </ul>

          <h3 className="font-semibold text-white mt-6 mb-4">COMMUNITY</h3>

          <ul className="space-y-2 text-sm">

            <li className="hover:text-blue-500 cursor-pointer">
              <a
                href="https://www.nitrkl.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Students
              </a>
            </li>

            <li className="hover:text-blue-500 cursor-pointer">
              <a
                href="https://www.nitrkl.ac.in/CDC/ContactUs/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Campus Help Desk
              </a>
            </li>

          </ul>
        </div>

      </div>


      {/* Bottom Section */}

      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm group text-gray-400 px-6">
        © 2026 Lost & Found - NIT Rourkela. Helping students recover lost items.
        <h1 className="test-right leading-tight">AYUSH GANGWAR</h1>
      </div>

      

    </footer>
  );
}

export default Footer;