import React, { useState, useEffect } from 'react';
import { useJobsStore } from '../store/useJobsStore';
import { Zap, Loader2, AlertCircle } from 'lucide-react';

export default function AiMatchBadge({ job }) {
    const { analyzeJobMatch, fetchJobMatch } = useJobsStore();

    const [matchData, setMatchData] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);

    // Initial load
    useEffect(() => {
        const loadMatch = async () => {
            const data = await fetchJobMatch(job.id);
            if (data) {
                setMatchData(data);
                if (data.verdict === 'Processing...') {
                    setIsAnalyzing(true);
                }
            }
        };
        loadMatch();
    }, [job.id]);

    // Polling effect if analyzing
    useEffect(() => {
        let interval;
        if (isAnalyzing) {
            interval = setInterval(async () => {
                try {
                    const data = await fetchJobMatch(job.id);
                    if (data && data.verdict !== 'Processing...') {
                        setMatchData(data);
                        setIsAnalyzing(false);
                    }
                } catch (err) {
                    console.error("Polling error", err);
                    setError("Analysis failed");
                    setIsAnalyzing(false);
                }
            }, 3000); // poll every 3s
        }
        return () => clearInterval(interval);
    }, [isAnalyzing, job.id]);

    const handleAnalyze = async () => {
        if (!job.job_description) {
            setError("Requires Job Description");
            // Clear error fast
            setTimeout(() => setError(null), 3000);
            return;
        }

        try {
            setIsAnalyzing(true);
            setError(null);
            await analyzeJobMatch(job.id);
            // the polling loop will catch the processing state
        } catch (err) {
            setIsAnalyzing(false);
            setError(err.response?.data?.message || 'Failed to start AI Match');
        }
    };

    if (error) {
        return (
            <div className="flex items-center text-xs text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-2 py-1 rounded-md border border-rose-200/50 dark:border-rose-800 tracking-wide mt-2">
                <AlertCircle size={12} className="mr-1" />
                {error}
            </div>
        );
    }

    if (isAnalyzing) {
        return (
            <div className="flex items-center text-xs text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-md border border-indigo-200/50 dark:border-indigo-800 tracking-wide mt-2">
                <Loader2 size={12} className="mr-1 animate-spin" />
                Analyzing Match...
            </div>
        );
    }

    if (!matchData) {
        return (
            <button
                onClick={handleAnalyze}
                title={!job.job_description ? 'Edit job to add a Job Description first' : 'Analyze match score'}
                className="flex items-center text-[10px] uppercase font-bold text-slate-500 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800/50 dark:hover:bg-indigo-900/40 px-2 py-1 rounded border border-slate-200 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors mt-2"
            >
                <Zap size={11} className="mr-1" fill="currentColor" />
                AI Match
            </button>
        );
    }

    // Determine color based on score
    const score = matchData.match_score || 0;
    let badgeColor = 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700';

    if (score >= 80) badgeColor = 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 shadow-emerald-500/10';
    else if (score >= 60) badgeColor = 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/50 shadow-amber-500/10';
    else if (score > 0) badgeColor = 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/50 shadow-rose-500/10';

    return (
        <div
            title={matchData.verdict}
            className={`flex items-center w-fit text-[11px] font-bold px-2 py-1 rounded-md border shadow-sm tracking-wide mt-2 cursor-help transition-all group ${badgeColor}`}
        >
            <Zap size={12} className="mr-1" fill="currentColor" />
            Score: {score}%
        </div>
    );
}
