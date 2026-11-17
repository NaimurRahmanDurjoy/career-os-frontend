import React, { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../services/authApi';
import { Loader2 } from 'lucide-react';

export default function OAuthCallback({ onComplete }) {
    const loginWithSocialData = useAuthStore((state) => state.loginWithSocialData);
    const [error, setError] = useState('');
    const executedRef = useRef(false);

    useEffect(() => {
        // Prevent double execution in React StrictMode
        if (executedRef.current) return;
        executedRef.current = true;

        const handleCallback = async () => {
            try {
                const searchParams = window.location.search;
                if (!searchParams) {
                    window.location.href = '/dashboard';
                    return;
                }

                const data = await authApi.handleSocialCallback('google', searchParams);

                if (data && data.access_token) {
                    loginWithSocialData(data.user, data.access_token);
                    window.history.replaceState({}, document.title, '/dashboard');
                    if (onComplete) onComplete();
                    window.location.href = '/dashboard';
                } else {
                    throw new Error('No access token received');
                }
            } catch (err) {
                console.error('OAuth Callback Error:', err);
                // If user is already authenticated in storage, silently continue to dashboard
                const token = localStorage.getItem('token');
                if (token) {
                    window.location.href = '/dashboard';
                    return;
                }
                setError('Failed to securely log in via OAuth provider.');
            }
        };

        handleCallback();
    }, [loginWithSocialData, onComplete]);

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-400">
                <p className="text-red-400 font-bold mb-4">{error}</p>
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg"
                >
                    Continue to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-400">
            <Loader2 className="h-8 w-8 text-emerald-500 animate-spin" />
            <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                Securely verifying OAuth credentials...
            </p>
        </div>
    );
}
