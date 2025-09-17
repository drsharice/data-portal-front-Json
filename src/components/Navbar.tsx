import { NavLink } from "react-router-dom";

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

        {/* Search bar + guest */}
        <div className="flex items-center space-x-3">
          <input
            type="text"
            placeholder="Search..."
            className="rounded px-3 py-1 text-sm text-white bg-gray-800 border border-gray-700 focus:outline-none"
          />
          <button
            type="button"
            className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:brightness-110"
          >
            Search
          </button>
          <span className="text-sm text-gray-300">Welcome, Guest</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
