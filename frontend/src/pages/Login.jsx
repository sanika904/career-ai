
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (error) {
      setMessage(error.message || "Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090014] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <Navbar />

          <div className="bg-[#0B0415] p-5 md:p-8">
            <div className="mx-auto max-w-7xl space-y-7">
              <div>
                <p className="mb-2 text-sm text-purple-400">
                  Welcome Back
                </p>

                <h1 className="text-3xl font-bold">
                  Login to CareerAI
                </h1>

                <p className="mt-2 text-sm text-white/50">
                  Continue your career preparation journey.
                </p>
              </div>

              <div className="mx-auto max-w-xl rounded-2xl border border-purple-500/20 bg-[#160B23] p-6 md:p-8">
                <h2 className="text-xl font-semibold">Welcome Back!</h2>

                <p className="mt-2 text-sm text-white/50">
                  Enter your account details to continue.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                      className="w-full rounded-xl border border-purple-500/20 bg-[#0B0415] px-4 py-3 outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-purple-500/20 bg-[#0B0415] px-4 py-3 outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 font-semibold transition hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  {message && (
                    <p role="alert" className="break-words text-sm text-red-300">
                      {message}
                    </p>
                  )}
                </form>

                <p className="mt-6 text-center text-sm text-white/50">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-purple-400 hover:text-purple-300"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
