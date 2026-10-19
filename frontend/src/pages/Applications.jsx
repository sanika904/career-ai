
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Applications() {
  const [showForm, setShowForm] = useState(false);
  const [applications, setApplications] = useState(() => {
  const savedApplications = localStorage.getItem("careerAI_applications");
  return savedApplications ? JSON.parse(savedApplications) : [];
});
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    date: "",
    status: "Applied",
    link: "",
  });

  useEffect(() => {
  localStorage.setItem(
    "careerAI_applications",
    JSON.stringify(applications)
  );
}, [applications]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newApplication = {
      ...formData,
      id: Date.now(),
    };

    setApplications([newApplication, ...applications]);

    setFormData({
      company: "",
      role: "",
      date: "",
      status: "Applied",
      link: "",
    });

    setShowForm(false);
  };

  const handleDelete = (id) => {
    setApplications(
      applications.filter((application) => application.id !== id)
    );
  };

  const stats = [
    {
      label: "Total Applications",
      value: applications.length,
      icon: "📄",
    },
    {
      label: "Applied",
      value: applications.filter((app) => app.status === "Applied").length,
      icon: "📨",
    },
    {
      label: "Interview",
      value: applications.filter((app) => app.status === "Interview").length,
      icon: "🎯",
    },
    {
      label: "Offers",
      value: applications.filter((app) => app.status === "Offer").length,
      icon: "🎉",
    },
  ];

  const statusColors = {
    Applied: "bg-blue-500/15 text-blue-300",
    Interview: "bg-purple-500/15 text-purple-300",
    Offer: "bg-green-500/15 text-green-300",
    Rejected: "bg-red-500/15 text-red-300",
  };

  return (
    <div className="min-h-screen bg-[#090014] text-white">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <Navbar />

          <div className="bg-[#0B0415] p-5 text-white md:p-8">
            <div className="mx-auto max-w-7xl space-y-7">
              {/* Page Header */}
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <p className="mb-2 text-sm text-purple-400">
                    Career Management
                  </p>

                  <h1 className="text-3xl font-bold">
                    My Applications
                  </h1>

                  <p className="mt-2 text-sm text-white/50">
                    Track and manage your job applications in one place.
                  </p>
                </div>

                <button
                  onClick={() => setShowForm(!showForm)}
                  className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-5 py-3 font-semibold transition hover:opacity-90"
                >
                  {showForm ? "Cancel" : "+ Add Application"}
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-purple-500/20 bg-[#160B23] p-5"
                  >
                    <div className="mb-3 text-2xl">{stat.icon}</div>

                    <p className="text-3xl font-bold">{stat.value}</p>

                    <p className="mt-1 text-sm text-white/50">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Application Form */}
              {showForm && (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5 rounded-2xl border border-purple-500/20 bg-[#160B23] p-6"
                >
                  <h2 className="text-xl font-semibold">
                    Add New Application
                  </h2>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      name="company"
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="rounded-xl border border-purple-500/20 bg-[#0B0415] px-4 py-3 outline-none focus:border-purple-500"
                    />

                    <input
                      type="text"
                      name="role"
                      placeholder="Job Role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                      className="rounded-xl border border-purple-500/20 bg-[#0B0415] px-4 py-3 outline-none focus:border-purple-500"
                    />

                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="rounded-xl border border-purple-500/20 bg-[#0B0415] px-4 py-3 text-white outline-none focus:border-purple-500"
                    />

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="rounded-xl border border-purple-500/20 bg-[#0B0415] px-4 py-3 text-white outline-none focus:border-purple-500"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>

                    <input
                      type="url"
                      name="link"
                      placeholder="Job Link (optional)"
                      value={formData.link}
                      onChange={handleChange}
                      className="rounded-xl border border-purple-500/20 bg-[#0B0415] px-4 py-3 outline-none focus:border-purple-500 md:col-span-2"
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold transition hover:opacity-90"
                  >
                    Save Application
                  </button>
                </form>
              )}

              {/* Recent Applications */}
              <div className="rounded-2xl border border-purple-500/20 bg-[#160B23] p-5 md:p-6">
                <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Recent Applications
                    </h2>

                    <p className="mt-1 text-sm text-white/50">
                      Keep track of your job application progress.
                    </p>
                  </div>

                  <span className="text-sm text-white/50">
                    {applications.length} applications
                  </span>
                </div>

                {applications.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-purple-500/20 px-5 py-12 text-center">
                    <div className="mb-3 text-4xl">📋</div>

                    <h3 className="text-lg font-medium">
                      No applications yet
                    </h3>

                    <p className="mt-2 text-sm text-white/50">
                      Click “Add Application” to track your first job.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex flex-col justify-between gap-4 rounded-xl border border-purple-500/15 bg-[#0B0415] p-4 md:flex-row md:items-center"
                      >
                        <div className="min-w-0">
                          <h3 className="font-semibold">{app.company}</h3>

                          <p className="mt-1 text-sm text-white/60">
                            {app.role}
                          </p>

                          <p className="mt-2 text-xs text-white/40">
                            Applied on: {app.date}
                          </p>

                          {app.link && (
                            <a
                              href={app.link}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-block text-sm text-purple-400 hover:text-purple-300"
                            >
                              View Job ↗
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <select
                            value={app.status}
                            onChange={(e) =>
                              setApplications(
                                applications.map((item) =>
                                  item.id === app.id
                                    ? { ...item, status: e.target.value }
                                    : item
                                )
                              )
                            }
                            className="rounded-lg border border-purple-500/20 bg-[#160B23] px-3 py-2 text-sm outline-none"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                          </select>

                          <button
                            onClick={() => handleDelete(app.id)}
                            className="rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
