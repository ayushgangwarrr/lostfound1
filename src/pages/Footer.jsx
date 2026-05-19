import { NavLink } from "react-router-dom";
import { useEffect } from "react";
function Footer() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const footerLinkClass = ({ isActive }) =>
    `block transition hover:text-blue-500 ${isActive ? "text-blue-400 font-semibold" : "text-gray-300"}`;
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
              <NavLink className={footerLinkClass} to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/browse">
                Browse Items
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/report-lost">
                Report Lost
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/report-found">
                Report Found
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/dashboard">
                Dashboard
              </NavLink>
            </li>
          </ul>
        </div>


        {/* Campus Locations */}

        <div>
          <h3 className="font-semibold text-white mb-4">POPULAR LOCATIONS</h3>

          <ul className="space-y-2 text-sm">
            <li>
              <NavLink className={footerLinkClass} to="/browse?location=library">
                Library
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/browse?location=lecture-halls">
                Lecture Halls
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/browse?location=sac">
                Student Activity Centre
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/browse?location=hostels">
                Hostels
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/browse?location=cafeteria">
                Campus Cafeteria
              </NavLink>
            </li>
          </ul>
        </div>


        {/* Resources */}

        <div>
          <h3 className="font-semibold text-white mb-4">RESOURCES</h3>

          <ul className="space-y-2 text-sm">
            <li>
              <NavLink className={footerLinkClass} to="/how-it-works">
                How It Works
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/safety-guidelines">
                Safety Guidelines
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/community/rules">
                Community Rules
              </NavLink>
            </li>
          </ul>

          <h3 className="font-semibold text-white mt-6 mb-4">CONTACT</h3>

          <ul className="space-y-2 text-sm">
            <li>
              <NavLink className={footerLinkClass} to="/support">
                Support
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/report-issue">
                Report Issue
              </NavLink>
            </li>
          </ul>
        </div>


        {/* About */}

        <div>
          <h3 className="font-semibold text-white mb-4">ABOUT</h3>

          <ul className="space-y-2 text-sm">
            <li>
              <NavLink className={footerLinkClass} to="/about">
                About Platform
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/privacy-policy">
                Privacy Policy
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/terms">
                Terms of Use
              </NavLink>
            </li>
          </ul>

          <h3 className="font-semibold text-white mt-6 mb-4">COMMUNITY</h3>

          <ul className="space-y-2 text-sm">
            <li>
              <NavLink className={footerLinkClass} to="/community/students">
                Students
              </NavLink>
            </li>
            <li>
              <NavLink className={footerLinkClass} to="/community/helpdesk">
                Campus Help Desk
              </NavLink>
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