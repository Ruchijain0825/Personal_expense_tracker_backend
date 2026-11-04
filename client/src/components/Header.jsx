
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  const name = user?.name || "User";
  const email = user?.email || "Email not available";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="relative flex h-20 items-center justify-end gap-4 border-b border-gray-100 bg-white px-6">

      {/* Profile */}
      <div className="relative">

        <button
          onClick={() => setShowProfile(!showProfile)}
          className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-gray-100"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-lg font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {name}
            </p>

            <p className="max-w-40 truncate text-xs text-gray-500">
              {email}
            </p>
          </div>

          <span className="text-gray-500">
            {showProfile ? "▲" : "▼"}
          </span>
        </button>

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="absolute right-0 top-16 z-50 w-72 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl">

            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <h3 className="truncate font-bold text-gray-800">
                  {name}
                </h3>

                <p className="truncate text-xs text-gray-500">
                  {email}
                </p>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">
                  Full Name
                </p>
                <p className="font-medium text-gray-700">
                  {name}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  Email Address
                </p>
                <p className="break-all font-medium text-gray-700">
                  {email}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="mt-5 w-full rounded-lg bg-red-50 py-2.5 font-semibold text-red-600 transition hover:bg-red-100"
            >
              Logout
            </button>

          </div>
        )}
      </div>

    
     

    </header>
  );
};

export default Header;
