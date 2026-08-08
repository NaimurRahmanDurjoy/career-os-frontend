import React, { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminPlans from './components/AdminPlans';
import { Loader2, LogOut, LayoutDashboard, CreditCard } from 'lucide-react';

export default function AdminApp() {
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        // Check if we have an admin token stored
        const checkAuth = async () => {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Technically we can hit an endpoint to verify token if we had one.
                // For now, if we have a token, we parse admin user from localStorage (basic implementation)
                const storedAdmin = localStorage.getItem('admin_user');
                if (storedAdmin) {
                    setAdminUser(JSON.parse(storedAdmin));
                }
            } catch (e) {
                localStorage.removeItem('admin_token');
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const handleLogin = (data) => {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
        setAdminUser(data.admin);
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setAdminUser(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex justify-center items-center">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (!adminUser) {
        return <AdminLogin onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
            <header className="fixed top-0 inset-x-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-50">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">C</div>
                        <span className="font-semibold text-white tracking-tight">Admin OS</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-2">
                        <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </button>
                        <button onClick={() => setActiveTab('plans')} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'plans' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
                            <CreditCard className="h-4 w-4" /> Subscriptions Let's Setup
                        </button>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-400">Logged in as <strong className="text-white">{adminUser.name}</strong></span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </header>

            <main className="pt-24 px-6 md:px-8 max-w-7xl mx-auto pb-12">
                {activeTab === 'dashboard' && <AdminDashboard onLogout={handleLogout} />}
                {activeTab === 'plans' && <AdminPlans onLogout={handleLogout} />}
            </main>
        </div>
    );
}
