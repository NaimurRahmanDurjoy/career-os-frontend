import React, { useState, useEffect } from 'react';
import { Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { authApi } from '../services/authApi';

export default function ResetPassword({ onSwitchToLogin }) {
    const [formData, setFormData] = useState({ password: '', password_confirmation: '' });
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setToken(params.get('token') || '');
        setEmail(params.get('email') || '');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        try {
            await authApi.resetPassword(token, email, formData.password, formData.password_confirmation);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired password reset link.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token || !email) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center bg-red-500/10 text-red-500 p-6 rounded-2xl max-w-md w-full border border-red-500/20 shadow-2xl">
                    <AlertCircle className="h-10 w-10 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Invalid Link</h2>
                    <p className="text-sm font-medium mb-6 opacity-80">This password reset link is invalid or incomplete. Please request a new one.</p>
                    <button
                        onClick={onSwitchToLogin}
                        className="text-xs font-bold uppercase tracking-widest hover:text-red-400 transition-colors"
                    >
                        Return to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/50 rounded-[2rem] p-10 shadow-2xl shadow-emerald-900/5 dark:shadow-emerald-900/20 space-y-8 relative z-10">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight">Create New Password</h2>
                    <p className="text-slate-500 dark:text-emerald-200/60 text-sm font-medium">Securing account for {email}</p>
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
                            <h3 className="font-bold text-sm">You're all set!</h3>
                            <p className="text-xs font-medium opacity-80">Your password has been successfully reset. You can now log in with your new credentials.</p>
                        </div>
                        <button
                            onClick={() => {
                                window.history.replaceState({}, document.title, window.location.pathname);
                                onSwitchToLogin();
                            }}
                            className="mt-2 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all text-sm"
                        >
                            Sign In Now
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative mt-2">
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                                placeholder=" "
                                className={`peer w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 transition-all text-sm shadow-sm dark:shadow-inner dark:shadow-black/20`}
                            />
                            <label
                                htmlFor="password"
                                className={`absolute left-11 px-1.5 bg-white dark:bg-slate-900 transition-all duration-200 pointer-events-none 
                                text-slate-500 dark:text-slate-400 peer-focus:text-emerald-500 dark:peer-focus:text-emerald-400
                                -top-2.5 text-[10px] font-bold uppercase tracking-widest
                                peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal
                                peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest`}
                            >
                                New Password
                            </label>
                            <Lock className={`absolute left-4 top-[15px] h-5 w-5 pointer-events-none transition-colors text-slate-400 dark:text-slate-500 peer-focus:text-emerald-500 dark:peer-focus:text-emerald-400`} />
                        </div>

                        <div className="relative mt-6 mb-6">
                            <input
                                type="password"
                                id="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData(p => ({ ...p, password_confirmation: e.target.value }))}
                                placeholder=" "
                                className={`peer w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 transition-all text-sm shadow-sm dark:shadow-inner dark:shadow-black/20`}
                            />
                            <label
                                htmlFor="password_confirmation"
                                className={`absolute left-11 px-1.5 bg-white dark:bg-slate-900 transition-all duration-200 pointer-events-none 
                                text-slate-500 dark:text-slate-400 peer-focus:text-emerald-500 dark:peer-focus:text-emerald-400
                                -top-2.5 text-[10px] font-bold uppercase tracking-widest
                                peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal
                                peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest`}
                            >
                                Confirm Password
                            </label>
                            <Lock className={`absolute left-4 top-[15px] h-5 w-5 pointer-events-none transition-colors text-slate-400 dark:text-slate-500 peer-focus:text-emerald-500 dark:peer-focus:text-emerald-400`} />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] border border-emerald-400/30"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
