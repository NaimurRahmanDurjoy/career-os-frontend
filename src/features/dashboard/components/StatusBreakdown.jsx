import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function StatusBreakdown({ stats }) {
    const data = [
        { name: 'Applied', value: stats.applied, color: '#3b82f6' }, // blue
        { name: 'Shortlisted', value: stats.shortlisted, color: '#a855f7' }, // purple
        { name: 'Interview', value: stats.interview, color: '#f59e0b' }, // amber
        { name: 'Offer', value: stats.offer, color: '#10b981' }, // emerald
        { name: 'Rejected', value: stats.rejected, color: '#ef4444' }, // red
    ].filter(item => item.value > 0);

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                No applications found in the pipeline.
            </div>
        );
    }

    return (
        <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1e293b',
                            borderColor: '#334155',
                            borderRadius: '0.5rem',
                            color: '#f8fafc'
                        }}
                        itemStyle={{ color: '#f8fafc' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value, entry) => <span className="text-slate-600 dark:text-slate-300 text-sm">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
