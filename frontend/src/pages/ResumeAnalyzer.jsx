import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  X,
  LoaderCircle,
  ArrowLeft,
  TrendingUp,
  Target,
  Lightbulb,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function ResumeAnalyzer() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setSelectedFile(file);
      setAnalysisComplete(false);
      setResumeText("");
      setAnalysis(null);
      setError("");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setAnalysisComplete(false);
    setResumeText("");
    setAnalysis(null);
    setError("");
  };

  const analyzeResume = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisComplete(false);
    setError("");

    try {
      const formData = new FormData();
      formData.append("resume", selectedFile);

      const response = await fetch(
        "http://localhost:5000/api/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to analyze resume");
      }

      setResumeText(data.text);
      localStorage.setItem("careerAI_resumeText", data.text);
      setAnalysis(data.analysis);
      setAnalysisComplete(true);
    } catch (error) {
      console.error("Resume analysis error:", error);

      setError(
        "Unable to analyze resume. Please make sure the backend is running."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#090014] text-white">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Area */}
      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="px-5 py-7 sm:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white/60 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          {/* Page Header */}
          <div className="mb-7">
            <div className="mb-3 flex items-center gap-2 text-purple-400">
              <Sparkles size={20} />

              <span className="text-sm font-medium">
                AI Career Intelligence
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              AI Resume Analyzer
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Upload your resume and get AI-powered insights about your
              resume quality, ATS compatibility, skills, and improvements.
            </p>
          </div>

          {/* Upload Section */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Upload size={20} />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Upload Resume
                  </h2>

                  <p className="text-xs text-white/40">
                    PDF format recommended
                  </p>
                </div>
              </div>

              {!selectedFile ? (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-purple-500/30 bg-purple-500/[0.03] px-6 py-14 text-center transition hover:border-purple-400/50 hover:bg-purple-500/[0.06]">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                    <Upload size={25} />
                  </div>

                  <p className="text-sm font-medium">
                    Click to upload your resume
                  </p>

                  <p className="mt-2 text-xs text-white/35">
                    PDF files only
                  </p>

                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="rounded-2xl border border-purple-500/20 bg-purple-500/[0.05] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                        <FileText size={22} />
                      </div>

                      <div>
                        <p className="text-sm font-medium">
                          {selectedFile.name}
                        </p>

                        <p className="mt-1 text-xs text-white/35">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={removeFile}
                      className="rounded-lg p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <button
                    onClick={analyzeResume}
                    disabled={isAnalyzing}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 text-sm font-semibold transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isAnalyzing ? (
                      <>
                        <LoaderCircle
                          size={18}
                          className="animate-spin"
                        />
                        Analyzing Resume...
                      </>
                    ) : (
                      <>
                        <Sparkles size={18} />
                        Analyze Resume
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* AI Features */}
            <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/10 p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Sparkles size={20} />
              </div>

              <h2 className="text-lg font-semibold">
                What AI analyzes
              </h2>

              <div className="mt-5 space-y-4">
                <InfoItem text="Resume quality and overall structure" />
                <InfoItem text="ATS compatibility and keywords" />
                <InfoItem text="Technical skills and role alignment" />
                <InfoItem text="Personalized improvement suggestions" />
              </div>
            </div>
          </div>

          {/* Results */}
          {analysisComplete && analysis && (
            <div className="mt-7">
              {/* Result Header */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 size={20} />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-emerald-400">
                    Resume Processed
                  </p>

                  <h2 className="mt-1 text-xl font-semibold">
                    AI Analysis Complete
                  </h2>
                </div>
              </div>

              {/* Scores */}
              <div className="grid gap-4 md:grid-cols-3">
                <ScoreCard
                  title="Resume Score"
                  value={analysis.resumeScore}
                  icon={TrendingUp}
                />

                <ScoreCard
                  title="ATS Score"
                  value={analysis.atsScore}
                  icon={Target}
                />

                <ScoreCard
                  title="Skills Match"
                  value={analysis.skillsMatch}
                  icon={Sparkles}
                />
              </div>

              {/* Strengths + Weaknesses */}
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <InsightCard
                  title="Three Strengths"
                  icon={CheckCircle2}
                  iconClass="text-emerald-400"
                  items={analysis.strengths}
                />

                <InsightCard
                  title="Three Weaknesses"
                  icon={AlertCircle}
                  iconClass="text-orange-400"
                  items={analysis.weaknesses}
                />
              </div>

              {/* Suggestions */}
              <div className="mt-6 rounded-2xl border border-purple-500/20 bg-white/[0.03] p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <Lightbulb size={20} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-purple-400">
                      AI Recommendations
                    </p>

                    <h3 className="mt-1 text-lg font-semibold">
                      Improvement Suggestions
                    </h3>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {analysis.suggestions.map((suggestion, index) => (
                    <Suggestion
                      key={index}
                      number={`0${index + 1}`}
                      title={suggestion}
                    />
                  ))}
                </div>
              </div>

              {/* Overall Recommendation */}
              <div className="mt-6 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-blue-900/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <Sparkles size={20} />
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-purple-400">
                      Overall Recommendation
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                      {analysis.recommendation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Extracted Resume */}
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="mb-4 flex items-center gap-3">
                  <FileText size={19} className="text-white/50" />

                  <h3 className="text-sm font-semibold">
                    Extracted Resume Content
                  </h3>
                </div>

                <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-black/30 p-5 text-xs leading-6 text-white/45">
                  {resumeText}
                </pre>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

/* Info Item */
function InfoItem({ text }) {
  return (
    <div className="flex gap-3">
      <CheckCircle2
        size={18}
        className="mt-0.5 shrink-0 text-purple-400"
      />

      <p className="text-sm leading-5 text-white/55">
        {text}
      </p>
    </div>
  );
}

/* Score Card */
function ScoreCard({ title, value, icon: Icon }) {
  const scoreLabel =
    value >= 85
      ? "Excellent"
      : value >= 70
      ? "Very Good"
      : value >= 55
      ? "Good"
      : "Needs Improvement";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-purple-500/30">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <Icon size={19} />
        </div>

        <span className="text-xs text-emerald-400">
          {scoreLabel}
        </span>
      </div>

      <p className="mt-5 text-sm text-white/40">
        {title}
      </p>

      <div className="mt-1 flex items-end gap-1">
        <h3 className="text-4xl font-bold">{value}</h3>

        <span className="mb-1 text-sm text-white/30">
          /100
        </span>
      </div>
    </div>
  );
}

/* Insight Card */
function InsightCard({
  title,
  icon: Icon,
  iconClass,
  items,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
          <Icon size={19} className={iconClass} />
        </div>

        <h3 className="text-lg font-semibold">
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
          >
            <span className="mt-0.5 text-xs text-purple-400">
              {index + 1}
            </span>

            <p className="text-sm leading-5 text-white/60">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Suggestion */
function Suggestion({ number, title }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4">
      <span className="text-xs font-semibold text-purple-400">
        {number}
      </span>

      <h4 className="mt-3 text-sm font-semibold leading-5">
        {title}
      </h4>
    </div>
  );
}

export default ResumeAnalyzer;