import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../services/authApi';
import { Loader2, AlertCircle } from 'lucide-react';

export default function SocialCallback() {
  const loginWithSocialData = useAuthStore((state) => state.loginWithSocialData);
  const [error, setError] = useState('');

  useEffect(() => {
    const processOAuthHandshake = async () => {
      // Extract the target provider dynamically from the URL route context if using a router,
      // or standard string parsing (Assuming Google for this specific edge case callback)
      const provider = 'google';
      const searchParams = window.location.search;

      if (!searchParams) {
        setError('Missing validation tokens from authorization server.');
        return;
      }

      try {
        // Exchange code with the backend server via service abstraction
        const data = await authApi.handleSocialCallback(provider, searchParams);
        
        // Populate the Zustand memory node with active session states
        loginWithSocialData(data.user, data.access_token);
        
        // Cleanly route the user to home/dashboard landscape
        window.location.href = '/';
      } catch (err) {
        console.error('Social auth callback error:', err);
        setError(err.response?.data?.message || 'Failed to authenticate with social account.');
      }
    };

    processOAuthHandshake();
  }, [loginWithSocialData]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">Authentication Failed</h3>
          <p className="text-slate-400 text-sm">{error}</p>
          <a href="/login" className="inline-block bg-slate-800 text-white text-sm px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-750 transition-all">
            Return to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-200">
      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      <p className="text-sm font-medium tracking-wide text-slate-400">
        Verifying security tokens with server, please wait...
      </p>
    </div>
  );
}