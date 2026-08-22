import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Users, Plus, Mail, Link, Trash2, Calendar } from 'lucide-react';
import { useJobsStore } from '../store/useJobsStore';
import { useReminderStore } from '../../reminders/store/useReminderStore';
import { suggestFollowUpReminder } from '../../reminders/services/reminderAutomation';

export default function ContactsDrawer({ job, isOpen, onClose }) {
    const { fetchContacts, addContact, updateContact, deleteContact } = useJobsStore();
    const { addReminder } = useReminderStore();
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    // Form inputs
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [lastContactDate, setLastContactDate] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen && job?.id) {
            loadContacts();
        } else {
            resetForm();
            setIsAdding(false);
            setContacts([]);
        }
    }, [isOpen, job]);

    const loadContacts = async () => {
        setLoading(true);
        try {
            const data = await fetchContacts(job.id);
            setContacts(data);
        } catch (e) { }
        setLoading(false);
    };

    const resetForm = () => {
        setName('');
        setRole('');
        setEmail('');
        setLinkedinUrl('');
        setLastContactDate('');
        setNotes('');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await addContact(job.id, {
                name, role, email, linkedin_url: linkedinUrl, last_contact_date: lastContactDate, notes
            });

            // Auto schedule a reminder if they supplied a date
            if (lastContactDate) {
                await suggestFollowUpReminder(name, lastContactDate, job.company_name, addReminder);
            }

            resetForm();
            setIsAdding(false);
            loadContacts();
        } catch (error) { }
    };

    const handleDelete = async (id) => {
        try {
            await deleteContact(id);
            loadContacts();
        } catch (e) { }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full relative z-10 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
                    <div>
                        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                            <Users size={18} className="text-emerald-500" />
                            Key Contacts
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Networking CRM for {job?.company_name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-black/20">
                    {!isAdding ? (
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-slate-500 uppercase">Saved Contacts</span>
                            <button
                                onClick={() => setIsAdding(true)}
                                className="flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus size={14} /> Add Contact
                            </button>
                        </div>
                    ) : null}

                    {isAdding ? (
                        <div className="bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900/50 p-4 rounded-xl mb-4 shadow-sm">
                            <form onSubmit={handleSave} className="space-y-3 relative z-[60]">
                                <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">New Contact</h3>

                                <input required placeholder="Name (e.g. John Doe)" value={name} onChange={e => setName(e.target.value)}
                                    className="w-full text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded focus:ring-1 focus:ring-emerald-500" />

                                <input placeholder="Role (e.g. Recruiter, Referrer)" value={role} onChange={e => setRole(e.target.value)}
                                    className="w-full text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded focus:ring-1 focus:ring-emerald-500" />

                                <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                                    className="w-full text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded focus:ring-1 focus:ring-emerald-500" />

                                <input type="url" placeholder="LinkedIn URL" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)}
                                    className="w-full text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded focus:ring-1 focus:ring-emerald-500" />

                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    <input type="date" title="Last Contact Date" value={lastContactDate} onChange={e => setLastContactDate(e.target.value)}
                                        className="flex-1 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded focus:ring-1 focus:ring-emerald-500" />
                                </div>

                                <textarea placeholder="Private Notes..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full h-20 resize-none text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded focus:ring-1 focus:ring-emerald-500" />

                                <div className="flex justify-end gap-2 pt-2">
                                    <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700">Cancel</button>
                                    <button type="submit" className="px-4 py-2 text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded shadow">Save Contact</button>
                                </div>
                            </form>
                        </div>
                    ) : null}

                    {loading ? (
                        <div className="text-center p-4 text-slate-400 text-sm">Loading contacts...</div>
                    ) : contacts.length === 0 && !isAdding ? (
                        <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl mt-4">
                            <Users size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                            <p className="text-slate-400 text-sm mb-4">No contacts added yet.</p>
                            <button onClick={() => setIsAdding(true)} className="text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50">
                                Add First Contact
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3 relative z-[50]">
                            {contacts.map(c => (
                                <div key={c.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 shadow-sm relative group interaction-layer">
                                    <button onClick={() => handleDelete(c.id)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={14} />
                                    </button>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{c.name}</h4>
                                    {c.role && <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">{c.role}</p>}

                                    <div className="mt-3 flex flex-col gap-1.5">
                                        {c.email && (
                                            <a href={`mailto:${c.email}`} className="text-xs text-slate-500 hover:text-emerald-500 flex items-center gap-2 relative z-50">
                                                <Mail size={12} /> {c.email}
                                            </a>
                                        )}
                                        {c.linkedin_url && (
                                            <a href={c.linkedin_url} target="_blank" rel="noreferrer" className="text-xs text-slate-500 hover:text-blue-500 flex items-center gap-2 relative z-50">
                                                <Link size={12} /> LinkedIn Profile
                                            </a>
                                        )}
                                        {c.last_contact_date && (
                                            <span className="text-xs text-amber-600 dark:text-amber-500 flex items-center gap-2 font-medium mt-1">
                                                <Calendar size={12} /> Last Contact: {new Date(c.last_contact_date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    {c.notes && (
                                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50">
                                            <p className="text-xs text-slate-600 dark:text-slate-400 italic">"{c.notes}"</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
