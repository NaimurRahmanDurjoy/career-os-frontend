import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { CheckCircle, Sparkles, User, ShieldAlert, ListFilter, Mail, Phone } from 'lucide-react';

export default function AnalysisDashboard() {
  const analysisData = useResumeStore((state) => state.analysisData);
  const clearAnalysisState = useResumeStore((state) => state.clearAnalysisState);

  // ডেটা না আসা পর্যন্ত ব্ল্যাঙ্ক রেন্ডার বা লোডিং স্টেট হ্যান্ডলার
  if (!analysisData) return null;

  // ব্যাকএন্ডের নতুন আর্কিটেকচারের সাথে ম্যাচ করে ডিফেন্সিভ ডিস্ট্রাকচারিং
  const { 
    profile = {}, 
    atsScorecard = {}, 
    critique = {} 
  } = analysisData;

  // সেফটি ফলব্যাকস (রেজুমিতে ডেটা মিসিং থাকলেও ক্র্যাশ করবে না)
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
      case 'critical': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'warning': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Dashboard Executive Header Control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-500" /> ATS Diagnostics Pipeline
          </h2>
          <p className="text-slate-400 text-xs mt-1">Runtime analysis completed via semantic contract validation parameters.</p>
        </div>
        <button
          onClick={clearAnalysisState}
          className="text-xs font-bold bg-slate-900 border border-slate-800 text-slate-400 hover:text-white px-4 py-2.5 rounded-xl hover:bg-slate-850 transition-all self-start sm:self-center"
        >
          Analyze Another Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Metric Block: Performance Scorecard Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-blue-500" /> ATS Scoring Matrix
            </h3>
            <p className="text-slate-500 text-[11px]">Aggregated core compatibility metric.</p>
          </div>
          <div className="flex items-baseline gap-2 py-4">
            <span className="text-6xl font-black tracking-tighter text-white">{score}</span>
            <span className="text-sm text-slate-500 font-bold">/ 100</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-850">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500" 
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Profile Card Summary Mapping (Updated with Phone, Email and Skills layout) */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <User className="h-4 w-4 text-indigo-500" /> Parsed Contact Identity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</span>
              <span className="text-slate-200 font-semibold truncate block">{name}</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email Node
              </span>
              <span className="text-slate-200 font-semibold truncate block" title={email}>{email}</span>
            </div>
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone Node
              </span>
              <span className="text-slate-200 font-semibold truncate block">{phone}</span>
            </div>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Identified Target Skill Taxonomy</span>
            <div className="flex flex-wrap gap-1.5">
              {skills.length === 0 ? (
                <span className="text-xs text-slate-500 italic">No explicit skills extracted from document.</span>
              ) : (
                skills.map((skill, index) => (
                  <span key={index} className="text-xs font-medium bg-slate-900 text-slate-300 px-2.5 py-1 rounded-md border border-slate-800">
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
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 text-amber-500" /> Keyword & Layout Structural Audit
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-red-400 flex items-center gap-1.5">Missing Target Keywords</h4>
              {missingKeywords.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-950 p-3 rounded-xl border border-slate-850">No missing critical keywords detected.</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {missingKeywords.map((keyword, i) => (
                    <span key={i} className="text-xs bg-red-500/5 text-red-400 border border-red-500/10 px-2 py-0.5 rounded">
                      {keyword}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">Formatting Anomalies</h4>
              {formattingIssues.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-950 p-3 rounded-xl border border-slate-850">Formatting tree is compliant with standard machine parsing layout guidelines.</p>
              ) : (
                <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-850">
                  {formattingIssues.map((issue, i) => <li key={i}>{issue}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Actionable Feedback Refactoring Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <ListFilter className="h-4 w-4 text-blue-500" /> Actionable Fix Briefing
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-850">
            {summary}
          </p>
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {actionableFixes.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-4 bg-slate-950 rounded-xl border border-slate-850">No actionable fixes recommended.</p>
            ) : (
              actionableFixes.map((fix, index) => (
                <div key={index} className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex items-start gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${getSeverityBadgeClass(fix.severity)}`}>
                    {fix.severity}
                  </span>
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-slate-300">{fix.section}</p>
                    <p className="text-slate-400 leading-relaxed">{fix.suggestion}</p>
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