import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, colorClass }) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300 shadow-sm hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">{title}</span>
                <div className={`p-2 rounded-lg ${colorClass}`}>
                    <Icon size={20} />
                </div>
            </div>
            <div>
                <span className="text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
                    {value}
                </span>
                {subtitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}
