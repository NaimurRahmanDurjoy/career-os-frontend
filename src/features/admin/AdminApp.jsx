import React, { useState, useEffect } from 'react';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { Loader2 } from 'lucide-react';

export default function AdminApp() {
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);

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

    return <AdminDashboard adminUser={adminUser} onLogout={handleLogout} />;
}
