import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { googleLogout } from "@react-oauth/google";
import api from "@/utils/axios";

export default function Home() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [surveyId, setSurveyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [isSubmitResponseLoading, setIsSubmitResponseLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleGenerateQuestions = async () => {
    if (!title) return;

    setTitles([]);
    setQuestions([]);
    setIsLoading(true);
    try {
      // This will be replaced with actual API call
      const response = await api.post("/ai/generate-questions", { title });
      setQuestions(response.data.questions);
      setSurveyId(response.data.surveyId);
      setTitle("");
    } catch (error) {
      // console.log("Failed to generate questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetTitleSuggestion = async () => {
    setIsSuggestionLoading(true);
    setQuestions([]);
    try {
      // This will be replaced with actual API call
      const response = await api.get("/ai/suggest-titles");
      setTitles(response.data);
    } catch (error) {
      // console.log("Failed to get title suggestion:", error);
    } finally {
      setIsSuggestionLoading(false);
    }
  };

  const handleSubmitResponse = async () => {
    setIsSubmitResponseLoading(true);
    try {
      await api.post("/ai/respond-to-question", {
        surveyId,
        answers,
      });
      // Clear answers after successful submission
      setAnswers([]);
      setQuestions([]);
      setShowSuccessMessage(true);
    } catch (error) {
      // console.log("Failed to submit responses:", error);
    } finally {
      setIsSubmitResponseLoading(false);
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    router.push("/login");
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
              Question Generator
            </h1>
            <p className="text-slate-300 text-sm sm:text-base">
              Generate and respond to random questions by giving a title
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium 
                     hover:bg-white/20 transform hover:-translate-y-0.5 transition-all 
                     duration-200 shadow-lg hover:shadow-xl border border-white/20
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Logout
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 lg:p-10">
          {/* Input Section */}
          <div className="space-y-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your interview questions..."
                className="flex-1 px-6 py-4 rounded-xl border-2 border-white/20 
                         focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 
                         outline-none transition-all duration-200 bg-white/5 
                         text-white placeholder-slate-400 text-lg"
              />
              <button
                onClick={handleGetTitleSuggestion}
                disabled={isSuggestionLoading}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium 
                         hover:from-purple-600 hover:to-pink-600 transform hover:-translate-y-0.5 
                         transition-all duration-200 shadow-lg hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isSuggestionLoading
                  ? "Getting Suggestion..."
                  : "Get Suggestion"}
              </button>
            </div>
            <button
              onClick={handleGenerateQuestions}
              disabled={isLoading || !title}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium 
                       hover:from-blue-600 hover:to-indigo-600 transform hover:-translate-y-0.5 
                       transition-all duration-200 shadow-lg hover:shadow-xl
                       disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? "Generating Questions..." : "Generate Questions"}
            </button>
          </div>

          {/* Title Suggestions */}
          {titles && titles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {titles.map((title, index) => (
                <button
                  key={index}
                  onClick={() => setTitle(title)}
                  className="p-4 bg-white/5 text-white border-2 border-white/20 
                           rounded-xl text-left font-medium hover:bg-white/10 
                           hover:border-purple-400 transform hover:-translate-y-0.5 
                           transition-all duration-200 backdrop-blur-sm"
                >
                  {title}
                </button>
              ))}
            </div>
          )}

          {/* Questions Section */}
          {questions.length > 0 && (
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
                Generated Interview Questions
              </h2>
              {questions.map((question, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border-2 border-white/20 
                           hover:border-purple-400 transform hover:-translate-y-0.5 
                           transition-all duration-200"
                >
                  <p className="mb-4 font-semibold text-white text-xl">
                    {index + 1}. {question}
                  </p>
                  <textarea
                    value={answers[index] || ""}
                    onChange={(e) => {
                      const newAnswers = [...answers];
                      newAnswers[index] = e.target.value;
                      setAnswers(newAnswers);
                    }}
                    placeholder="Enter your response here..."
                    className="w-full min-h-[120px] p-4 rounded-xl border-2 border-white/20 
                             focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 
                             outline-none transition-all duration-200 bg-white/5 
                             text-white placeholder-slate-400 resize-y"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Submit Button */}
          {questions.length > 0 && (
            <button
              onClick={handleSubmitResponse}
              disabled={isSubmitResponseLoading || answers.length === 0}
              className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-medium 
                       hover:from-emerald-600 hover:to-teal-600 transform hover:-translate-y-0.5 
                       transition-all duration-200 shadow-lg hover:shadow-xl
                       disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitResponseLoading
                ? "Submitting Response..."
                : "Submit Response"}
            </button>
          )}

          {/* Success Message */}
          {showSuccessMessage && (
            <div
              className="mt-6 p-4 bg-emerald-500/20 backdrop-blur-sm text-emerald-200 rounded-xl 
                         border-2 border-emerald-500/30 flex items-center justify-center 
                         font-medium animate-fade-in"
            >
              <span className="mr-2">✨</span>
              Response successfully recorded!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
