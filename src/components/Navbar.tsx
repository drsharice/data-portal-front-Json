import { NavLink } from "react-router-dom";
import GlobalSearch from "./GlobalSearch"; // adjust path if needed

function Navbar() {
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

        {/* Global search + guest */}
        <div className="flex items-center space-x-3">
          <GlobalSearch placeholder="Search..." variant="navbar" />
          <span className="text-sm text-gray-300">Welcome, Guest</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
