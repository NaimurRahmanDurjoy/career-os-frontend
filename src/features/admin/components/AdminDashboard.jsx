import React, { useEffect, useState } from 'react';
import { Users, FileText, CheckSquare, LogOut, Loader2, ArrowRight } from 'lucide-react';

export default function AdminDashboard({ adminUser, onLogout }) {
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
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
            {/* Top Navbar */}
            <header className="fixed top-0 inset-x-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
                        C
                    </div>
                    <span className="font-semibold text-white tracking-tight">Admin OS</span>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">Logged in as <strong className="text-white">{adminUser.name}</strong></span>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 px-6 md:px-8 max-w-7xl mx-auto pb-12">
                <div className="flex flex-col gap-2 mb-10">
                    <h1 className="text-3xl font-bold text-white">Platform Metrics</h1>
                    <p className="text-slate-400">Overview of application usage and statistics.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20 text-slate-500">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : metrics ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Metric Card 1 */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                                    <Users className="h-5 w-5 text-emerald-500" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">Total Users</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-white">{metrics.total_users}</h3>
                            </div>
                        </div>

                        {/* Metric Card 2 */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 bg-indigo-500/10 rounded-lg flex items-center justify-center border border-indigo-500/20">
                                    <FileText className="h-5 w-5 text-indigo-500" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">Resumes Parsed</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-white">{metrics.total_resumes}</h3>
                            </div>
                        </div>

                        {/* Metric Card 3 */}
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-700 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                                    <CheckSquare className="h-5 w-5 text-amber-500" />
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">Mock Tests Taken</p>
                            <div className="mt-2 flex items-baseline gap-2">
                                <h3 className="text-3xl font-bold text-white">{metrics.total_mock_tests}</h3>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
                        Failed to load metrics.
                    </div>
                )}
            </main>
        </div>
    );
}
