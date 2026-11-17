import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, FileUp, Briefcase, Globe, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../auth/store/useAuthStore';

export default function OnboardingModal({ stats }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed or completed the welcome tour
    const hasSeenWelcome = localStorage.getItem(`has_seen_welcome_${user?.id || 'guest'}`);
    if (!hasSeenWelcome) {
      // Delay slightly for smooth entrance
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(`has_seen_welcome_${user?.id || 'guest'}`, 'true');
  };

  const handleAction = (path) => {
    handleClose();
    navigate(path);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} /> Welcome to Career OS
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Let's Launch Your Job Search
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
            Career OS is engineered to get you 3x more interview callbacks. Here is how to get started in 2 minutes:
          </p>
        </div>

        {/* 3 Quick Cards */}
        <div className="space-y-3 mb-8">
          <div
            onClick={() => handleAction('/resumes')}
            className="p-4 bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                <FileUp size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  1. Upload your Resume (ATS Scanner)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Get scored against real applicant tracking systems.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>

          <div
            onClick={() => handleAction('/jobs')}
            className="p-4 bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
                <Briefcase size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  2. Track Your Applications (Kanban CRM)
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organize leads, notes, and recruiter contacts in one place.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>

          <div
            onClick={() => handleAction('/match-checker')}
            className="p-4 bg-slate-950/70 border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  3. Compare CV vs Job Description
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Find missing keywords and auto-generate cover letters.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-500 font-medium">Takes less than 2 minutes</span>
          <button
            onClick={() => handleAction('/resumes')}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
          >
            Start by Uploading Resume <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
