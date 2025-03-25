import { GOOGLE_CLIENT_ID } from "@/utils/index.config";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  CredentialResponse,
} from "@react-oauth/google";
import api from "@/utils/axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface GoogleTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("accessToken");
    if (token) {
      router.push("/");
    }
  }, [router]);

  function processResponse({ response }: { response: CredentialResponse }) {
    api
      .post<GoogleTokenResponse>(
        "/google-authentication/",
        {
          access_token: response.credential,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        localStorage.setItem("accessToken", response.data.accessToken);
        router.push("/");
      })
      .catch((error) => {
        // console.log("Authentication failed:", error);
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight mb-4">
            Question Generator
          </h1>
          <p className="text-slate-300 text-lg">
            Sign in to start generating your questions
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-slate-300">
                Continue with your Google account to get started
              </p>
            </div>

            <div className="flex justify-center">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <div className="w-full max-w-[300px] h-[50px] rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                  <GoogleLogin
                    text="continue_with"
                    type="standard"
                    theme="filled_blue"
                    shape="pill"
                    logo_alignment="center"
                    onSuccess={(response) => processResponse({ response })}
                  />
                </div>
              </GoogleOAuthProvider>
            </div>

            {/* Features List */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center text-slate-300">
                <span className="mr-2">✨</span>
                <span>AI-powered interview questions</span>
              </div>
              <div className="flex items-center text-slate-300">
                <span className="mr-2">🎯</span>
                <span>Personalized question suggestions</span>
              </div>
              <div className="flex items-center text-slate-300">
                <span className="mr-2">📝</span>
                <span>Detailed response analysis</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
