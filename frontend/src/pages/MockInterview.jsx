import { useEffect, useState } from "react";
import {
  Video,
  Sparkles,
  Briefcase,
  BarChart3,
  Clock,
  Play,
  ArrowRight,
  CheckCircle2,
  RotateCcw,
  LoaderCircle,
  ChevronDown,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function MockInterview() {
  const [role, setRole] = useState("Frontend Developer");
  const [difficulty, setDifficulty] = useState("Medium");

  const [questions, setQuestions] = useState([]);

  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  const [isFinished, setIsFinished] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const [error, setError] = useState("");
  const [resumeText, setResumeText] = useState("");

  useEffect(() => {
    const savedResumeText = localStorage.getItem(
      "careerAI_resumeText"
    );

    if (savedResumeText) {
      setResumeText(savedResumeText);
    }
  }, []);

  // =====================================================
  // START INTERVIEW
  // =====================================================

  const startInterview = async () => {
    if (!resumeText) {
      setError(
        "Please upload and analyze your resume first."
      );
      return;
    }

    setIsEvaluating(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/interview/generate-questions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resumeText,
            role,
            difficulty,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to generate questions"
        );
      }

      setQuestions(data.questions);

      setCurrentQuestion(0);
      setAnswer("");
      setAnswers([]);
      setEvaluations([]);
      setIsFinished(false);

      setIsInterviewStarted(true);
    } catch (error) {
      console.error(
        "Question generation error:",
        error
      );

      setError(
        error.message ||
          "Unable to generate interview questions."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  // =====================================================
  // EVALUATE ANSWER + NEXT QUESTION
  // =====================================================

  const nextQuestion = async () => {
    if (!answer.trim()) {
      return;
    }

    setIsEvaluating(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/interview/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            difficulty,
            question: questions[currentQuestion],
            answer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to evaluate answer"
        );
      }

      const updatedAnswers = [
        ...answers,
        answer,
      ];

      const updatedEvaluations = [
        ...evaluations,
        data.evaluation,
      ];

      setAnswers(updatedAnswers);
      setEvaluations(updatedEvaluations);

      // =================================================
      // NEXT QUESTION
      // =================================================

      if (
        currentQuestion <
        questions.length - 1
      ) {
        setCurrentQuestion(
          currentQuestion + 1
        );

        setAnswer("");
      } else {
        // ===============================================
        // CALCULATE FINAL SCORE
        // ===============================================

        const totalScore =
          updatedEvaluations.reduce(
            (sum, evaluation) =>
              sum + evaluation.overallScore,
            0
          ) / updatedEvaluations.length;

        const finalScore =
          Math.round(totalScore);

        // ===============================================
        // SAVE INTERVIEW TO MONGODB
        // ===============================================

        try {
          const saveResponse = await fetch(
            "http://localhost:5000/api/interview/save",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                role,
                difficulty,
                questions,
                answers: updatedAnswers,
                evaluations:
                  updatedEvaluations,
                overallScore: finalScore,
              }),
            }
          );

          const saveData =
            await saveResponse.json();

          if (!saveResponse.ok) {
            console.error(
              "Interview save failed:",
              saveData.message
            );
          } else {
            console.log(
              "Interview saved to MongoDB ✅"
            );
          }
        } catch (saveError) {
          console.error(
            "Interview save error:",
            saveError
          );
        }

        // Show result screen
        setIsFinished(true);
      }
    } catch (error) {
      console.error(
        "Interview evaluation error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while evaluating your answer."
      );
    } finally {
      setIsEvaluating(false);
    }
  };

  // =====================================================
  // RESTART INTERVIEW
  // =====================================================

  const restartInterview = () => {
    setIsInterviewStarted(false);
    setCurrentQuestion(0);
    setAnswer("");
    setAnswers([]);
    setEvaluations([]);
    setIsFinished(false);
    setIsEvaluating(false);
    setError("");
    setQuestions([]);
  };

  // =====================================================
  // PROGRESS
  // =====================================================

  const progress =
    questions.length > 0
      ? ((currentQuestion + 1) /
          questions.length) *
        100
      : 0;

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <div className="flex min-h-screen bg-[#090014] text-white">
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="min-w-0 flex-1">
        <Navbar />

        <main className="px-5 py-7 sm:px-8">
          <div className="mx-auto max-w-7xl">

            {/* HEADER */}

            <div className="mb-7">
              <div className="mb-3 flex items-center gap-2 text-purple-400">
                <Sparkles size={20} />

                <span className="text-sm font-medium">
                  AI Career Intelligence
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight">
                AI Mock Interview
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                Practice realistic interview
                questions and improve your
                confidence with AI-powered
                feedback.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* INTERVIEW STARTED */}

            {isInterviewStarted ? (
              <>
                {!isFinished ? (
                  <InterviewSession
                    role={role}
                    difficulty={difficulty}
                    question={
                      questions[currentQuestion]
                    }
                    currentQuestion={
                      currentQuestion
                    }
                    totalQuestions={
                      questions.length
                    }
                    progress={progress}
                    answer={answer}
                    setAnswer={setAnswer}
                    onNext={nextQuestion}
                    isEvaluating={
                      isEvaluating
                    }
                    error={error}
                  />
                ) : (
                  <InterviewResult
                    role={role}
                    difficulty={difficulty}
                    answers={answers}
                    evaluations={evaluations}
                    questions={questions}
                    onRestart={
                      restartInterview
                    }
                  />
                )}
              </>
            ) : (
              <>
                {/* SETUP */}

                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

                  {/* SETUP CARD */}

                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                        <Video size={21} />
                      </div>

                      <div>
                        <h2 className="text-lg font-semibold">
                          Interview Setup
                        </h2>

                        <p className="text-xs text-white/40">
                          Customize your interview
                        </p>
                      </div>
                    </div>

                    {/* ROLE */}

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/70">
                        Select Role
                      </label>

                      <div className="relative">
                        <Briefcase
                          size={18}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                        />

                        <select
                          value={role}
                          onChange={(e) =>
                            setRole(
                              e.target.value
                            )
                          }
                          className="w-full appearance-none rounded-xl border border-white/10 bg-black/20 px-11 py-3 text-sm text-white outline-none transition focus:border-purple-500/40"
                        >
                          <option className="bg-[#12051c]">
                            Frontend Developer
                          </option>

                          <option className="bg-[#12051c]">
                            Full Stack Developer
                          </option>

                          <option className="bg-[#12051c]">
                            Backend Developer
                          </option>

                          <option className="bg-[#12051c]">
                            Software Developer
                          </option>
                        </select>

                        <ChevronDown
                          size={17}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35"
                        />
                      </div>
                    </div>

                    {/* DIFFICULTY */}

                    <div className="mt-5">
                      <label className="mb-2 block text-sm font-medium text-white/70">
                        Difficulty Level
                      </label>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          "Easy",
                          "Medium",
                          "Hard",
                        ].map((level) => (
                          <button
                            key={level}
                            onClick={() =>
                              setDifficulty(
                                level
                              )
                            }
                            className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                              difficulty ===
                              level
                                ? "border-purple-500/50 bg-purple-500/15 text-purple-300"
                                : "border-white/10 bg-white/[0.02] text-white/50 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* START */}

                    <button
                      onClick={
                        startInterview
                      }
                      disabled={isEvaluating}
                      className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 text-sm font-semibold transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isEvaluating ? (
                        <>
                          <LoaderCircle
                            size={18}
                            className="animate-spin"
                          />
                          Generating Questions...
                        </>
                      ) : (
                        <>
                          <Play size={18} />
                          Start Interview
                        </>
                      )}
                    </button>
                  </div>

                  {/* AI EVALUATION CARD */}

                  <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/10 p-6">

                    <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                      <Sparkles size={20} />
                    </div>

                    <h2 className="text-lg font-semibold">
                      What AI evaluates
                    </h2>

                    <div className="mt-5 space-y-4">

                      <Feature
                        icon={Video}
                        title="Communication"
                        text="Clarity and confidence in your answers."
                      />

                      <Feature
                        icon={BarChart3}
                        title="Answer Quality"
                        text="Relevance and technical accuracy."
                      />

                      <Feature
                        icon={Clock}
                        title="Response Time"
                        text="How effectively you manage your time."
                      />

                      <Feature
                        icon={Sparkles}
                        title="AI Feedback"
                        text="Personalized suggestions for improvement."
                      />

                    </div>
                  </div>
                </div>

                {/* STATS */}

                <div className="mt-6 grid gap-4 md:grid-cols-3">

                  <InterviewStat
                    icon={Video}
                    title="Mock Interviews"
                    value="0"
                  />

                  <InterviewStat
                    icon={BarChart3}
                    title="Average Score"
                    value="--"
                  />

                  <InterviewStat
                    icon={Clock}
                    title="Practice Time"
                    value="0 min"
                  />

                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// =====================================================
// INTERVIEW SESSION
// =====================================================

function InterviewSession({
  role,
  difficulty,
  question,
  currentQuestion,
  totalQuestions,
  progress,
  answer,
  setAnswer,
  onNext,
  isEvaluating,
  error,
}) {
  return (
    <div className="space-y-6">

      {/* TOP INFO */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs text-white/40">
            Role
          </p>

          <p className="mt-1 font-semibold">
            {role}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs text-white/40">
            Difficulty
          </p>

          <p className="mt-1 font-semibold">
            {difficulty}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs text-white/40">
            Question
          </p>

          <p className="mt-1 font-semibold">
            {currentQuestion + 1} /{" "}
            {totalQuestions}
          </p>
        </div>

      </div>

      {/* PROGRESS */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-white/45">
            Interview Progress
          </span>

          <span className="text-xs font-medium text-purple-300">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      {/* QUESTION CARD */}

      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-blue-900/10 p-7">

        <div className="flex items-center gap-2 text-sm text-purple-300">
          <Sparkles size={17} />

          AI Generated Question
        </div>

        <h2 className="mt-5 text-xl font-semibold leading-8">
          {question}
        </h2>

      </div>

      {/* ANSWER */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <label className="mb-3 block text-sm font-medium text-white/70">
          Your Answer
        </label>

        <textarea
          value={answer}
          onChange={(e) =>
            setAnswer(e.target.value)
          }
          placeholder="Type your answer here..."
          rows={8}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white outline-none placeholder:text-white/25 focus:border-purple-500/40"
        />

        {error && (
          <p className="mt-3 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          onClick={onNext}
          disabled={
            !answer.trim() ||
            isEvaluating
          }
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3.5 text-sm font-semibold transition hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isEvaluating ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
              />
              Evaluating...
            </>
          ) : (
            <>
              {currentQuestion ===
              totalQuestions - 1
                ? "Submit Interview"
                : "Submit & Next"}

              <ArrowRight size={18} />
            </>
          )}
        </button>

      </div>
    </div>
  );
}

// =====================================================
// INTERVIEW RESULT
// =====================================================

function InterviewResult({
  role,
  difficulty,
  answers,
  evaluations,
  questions,
  onRestart,
}) {
  const overallScore =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, evaluation) =>
              sum +
              evaluation.overallScore,
            0
          ) / evaluations.length
        )
      : 0;

  const averageTechnical =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, evaluation) =>
              sum +
              evaluation.technicalAccuracy,
            0
          ) / evaluations.length
        )
      : 0;

  const averageCommunication =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, evaluation) =>
              sum +
              evaluation.communication,
            0
          ) / evaluations.length
        )
      : 0;

  const averageRelevance =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, evaluation) =>
              sum + evaluation.relevance,
            0
          ) / evaluations.length
        )
      : 0;

  const averageConfidence =
    evaluations.length > 0
      ? Math.round(
          evaluations.reduce(
            (sum, evaluation) =>
              sum + evaluation.confidence,
            0
          ) / evaluations.length
        )
      : 0;

  const allStrengths = evaluations.flatMap(
    (evaluation) =>
      evaluation.strengths || []
  );

  const allWeaknesses = evaluations.flatMap(
    (evaluation) =>
      evaluation.weaknesses || []
  );

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/25 to-blue-900/10 p-7">

        <div className="flex items-center gap-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <CheckCircle2 size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Interview Completed
            </h2>

            <p className="mt-1 text-sm text-white/45">
              {role} • {difficulty}
            </p>
          </div>

        </div>

      </div>

      {/* SCORE CARDS */}

      <div className="grid gap-4 md:grid-cols-5">

        <ScoreCard
          title="Overall Score"
          value={overallScore}
        />

        <ScoreCard
          title="Technical Accuracy"
          value={averageTechnical}
        />

        <ScoreCard
          title="Communication"
          value={averageCommunication}
        />

        <ScoreCard
          title="Relevance"
          value={averageRelevance}
        />

        <ScoreCard
          title="Confidence"
          value={averageConfidence}
        />

      </div>

      {/* STRENGTHS + WEAKNESSES */}

      <div className="grid gap-6 lg:grid-cols-2">

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <h3 className="text-lg font-semibold">
            Your Strengths
          </h3>

          <div className="mt-5 space-y-3">
            {[
              ...new Set(
                allStrengths
              ),
            ]
              .slice(0, 5)
              .map((strength, index) => (
                <div
                  key={index}
                  className="flex gap-3 text-sm text-white/65"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />

                  <span>{strength}</span>
                </div>
              ))}
          </div>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

          <h3 className="text-lg font-semibold">
            Areas to Improve
          </h3>

          <div className="mt-5 space-y-3">
            {[
              ...new Set(
                allWeaknesses
              ),
            ]
              .slice(0, 5)
              .map((weakness, index) => (
                <div
                  key={index}
                  className="flex gap-3 text-sm text-white/65"
                >
                  <Sparkles
                    size={18}
                    className="mt-0.5 shrink-0 text-purple-400"
                  />

                  <span>{weakness}</span>
                </div>
              ))}
          </div>

        </div>

      </div>

      {/* QUESTION FEEDBACK */}

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

        <h3 className="text-lg font-semibold">
          AI Feedback
        </h3>

        <div className="mt-5 space-y-5">

          {questions.map(
            (question, index) => {
              const evaluation =
                evaluations[index];

              return (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 bg-black/20 p-5"
                >

                  <p className="text-sm font-semibold leading-6">
                    Q{index + 1}.{" "}
                    {question}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-white/45">
                    Your Answer:
                  </p>

                  <p className="mt-1 text-sm leading-6 text-white/65">
                    {answers[index]}
                  </p>

                  {evaluation && (
                    <>
                      <div className="mt-4 flex items-center gap-3">

                        <span className="text-xs text-white/40">
                          Score
                        </span>

                        <span className="rounded-lg bg-purple-500/10 px-3 py-1 text-sm font-semibold text-purple-300">
                          {
                            evaluation.overallScore
                          }%
                        </span>

                      </div>

                      <p className="mt-4 text-sm leading-6 text-white/65">
                        <span className="font-semibold text-white">
                          Feedback:
                        </span>{" "}
                        {evaluation.feedback}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-white/65">
                        <span className="font-semibold text-white">
                          Improvement:
                        </span>{" "}
                        {evaluation.improvement}
                      </p>
                    </>
                  )}

                </div>
              );
            }
          )}

        </div>
      </div>

      {/* RESTART */}

      <button
        onClick={onRestart}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-3.5 text-sm font-semibold transition hover:bg-white/5"
      >
        <RotateCcw size={18} />
        Start New Interview
      </button>

    </div>
  );
}

// =====================================================
// FEATURE
// =====================================================

function Feature({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="flex gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-purple-400">
        <Icon size={17} />
      </div>

      <div>
        <h4 className="text-sm font-medium">
          {title}
        </h4>

        <p className="mt-1 text-xs leading-5 text-white/40">
          {text}
        </p>
      </div>

    </div>
  );
}

// =====================================================
// INTERVIEW STAT
// =====================================================

function InterviewStat({
  icon: Icon,
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
          <Icon size={19} />
        </div>

        <div>
          <p className="text-xs text-white/40">
            {title}
          </p>

          <p className="mt-1 text-xl font-bold">
            {value}
          </p>
        </div>

      </div>

    </div>
  );
}

// =====================================================
// SCORE CARD
// =====================================================

function ScoreCard({
  title,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <p className="text-xs leading-5 text-white/40">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-purple-300">
        {value}%
      </p>

    </div>
  );
}

export default MockInterview;