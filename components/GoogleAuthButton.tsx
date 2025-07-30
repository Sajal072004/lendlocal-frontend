'use client';

import { Button } from "@/components/ui/button";

// A simple SVG component for the Google icon
const GoogleIcon = () => (
  <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 265.9c0-13.2 1-26.2 2.9-38.9h241.1v77.3H138.6c8.5 41.4 43.3 73.5 85.4 73.5 50.1 0 88.5-35.1 104.3-83.4h62.1c-22.1 63.9-86.6 109.6-166.4 109.6-98.2 0-178.6-81.1-178.6-180.7S145.8 85.2 244 85.2c53.9 0 99.6 24.4 132.3 62.3l-53.6 52.1c-19.5-18.2-46.7-30.8-78.7-30.8-62.5 0-113.5 51.6-113.5 115.3s51 115.3 113.5 115.3c41.3 0 74.4-19.4 92.8-51.4H244v-77.3h244z"></path>
  </svg>
);

export const GoogleAuthButton = () => {
  const handleGoogleLogin = () => {
    // This is the key part: we simply navigate to the backend's Google auth route.
    // The backend will handle the redirect to Google and the callback.
    window.location.href = 'http://localhost:8080/api/auth/google';
  };

  return (
    <Button variant="outline" type="button" className="w-full" onClick={handleGoogleLogin}>
      <GoogleIcon />
      Continue with Google
    </Button>
  );
};