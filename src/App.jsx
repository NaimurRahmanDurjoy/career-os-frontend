import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from './features/auth/store/useAuthStore.js';
import { useResumeStore } from './features/resumes/store/useResumeStore.js';
import { Loader2 } from 'lucide-react';
import { useThemeStore } from './store/useThemeStore.js';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './components/LandingPage';
import PrivacyPolicy from './components/PrivacyPolicy';

// Auth Components (Eager loaded for instant login screen)
import Login from './features/auth/components/Login';
import Register from './features/auth/components/Register';
import OAuthCallback from './features/auth/components/OAuthCallback';
import ForgotPassword from './features/auth/components/ForgotPassword';
import ResetPassword from './features/auth/components/ResetPassword';

// Lazy Loaded Application Features (Code Splitting to shrink initial bundle)
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const CircularsPage = lazy(() => import('./features/circulars/CircularsPage'));
const PublicPortfolioPage = lazy(() => import('./features/portfolio/PublicPortfolioPage'));
const JobsDashboard = lazy(() => import('./features/jobs/JobsDashboard'));
const MatchCheckerPage = lazy(() => import('./features/match-checker/MatchCheckerPage'));
const PreparationTrackerPage = lazy(() => import('./features/preparation/PreparationTrackerPage'));
const MockTestDashboard = lazy(() => import('./features/mock-tests/MockTestDashboard'));
const Profile = lazy(() => import('./features/auth/components/Profile'));
const BillingDashboard = lazy(() => import('./features/billing/components/BillingDashboard'));
const CvBuilderApp = lazy(() => import('./features/cv-builder/CvBuilderApp'));
const SupportView = lazy(() => import('./features/support/SupportView'));
const AdminApp = lazy(() => import('./features/admin/AdminApp'));
const ResumeUploader = lazy(() => import('./features/resumes/components/ResumeUploader'));
const AnalysisDashboard = lazy(() => import('./features/resumes/components/AnalysisDashboard'));
const ResumeVersionList = lazy(() => import('./features/resumes/components/ResumeVersionList'));
const ReminderList = lazy(() => import('./features/reminders/components/ReminderList'));

function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center p-16 min-h-[50vh] text-slate-400 gap-3">
      <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
      <span className="text-xs uppercase font-bold tracking-widest text-slate-500">Loading module...</span>
    </div>
  );
}

function ResumePageWrapper() {
  const resumeAnalysisData = useResumeStore((state) => state.analysisData);

  return (
    <div className="px-4 md:px-8 max-w-[1600px] w-full mx-auto h-[calc(100vh-12rem)] flex flex-col md:flex-row gap-6 relative z-10">
      <div className="w-72 shrink-0 hidden lg:block h-full">
        <ResumeVersionList onSelect={(id) => useResumeStore.getState().selectResume(id)} />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pretty-scrollbar">
        {!resumeAnalysisData ? (
          <div className="space-y-4 md:space-y-6 max-w-3xl mx-auto text-center mt-6 md:mt-12 px-2">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 tracking-tight pb-2">
                Optimize Your Application
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
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
  );
}

function AuthenticatedApp() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const handleViewChange = (e) => {
      const viewMap = {
        dashboard: '/dashboard',
        resume: '/resumes',
        jobs: '/jobs',
        'match-checker': '/match-checker',
        preparation: '/preparation',
        'mock-tests': '/mock-tests',
        reminders: '/reminders',
        billing: '/billing',
        profile: '/profile',
        'cv-builder': '/cv-builder',
        support: '/support'
      };
      const path = viewMap[e.detail] || `/${e.detail}`;
      navigate(path);
    };

    window.addEventListener('changeView', handleViewChange);
    return () => window.removeEventListener('changeView', handleViewChange);
  }, [navigate]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/circulars" element={<CircularsPage />} />
          <Route path="/resumes" element={<ResumePageWrapper />} />
          <Route path="/jobs" element={<JobsDashboard />} />
          <Route path="/match-checker" element={<MatchCheckerPage />} />
          <Route path="/cv-builder" element={<CvBuilderApp />} />
          <Route path="/preparation" element={<PreparationTrackerPage />} />
          <Route path="/mock-tests" element={<MockTestDashboard />} />
          <Route path="/reminders" element={<ReminderList />} />
          <Route path="/billing" element={<BillingDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/support" element={<SupportView />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </MainLayout>
  );
}

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.loading);

  useEffect(() => {
    useThemeStore.getState().initTheme();

    if (!window.location.pathname.startsWith('/oauth/callback')) {
      initializeAuth();
    }
  }, [initializeAuth]);

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

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing & Policy Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<PrivacyPolicy />} />

        {/* Public Portfolio View */}
        <Route
          path="/p/:username"
          element={
            <Suspense fallback={<PageLoader />}>
              <PublicPortfolioPage />
            </Suspense>
          }
        />

        {/* Auth routes */}
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login
                onSwitchToRegister={() => window.location.href = '/register'}
                onSwitchToForgotPassword={() => window.location.href = '/forgot-password'}
              />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Register onSwitchToLogin={() => window.location.href = '/login'} />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <ForgotPassword onSwitchToLogin={() => window.location.href = '/login'} />
            )
          }
        />
        <Route
          path="/reset-password"
          element={<ResetPassword onSwitchToLogin={() => window.location.href = '/login'} />}
        />
        <Route
          path="/oauth/callback"
          element={<OAuthCallback onComplete={() => initializeAuth()} />}
        />

        {/* Dedicated Admin Portal Route */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminApp />
            </Suspense>
          }
        />

        {/* Authenticated User App Routes */}
        <Route path="/*" element={<AuthenticatedApp />} />
      </Routes>
    </BrowserRouter>
  );
}
