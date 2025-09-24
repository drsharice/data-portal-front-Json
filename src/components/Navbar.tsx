import { NavLink, Link } from "react-router-dom";
import GlobalSearch from "./GlobalSearch";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-black text-white shadow-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        
        {/* Logo with red square */}
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 bg-red-600 rounded-sm"></div>
          <div className="font-bold text-lg text-white">Data Instrumentation</div>
        </div>

        {/* Navigation links */}
        <div className="flex space-x-6 text-sm font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-yellow-400 ${
                isActive ? "text-yellow-400 border-b-2 border-yellow-400" : ""
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/data"
            className={({ isActive }) =>
              `hover:text-yellow-400 ${
                isActive ? "text-yellow-400 border-b-2 border-yellow-400" : ""
              }`
            }
          >
            Data
          </NavLink>
          <NavLink
            to="/apis"
            className={({ isActive }) =>
              `hover:text-yellow-400 ${
                isActive ? "text-yellow-400 border-b-2 border-yellow-400" : ""
              }`
            }
          >
            API
          </NavLink>
          <NavLink
            to="/catalog"
            className={({ isActive }) =>
              `hover:text-yellow-400 ${
                isActive ? "text-yellow-400 border-b-2 border-yellow-400" : ""
              }`
            }
          >
            Catalog
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `hover:text-yellow-400 ${
                isActive ? "text-yellow-400 border-b-2 border-yellow-400" : ""
              }`
            }
          >
            Report
          </NavLink>
        </div>

        {/* Global search + user dropdown */}
        <div className="flex items-center space-x-3 relative">
          <GlobalSearch placeholder="Search..." variant="navbar" />

          <button
            onClick={() => setOpen(!open)}
            className="text-sm text-gray-300 hover:text-yellow-400"
          >
            Welcome, Guest ▾
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/10">
              <Link
                to="/contact"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
