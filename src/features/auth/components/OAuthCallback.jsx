import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../services/authApi';
import { Loader2 } from 'lucide-react';

export default function OAuthCallback({ onComplete }) {
    const loginWithSocialData = useAuthStore((state) => state.loginWithSocialData);
    const [error, setError] = useState('');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const searchParams = window.location.search;
                // Since we only added Google, we default to Google for now
                // A more dynamic approach would read the provider from the URL if needed
                const data = await authApi.handleSocialCallback('google', searchParams);

                loginWithSocialData(data.user, data.access_token);

                window.history.replaceState({}, document.title, '/');
                if (onComplete) onComplete();

                // force a reload if needed or just let the app re-render based on user state change.
                // Zustand will update the user state, causing App.jsx to re-render.
            } catch (err) {
                console.error(err);
                setError('Failed to securely log in via OAuth provider.');
            }
        };

        handleCallback();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-400">
                <p className="text-red-400 font-bold mb-4">{error}</p>
                <button onClick={() => window.location.href = '/'} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 text-slate-400">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="text-xs font-semibold tracking-wider uppercase">
                Securely verifying OAuth credentials...
            </p>
        </div>
    );
}
