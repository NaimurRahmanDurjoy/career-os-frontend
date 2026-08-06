import React, { useEffect } from 'react';
import { useDashboardStore } from './store/useDashboardStore';
import StatCard from './components/StatCard';
import WeeklyChart from './components/WeeklyChart';
import StatusBreakdown from './components/StatusBreakdown';
import { Briefcase, Target, Award, UserX, Loader2 } from 'lucide-react';

export default function DashboardPage() {
    const { fetchStats, stats, loading, error } = useDashboardStore();

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (loading) {
        return (
            <div className="h-full w-full flex items-center justify-center text-emerald-500">
                <Loader2 className="animate-spin h-8 w-8 mr-3" />
                <span className="font-bold uppercase tracking-widest text-sm">Aggregating Metrics...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-900/50">
                <h3 className="font-bold text-lg mb-2">Failed to load analytics</h3>
                <p>{error}</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="md:px-8 max-w-[1600px] w-full mx-auto pb-10">
            {/* Header section */}
            <div className="mb-8 pb-5 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">
                    Overview
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 transition-colors duration-300">
                    Your job search performance and application pipeline analytics.
                </p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Applications"
                    value={stats.total}
                    icon={Briefcase}
                    colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                />
                <StatCard
                    title="Interview Rate"
                    value={`${stats.interview_rate}%`}
                    subtitle={`${stats.interview} Interviews Scheduled`}
                    icon={Target}
                    colorClass="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                />
                <StatCard
                    title="Success Rate"
                    value={`${stats.success_rate}%`}
                    subtitle={`${stats.offer} Offers Received`}
                    icon={Award}
                    colorClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                />
                <StatCard
                    title="Rejection Rate"
                    value={`${stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0}%`}
                    subtitle={`${stats.rejected} Applications Rejected`}
                    icon={UserX}
                    colorClass="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                />
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors duration-300 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Application Activity</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">Weekly trend of submitted applications</p>
                    <WeeklyChart data={stats.weekly_data} />
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 transition-colors duration-300 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Pipeline Breakdown</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium">Current status distribution</p>
                    <StatusBreakdown stats={stats} />
                </div>
            </div>
        </div>
    );
}
