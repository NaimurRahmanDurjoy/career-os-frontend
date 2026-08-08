import React from 'react';
import { Lock, X, ArrowRight, Zap, Target, BookOpen } from 'lucide-react';

export default function PaywallModal({ isOpen, onClose, onUpgrade, featureName = "This feature" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">

                {/* Decorative Head */}
                <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-emerald-500/20 to-transparent"></div>

                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors z-10">
                    <X className="h-5 w-5" />
                </button>

                <div className="p-8 pt-10 text-center relative z-10 flex flex-col items-center">

                    <div className="h-16 w-16 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 transform -rotate-6 group-hover:rotate-0 transition-transform">
                        <Lock className="h-8 w-8 text-white" />
                    </div>

                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
                        Unlock {featureName}
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                        You have reached the limit of your current plan. Upgrade to a Pro tier to unlock unlimited access and supercharge your career.
                    </p>

                    <div className="space-y-3 w-full text-left mb-8">
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <Zap className="h-5 w-5 text-emerald-500" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Unlimited AI Mock Tests</span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <Target className="h-5 w-5 text-indigo-500" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Advanced Job Match Checking</span>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <BookOpen className="h-5 w-5 text-amber-500" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Cover Letters & Negotiation</span>
                        </div>
                    </div>

                    <button
                        onClick={() => { onClose(); onUpgrade(); }}
                        className="w-full relative group bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] shadow-emerald-900/10"
                    >
                        <span>View Plans & Upgrade</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button onClick={onClose} className="mt-4 text-sm font-medium text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                        Maybe later
                    </button>

                </div>
            </div>
        </div>
    );
}
