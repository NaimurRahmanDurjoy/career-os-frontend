import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Edit, Trash2, Check, X, ShieldAlert } from 'lucide-react';

export default function AdminPlans({ onLogout }) {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const [form, setForm] = useState({
        identifier: '',
        name: '',
        price_bdt: 0,
        price_usd: 0,
        features: '',
        limits: { mock_tests: 1, resumes: 1, ai_tools: 1, job_match: false, jobs: 10 },
        is_popular: false,
        is_active: true
    });

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
    const getHeaders = () => ({
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });

    const fetchPlans = async () => {
        try {
            const res = await fetch(`${baseUrl}/admin/plans`, { headers: getHeaders() });
            if (res.status === 401) return onLogout();
            const data = await res.json();
            setPlans(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const openNewPlan = () => {
        setEditingPlan(null);
        setForm({ identifier: '', name: '', price_bdt: 0, price_usd: 0, features: '', limits: { mock_tests: 1, resumes: 1, ai_tools: 1, job_match: false, jobs: 10 }, is_popular: false, is_active: true });
        setShowModal(true);
    };

    const openEditPlan = (plan) => {
        setEditingPlan(plan);
        setForm({
            identifier: plan.identifier,
            name: plan.name,
            price_bdt: plan.price_bdt,
            price_usd: plan.price_usd,
            features: (plan.features || []).join('\n'), // convert array to newline string
            limits: { mock_tests: 1, resumes: 1, ai_tools: 1, job_match: false, jobs: 10, ...(plan.limits || {}) },
            is_popular: plan.is_popular,
            is_active: plan.is_active
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            features: form.features.split('\n').map(f => f.trim()).filter(f => f)
        };

        const url = editingPlan ? `${baseUrl}/admin/plans/${editingPlan.id}` : `${baseUrl}/admin/plans`;
        const method = editingPlan ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowModal(false);
                fetchPlans();
            } else {
                alert('Failed to save plan. Check if identifier is unique.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this plan? This may break active subscriptions tied to this ID!')) return;
        try {
            await fetch(`${baseUrl}/admin/plans/${id}`, { method: 'DELETE', headers: getHeaders() });
            fetchPlans();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-white">Subscription Plans</h1>
                    <p className="text-slate-400">Create and update dynamic plans displayed on the user billing dashboard.</p>
                </div>
                <button
                    onClick={openNewPlan}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] whitespace-nowrap"
                >
                    <Plus className="h-5 w-5" /> New Plan
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500 h-8 w-8" /></div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plans.map(plan => (
                        <div key={plan.id} className={`bg-slate-900 border rounded-xl p-6 ${plan.is_popular ? 'border-emerald-500/50' : 'border-slate-800'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-xl text-white">{plan.name}</h3>
                                    <code className="text-xs text-slate-500">{plan.identifier}</code>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => openEditPlan(plan)} className="p-1.5 text-slate-400 hover:text-blue-400 bg-slate-800 rounded"><Edit className="h-4 w-4" /></button>
                                    <button onClick={() => handleDelete(plan.id)} className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800 rounded"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            </div>

                            <div className="flex gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">BDT</p>
                                    <p className="text-lg font-semibold text-emerald-400">৳{plan.price_bdt}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase">USD</p>
                                    <p className="text-lg font-semibold text-emerald-400">${plan.price_usd}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-6">
                                {(plan.features || []).map((f, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                        <Check className="h-4 w-4 text-emerald-500" /> {f}
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                {plan.is_popular && <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded inline-flex font-semibold">Popular</span>}
                                {plan.is_active ? (
                                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded inline-flex font-semibold">Active</span>
                                ) : (
                                    <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded inline-flex font-semibold">Inactive (Hidden)</span>
                                )}
                            </div>
                        </div>
                    ))}
                    {plans.length === 0 && <p className="text-slate-500 py-10 w-full text-center">No subscription plans found. Create one to get started.</p>}
                </div>
            )}

            {/* Plan Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                            <h2 className="text-xl font-bold text-white">{editingPlan ? 'Edit Plan' : 'Create New Plan'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white"><X /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <form id="planForm" onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Plan Name</label>
                                        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-emerald-500" placeholder="e.g. Pro Monthly" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Identifier (Unique ID)</label>
                                        <input required value={form.identifier} onChange={e => setForm({ ...form, identifier: e.target.value })} disabled={!!editingPlan} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-emerald-500 disabled:opacity-50" placeholder="e.g. pro_monthly" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Price BDT</label>
                                        <input required type="number" value={form.price_bdt} onChange={e => setForm({ ...form, price_bdt: parseInt(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-emerald-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-1">Price USD</label>
                                        <input required type="number" value={form.price_usd} onChange={e => setForm({ ...form, price_usd: parseInt(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white outline-none focus:border-emerald-500" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Features (One per line)</label>
                                    <textarea rows={4} value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white outline-none focus:border-emerald-500 text-sm leading-relaxed" placeholder="Unlimited Mock Tests&#10;Priority Support" />
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-white mb-3 mt-2 border-t border-slate-800 pt-4">Hard Limits (Backend Gating)</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Max Resumes</label>
                                            <input required type="number" value={form.limits.resumes} onChange={e => setForm({ ...form, limits: { ...form.limits, resumes: parseInt(e.target.value) } })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Max Mock Tests</label>
                                            <input required type="number" value={form.limits.mock_tests} onChange={e => setForm({ ...form, limits: { ...form.limits, mock_tests: parseInt(e.target.value) } })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Max AI Tool Usages</label>
                                            <input required type="number" value={form.limits.ai_tools} onChange={e => setForm({ ...form, limits: { ...form.limits, ai_tools: parseInt(e.target.value) } })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Max Job Trackers</label>
                                            <input required type="number" value={form.limits.jobs ?? 10} onChange={e => setForm({ ...form, limits: { ...form.limits, jobs: parseInt(e.target.value) } })} className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white outline-none focus:border-emerald-500 text-sm" />
                                        </div>
                                    </div>
                                    <label className="flex items-center gap-2 text-white cursor-pointer group mt-4">
                                        <input type="checkbox" checked={form.limits.job_match} onChange={e => setForm({ ...form, limits: { ...form.limits, job_match: e.target.checked } })} className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500" />
                                        <span className="text-sm font-medium group-hover:text-emerald-400 transition-colors">Has Access to "Job Match Checker"</span>
                                    </label>
                                </div>

                                <div className="flex gap-6 pt-2">
                                    <label className="flex items-center gap-2 text-white cursor-pointer group">
                                        <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500" />
                                        <span className="text-sm font-medium group-hover:text-emerald-400 transition-colors">Visible Config</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-white cursor-pointer group">
                                        <input type="checkbox" checked={form.is_popular} onChange={e => setForm({ ...form, is_popular: e.target.checked })} className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-emerald-500" />
                                        <span className="text-sm font-medium group-hover:text-emerald-400 transition-colors">Mark "Most Popular"</span>
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
                            <button onClick={() => setShowModal(false)} className="px-5 py-2 text-slate-300 font-medium hover:bg-slate-800 rounded-lg transition-colors">Cancel</button>
                            <button form="planForm" type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
                                Save Plan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
