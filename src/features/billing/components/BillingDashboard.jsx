import React, { useEffect, useState } from 'react';
import { CreditCard, Wallet, Check, AlertCircle, Loader2 } from 'lucide-react';

export default function BillingDashboard() {
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
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 relative z-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight">Upgrade to Career OS Pro</h1>
                <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-medium">Get unlimited access to AI Mock Tests, advanced resume parsing, and priority support.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3 mb-8">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="grid md:grid-cols-1 gap-8 max-w-lg mx-auto">
                {plans.map(plan => (
                    <div key={plan.id} className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-2xl border border-emerald-500/30 rounded-[2rem] p-8 relative shadow-2xl shadow-emerald-900/10">
                        <div className="absolute top-0 right-8 transform -translate-y-1/2">
                            <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full">Most Popular</span>
                        </div>

                        <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2">{plan.name}</h3>

                        <div className="flex items-baseline gap-2 mb-8">
                            <span className="text-5xl font-black text-slate-900 dark:text-white">৳{plan.price_bdt}</span>
                            <span className="text-slate-500 font-medium">/ 30 Days</span>
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

                        <div className="space-y-4">
                            <button
                                onClick={() => handleCheckout('sslcommerz', plan.id)}
                                disabled={checkoutLoading}
                                className="w-full relative group bg-emerald-50 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-900 dark:text-emerald-400 border border-emerald-200 dark:border-slate-700 font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm"
                            >
                                {checkoutLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />}
                                Pay with bKash / Local Bank
                            </button>

                            <button
                                onClick={() => handleCheckout('stripe', plan.id)}
                                disabled={checkoutLoading}
                                className="w-full relative group bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)] text-white font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all text-sm border border-indigo-500"
                            >
                                {checkoutLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5 text-indigo-200" />}
                                Pay securely with Stripe
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
