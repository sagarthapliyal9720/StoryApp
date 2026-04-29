import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("access"));
  const [isDark, setIsDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    checkTokenExpiry();
  }, []);

  const checkTokenExpiry = () => {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) {
      setToken(null);
      return;
    }

    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      const currentTime = Date.now() / 1000;

      if (payload.exp < currentTime) {
        handleLogout();
      } else {
        setToken(accessToken);
      }
    } catch {
      handleLogout();
    }
  };

  const handleProtectedNavigation = (path) => {
    const accessToken = localStorage.getItem("access");

    if (!accessToken) return navigate("/login");

    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null);
    navigate("/login");
    setOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    setIsDark(!isDark);
  };

  return (
    <div className="w-full bg-gray-900 text-white shadow-md border-b border-gray-700">

      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">

        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="text-xl font-bold text-blue-400 cursor-pointer"
        >
          Story App
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <button onClick={() => navigate("/")} className="hover:text-blue-400">
            Home
          </button>

          <button onClick={() => handleProtectedNavigation("/bookmark")} className="hover:text-blue-400">
            Bookmarks
          </button>

          <button onClick={() => handleProtectedNavigation("/post")} className="hover:text-blue-400">
            Create Story
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* theme */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1 border border-gray-600 rounded text-sm hover:bg-gray-800"
          >
            {isDark ? "☀" : "🌙"}
          </button>

          {/* auth buttons (desktop) */}
          {token ? (
            <button
              onClick={handleLogout}
              className="hidden md:block px-3 py-1 bg-red-500 rounded text-sm"
            >
              Logout
            </button>
          ) : (
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1 border rounded text-sm hover:bg-gray-800"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-3 py-1 bg-blue-500 rounded text-sm"
              >
                Register
              </button>
            </div>
          )}

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700 px-4 py-3 space-y-2">

          <button onClick={() => handleProtectedNavigation("/")} className="block w-full text-left">
            Home
          </button>

          <button onClick={() => handleProtectedNavigation("/bookmark")} className="block w-full text-left">
            Bookmarks
          </button>

          <button onClick={() => handleProtectedNavigation("/post")} className="block w-full text-left">
            Create Story
          </button>

          <hr className="border-gray-600" />

          {token ? (
            <button
              onClick={handleLogout}
              className="text-red-400 block w-full text-left"
            >
              Logout
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/login")} className="block w-full text-left">
                Login
              </button>

              <button onClick={() => navigate("/register")} className="block w-full text-left">
                Register
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}