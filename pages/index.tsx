import { GOOGLE_CLIENT_ID } from "@/utils/index.config";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  CredentialResponse,
  googleLogout,
} from "@react-oauth/google";
import api from "@/utils/axios";
import { useState, useEffect } from "react";

interface GoogleTokenResponse {
  access_token: string;
  refreshToken: string;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function processResponse({ response }: { response: CredentialResponse }) {
    console.log("hitting processResponse");
    console.log({ response });
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
        // Handle successful authentication
        console.log("Authentication successful:", response);
        // Store the access token
        localStorage.setItem('accessToken', response.data.access_token);
        setIsLoggedIn(true);
      })
      .catch((error) => {
        // Handle errors
        console.log("Authentication failed:", error);
      });
  }

  const handleLogout = () => {
    googleLogout();
    // Clear the stored tokene
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {!isLoggedIn ? (
          <GoogleLogin
            text="continue_with"
            type="standard"
            theme="filled_blue"
            shape="pill"
            logo_alignment="center"
            onSuccess={(response) => {
              console.log({ response });
              processResponse({ response });
            }}
          />
        ) : (
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        )}
      </GoogleOAuthProvider>
    </>
  );
}
