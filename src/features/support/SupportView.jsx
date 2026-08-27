import React, { useState } from 'react';
import apiClient from '../../lib/apiClient';
import { MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SupportView() {
    const [subject, setSubject] = useState('Bug Report');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        setStatus('loading');

        try {
            // Using the new API endpoint we created via apiClient
            const response = await apiClient.post('/support-tickets', {
                subject,
                message
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                setStatus('success');
                setMessage('');
            }
        } catch (error) {
            console.error('Failed to submit support ticket:', error);
            setStatus('error');
            setErrorMessage(error.response?.data?.message || 'Failed to submit feedback. Please try again.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <MessageSquare size={32} className="text-indigo-600 dark:text-indigo-400" />
                    Help & Support
                </h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Encountered an issue or have a feature request? Let us know so we can improve your experience!
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                {status === 'success' ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Feedback Received!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
                            Thank you for reaching out. Your feedback is highly valuable to us and our support team will review it shortly.
                        </p>
                        <button
                            onClick={() => setStatus('idle')}
                            className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                        >
                            Send Another Message
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {status === 'error' && (
                            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-start gap-3 border border-rose-100 dark:border-rose-800">
                                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                <p className="text-sm font-medium">{errorMessage}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                What is this regarding?
                            </label>
                            <select
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full form-select rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                            >
                                <option value="Bug Report">Found a Bug / Error</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="Question">General Question</option>
                                <option value="Account Issue">Account or Billing Issue</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Detailed Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={6}
                                placeholder="Please describe the issue or your suggestion in detail..."
                                required
                                className="pl-4 w-full form-textarea rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-y"
                            ></textarea>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={status === 'loading' || !message.trim()}
                                className={`flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                            >
                                {status === 'loading' ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
