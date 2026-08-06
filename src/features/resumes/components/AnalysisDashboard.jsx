import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { CheckCircle, Sparkles, User, ShieldAlert, ListFilter, Mail, Phone } from 'lucide-react';

export default function AnalysisDashboard() {
  const analysisData = useResumeStore((state) => state.analysisData);
  const clearAnalysisState = useResumeStore((state) => state.clearAnalysisState);

  // data not coming render blank or loading state handler
  if (!analysisData) return null;

  // backend new architecture defensive destructuring
  const {
    profile = {},
    atsScorecard = {},
    critique = {}
  } = analysisData;

  // safty fallback for missing data 
  const name = profile.name || 'Candidate Name Missing';
  const email = profile.email || 'N/A';
  const phone = profile.phone || 'Not Provided';
  const skills = profile.skills || [];

  const score = atsScorecard.score ?? 0;
  const missingKeywords = atsScorecard.missingKeywords || [];
  const formattingIssues = atsScorecard.formattingIssues || [];

  const summary = critique.summary || 'No review summary provided by the parser.';
  const actionableFixes = critique.actionableFixes || [];

  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50';
      case 'warning': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50';
      default: return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Dashboard Executive Header Control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-500" /> ATS Diagnostics Pipeline
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Runtime analysis completed via semantic contract validation parameters.</p>
        </div>
        <button
          onClick={clearAnalysisState}
          className="text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all self-start sm:self-center shadow-sm"
        >
          Analyze Another Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Metric Block: Performance Scorecard Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-blue-500" /> ATS Scoring Matrix
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-[11px]">Aggregated core compatibility metric.</p>
          </div>
          <div className="flex items-baseline gap-2 py-4">
            <span className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white">{score}</span>
            <span className="text-sm text-slate-400 dark:text-slate-500 font-bold">/ 100</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-200 dark:border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Profile Card Summary Mapping (Updated with Phone, Email and Skills layout) */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <User className="h-4 w-4 text-indigo-500" /> Parsed Contact Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Full Name</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold truncate block">{name}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email Node
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold truncate block" title={email}>{email}</span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone Node
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold truncate block">{phone}</span>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Identified Target Skill Taxonomy</span>
            <div className="flex flex-wrap gap-1.5">
              {skills.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No explicit skills extracted from document.</span>
              ) : (
                skills.map((skill, index) => (
                  <span key={index} className="text-xs font-medium bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 shadow-sm">
                    {skill}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Core Fix Recommendations Mapping */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-amber-500" /> Keyword & Layout Structural Audit
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-red-500 dark:text-red-400 flex items-center gap-1.5">Missing Target Keywords</h4>
              {missingKeywords.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">No missing critical keywords detected.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {missingKeywords.map((keyword, i) => (
                    <span key={i} className="text-xs bg-red-50 dark:bg-red-500/5 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/10 px-2 py-0.5 rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1.5">Formatting Anomalies</h4>
              {formattingIssues.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">Formatting tree is compliant with standard machine parsing layout guidelines.</p>
              ) : (
                <ul className="text-xs text-slate-700 dark:text-slate-300 list-disc pl-4 space-y-1 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                  {formattingIssues.map((issue, i) => <li key={i}>{issue}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Actionable Feedback Refactoring Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <ListFilter className="h-4 w-4 text-blue-500" /> Actionable Fix Briefing
          </h3>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
            {summary}
          </p>
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {actionableFixes.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/80">No actionable fixes recommended.</p>
            ) : (
              actionableFixes.map((fix, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 flex items-start gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityBadgeClass(fix.severity)}`}>
                    {fix.severity}
                  </span>
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-slate-800 dark:text-slate-300">{fix.section}</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{fix.suggestion}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}