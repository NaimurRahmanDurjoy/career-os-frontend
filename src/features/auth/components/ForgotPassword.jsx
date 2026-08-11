import React, { useState } from 'react';
import { Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '../services/authApi';

export default function ForgotPassword({ onSwitchToLogin }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        try {
            await authApi.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/50 rounded-[2rem] p-10 shadow-2xl shadow-emerald-900/5 dark:shadow-emerald-900/20 space-y-8 relative z-10">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight">Recover Password</h2>
                    <p className="text-slate-500 dark:text-emerald-200/60 text-sm font-medium">We'll send a password reset link to your email.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="text-xs font-medium">{error}</span>
                    </div>
                )}

                {success ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-xl text-center space-y-4">
                        <CheckCircle2 className="h-10 w-10 mx-auto" />
                        <div className="space-y-1">
                            <h3 className="font-bold text-sm">Check your inbox</h3>
                            <p className="text-xs font-medium opacity-80">We've sent a password reset link to {email}. It will expire in 60 minutes.</p>
                        </div>
                        <button
                            onClick={onSwitchToLogin}
                            className="mt-2 text-xs font-bold uppercase tracking-widest hover:text-emerald-500 transition-colors"
                        >
                            Return to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm shadow-sm dark:shadow-inner dark:shadow-black/20"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] border border-emerald-400/30"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>
                )}

                <div className="text-center pt-2">
                    <button
                        onClick={onSwitchToLogin}
                        className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
}
