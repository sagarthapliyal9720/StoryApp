import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "https://storyapp-38sq.onrender.com/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();

      localStorage.setItem("access", data.access);

      navigate("/");
    } catch (error) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D0B12] text-[#F0EBE0] px-4">

      <div className="w-full max-w-md bg-[#161320] border border-yellow-700/20 rounded-2xl p-8 shadow-2xl">

        <h2 className="text-3xl font-serif text-center mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-sm text-gray-400 mb-6">
          Login to continue your story journey
        </p>

        <div className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-xs text-gray-400">
              Email
            </label>

            <input
              className="w-full mt-1 p-3 rounded-lg bg-[#0D0B12] border border-yellow-700/20 focus:border-yellow-400 outline-none"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-400">
              Password
            </label>

            <input
              className="w-full mt-1 p-3 rounded-lg bg-[#0D0B12] border border-yellow-700/20 focus:border-yellow-400 outline-none"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm text-center">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Register */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => !loading && navigate("/register")}
              className="text-yellow-400 cursor-pointer"
            >
              Sign up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}