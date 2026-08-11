import React, { useState, useEffect } from 'react';
import { Loader2, Users, Search, ShieldCheck, Ban, CheckCircle2 } from 'lucide-react';

export default function AdminUsers({ onLogout }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const getHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${baseUrl}/admin/users`, { headers: getHeaders() });
            if (res.status === 401) return onLogout();
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error("Failed to load users", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, isActive) => {
        let payload = {};
        if (isActive) {
            const reason = window.prompt("Enter a reason for suspension (or leave blank for default):");
            if (reason === null) return; // user cancelled
            payload = { suspension_reason: reason || "Please contact support." };
        }

        try {
            const res = await fetch(`${baseUrl}/admin/users/${id}/toggle-status`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(users.map(u => u.id === id ? data.user : u));
            }
        } catch (err) {
            console.error("Failed to toggle status", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="h-8 w-8 text-blue-500" /> User Directory
                    </h1>
                    <p className="text-slate-400 mt-1">Track active users and their current subscription plans.</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-800/50 text-slate-300 text-sm font-semibold border-b border-slate-800">
                                    <th className="py-4 px-6">User Details</th>
                                    <th className="py-4 px-6">Registration Date</th>
                                    <th className="py-4 px-6">Active Package</th>
                                    <th className="py-4 px-6">Days Left</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center py-8 text-slate-500">No matching users found.</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user) => {
                                        const isPro = user.current_plan?.identifier !== 'basic';

                                        return (
                                            <tr key={user.id} className={`border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${!user.is_active ? 'opacity-50 grayscale' : ''}`}>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-medium">{user.name}</span>
                                                        <span className="text-slate-400 text-sm">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-slate-300 text-sm">
                                                    {new Date(user.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isPro
                                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                                                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                                                        }`}>
                                                        {isPro && <ShieldCheck className="h-3.5 w-3.5" />}
                                                        {user.current_plan?.name}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {isPro ? (
                                                        <span className="text-emerald-400 font-medium text-sm bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                                                            {user.current_plan?.days_remaining} days
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-600 text-sm font-bold tracking-widest pl-3">∞</span>
                                                    )}
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    {user.is_active ? (
                                                        <button
                                                            onClick={() => toggleStatus(user.id, user.is_active)}
                                                            title="Suspend User"
                                                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all ml-auto border border-red-500/20 w-[90px]"
                                                        >
                                                            <Ban className="h-3.5 w-3.5" /> Suspend
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => toggleStatus(user.id, user.is_active)}
                                                            title="Activate User"
                                                            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all ml-auto border border-emerald-500/20 w-[90px]"
                                                        >
                                                            <CheckCircle2 className="h-3.5 w-3.5" /> Activate
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
