import React, { useState } from 'react';
import { X, Bot, AlertCircle } from 'lucide-react';
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
        }
    }, [isOpen]);

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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-end p-0">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white dark:bg-slate-950 w-full max-w-xl h-full shadow-2xl relative z-10 flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-indigo-50 dark:bg-indigo-950/20">
                    <div>
                        <h2 className="font-black text-xl text-indigo-900 dark:text-indigo-400 flex items-center gap-2">
                            <Bot size={22} className="text-indigo-500" />
                            Interview Simulator
                        </h2>
                        <p className="text-sm text-indigo-700/60 dark:text-indigo-300/60 font-medium">Preparation for {job.role}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-950">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
                            <p className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-sm">Targeting Questions...</p>
                        </div>
                    ) : error ? (
                        <div className="p-6 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-200 dark:border-rose-800 flex items-start gap-4 text-rose-700 dark:text-rose-400">
                            <AlertCircle size={24} className="shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold mb-1">Pre-flight Error</h3>
                                <p className="text-sm">{error}</p>
                            </div>
                        </div>
                    ) : questions ? (
                        <div className="space-y-6">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-xl text-sm text-indigo-800 dark:text-indigo-200 font-medium border border-indigo-200 dark:border-indigo-800/50">
                                Practice answering these tailored questions aloud. The AI has provided the 'Why' behind each question to help you structure your responses.
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
                        <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                            <div className="w-24 h-24 mb-6 relative">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
                                <div className="absolute inset-0 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-500 rounded-full flex items-center justify-center shadow-inner border border-indigo-200 dark:border-indigo-800">
                                    <Bot size={48} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-3 tracking-tight">AI Interview Coaching</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">
                                Analyze the job description and your profile to predict the most likely technical and behavioral questions you'll face.
                            </p>
                            <button
                                onClick={handleGenerate}
                                className="w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/20 text-sm"
                            >
                                Generate Practice Questions
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
