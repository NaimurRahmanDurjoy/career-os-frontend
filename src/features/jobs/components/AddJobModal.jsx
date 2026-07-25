import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useJobsStore } from '../store/useJobsStore';

export default function AddJobModal({ isOpen, onClose }) {
    const { addJob, loading } = useJobsStore();
    const [formData, setFormData] = useState({
        company_name: '',
        role: '',
        salary_range: '',
        status: 'applied',
        application_date: new Date().toISOString().split('T')[0]
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

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
                status: 'applied',
                application_date: new Date().toISOString().split('T')[0]
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Opportunity</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name *</label>
                        <input
                            type="text"
                            name="company_name"
                            required
                            value={formData.company_name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white transition-all"
                            placeholder="e.g. Google"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role / Job Title *</label>
                        <input
                            type="text"
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white transition-all"
                            placeholder="e.g. Frontend Engineer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary Range</label>
                            <input
                                type="text"
                                name="salary_range"
                                value={formData.salary_range}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white transition-all"
                                placeholder="$80k - $120k"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Application Date</label>
                            <input
                                type="date"
                                name="application_date"
                                required
                                value={formData.application_date}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white transition-all"
                        >
                            <option value="applied">Applied</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="interview">Interviewing</option>
                            <option value="offer">Offer Received</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[120px]"
                        >
                            {isSubmitting ? 'Saving...' : 'Add Job'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
