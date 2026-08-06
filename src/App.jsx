import React, { useEffect, useState } from 'react';
import { useAuthStore } from './features/auth/store/useAuthStore.js';
import { useResumeStore } from './features/resumes/store/useResumeStore.js';
import Login from './features/auth/components/Login';
import Register from './features/auth/components/Register';
import OAuthCallback from './features/auth/components/OAuthCallback';
import Profile from './features/auth/components/Profile';
import ResumeUploader from './features/resumes/components/ResumeUploader';
import AnalysisDashboard from './features/resumes/components/AnalysisDashboard';
import ResumeVersionList from './features/resumes/components/ResumeVersionList';
import CoverLetterModal from './features/jobs/components/CoverLetterModal';
import JobsDashboard from './features/jobs/JobsDashboard';
import ReminderList from './features/reminders/components/ReminderList';
import MatchCheckerPage from './features/match-checker/MatchCheckerPage';
import PreparationTrackerPage from './features/preparation/PreparationTrackerPage';
import MockTestDashboard from './features/mock-tests/MockTestDashboard';
import DashboardPage from './features/dashboard/DashboardPage';
import MainLayout from './components/layout/MainLayout';
import { Loader2 } from 'lucide-react';
import { useThemeStore } from './store/useThemeStore.js';

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.loading);
  const resumeAnalysisData = useResumeStore((state) => state.analysisData);

  // New Navigation State
  const [activeView, setActiveView] = useState('dashboard');
  const [authView, setAuthView] = useState('login');

  useEffect(() => {
    // Initialize Theme
    useThemeStore.getState().initTheme();

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
      {activeView === 'dashboard' && (
        <DashboardPage />
      )}

      {activeView === 'resume' && (
        <div className="md:px-8 max-w-[1600px] w-full mx-auto h-[calc(100vh-8rem)] flex gap-6 relative z-10">
          {/* Sidebar */}
          <div className="w-72 shrink-0 hidden lg:block h-full">
            <ResumeVersionList onSelect={(id) => useResumeStore.getState().pollResumeStatus(id)} />
          </div>

          {/* Main Area */}
          <div className="flex-1 overflow-y-auto pr-2 pretty-scrollbar">
            {!resumeAnalysisData ? (
              <div className="space-y-6 max-w-3xl mx-auto text-center mt-12">
                <div className="space-y-4">
                  <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 tracking-tight sm:text-6xl pb-2">
                    Optimize Your Application
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-base max-w-xl mx-auto leading-relaxed font-medium">
                    Upload your resume file below to automatically extract and parse your career data.
                  </p>
                </div>
                <ResumeUploader />
              </div>
            ) : (
              <AnalysisDashboard />
            )}
          </div>
        </div>
      )}

      {activeView === 'jobs' && (
        <JobsDashboard />
      )}

      {activeView === 'reminders' && (
        <ReminderList />
      )}

      {activeView === 'match-checker' && (
        <MatchCheckerPage />
      )}

      {activeView === 'preparation' && (
        <PreparationTrackerPage />
      )}

      {activeView === 'mock-tests' && (
        <MockTestDashboard />
      )}

      {activeView === 'profile' && (
        <Profile />
      )}
    </MainLayout>
  );
}