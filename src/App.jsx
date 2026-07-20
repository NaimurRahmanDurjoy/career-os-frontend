import React, { useEffect, useState } from 'react';
import { useAuthStore } from './features/auth/store/useAuthStore.js';
import { useResumeStore } from './features/resumes/store/useResumeStore.js';
import Login from './features/auth/components/Login';
import ResumeUploader from './features/resumes/components/ResumeUploader';
import AnalysisDashboard from './features/resumes/components/AnalysisDashboard';
import { Loader2, LogOut, Briefcase } from 'lucide-react';

export default function App() {
  // Extract essential global states from our atomic stores
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.loading);
  const logout = useAuthStore((state) => state.logout);

  const resumeAnalysisData = useResumeStore((state) => state.analysisData);

  // Trigger automated backend session verification on mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Handle structural system loader while confirming active credentials
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

  // Route unauthorized guests cleanly to the isolated gateway view
  if (!user) {
    return <Login onSwitchToRegister={() => alert('Registration layout pipeline triggered.')} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
      {/* Central Application Navigation Bar Header */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-md">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="font-black text-sm tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Career OS
            </span>
          </div>

          {/* User Account Session Operations panel */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-200">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-medium">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2.5 bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-500/20 rounded-xl transition-all"
              title="Terminate Active Session"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout Wrapper */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!resumeAnalysisData ? (
          <div className="space-y-8 max-w-2xl mx-auto text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-white tracking-tight sm:text-5xl">
                Optimize Your Application Strategy
              </h1>
              <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                Upload your document file below to evaluate compliance factors against standard machine parsing parsing nodes.
              </p>
            </div>
            <ResumeUploader />
          </div>
        ) : (
          <AnalysisDashboard />
        )}
      </main>
    </div>
  );
}