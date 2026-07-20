import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { registerSchema } from '../validations/authValidation'; // 🎯 স্কিমা ইমপোর্ট করা হলো
import { Loader2, User, Mail, Lock, AlertCircle } from 'lucide-react';

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
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
                <div className="space-y-1 text-center">
                    <h2 className="text-2xl font-black tracking-tight text-white">Create an Account</h2>
                    <p className="text-xs text-slate-400">Join Career OS and optimize your resume analysis pipeline</p>
                </div>

                {serverError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <span className="font-medium">{serverError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name Field */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
                        <div className="relative">
                            <User className={`absolute left-4 top-3.5 h-5 w-5 ${fieldErrors.name ? 'text-red-400' : 'text-slate-500'}`} />
                            <input
                                name="name"
                                type="text"
                                className={`w-full pl-12 pr-4 py-3 bg-slate-950 border ${fieldErrors.name ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500'} rounded-xl text-sm text-white transition-all outline-none focus:ring-2`}
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        {fieldErrors.name && <p className="text-red-400 text-xs mt-1.5 font-medium pl-1">{fieldErrors.name}</p>}
                    </div>

                    {/* Email Address Field */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className={`absolute left-4 top-3.5 h-5 w-5 ${fieldErrors.email ? 'text-red-400' : 'text-slate-500'}`} />
                            <input
                                name="email"
                                type="text"
                                className={`w-full pl-12 pr-4 py-3 bg-slate-950 border ${fieldErrors.email ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500'} rounded-xl text-sm text-white transition-all outline-none focus:ring-2`}
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        {fieldErrors.email && <p className="text-red-400 text-xs mt-1.5 font-medium pl-1">{fieldErrors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                        <div className="relative">
                            <Lock className={`absolute left-4 top-3.5 h-5 w-5 ${fieldErrors.password ? 'text-red-400' : 'text-slate-500'}`} />
                            <input
                                name="password"
                                type="password"
                                className={`w-full pl-12 pr-4 py-3 bg-slate-950 border ${fieldErrors.password ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500'} rounded-xl text-sm text-white transition-all outline-none focus:ring-2`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        {fieldErrors.password && <p className="text-red-400 text-xs mt-1.5 font-medium pl-1">{fieldErrors.password}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className={`absolute left-4 top-3.5 h-5 w-5 ${fieldErrors.passwordConfirmation ? 'text-red-400' : 'text-slate-500'}`} />
                            <input
                                name="passwordConfirmation"
                                type="password"
                                className={`w-full pl-12 pr-4 py-3 bg-slate-950 border ${fieldErrors.passwordConfirmation ? 'border-red-500/50 focus:ring-red-500' : 'border-slate-800 focus:ring-blue-500'} rounded-xl text-sm text-white transition-all outline-none focus:ring-2`}
                                placeholder="••••••••"
                                value={formData.passwordConfirmation}
                                onChange={handleInputChange}
                            />
                        </div>
                        {fieldErrors.passwordConfirmation && <p className="text-red-400 text-xs mt-1.5 font-medium pl-1">{fieldErrors.passwordConfirmation}</p>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Register'}
                    </button>
                </form>

                <p className="text-xs text-center text-slate-400">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="text-blue-400 hover:underline font-semibold">Sign In</button>
                </p>
            </div>
        </div>
    );
}