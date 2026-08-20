import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { registerSchema } from '../validations/authValidation'; // 🎯 স্কিমা ইমপোর্ট করা হলো
import { Loader2, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaLinkedin } from "react-icons/fa";

export default function Register({ onSwitchToLogin }) {
    const register = useAuthStore((state) => state.register);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        passwordConfirmation: ''
    });

    // 🏢 সিনিয়র আর্কিটেকচার: ফিল্ড-স্পেসিফিক এবং সার্ভার এরর আলাদা করা
    const [fieldErrors, setFieldErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSocialLogin = (provider) => {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
        window.location.href = `${backendUrl}/auth/${provider}/redirect`;
    };

    // জেনিরিক ইনপুট চেঞ্জার (কোড ক্লিন রাখার জন্য)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // ইউজার টাইপ করা শুরু করলে সংশ্লিষ্ট এরর মুছে যাবে
        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setServerError('');

        // 🛡️ লেয়ার ১: Zod ক্লায়েন্ট-সাইড সিঙ্ক ভ্যালিডেশন
        const validationResult = registerSchema.safeParse(formData);

        if (!validationResult.success) {
            const formattedErrors = {};
            validationResult.error.errors.forEach((error) => {
                formattedErrors[error.path[0]] = error.message;
            });
            setFieldErrors(formattedErrors);
            return; // ব্যাকএন্ডে হিট করা ব্লক
        }

        setIsSubmitting(true);

        try {
            // 🚀 লেয়ার ২: ব্যাকএন্ড রিকোয়েস্ট ফায়ার
            await register(formData.name, formData.email, formData.password, formData.passwordConfirmation);
        } catch (err) {
            if (err.response?.status === 422) {
                // ল্যারাভেলের স্নেক_কেস 'password_confirmation' এররকে ফ্রন্টএন্ডের ক্যামেলকেসে ম্যাপ করা
                const laravelErrors = err.response?.data?.errors;
                const formattedBackendErrors = {};
                if (laravelErrors) {
                    Object.keys(laravelErrors).forEach((key) => {
                        const camelKey = key === 'password_confirmation' ? 'passwordConfirmation' : key;
                        formattedBackendErrors[camelKey] = laravelErrors[key][0];
                    });
                }
                setFieldErrors(formattedBackendErrors);
            } else {
                setServerError(err.response?.data?.message || 'Registration infrastructure pipeline failure.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background glow effects strictly for Auth */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-slate-700/50 rounded-[2rem] p-10 shadow-2xl shadow-indigo-900/5 dark:shadow-indigo-900/20 space-y-8 relative z-10 my-8">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center space-x-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-full px-4 py-1.5 mb-4">
                        <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Career OS Pro</span>
                    </div>
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight">Create Account</h2>
                    <p className="text-slate-500 dark:text-indigo-200/60 text-sm font-medium">Join Career OS and optimize your application pipeline</p>
                </div>

                {serverError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{serverError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name Field */}
                    <div className="relative mt-2">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder=" "
                            className={`peer w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border ${fieldErrors.name ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700/50 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 transition-all text-sm shadow-sm dark:shadow-inner dark:shadow-black/20`}
                        />
                        <label
                            htmlFor="name"
                            className={`absolute left-11 px-1.5 bg-white dark:bg-slate-900 transition-all duration-200 pointer-events-none 
                            ${fieldErrors.name ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400 peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400'} 
                            -top-2.5 text-[10px] font-bold uppercase tracking-widest
                            peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal
                            peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest`}
                        >
                            Full Name
                        </label>
                        <User className={`absolute left-4 top-[15px] h-5 w-5 pointer-events-none transition-colors ${fieldErrors.name ? 'text-red-500/50 dark:text-red-400/50' : 'text-slate-400 dark:text-slate-500 peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400'}`} />
                        {fieldErrors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">{fieldErrors.name}</p>}
                    </div>

                    {/* Email Address Field */}
                    <div className="relative mt-6">
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder=" "
                            className={`peer w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border ${fieldErrors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700/50 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 transition-all text-sm shadow-sm dark:shadow-inner dark:shadow-black/20`}
                        />
                        <label
                            htmlFor="email"
                            className={`absolute left-11 px-1.5 bg-white dark:bg-slate-900 transition-all duration-200 pointer-events-none 
                            ${fieldErrors.email ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400 peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400'} 
                            -top-2.5 text-[10px] font-bold uppercase tracking-widest
                            peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal
                            peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest`}
                        >
                            Email Address
                        </label>
                        <Mail className={`absolute left-4 top-[15px] h-5 w-5 pointer-events-none transition-colors ${fieldErrors.email ? 'text-red-500/50 dark:text-red-400/50' : 'text-slate-400 dark:text-slate-500 peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400'}`} />
                        {fieldErrors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">{fieldErrors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="relative mt-6">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder=" "
                            className={`peer w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border ${fieldErrors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700/50 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 transition-all text-sm shadow-sm dark:shadow-inner dark:shadow-black/20`}
                        />
                        <label
                            htmlFor="password"
                            className={`absolute left-11 px-1.5 bg-white dark:bg-slate-900 transition-all duration-200 pointer-events-none 
                            ${fieldErrors.password ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400 peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400'} 
                            -top-2.5 text-[10px] font-bold uppercase tracking-widest
                            peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal
                            peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest`}
                        >
                            Password
                        </label>
                        <Lock className={`absolute left-4 top-[15px] h-5 w-5 pointer-events-none transition-colors ${fieldErrors.password ? 'text-red-500/50 dark:text-red-400/50' : 'text-slate-400 dark:text-slate-500 peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400'}`} />
                        {fieldErrors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">{fieldErrors.password}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative mt-6">
                        <input
                            type="password"
                            name="passwordConfirmation"
                            id="passwordConfirmation"
                            value={formData.passwordConfirmation}
                            onChange={handleInputChange}
                            placeholder=" "
                            className={`peer w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border ${fieldErrors.passwordConfirmation ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-slate-700/50 focus:border-indigo-500 focus:ring-indigo-500'} rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 transition-all text-sm shadow-sm dark:shadow-inner dark:shadow-black/20`}
                        />
                        <label
                            htmlFor="passwordConfirmation"
                            className={`absolute left-11 px-1.5 bg-white dark:bg-slate-900 transition-all duration-200 pointer-events-none 
                            ${fieldErrors.passwordConfirmation ? 'text-red-500 dark:text-red-400' : 'text-slate-500 dark:text-slate-400 peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400'} 
                            -top-2.5 text-[10px] font-bold uppercase tracking-widest
                            peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal
                            peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest`}
                        >
                            Confirm Password
                        </label>
                        <Lock className={`absolute left-4 top-[15px] h-5 w-5 pointer-events-none transition-colors ${fieldErrors.passwordConfirmation ? 'text-red-500/50 dark:text-red-400/50' : 'text-slate-400 dark:text-slate-500 peer-focus:text-indigo-500 dark:peer-focus:text-indigo-400'}`} />
                        {fieldErrors.passwordConfirmation && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium pl-1">{fieldErrors.passwordConfirmation}</p>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold py-3.5 px-4 rounded-xl hover:from-indigo-400 hover:to-indigo-500 transition-all duration-300 flex items-center justify-center gap-2 text-sm disabled:opacity-50 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.4)] border border-indigo-400/30 mt-4">
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Register'}
                    </button>
                </form>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700/50"></div>
                    <span className="flex-shrink mx-4 text-slate-500 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        Or continue with
                    </span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700/50"></div>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => handleSocialLogin('google')}
                        type="button"
                        className="w-14 h-14 flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700/50 rounded-xl transition-all duration-300 group"
                        aria-label="Continue with Google"
                    >
                        <FcGoogle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        onClick={() => handleSocialLogin('facebook')}
                        type="button"
                        className="w-14 h-14 flex items-center justify-center bg-[#1877F2]/5 dark:bg-[#1877F2]/10 hover:bg-[#1877F2]/10 dark:hover:bg-[#1877F2]/20 border border-[#1877F2]/10 dark:border-[#1877F2]/20 rounded-xl transition-all duration-300 group"
                        aria-label="Continue with Facebook"
                    >
                        <FaFacebook className="h-6 w-6 text-[#1877F2] dark:text-[#589BFF] group-hover:scale-110 transition-transform" />
                    </button>

                    <button
                        onClick={() => handleSocialLogin('linkedin')}
                        type="button"
                        className="w-14 h-14 flex items-center justify-center bg-[#0A66C2]/5 dark:bg-[#0A66C2]/10 hover:bg-[#0A66C2]/10 dark:hover:bg-[#0A66C2]/20 border border-[#0A66C2]/10 dark:border-[#0A66C2]/20 rounded-xl transition-all duration-300 group"
                        aria-label="Continue with LinkedIn"
                    >
                        <FaLinkedin className="h-6 w-6 text-[#0A66C2] dark:text-[#3B8DEB] group-hover:scale-110 transition-transform" />
                    </button>
                </div>

                <p className="text-sm text-center text-slate-500 dark:text-slate-400 font-medium">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-gold-400 transition-colors">Sign In</button>
                </p>
            </div>
        </div>
    );
}