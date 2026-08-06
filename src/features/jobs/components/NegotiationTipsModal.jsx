import React, { useState } from 'react';
import { X, Banknote, Sparkles, Copy, CheckCircle2 } from 'lucide-react';
import { useJobsStore } from '../store/useJobsStore';

export default function NegotiationTipsModal({ job, isOpen, onClose }) {
    const { generateNegotiationTips } = useJobsStore();
    const [tips, setTips] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    React.useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setTips(null);
                setError(null);
                setCopied(false);
            }, 300);
        }
    }, [isOpen]);

    const handleGenerate = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await generateNegotiationTips(job.id);
            setTips(data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to generate tips.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (tips?.script_template) {
            navigator.clipboard.writeText(tips.script_template);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/20">
                    <div>
                        <h2 className="font-bold text-lg text-emerald-900 dark:text-emerald-400 flex items-center gap-2">
                            <Banknote size={18} className="text-emerald-500" />
                            Salary Negotiation Strategy
                        </h2>
                        <p className="text-xs text-emerald-700/70 dark:text-emerald-300/60 font-medium">For {job.role} @ {job.company_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-emerald-100/50 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-800/60 rounded-full transition-colors text-emerald-600 dark:text-emerald-400">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950 overflow-y-auto min-h-[300px]">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-4"></div>
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase text-sm animate-pulse">Formulating Strategy...</p>
                        </div>
                    ) : error ? (
                        <div className="h-full flex flex-col items-center justify-center text-center py-8">
                            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/40 text-rose-500 rounded-full flex items-center justify-center mb-4">
                                <X size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Failed to Generate Strategy</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">{error}</p>
                        </div>
                    ) : tips ? (
                        <div className="space-y-6">
                            <div>
                                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wide flex items-center gap-2">
                                    <Sparkles size={16} className="text-emerald-500" /> Your Leverage Points
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {tips.leverage_points.map((point, i) => (
                                        <div key={i} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 leading-relaxed shadow-sm">
                                            {point}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wide">
                                        Email Script Template
                                    </h3>
                                    <button onClick={handleCopy} className="text-xs flex items-center gap-1 font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-1 rounded transition-colors">
                                        {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
                                        {copied ? 'Copied!' : 'Copy Script'}
                                    </button>
                                </div>
                                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-wrap shadow-inner border-l-4 border-l-emerald-400 dark:border-l-emerald-600">
                                    {tips.script_template}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-8">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-200 dark:border-emerald-800/50">
                                <Banknote size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">Congratulations on the Offer!</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 max-w-md">
                                Don't leave money on the table. We will analyze your unique strengths against the job description to give you specific leverage points and a professional script to negotiate a better package.
                            </p>
                            <button
                                onClick={handleGenerate}
                                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                            >
                                <Sparkles size={18} />
                                Build Negotiation Strategy
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
