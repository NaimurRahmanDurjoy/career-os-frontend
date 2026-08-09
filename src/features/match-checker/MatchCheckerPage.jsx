import React, { useState, useEffect } from 'react';
import { Target, Zap, AlertCircle, RefreshCw, FileText, Copy, CheckCircle2 } from 'lucide-react';
import { useMatchCheckerStore } from './store/useMatchCheckerStore';
import { useResumeStore } from '../resumes/store/useResumeStore';
import { useAuthStore } from '../auth/store/useAuthStore';
import PaywallModal from '../../components/common/PaywallModal';

export default function MatchCheckerPage() {
    const { evaluationCache, coverLetterCache, isEvaluating, isGeneratingLetter, error, evaluateMatch, generateCoverLetter, clearEvaluation } = useMatchCheckerStore();
    const { resumes, fetchResumes } = useResumeStore();
    const user = useAuthStore((state) => state.user);

    const [copiedLetter, setCopiedLetter] = useState(false);
    const [isPaywallOpen, setIsPaywallOpen] = useState(false);

    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    useEffect(() => {
        // Auto-select primary resume if available
        if (resumes.length > 0 && !selectedResumeId) {
            const primary = resumes.find(r => r.is_primary) || resumes[0];
            setSelectedResumeId(primary.id);
        }
    }, [resumes, selectedResumeId]);

    const handleCheck = async () => {
        if (user && !user.limits?.job_match) {
            setIsPaywallOpen(true);
            return;
        }
        if (!selectedResumeId || !jobDescription.trim()) return;
        await evaluateMatch(selectedResumeId, jobDescription);
    };

    const handleGenerateCoverLetterClick = async () => {
        if (user && !user.limits?.job_match) {
            setIsPaywallOpen(true);
            return;
        }
        if (!selectedResumeId || !jobDescription.trim()) return;
        await generateCoverLetter(selectedResumeId, jobDescription);
    };

    const handleClear = () => {
        setJobDescription('');
        clearEvaluation();
    };

    const handleCopyLetter = () => {
        if (coverLetterCache) {
            navigator.clipboard.writeText(coverLetterCache);
            setCopiedLetter(true);
            setTimeout(() => setCopiedLetter(false), 2000);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-rose-500';
    };

    return (
        <div className="md:px-8 max-w-[1600px] w-full mx-auto relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300 flex items-center gap-3">
                        <Target size={28} className="text-indigo-500" />
                        CV vs JD Match Checker
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 transition-colors duration-300">
                        Paste a job description below to see how well it matches your resume before you decide to apply.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Column */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                            Select Resume
                        </label>
                        <select
                            value={selectedResumeId}
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all dark:text-white font-medium cursor-pointer mb-6"
                        >
                            <option value="" disabled>Select a resume...</option>
                            {resumes.map(r => (
                                <option key={r.id} value={r.id}>
                                    {r.version_name || 'Main Version'} {r.is_primary ? '(Primary)' : ''}
                                </option>
                            ))}
                        </select>

                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                            Paste Job Description
                        </label>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all dark:text-white h-64 resize-none mb-6 text-sm leading-relaxed"
                            placeholder="Copy & paste the raw job requirements here..."
                        />

                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={handleCheck}
                                disabled={isEvaluating || !selectedResumeId || !jobDescription.trim()}
                                className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                {isEvaluating ? (
                                    <><RefreshCw size={18} className="animate-spin" /> Analyzing...</>
                                ) : (
                                    <><Zap size={18} /> Check Match</>
                                )}
                            </button>
                            <button
                                onClick={handleClear}
                                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-colors"
                            >
                                Reset
                            </button>
                        </div>

                        <button
                            onClick={handleGenerateCoverLetterClick}
                            disabled={isGeneratingLetter || !selectedResumeId || !jobDescription.trim()}
                            className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl transition-all border border-slate-200 dark:border-slate-700/50 hover:bg-slate-200 dark:hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                        >
                            {isGeneratingLetter ? (
                                <><RefreshCw size={18} className="animate-spin" /> Drafting Letter...</>
                            ) : (
                                <><FileText size={18} /> Generate Cover Letter</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Output Column */}
                <div>
                    {error ? (
                        <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 p-6 rounded-2xl flex items-start gap-4">
                            <AlertCircle size={24} className="shrink-0" />
                            <div>
                                <h3 className="font-bold mb-1">Analysis Error</h3>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    ) : evaluationCache ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500"></div>

                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-1">Match Score</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-6xl font-black tracking-tighter ${getScoreColor(evaluationCache.match_score)}`}>
                                            {evaluationCache.match_score}
                                        </span>
                                        <span className="text-2xl text-slate-400 font-bold">/100</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wide
                                        ${evaluationCache.match_score >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                            evaluationCache.match_score >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                                        {evaluationCache.verdict.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100 mb-3 uppercase tracking-wide text-sm">
                                        <Zap size={16} className="text-emerald-500" /> Key Strengths
                                    </h4>
                                    <ul className="space-y-2">
                                        {evaluationCache.strengths?.map((str, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                <div className="min-w-1.5 min-h-1.5 bg-emerald-500 rounded-full mt-1.5"></div>
                                                {str}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100 mb-3 uppercase tracking-wide text-sm">
                                        <AlertCircle size={16} className="text-amber-500" /> Missing Skills / Gaps
                                    </h4>
                                    {evaluationCache.missing_skills?.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {evaluationCache.missing_skills.map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 rounded-lg text-xs font-bold">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-slate-500 italic">No major skill gaps detected!</p>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        <strong className="text-slate-800 dark:text-slate-200">Recommendation:</strong> {evaluationCache.recommendation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {!evaluationCache && !coverLetterCache && !error && (
                        <div className="h-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 dark:bg-slate-900/20">
                            <Target size={48} className="text-indigo-200 dark:text-indigo-900/50 mb-4" />
                            <h3 className="font-bold text-slate-400 dark:text-slate-500 mb-2">Ready to evaluate</h3>
                            <p className="text-sm text-slate-400 dark:text-slate-600 max-w-xs">
                                Select a resume and paste a job description. We'll extract the requirements and compare them to your profile instantly.
                            </p>
                        </div>
                    )}

                    {coverLetterCache && (
                        <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex justify-between items-end mb-4">
                                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide flex items-center gap-2">
                                    <FileText size={16} className="text-indigo-500" /> Professional Cover Letter
                                </h3>
                                <button
                                    onClick={handleCopyLetter}
                                    className="text-xs flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/40 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    {copiedLetter ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                                    {copiedLetter ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <div className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif p-5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/50">
                                {coverLetterCache}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <PaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setIsPaywallOpen(false)}
                onUpgrade={() => window.dispatchEvent(new CustomEvent('changeView', { detail: 'billing' }))}
                featureName="Job Match Checker"
            />
        </div>
    );
}
