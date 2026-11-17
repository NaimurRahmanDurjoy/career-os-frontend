import React, { useState, useEffect } from 'react';
import { CreditCard, Wallet, Check, AlertCircle, Loader2, Activity, History, Clock } from 'lucide-react';
import { useAuthStore } from '../../auth/store/useAuthStore';
import apiClient from '../../../lib/apiClient';

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
                const [plansRes, historyRes] = await Promise.all([
                    apiClient.get('/billing/plans'),
                    apiClient.get('/billing/history')
                ]);

                setPlans(plansRes.data?.plans || []);
                setTransactions(historyRes.data?.transactions || []);
            } catch (err) {
                console.error('Failed to load billing data:', err);
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
            const res = await apiClient.post('/billing/checkout', {
                gateway,
                plan_id: planId
            });

            if (res.data?.checkout_url) {
                window.location.href = res.data.checkout_url;
            } else {
                throw new Error('Checkout URL missing in response');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Checkout failed');
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
                                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-gradient-to-br from-indigo-900/40 via-slate-900/40 to-slate-900/20 border border-indigo-500/20 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                            <div>
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest mb-3">
                                    Current Tier
                                </span>
                                <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                                    {user?.current_plan?.name || 'Free Tier'}
                                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                                        ACTIVE
                                    </span>
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">
                                    {user?.current_plan?.days_remaining !== null
                                        ? `Your subscription renews or expires in ${user.current_plan.days_remaining} days.`
                                        : 'You are on the basic free account with standard monthly quotas.'}
                                </p>
                            </div>

                            <button
                                onClick={() => setActiveTab('plans')}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 text-sm"
                            >
                                <CreditCard size={16} /> Upgrade / Change Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: PLANS */}
            {activeTab === 'plans' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {plans.map(plan => {
                        const isCurrent = user?.current_plan?.id === plan.id;
                        return (
                            <div
                                key={plan.id}
                                className={`bg-white dark:bg-slate-900 border rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${plan.popular
                                        ? 'border-indigo-500 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                                        : 'border-slate-200 dark:border-slate-800'
                                    }`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                                        Most Popular
                                    </span>
                                )}

                                <div>
                                    <div className="flex justify-between items-baseline mb-4">
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white">{plan.name}</h3>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-slate-900 dark:text-white">${plan.price}</span>
                                            <span className="text-xs text-slate-500">/{plan.interval}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">{plan.description}</p>

                                    <div className="space-y-3 mb-8">
                                        {(plan.features || []).map((feat, i) => (
                                            <div key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                                                <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                                    <Check size={12} strokeWidth={3} />
                                                </div>
                                                <span className="font-medium">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2.5 pt-6 border-t border-slate-100 dark:border-slate-800/80">
                                    {isCurrent ? (
                                        <button disabled className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl font-bold text-sm cursor-not-allowed">
                                            Current Active Plan
                                        </button>
                                    ) : (
                                        <>
                                            {/* Local Payment: bKash / Nagad / Rocket */}
                                            <button
                                                onClick={() => handleCheckout('sslcommerz', plan.id)}
                                                disabled={checkoutLoading !== null}
                                                className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-pink-600/20"
                                            >
                                                {checkoutLoading === `sslcommerz-${plan.id}` ? (
                                                    <Loader2 size={15} className="animate-spin" />
                                                ) : (
                                                    <Wallet size={15} />
                                                )}
                                                Pay with bKash / Nagad / Cards (BDT)
                                            </button>

                                            {/* International Payment: Stripe */}
                                            <button
                                                onClick={() => handleCheckout('stripe', plan.id)}
                                                disabled={checkoutLoading !== null}
                                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20"
                                            >
                                                {checkoutLoading === `stripe-${plan.id}` ? (
                                                    <Loader2 size={15} className="animate-spin" />
                                                ) : (
                                                    <CreditCard size={15} />
                                                )}
                                                Pay with Stripe / International Card
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* TAB: HISTORY */}
            {activeTab === 'history' && (
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
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
