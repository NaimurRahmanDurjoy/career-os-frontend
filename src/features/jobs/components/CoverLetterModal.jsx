import React, { useState } from 'react';
import { X, Copy, CheckCircle2, Download, Zap } from 'lucide-react';
import { useJobsStore } from '../store/useJobsStore';

export default function CoverLetterModal({ job, isOpen, onClose }) {
    const { generateCoverLetter } = useJobsStore();
    const [letter, setLetter] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        if (!isOpen) {
            // Reset when closed
            setTimeout(() => {
                setLetter(null);
                setCopied(false);
                setError(null);
            }, 300);
        }
    }, [isOpen]);

    const handleGenerate = async () => {
        if (!job.job_description) {
            setError("You must add a job description to this role first to generate a tailored cover letter.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await generateCoverLetter(job.id);
            setLetter(data.cover_letter);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to generate cover letter.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (letter) {
            navigator.clipboard.writeText(letter);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownload = () => {
        if (!letter) return;
        const blob = new Blob([letter], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cover_Letter_${job.company_name.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white dark:bg-slate-900 w-full max-w-3xl h-[85vh] rounded-2xl shadow-2xl relative z-10 flex flex-col border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
                    <div>
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                            <Zap size={18} className="text-emerald-500" />
                            AI Cover Letter
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">For {job.role} @ {job.company_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-200/50 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                        <X size={18} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50 relative">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-4"></div>
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase text-sm animate-pulse">Drafting Your Pitch...</p>
                            <p className="text-xs text-slate-500 mt-2 text-center max-w-sm">Combining your primary resume with the job description for the perfect match.</p>
                        </div>
                    ) : error ? (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-full flex items-center justify-center mb-4">
                                <X size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">Generation Failed</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{error}</p>
                            {!job.job_description && (
                                <button onClick={onClose} className="mt-6 px-4 py-2 bg-emerald-500 text-white font-bold rounded-lg text-sm">
                                    Got it
                                </button>
                            )}
                        </div>
                    ) : letter ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm min-h-full whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                            {letter}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-200 dark:border-emerald-800/50">
                                <FileText size={40} />
                            </div>
                            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">Generate Tailored Cover Letter</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                                We will use your <span className="font-bold text-emerald-600 dark:text-emerald-500 focus:outline-none">primary resume</span> and compare it against the job description to craft a unique, highly targeted cover letter.
                            </p>
                            <button
                                onClick={handleGenerate}
                                className="px-8 py-3 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            >
                                <Zap size={18} />
                                Synthesize Cover Letter
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer fixed */}
                {letter && !loading && (
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-white dark:bg-slate-900 rounded-b-2xl">
                        <button
                            onClick={handleCopy}
                            className="px-5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-lg transition-colors flex items-center gap-2"
                        >
                            {copied ? <><CheckCircle2 size={16} className="text-emerald-500" /> Copied</> : <><Copy size={16} /> Copy Text</>}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-5 py-2 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 font-bold text-sm rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Download size={16} />
                            Download TXT
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
