import React, { useState, useEffect } from 'react';
import apiClient from '../../../lib/apiClient';
import { Loader2, MessageSquare, CheckCircle, Clock, CheckCircle2, User as UserIcon } from 'lucide-react';

export default function AdminSupportTickets({ onLogout }) {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            const res = await apiClient.get('/admin/support-tickets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTickets(res.data);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
            if (error.response?.status === 401) onLogout();
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const token = localStorage.getItem('admin_token');
            await apiClient.patch(`/admin/support-tickets/${id}`, {
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error('Failed to update status:', error);
            if (error.response?.status === 401) onLogout();
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'in_progress': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'resolved':
            case 'closed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    if (loading) {
        return (
            <div className="py-12 flex justify-center">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <MessageSquare className="text-blue-500" />
                        Support Tickets
                    </h1>
                    <p className="text-slate-400 mt-1">Review user feedback and resolve issues.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {tickets.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                        <MessageSquare className="h-12 w-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No tickets yet</h3>
                        <p className="text-slate-400">When users submit feedback or issues, they will appear here.</p>
                    </div>
                ) : (
                    tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors">
                            <div className="flex flex-col md:flex-row gap-5">
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-white leading-tight">{ticket.subject}</h3>
                                            <div className="flex items-center gap-3 text-sm text-slate-400">
                                                <span className="flex items-center gap-1.5"><UserIcon size={14} /> {ticket.user?.name || 'Unknown User'}</span>
                                                <span className="flex items-center gap-1.5">&bull; {ticket.user?.email || 'N/A'}</span>
                                                <span className="flex items-center gap-1.5">&bull; {new Date(ticket.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </div>
                                    </div>

                                    <div className="bg-slate-950 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap border border-slate-800/50">
                                        {ticket.message}
                                    </div>
                                </div>
                                <div className="shrink-0 flex md:flex-col gap-2 pt-1 border-t border-slate-800 md:border-t-0 md:border-l md:pl-5">
                                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-1 hidden md:block">Actions</p>
                                    <select
                                        className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 w-full md:w-36 outline-none focus:border-blue-500"
                                        value={ticket.status}
                                        onChange={(e) => updateStatus(ticket.id, e.target.value)}
                                    >
                                        <option value="open">Open</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
