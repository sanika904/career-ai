import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  Palette,
  Bell,
  ShieldCheck,
  Globe,
  UserRound,
  RotateCcw,
  Check,
  ChevronRight,
  Monitor,
} from "lucide-react";

const defaults = {
  darkMode: true,
  notifications: true,
  emailUpdates: false,
  language: "English",
};

export default function Settings() {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const [notifications, setNotifications] = useState(defaults.notifications);
  const [emailUpdates, setEmailUpdates] = useState(defaults.emailUpdates);
  const [language, setLanguage] = useState(defaults.language);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load logged-in user's settings from MongoDB
  useEffect(() => {
    const loadSettings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please log in to load your settings.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/settings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load settings.");
        }

        setDarkMode(data.darkMode ?? defaults.darkMode);
        setNotifications(data.notifications ?? defaults.notifications);
        setEmailUpdates(data.emailUpdates ?? defaults.emailUpdates);
        setLanguage(data.language ?? defaults.language);
      } catch (error) {
        setMessage(error.message || "Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save one preference to MongoDB
  const saveSetting = async (key, value) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    const setters = {
      darkMode: setDarkMode,
      notifications: setNotifications,
      emailUpdates: setEmailUpdates,
      language: setLanguage,
    };

    const previousValues = {
      darkMode,
      notifications,
      emailUpdates,
      language,
    };

    setters[key](value);
    setMessage("");
    setSaving(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [key]: value }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save settings.");
      }

      setMessage("Your preferences have been saved.");
    } catch (error) {
      setters[key](previousValues[key]);
      setMessage(error.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // Reset preferences and save defaults to MongoDB
  const resetSettings = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to restore the default settings?"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(defaults),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to reset settings.");
      }

      setDarkMode(defaults.darkMode);
      setNotifications(defaults.notifications);
      setEmailUpdates(defaults.emailUpdates);
      setLanguage(defaults.language);
      setMessage("Settings restored to default.");
    } catch (error) {
      setMessage(error.message || "Unable to reset settings.");
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={saving || loading}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition disabled:opacity-50 ${
        checked ? "bg-purple-600" : "bg-white/15"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#090014] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <Navbar />

          <div className="min-h-screen bg-[#0B0415] p-5 md:p-8">
            <div className="mx-auto max-w-5xl space-y-8">

              {/* Header */}
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="mb-3 flex items-center gap-2 text-sm text-purple-400">
                    <Monitor size={16} />
                    <span>WORKSPACE PREFERENCES</span>
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Settings
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/50">
                    Manage your account preferences and personalize your
                    CareerAI experience.
                  </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-purple-500/20 bg-[#160B23] px-4 py-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15">
                    <UserRound className="text-purple-300" size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Account Settings</p>
                    <p className="mt-1 text-xs text-white/45">
                      Manage your preferences
                    </p>
                  </div>
                </div>
              </div>

              {/* Loading */}
              {loading && (
                <p className="text-sm text-purple-300">
                  Loading your settings...
                </p>
              )}

              {/* Success or Error Message */}
              {message && (
                <div
                  role="status"
                  className="flex items-center gap-3 rounded-xl border border-purple-500/20 bg-purple-500/10 p-4 text-sm text-purple-200"
                >
                  <Check size={18} />
                  {message}
                </div>
              )}

              {/* Quick Overview */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-[#160B23] p-5">
                  <Palette size={21} className="mb-4 text-purple-300" />
                  <p className="text-sm text-white/50">Appearance</p>
                  <p className="mt-2 font-semibold">
                    {darkMode ? "Dark theme" : "Light preference"}
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-500/20 bg-[#160B23] p-5">
                  <Bell size={21} className="mb-4 text-blue-300" />
                  <p className="text-sm text-white/50">Notifications</p>
                  <p className="mt-2 font-semibold">
                    {notifications ? "Enabled" : "Disabled"}
                  </p>
                </div>

                <div className="rounded-2xl border border-purple-500/20 bg-[#160B23] p-5">
                  <Globe size={21} className="mb-4 text-cyan-300" />
                  <p className="text-sm text-white/50">Language</p>
                  <p className="mt-2 font-semibold">{language}</p>
                </div>
              </div>

              {/* Appearance */}
              <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#160B23]">
                <div className="flex items-center gap-4 border-b border-white/10 p-5 md:p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15">
                    <Palette size={21} className="text-purple-300" />
                  </div>

                  <div>
                    <h2 className="font-semibold">Appearance</h2>
                    <p className="mt-1 text-sm text-white/45">
                      Customize your visual experience.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 p-5 md:p-6">
                  <div>
                    <p className="font-medium">Dark Mode Preference</p>
                    <p className="mt-1 text-sm leading-5 text-white/45">
                      Save your preferred dark interface setting.
                    </p>
                  </div>

                  <Toggle
                    checked={darkMode}
                    onChange={(value) => saveSetting("darkMode", value)}
                  />
                </div>
              </section>

              {/* Notifications */}
              <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#160B23]">
                <div className="flex items-center gap-4 border-b border-white/10 p-5 md:p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15">
                    <Bell size={21} className="text-blue-300" />
                  </div>

                  <div>
                    <h2 className="font-semibold">Notifications</h2>
                    <p className="mt-1 text-sm text-white/45">
                      Choose your communication preferences.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-white/10">
                  <div className="flex items-center justify-between gap-4 p-5 md:p-6">
                    <div>
                      <p className="font-medium">Application Alerts</p>
                      <p className="mt-1 text-sm text-white/45">
                        Preference for job application updates.
                      </p>
                    </div>

                    <Toggle
                      checked={notifications}
                      onChange={(value) =>
                        saveSetting("notifications", value)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 p-5 md:p-6">
                    <div>
                      <p className="font-medium">Email Updates</p>
                      <p className="mt-1 text-sm text-white/45">
                        Preference for career tips and product updates.
                      </p>
                    </div>

                    <Toggle
                      checked={emailUpdates}
                      onChange={(value) =>
                        saveSetting("emailUpdates", value)
                      }
                    />
                  </div>
                </div>
              </section>

              {/* Language */}
              <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#160B23]">
                <div className="flex items-center gap-4 border-b border-white/10 p-5 md:p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15">
                    <Globe size={21} className="text-cyan-300" />
                  </div>

                  <div>
                    <h2 className="font-semibold">Language & Region</h2>
                    <p className="mt-1 text-sm text-white/45">
                      Select your preferred language.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center md:p-6">
                  <div>
                    <p className="font-medium">Display Language</p>
                    <p className="mt-1 text-sm text-white/45">
                      Your preference is saved to your account.
                    </p>
                  </div>

                  <select
                    value={language}
                    disabled={saving || loading}
                    onChange={(e) => saveSetting("language", e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0B0415] px-4 py-3 text-sm outline-none transition focus:border-purple-500 disabled:opacity-50"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Marathi">Marathi</option>
                  </select>
                </div>
              </section>

              {/* Privacy */}
              <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#160B23]">
                <div className="flex items-center gap-4 border-b border-white/10 p-5 md:p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15">
                    <ShieldCheck size={21} className="text-emerald-300" />
                  </div>

                  <div>
                    <h2 className="font-semibold">Privacy & Security</h2>
                    <p className="mt-1 text-sm text-white/45">
                      Information about your saved preferences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-5 md:p-6">
                  <ShieldCheck
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-300"
                  />

                  <div>
                    <p className="font-medium">Account Preference Storage</p>
                    <p className="mt-2 text-sm leading-6 text-white/45">
                      Your preferences are saved to your account through the
                      server. Keep your login credentials private and log out
                      when using a shared device.
                    </p>
                  </div>
                </div>
              </section>

              {/* Reset Settings */}
              <section className="flex flex-col justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-5 sm:flex-row sm:items-center md:p-6">
                <div className="flex items-start gap-3">
                  <RotateCcw
                    size={20}
                    className="mt-1 shrink-0 text-red-300"
                  />

                  <div>
                    <h2 className="font-semibold">Reset Preferences</h2>
                    <p className="mt-1 text-sm leading-5 text-white/45">
                      Restore your saved settings to their defaults.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={saving || loading}
                  onClick={resetSettings}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-400/25 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  Reset Settings
                  <ChevronRight size={16} />
                </button>
              </section>

              <p className="pb-3 text-center text-xs text-white/30">
                CareerAI · Personalize your career workspace
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
