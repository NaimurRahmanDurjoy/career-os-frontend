import React, { useEffect, useState } from 'react';
import { useAuthStore } from './features/auth/store/useAuthStore.js';
import { useResumeStore } from './features/resumes/store/useResumeStore.js';
import Login from './features/auth/components/Login';
import Register from './features/auth/components/Register';
import OAuthCallback from './features/auth/components/OAuthCallback';
import ResumeUploader from './features/resumes/components/ResumeUploader';
import AnalysisDashboard from './features/resumes/components/AnalysisDashboard';
import JobsDashboard from './features/jobs/JobsDashboard';
import MainLayout from './components/layout/MainLayout';
import { Loader2 } from 'lucide-react';

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.loading);
  const resumeAnalysisData = useResumeStore((state) => state.analysisData);

  // New Navigation State
  const [activeView, setActiveView] = useState('resume');
  const [authView, setAuthView] = useState('login');

  useEffect(() => {
    // If not in oauth callback, initialize auth as usual
    if (!window.location.pathname.startsWith('/oauth/callback')) {
      initializeAuth();
    }
  }, [initializeAuth]);

  if (window.location.pathname.startsWith('/oauth/callback')) {
    return <OAuthCallback onComplete={() => initializeAuth()} />;
  }

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
        <p className="text-xs font-semibold tracking-wider uppercase">
          Verifying Active Profile Token Context...
        </p>
      </div>
    );
  }

  if (!user) {
    if (authView === 'register') {
      return <Register onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <Login onSwitchToRegister={() => setAuthView('register')} />;
  }

  return (
    <MainLayout activeView={activeView} setActiveView={setActiveView}>
      {activeView === 'resume' && (
        !resumeAnalysisData ? (
          <div className="space-y-8 max-w-2xl mx-auto text-center mt-12">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl">
                Optimize Your Application Strategy
              </h1>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Upload your document file below to evaluate compliance factors against standard machine parsing nodes.
              </p>
            </div>
            <ResumeUploader />
          </div>
        ) : (
          <AnalysisDashboard />
        )
      )}

      {activeView === 'jobs' && (
        <JobsDashboard />
      )}
    </MainLayout>
  );
}