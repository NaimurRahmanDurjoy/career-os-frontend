import React, { useEffect, useState } from 'react';
import { CreditCard, Wallet, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../auth/store/useAuthStore';

export default function BillingDashboard() {
    const { user } = useAuthStore();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const token = localStorage.getItem('token');
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
                const res = await fetch(`${baseUrl}/billing/plans`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setPlans(data.plans || []);
            } catch (err) {
                setError('Failed to load subscription plans.');
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleCheckout = async (gateway, planId) => {
        setCheckoutLoading(true);
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

            // Redirect to Hosted Checkout
            window.location.href = data.checkout_url;

        } catch (err) {
            setError(err.message);
            setCheckoutLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500 h-8 w-8" /></div>;

    return (
        <div className="md:px-8 max-w-[1600px] w-full mx-auto relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300 flex items-center gap-3">
                        <CreditCard size={28} className="text-indigo-500" />
                        Upgrade to Career OS Pro
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 transition-colors duration-300">
                        Get unlimited access to AI Mock Tests, advanced resume parsing, and priority support.
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 mb-8">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8 w-full">
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
                                    disabled={checkoutLoading}
                                    className={`w-full relative group font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-colors text-xs lg:text-sm ${plan.popular ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-900 dark:text-emerald-400 border border-emerald-200 dark:border-slate-700' : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700'}`}
                                >
                                    {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wallet className={`h-4 w-4 ${plan.popular ? 'text-emerald-600 dark:text-emerald-500' : 'text-slate-500'}`} />}
                                    Pay via bKash/Local
                                </button>

                                <button
                                    onClick={() => handleCheckout('stripe', plan.id)}
                                    disabled={checkoutLoading}
                                    className={`w-full relative group font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all text-xs lg:text-sm border ${plan.popular ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)] text-white border-indigo-500' : 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                                >
                                    {checkoutLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4 opacity-70" />}
                                    Pay via Stripe/Card
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
