
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://career-ai-z87n.onrender.com/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setMessage("Account created successfully! Please log in.");
      setForm({ name: "", email: "", password: "" });
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
                  Welcome to CareerAI
                </p>
                <h1 className="text-3xl font-bold">Create Account</h1>
                <p className="mt-2 text-sm text-white/50">
                  Create your account to manage your career journey.
                </p>
              </div>

              <div className="mx-auto max-w-xl rounded-2xl border border-purple-500/20 bg-[#160B23] p-6 md:p-8">
                <h2 className="text-xl font-semibold">Sign Up</h2>
                <p className="mt-2 text-sm text-white/50">
                  Enter your details to get started.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-white/70">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      autoComplete="name"
                      required
                      className="w-full rounded-xl border border-purple-500/20 bg-[#0B0415] px-4 py-3 outline-none focus:border-purple-500"
                    />
                  </div>

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
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      minLength={8}
                      required
                      className="w-full rounded-xl border border-purple-500/20 bg-[#0B0415] px-4 py-3 outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 font-semibold transition hover:opacity-90 disabled:opacity-50"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>

                  {message && (
                    <p role="status" className="break-words text-sm text-purple-300">
                      {message}
                    </p>
                  )}
                </form>

                <p className="mt-6 text-center text-sm text-white/50">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-purple-400 hover:text-purple-300"
                  >
                    Login
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
