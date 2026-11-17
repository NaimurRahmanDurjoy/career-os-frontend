import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FileUp,
  Briefcase,
  Target,
  Globe,
  CheckCircle2,
  ArrowRight,
  X,
  ChevronRight
} from 'lucide-react';
import { useResumeStore } from '../../features/resumes/store/useResumeStore';
import { useDashboardStore } from '../../features/dashboard/store/useDashboardStore';

export default function SidebarSetupItem({ isCollapsed }) {
  const navigate = useNavigate();
  const resumes = useResumeStore((state) => state.resumes);
  const stats = useDashboardStore((state) => state.stats);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('hide_sidebar_setup_item') === 'true';
  });

  const hasUploadedResume = Boolean(resumes && resumes.length > 0);
  const hasAddedJob = Boolean(stats && stats.total > 0);
  const hasCheckedMatch = Boolean(stats && (stats.interview > 0 || stats.total > 1));

  const steps = [
    {
      id: 'resume',
      title: 'Upload primary Resume (ATS Scan)',
      desc: 'Extract your career history & calculate keywords match score.',
      completed: hasUploadedResume,
      action: () => navigate('/resumes'),
      btnText: 'Upload Resume',
      icon: FileUp,
    },
    {
      id: 'job',
      title: 'Track your first job application',
      desc: 'Add to your Kanban pipeline or clip in 1-click via extension.',
      completed: hasAddedJob,
      action: () => navigate('/jobs'),
      btnText: 'Add First Job',
      icon: Briefcase,
    },
    {
      id: 'match',
      title: 'Test Job vs Resume Match Checker',
      desc: 'Compare CV against JD & auto-generate a tailored cover letter.',
      completed: hasCheckedMatch,
      action: () => navigate('/match-checker'),
      btnText: 'Check Match',
      icon: Target,
    },
    {
      id: 'extension',
      title: 'Install 1-Click Job Clipper Extension',
      desc: 'Clip jobs natively from LinkedIn, Bdjobs, and Facebook.',
      completed: false,
      action: () => window.open('https://github.com', '_blank'),
      btnText: 'Get Extension',
      icon: Globe,
    }
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  if (isDismissed || progressPercent === 100) return null;

  return (
    <>
      {/* Sleek, 1-Line Minimal Sidebar Item */}
      <div className={`mb-3 ${isCollapsed ? 'mx-2' : 'mx-4'}`}>
        <button
          onClick={() => setIsOpenModal(true)}
          title={`Setup Guide (${completedCount}/${steps.length} completed)`}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3.5 py-2.5'} rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all duration-200 group relative shadow-sm`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform shrink-0">
              <Sparkles size={16} />
            </div>
            {!isCollapsed && (
              <div className="text-left truncate">
                <span className="text-xs font-bold text-white block leading-tight">
                  Setup Guide
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {completedCount}/{steps.length} completed
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <ChevronRight size={13} className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          )}

          {isCollapsed && (
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[8px] flex items-center justify-center">
              {completedCount}
            </span>
          )}
        </button>
      </div>

      {/* Render Modal via React Portal directly into document.body to escape Sidebar overflow & transform */}
      {isOpenModal && typeof document !== 'undefined' && createPortal(
        <div
          onClick={() => setIsOpenModal(false)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Ambient Glow */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Career OS Setup Guide</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {completedCount} of {steps.length} recommended steps completed ({progressPercent}%)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Steps List */}
            <div className="space-y-3 mb-6 relative z-10">
              {steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      step.completed
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 ${
                          step.completed
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="truncate">
                        <h4
                          className={`text-sm font-bold truncate ${
                            step.completed
                              ? 'text-emerald-400 line-through opacity-75'
                              : 'text-white'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {step.desc}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {step.completed ? (
                        <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400">
                          <CheckCircle2 size={18} />
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setIsOpenModal(false);
                            step.action();
                          }}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-xs transition-all flex items-center gap-1 shadow-sm active:scale-95 whitespace-nowrap"
                        >
                          <span>{step.btnText}</span> <ArrowRight size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-500 relative z-10">
              <span>Automatic progress sync</span>
              <button
                onClick={() => {
                  setIsDismissed(true);
                  localStorage.setItem('hide_sidebar_setup_item', 'true');
                  setIsOpenModal(false);
                }}
                className="text-slate-400 hover:text-rose-400 transition-colors font-medium"
              >
                Dismiss Setup Guide
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
