import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, RefreshCw, Briefcase } from 'lucide-react';
import { useJobsStore } from '../store/useJobsStore';
import { useResumeStore } from '../../resumes/store/useResumeStore';
import apiClient from '../../../lib/apiClient';

export default function AddJobModal({ isOpen, onClose }) {
    const { addJob, loading } = useJobsStore();
    const { resumes, fetchResumes } = useResumeStore();

    React.useEffect(() => {
        if (isOpen && resumes.length === 0) fetchResumes();
    }, [isOpen]);

    const [formData, setFormData] = useState({
        company_name: '',
        role: '',
        salary_range: '',
        job_description: '',
        resume_id: '',
        status: 'applied',
        applied_at: new Date().toISOString().split('T')[0]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isParsing, setIsParsing] = useState(false);

    if (!isOpen) return null;

    const handleAutoFill = async () => {
        if (!formData.job_description.trim()) return;
        setIsParsing(true);
        try {
            const res = await apiClient.post('/ai-tools/parse-jd', {
                job_description: formData.job_description
            });
            const data = res.data.parsed_data;
            if (data) {
                setFormData(prev => ({
                    ...prev,
                    company_name: data.company_name || prev.company_name,
                    role: data.role || prev.role,
                    salary_range: data.salary_range || prev.salary_range,
                }));
            }
        } catch (error) {
            console.error('Failed to parse JD:', error);
        } finally {
            setIsParsing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addJob(formData);
            onClose(); // close modal on success
            setFormData({
                company_name: '',
                role: '',
                salary_range: '',
                job_description: '',
                status: 'applied',
                applied_at: new Date().toISOString().split('T')[0]
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
                    <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Briefcase size={18} className="text-emerald-500" />
                        Add New Opportunity
                    </h2>
                    <button onClick={onClose} className="p-2 bg-slate-200/50 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-full text-slate-500 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                            Company Name *
                        </label>
                        <input
                            type="text"
                            name="company_name"
                            required
                            value={formData.company_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 dark:text-white transition-all placeholder-slate-400"
                            placeholder="e.g. Google"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                            Role / Job Title *
                        </label>
                        <input
                            type="text"
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 dark:text-white transition-all placeholder-slate-400"
                            placeholder="e.g. Frontend Engineer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                                Salary Range
                            </label>
                            <input
                                type="text"
                                name="salary_range"
                                value={formData.salary_range}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 dark:text-white transition-all placeholder-slate-400"
                                placeholder="$80k - $120k"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                                Application Date
                            </label>
                            <input
                                type="date"
                                name="applied_at"
                                required
                                value={formData.applied_at}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 dark:text-white transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-end mb-1.5">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                                Job Description
                            </label>
                            <button
                                type="button"
                                onClick={handleAutoFill}
                                disabled={isParsing || !formData.job_description.trim()}
                                className="text-[10px] uppercase flex items-center gap-1 font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 disabled:opacity-50 transition-all bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded"
                            >
                                {isParsing ? <RefreshCw size={12} className="animate-spin" /> : <Sparkles size={12} />}
                                AI Auto-Fill
                            </button>
                        </div>
                        <textarea
                            name="job_description"
                            value={formData.job_description}
                            onChange={handleChange}
                            maxLength={10000}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 dark:text-white transition-all placeholder-slate-400 h-24 resize-none"
                            placeholder="Paste the raw job description here for AI matching..."
                        />
                        <div className="flex justify-end mt-1">
                            <span className={`text-[10px] font-medium ${formData.job_description.length > 9500 ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}>
                                {formData.job_description.length} / 10,000 characters
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                                Targeted Resume
                            </label>
                            <select
                                name="resume_id"
                                value={formData.resume_id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 dark:text-white transition-all appearance-none font-medium cursor-pointer"
                            >
                                <option value="">Use Default/Primary Resume</option>
                                {resumes.map(r => (
                                    <option key={r.id} value={r.id}>
                                        {r.version_name || r.file_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                                Current Status
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-slate-900 dark:text-white transition-all appearance-none font-medium cursor-pointer"
                            >
                                <option value="applied">Applied</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="interview">Interviewing</option>
                                <option value="offer">Offer Received</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3 w-full">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            <Briefcase size={18} />
                            {isSubmitting ? 'Saving...' : 'Add Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
