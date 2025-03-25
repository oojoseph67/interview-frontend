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
    console.log("inside process", response);
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
        console.log({ response });
        localStorage.setItem("accessToken", response.data.accessToken);
        router.push("/");
      })
      .catch((error) => {
        console.log("Authentication failed:", error);
      });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "2rem", color: "#333" }}>Welcome</h1>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <GoogleLogin
            text="continue_with"
            type="standard"
            theme="filled_blue"
            shape="pill"
            logo_alignment="center"
            onSuccess={(response) => processResponse({ response })}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}
