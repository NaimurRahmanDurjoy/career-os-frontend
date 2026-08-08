import React, { useEffect, useState } from 'react';
import { Users, CheckSquare, Loader2, DollarSign, Activity, CreditCard } from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
                const token = localStorage.getItem('admin_token');
                const res = await fetch(`${baseUrl}/admin/dashboard`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMetrics(data);
                } else if (res.status === 401) {
                    onLogout();
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [onLogout]);

    return (
        <>
            <div className="flex flex-col gap-2 mb-10">
                <h1 className="text-3xl font-bold text-white">Platform Metrics</h1>
                <p className="text-slate-400">Overview of application usage and subscription revenue.</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : metrics ? (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                                    <DollarSign className="h-5 w-5 text-emerald-500" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">Revenue</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-white">৳{metrics.revenue_bdt || 0}</h3>
                                <span className="text-sm text-slate-500">/ ${metrics.revenue_usd || 0}</span>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 bg-blue-500/10 rounded-lg flex items-center justify-center border border-blue-500/20">
                                    <Activity className="h-5 w-5 text-blue-500" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">Active Subs</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-white">{metrics.active_subscriptions || 0}</h3>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                                    <Users className="h-5 w-5 text-indigo-500" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">Total Users</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-white">{metrics.total_users}</h3>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                                    <CheckSquare className="h-5 w-5 text-amber-500" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">Mock Tests Taken</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-white">{metrics.total_mock_tests}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-slate-400" />
                                Recent Transactions
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Gateway</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {metrics.recent_transactions && metrics.recent_transactions.length > 0 ? (
                                        metrics.recent_transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="text-white font-medium">{tx.user?.name}</div>
                                                    <div className="text-xs text-slate-500">{tx.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${tx.gateway === 'stripe' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                                        {tx.gateway}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-white">
                                                    {tx.currency === 'BDT' ? '৳' : '$'}{tx.amount}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {new Date(tx.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
                                                        Paid
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                                No paid transactions found yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
                    Failed to load metrics.
                </div>
            )}
        </>
    );
}
