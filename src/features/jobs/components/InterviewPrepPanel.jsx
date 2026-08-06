import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Bot, AlertCircle, Sparkles } from 'lucide-react';
import { useJobsStore } from '../store/useJobsStore';

export default function InterviewPrepPanel({ job, isOpen, onClose }) {
    const { generateInterviewPrep } = useJobsStore();
    const [questions, setQuestions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setQuestions(null);
                setError(null);
            }, 300);
        } else {
            // Check if AI prep questions already exist in the database for this job to avoid re-generating
            if (job.ai_match && job.ai_match.interview_prep_questions) {
                setQuestions(job.ai_match.interview_prep_questions);
            }
        }
    }, [isOpen, job]);

    const handleGenerate = async () => {
        if (!job.job_description) {
            setError("You must add a job description to this role first to generate targeted interview questions.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await generateInterviewPrep(job.id);
            setQuestions(data.interview_questions);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to generate interview prep.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-0">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg h-full shadow-2xl relative z-10 flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <div>
                        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <Bot size={20} className="text-emerald-500" />
                            AI Interview Simulator
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Preparation for {job.role}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 pretty-scrollbar">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500 mb-4"></div>
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase text-xs">Simulating Interview...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-rose-50 dark:bg-rose-900/10 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-start gap-4 text-rose-700 dark:text-rose-400">
                            <AlertCircle size={20} className="shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold mb-1 text-sm">Pre-flight Error</h3>
                                <p className="text-sm text-rose-600/80 dark:text-rose-400/80">{error}</p>
                            </div>
                        </div>
                    ) : questions ? (
                        <div className="space-y-6">
                            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl text-sm text-emerald-800 dark:text-emerald-300 font-medium border border-emerald-200/50 dark:border-emerald-800/30 flex items-start gap-3">
                                <Sparkles size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                                <div>Practice answering these tailored questions aloud. The AI has provided the 'Why' behind each question to help you structure your responses.</div>
                            </div>

                            {questions.map((q, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-[10px] uppercase font-black px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border ${q.type?.toLowerCase().includes('behavioral') ? 'text-amber-600 border-amber-200 dark:border-amber-800/50' : 'text-blue-600 border-blue-200 dark:border-blue-800/50'
                                            }`}>
                                            {q.type}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-3 leading-snug">Q: {q.question}</h4>
                                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800/50 relative">
                                        <div className="absolute -top-3 left-4 bg-slate-50 dark:bg-slate-950 px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-800/50 rounded flex items-center">
                                            Recruiter Perspective
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                                            {q.strategy}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-xs mx-auto">
                            <div className="w-16 h-16 mb-6 relative">
                                <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping"></div>
                                <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                                    <Bot size={28} />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Ready to Practice?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                                We'll analyze the job description to predict the most likely technical and behavioral questions you'll face.
                            </p>
                            <button
                                onClick={handleGenerate}
                                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 text-sm flex items-center justify-center gap-2"
                            >
                                <Sparkles size={16} /> Generate Questions
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
