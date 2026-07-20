import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { loginSchema } from '../validations/authValidation';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";

export default function Login({ onSwitchToRegister }) {
  // Select only the exact slice required to prevent unnecessary re-renders
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear targeted field error proactively once the user modifies the input
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSocialLogin = (provider) => {
    // Redirects directly to the Laravel Socialite initiation endpoint
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    window.location.href = `${backendUrl}/auth/${provider}/redirect`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError('');

    // Execute synchronous client-side validation runtime via Zod
    const validationResult = loginSchema.safeParse(formData);
    
    if (!validationResult.success) {
      const formattedErrors = {};
      validationResult.error.errors.forEach((error) => {
        formattedErrors[error.path[0]] = error.message;
      });
      setFieldErrors(formattedErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Authentication failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 mt-2 text-sm">Sign in to manage your Career OS</p>
        </div>

        {serverError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-xs font-medium">{serverError}</span>
          </div>
        )}

        {/* Traditional Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                name="email"
                type="text"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-400 text-xs mt-1.5 font-medium">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-500" />
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
            </div>
            {fieldErrors.password && (
              <p className="text-red-400 text-xs mt-1.5 font-medium">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold py-3 px-4 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Sign In <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider Section */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            Or continue with
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* OAuth Authentication Button */}
        <button
          onClick={() => handleSocialLogin('google')}
          type="button"
          className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 text-sm"
        >
          <FcGoogle className="h-5 w-5" />
          Google Account
        </button>

        <div className="text-center pt-2">
          <p className="text-sm text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-400 font-semibold hover:underline hover:text-blue-300"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}