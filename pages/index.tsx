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
    console.log({ token });
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
      console.log("Failed to generate questions:", error);
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
      console.log("Failed to get title suggestion:", error);
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
      console.log("Failed to submit responses:", error);
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

  console.log({ questions });

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <h1 style={{ margin: 0, color: "#333" }}>Question Generator</h1>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a title for your questions..."
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                fontSize: "16px",
                backgroundColor: "#f8f9fa",
                color: "#333",
              }}
            />
            <button
              onClick={handleGetTitleSuggestion}
              disabled={isSuggestionLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#34a853",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              {isSuggestionLoading ? "Getting Suggestion" : "Get Suggestion"}
            </button>
          </div>
          <button
            onClick={handleGenerateQuestions}
            disabled={isLoading || !title}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isLoading || !title.trim() ? "not-allowed" : "pointer",
              fontSize: "16px",
              opacity: isLoading || !title.trim() ? 0.7 : 1,
            }}
          >
            {isLoading ? "Generating..." : "Generate Questions"}
          </button>
        </div>

        {titles && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {titles.map((title, index) => (
              <button
                key={index}
                onClick={() => setTitle(title)}
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#f8f9fa",
                  color: "#333",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                  width: "100%",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#e9ecef";
                  e.currentTarget.style.borderColor = "#4285f4";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f9fa";
                  e.currentTarget.style.borderColor = "#ddd";
                }}
              >
                {title}
              </button>
            ))}
          </div>
        )}

        {questions.length > 0 && (
          <div>
            <h2 style={{ marginBottom: "1rem", color: "#333" }}>
              Generated Questions
            </h2>
            {questions.map((question, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  backgroundColor: "#f8f9fa",
                  color: "#333",
                  borderRadius: "5px",
                }}
              >
                <p style={{ marginBottom: "0.5rem", fontWeight: "bold" }}>
                  {index + 1}. {question}
                </p>
                <textarea
                  value={answers[index] || ""}
                  onChange={(e) => {
                    const newAnswers = [...answers];
                    newAnswers[index] = e.target.value;
                    setAnswers(newAnswers);
                  }}
                  placeholder="Enter your answer..."
                  style={{
                    width: "100%",
                    minHeight: "100px",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    resize: "vertical",
                    backgroundColor: "#f8f9fa",
                    color: "#333",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {questions.length > 0 && (
          <button
            onClick={handleSubmitResponse}
            disabled={isSubmitResponseLoading || answers.length === 0}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor:
                isSubmitResponseLoading || answers.length === 0
                  ? "not-allowed"
                  : "pointer",
              fontSize: "16px",
              opacity:
                isSubmitResponseLoading || answers.length === 0 ? 0.7 : 1,
              marginTop: "1rem",
            }}
          >
            {isSubmitResponseLoading
              ? "Submitting Response..."
              : "Submit Response"}
          </button>
        )}

        {showSuccessMessage && (
          <div
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "1rem",
              borderRadius: "5px",
              marginTop: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid #c3e6cb",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            ✅ Response successfully recorded!
          </div>
        )}
      </div>
    </div>
  );
}
