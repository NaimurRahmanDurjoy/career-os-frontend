import React, { useEffect, useState } from 'react';
import { CreditCard, Wallet, Check, AlertCircle, Loader2, Activity, History, Clock } from 'lucide-react';
import { useAuthStore } from '../../auth/store/useAuthStore';

export default function BillingDashboard() {
    const { user } = useAuthStore();
    const [plans, setPlans] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(null);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

                const [plansRes, historyRes] = await Promise.all([
                    fetch(`${baseUrl}/billing/plans`, { headers: { 'Authorization': `Bearer ${token}` } }),
                    fetch(`${baseUrl}/billing/history`, { headers: { 'Authorization': `Bearer ${token}` } })
                ]);

                const plansData = await plansRes.json();
                const historyData = await historyRes.json();

                setPlans(plansData.plans || []);
                setTransactions(historyData.transactions || []);
            } catch (err) {
                setError('Failed to load billing data.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCheckout = async (gateway, planId) => {
        setCheckoutLoading(`${gateway}-${planId}`);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
            const res = await fetch(`${baseUrl}/billing/checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ gateway, plan_id: planId })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Checkout failed');

            window.location.href = data.checkout_url;

        } catch (err) {
            setError(err.message);
            setCheckoutLoading(null);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500 h-8 w-8" /></div>;

    const navTabs = [
        { id: 'overview', label: 'Overview & Usage', icon: Activity },
        { id: 'plans', label: 'Upgrade Plan', icon: CreditCard },
        { id: 'history', label: 'Billing History', icon: History }
    ];

    return (
        <div className="md:px-8 max-w-[1600px] w-full mx-auto relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <CreditCard size={28} className="text-indigo-500" />
                        Billing & Usage
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
                        Manage your subscription, view current limits, and access your invoice history.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 mb-8">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-2 mb-8 bg-slate-100 p-1.5 rounded-2xl dark:bg-slate-900/50 w-full sm:w-fit custom-scrollbar overflow-x-auto">
                {navTabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700/50'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                                }`}
                        >
                            <Icon size={16} className={activeTab === tab.id ? 'text-indigo-500' : ''} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8">
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-800/50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Subscription</h3>
                                <p className="text-sm font-medium tracking-wide text-indigo-500 flex items-center gap-1.5 mt-1">
                                    <Check size={14} className="text-emerald-500" />
                                    {user?.current_plan?.name}
                                </p>
                            </div>
                            <div className="text-right">
                                {user?.current_plan?.days_remaining !== null ? (
                                    <>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{user?.current_plan?.days_remaining}</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Days Left</p>
                                    </>
                                ) : (
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Free Tier</span>
                                )}
                            </div>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-widest uppercase mb-6">Current Cycle Usage</h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Ai Mock Tests bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-700 dark:text-slate-300">AI Mock Tests</span>
                                    <span className="text-slate-500">{user?.usage?.mock_tests || 0} / {user?.limits?.mock_tests === -1 ? '∞' : user?.limits?.mock_tests}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 transition-all rounded-full"
                                        style={{ width: `${user?.limits?.mock_tests === -1 ? 100 : Math.min(100, ((user?.usage?.mock_tests || 0) / (user?.limits?.mock_tests || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Resumes bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-700 dark:text-slate-300">Resume Analyses</span>
                                    <span className="text-slate-500">{user?.usage?.resumes || 0} / {user?.limits?.resumes === -1 ? '∞' : user?.limits?.resumes}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 transition-all rounded-full"
                                        style={{ width: `${user?.limits?.resumes === -1 ? 100 : Math.min(100, ((user?.usage?.resumes || 0) / (user?.limits?.resumes || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* AI Tools bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-700 dark:text-slate-300">AI Tool Invocations</span>
                                    <span className="text-slate-500">{user?.usage?.ai_tools || 0} / {user?.limits?.ai_tools === -1 ? '∞' : user?.limits?.ai_tools}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 transition-all rounded-full"
                                        style={{ width: `${user?.limits?.ai_tools === -1 ? 100 : Math.min(100, ((user?.usage?.ai_tools || 0) / (user?.limits?.ai_tools || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Job Applications bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-700 dark:text-slate-300">Job Applications</span>
                                    <span className="text-slate-500">{user?.usage?.jobs || 0} / {user?.limits?.jobs === -1 ? '∞' : user?.limits?.jobs}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-500 transition-all rounded-full"
                                        style={{ width: `${user?.limits?.jobs === -1 ? 100 : Math.min(100, ((user?.usage?.jobs || 0) / (user?.limits?.jobs || 1)) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* TAB: PLANS */}
            {activeTab === 'plans' && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {plans.map(plan => {
                        const isCurrentPlan = user?.current_plan?.name === plan.name;
                        return (
                            <div key={plan.id} className={`backdrop-blur-xl border rounded-[1.5rem] p-6 flex flex-col relative shadow-xl transition-all h-full ${isCurrentPlan ? 'bg-white dark:bg-slate-900 border-indigo-500/50 ring-2 ring-indigo-500/50 shadow-indigo-900/20 xl:-translate-y-2' : plan.popular ? 'bg-white dark:bg-slate-900/80 border-emerald-500/50 ring-1 ring-emerald-500/50 shadow-emerald-900/20 xl:-translate-y-2' : 'bg-white/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 shadow-slate-900/5 hover:border-slate-300 dark:hover:border-slate-700'}`}>

                                {isCurrentPlan && (
                                    <div className="absolute top-0 right-8 transform -translate-y-1/2 z-10">
                                        <span className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(99,102,241,0.3)] text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full flex items-center gap-1.5">
                                            <Check size={14} /> Current Plan
                                        </span>
                                    </div>
                                )}

                                {plan.popular && !isCurrentPlan && (
                                    <div className="absolute top-0 right-8 transform -translate-y-1/2 z-10">
                                        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full">Most Popular</span>
                                    </div>
                                )}

                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-2 truncate">{plan.name}</h3>

                                <div className="flex items-baseline gap-1.5 mb-6">
                                    <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                        ৳{plan.price_bdt} <span className="text-2xl text-slate-400 font-bold ml-1">| ${plan.price_usd}</span>
                                    </span>
                                    <span className="text-xs text-slate-500 font-medium tracking-wide border px-2 py-0.5 rounded-full border-slate-200 dark:border-slate-800 ml-1">/ 30 Days</span>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-4 text-slate-600 dark:text-slate-300 font-medium text-sm">
                                            <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="space-y-3 mt-auto pt-6">
                                    <button
                                        onClick={() => handleCheckout('sslcommerz', plan.id)}
                                        disabled={checkoutLoading !== null}
                                        className={`w-full relative group font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs lg:text-sm ${plan.popular ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-900 dark:text-emerald-400 border border-emerald-200 dark:border-slate-700' : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                                    >
                                        {checkoutLoading === `sslcommerz-${plan.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className={`h-4 w-4 ${plan.popular ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-500'}`} />}
                                        Pay via bKash/Local
                                    </button>

                                    <button
                                        onClick={() => handleCheckout('stripe', plan.id)}
                                        disabled={checkoutLoading !== null}
                                        className={`w-full relative group font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs lg:text-sm border ${plan.popular ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)] text-white border-indigo-500' : 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                                    >
                                        {checkoutLoading === `stripe-${plan.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4 opacity-70" />}
                                        Pay via Stripe/Card
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* TAB: HISTORY */}
            {activeTab === 'history' && (
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/20 text-xs uppercase tracking-widest text-slate-500">
                                    <th className="font-bold p-6 w-1/4">Date</th>
                                    <th className="font-bold p-6">Plan Name</th>
                                    <th className="font-bold p-6">Amount</th>
                                    <th className="font-bold p-6">Method</th>
                                    <th className="font-bold p-6 w-1/4 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                                            No transaction history found.
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map(tx => (
                                        <tr key={tx.id} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                                            <td className="p-6 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} className="text-slate-400" />
                                                    {new Date(tx.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="p-6 text-sm font-bold text-slate-800 dark:text-slate-100">{tx.plan_id}</td>
                                            <td className="p-6 text-sm font-bold text-slate-800 dark:text-slate-100">{tx.currency} {tx.amount}</td>
                                            <td className="p-6 text-sm font-bold text-slate-500 uppercase">{tx.gateway}</td>
                                            <td className="p-6 text-right">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${tx.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                                                        tx.status === 'failed' ? 'bg-red-500/10 text-red-600 dark:text-red-400' :
                                                            'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                    }`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
