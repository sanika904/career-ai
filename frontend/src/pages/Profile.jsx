
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  BriefcaseBusiness,
  Code2,
  Pencil,
  Save,
  X,
  CheckCircle2,
} from "lucide-react";

const initialProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  education: "",
  college: "",
  skills: "",
  goal: "Software Developer",
};

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch logged-in user's profile from MongoDB
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setMessage("Please log in to view your profile.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://career-ai-z87n.onrender.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load profile.");
        }

        const loadedProfile = {
          ...initialProfile,
          ...data,
        };

        setProfile(loadedProfile);
        setSavedProfile(loadedProfile);
      } catch (error) {
        setMessage(error.message || "Unable to connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateField = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Save profile to MongoDB
  const saveProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in first.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "https://career-ai-z87n.onrender.com/api/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update profile.");
      }

      const updatedProfile = {
        ...profile,
        ...(data.user || {}),
      };

      setProfile(updatedProfile);
      setSavedProfile(updatedProfile);
      setEditing(false);
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage(error.message || "Unable to connect to server.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = () => {
    setProfile(savedProfile);
    setEditing(false);
    setMessage("");
  };

  const fields = [
    { label: "Full Name", name: "name", icon: UserRound, required: true },
    { label: "Email Address", name: "email", icon: Mail, type: "email" },
    { label: "Phone Number", name: "phone", icon: Phone, type: "tel" },
    { label: "Location", name: "location", icon: MapPin },
    { label: "Education", name: "education", icon: GraduationCap },
    { label: "College / University", name: "college", icon: GraduationCap },
    { label: "Career Goal", name: "goal", icon: BriefcaseBusiness },
  ];

  const completedFields = [
    profile.name,
    profile.email,
    profile.phone,
    profile.location,
    profile.education,
    profile.college,
    profile.skills,
    profile.goal,
  ].filter((value) => String(value || "").trim() !== "").length;

  const completion = Math.round((completedFields / 8) * 100);

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-[#0B0415] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-purple-500";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090014] p-8 text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090014] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <Navbar />

          <div className="min-h-screen bg-[#0B0415] p-5 md:p-8">
            <div className="mx-auto max-w-5xl space-y-7">

              {/* Page Header */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="mb-2 text-sm text-purple-400">
                    ACCOUNT MANAGEMENT
                  </p>
                  <h1 className="text-3xl font-bold md:text-4xl">
                    My Profile
                  </h1>
                  <p className="mt-2 text-sm text-white/50">
                    Manage your personal information and career details.
                  </p>
                </div>

                {!editing && (
                  <button
                    onClick={() => {
                      setMessage("");
                      setEditing(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 text-sm font-semibold transition hover:opacity-90"
                  >
                    <Pencil size={16} />
                    Edit Profile
                  </button>
                )}
              </div>

              {message && (
                <div className="flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-500/10 p-4 text-sm text-purple-200">
                  <CheckCircle2 size={18} />
                  {message}
                </div>
              )}

              {/* Profile Summary */}
              <section className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-[#211033] via-[#160B23] to-[#10081b] p-6 md:p-8">
                <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-purple-600/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-purple-400/30 bg-gradient-to-br from-purple-500 to-blue-600 text-3xl font-bold shadow-lg shadow-purple-950/30">
                    {profile.name.trim()
                      ? profile.name.trim().charAt(0).toUpperCase()
                      : "U"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold">
                        {profile.name || "Your Name"}
                      </h2>
                      <span className="rounded-full border border-purple-400/20 bg-purple-500/10 px-3 py-1 text-xs text-purple-300">
                        Student
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-white/55">
                      {profile.goal || "Set your career goal"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/45">
                      {profile.email && (
                        <span className="flex items-center gap-2">
                          <Mail size={15} />
                          {profile.email}
                        </span>
                      )}

                      {profile.location && (
                        <span className="flex items-center gap-2">
                          <MapPin size={15} />
                          {profile.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/10 px-5 py-4 sm:min-w-36">
                    <p className="text-sm text-white/45">Profile Status</p>
                    <p className="mt-2 text-xl font-bold text-purple-300">
                      {completion}%
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-white/40">Complete</p>
                  </div>
                </div>
              </section>

              {/* Profile Details */}
              <form onSubmit={saveProfile} className="space-y-6">
                <section className="rounded-2xl border border-white/10 bg-[#160B23] p-5 md:p-7">
                  <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15">
                      <UserRound size={21} className="text-purple-300" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Personal Information</h2>
                      <p className="mt-1 text-sm text-white/45">
                        Your basic contact and education details.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {fields.map((field) => {
                      const Icon = field.icon;

                      return (
                        <label key={field.name} className="block">
                          <span className="flex items-center gap-2 text-sm font-medium text-white/75">
                            <Icon size={15} className="text-purple-300" />
                            {field.label}
                          </span>

                          {editing ? (
                            <input
                              name={field.name}
                              type={field.type || "text"}
                              value={profile[field.name] || ""}
                              onChange={updateField}
                              required={field.required}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                              className={inputClass}
                            />
                          ) : (
                            <div className="mt-2 min-h-12 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 text-sm text-white/80 break-words">
                              {profile[field.name] || "Not added yet"}
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </section>

                {/* Skills */}
                <section className="rounded-2xl border border-white/10 bg-[#160B23] p-5 md:p-7">
                  <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15">
                      <Code2 size={21} className="text-blue-300" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Technical Skills</h2>
                      <p className="mt-1 text-sm text-white/45">
                        List your skills separated by commas.
                      </p>
                    </div>
                  </div>

                  {editing ? (
                    <textarea
                      name="skills"
                      value={profile.skills || ""}
                      onChange={updateField}
                      rows={3}
                      placeholder="Java, React.js, SQL..."
                      className={inputClass}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {(profile.skills || "")
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean)
                        .map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-3 py-2 text-sm text-purple-200"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  )}
                </section>

                {/* Actions */}
                {editing && (
                  <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={cancelEditing}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5 disabled:opacity-50"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
                    >
                      <Save size={16} />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </form>

              <p className="pb-3 text-center text-xs text-white/30">
                CareerAI · Your career journey, organized.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
