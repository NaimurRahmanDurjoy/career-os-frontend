import React, { useState } from 'react';
import { X, AlertCircle, ArrowUpCircle } from 'lucide-react';
import { useJobsStore } from '../store/useJobsStore';

export default function RejectionAnalysisModal({ job, isOpen, onClose }) {
    const { analyzeRejection } = useJobsStore();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setAnalysis(null);
                setError(null);
            }, 300);
        }
    }, [isOpen]);

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await analyzeRejection(job.id);
            setAnalysis(data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to analyze rejection.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-rose-50 dark:bg-rose-950/20">
                    <div>
                        <h2 className="font-bold text-lg text-rose-900 dark:text-rose-400 flex items-center gap-2">
                            <AlertCircle size={18} className="text-rose-500" />
                            Rejection Analysis
                        </h2>
                        <p className="text-xs text-rose-700/70 dark:text-rose-300/60 font-medium">Insights for {job.role} @ {job.company_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-rose-100/50 dark:bg-rose-900/40 hover:bg-rose-200 dark:hover:bg-rose-800/60 rounded-full transition-colors text-rose-500 dark:text-rose-400">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950 min-h-[300px]">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500 mb-4"></div>
                            <p className="text-rose-600 dark:text-rose-400 font-bold tracking-widest uppercase text-sm animate-pulse">Analyzing Mismatch...</p>
                        </div>
                    ) : error ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-8">
                            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/40 text-rose-500 rounded-full flex items-center justify-center mb-4">
                                <X size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Analysis Failed</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">{error}</p>
                        </div>
                    ) : analysis ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
                                    <AlertCircle size={16} className="text-rose-500" /> Probable Reasons
                                </h3>
                                <ul className="space-y-2">
                                    {analysis.reasons.map((r, i) => (
                                        <li key={i} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300">
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
                                    <ArrowUpCircle size={16} className="text-emerald-500" /> Areas for Improvement
                                </h3>
                                <ul className="space-y-2">
                                    {analysis.improvement_suggestions.map((r, i) => (
                                        <li key={i} className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300">
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-8">
                            <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mb-6 border border-rose-200 dark:border-rose-800/50">
                                <AlertCircle size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">Discover Growth Opportunities</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 max-w-md">
                                Rejection is redirection. Let AI analyze your resume against this specific job's requirements to identify critical skills you might be missing, helping you refine your approach for the next application.
                            </p>
                            <button
                                onClick={handleAnalyze}
                                className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                            >
                                <AlertCircle size={18} />
                                Uncover Insights
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
