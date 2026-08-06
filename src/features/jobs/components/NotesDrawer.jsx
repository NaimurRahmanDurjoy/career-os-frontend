import React, { useState, useEffect } from 'react';
import { useJobsStore } from '../store/useJobsStore';
import { X, Trash2, Plus, Loader2, Save } from 'lucide-react';

export default function NotesDrawer({ isOpen, onClose, job }) {
    const { fetchNotes, addNote, deleteNote } = useJobsStore();
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        if (isOpen && job) {
            loadNotes();
        } else {
            setNotes([]);
            setIsAdding(false);
        }
    }, [isOpen, job]);

    const loadNotes = async () => {
        setLoading(true);
        try {
            const data = await fetchNotes(job.id);
            setNotes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newContent.trim()) return;

        try {
            const note = await addNote(job.id, newTitle, newContent);
            setNotes([note, ...notes]);
            setIsAdding(false);
            setNewTitle('');
            setNewContent('');
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await deleteNote(noteId);
            setNotes(notes.filter(n => n.id !== noteId));
        } catch (error) {
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white dark:bg-slate-950 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-slide-in-right">
                {/* Header */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
                    <div>
                        <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">Application Notes</h2>
                        <p className="text-xs text-slate-500 font-medium">
                            {job?.role} @ {job?.company_name}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-5 bg-slate-50 dark:bg-slate-950">
                    {!isAdding ? (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="mb-6 w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-emerald-300 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-500 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-bold text-sm transition-colors"
                        >
                            <Plus size={18} />
                            Add New Note
                        </button>
                    ) : (
                        <form onSubmit={handleAddNote} className="mb-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                            <input
                                type="text"
                                placeholder="Note Title (e.g. Interview Prep)"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 rounded-lg text-sm font-semibold mb-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                autoFocus
                            />
                            <textarea
                                placeholder="Write your thoughts..."
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 px-3 py-2 rounded-lg text-sm mb-3 h-24 resize-none outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsAdding(false); setNewTitle(''); setNewContent(''); }}
                                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newTitle.trim() || !newContent.trim()}
                                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg flex items-center gap-1 disabled:opacity-50"
                                >
                                    <Save size={14} />
                                    Save Note
                                </button>
                            </div>
                        </form>
                    )}

                    {loading ? (
                        <div className="flex justify-center p-8 text-emerald-500">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : notes.length === 0 && !isAdding ? (
                        <div className="text-center py-12 px-4 text-slate-400">
                            <p className="text-sm font-medium">No notes yet.</p>
                            <p className="text-xs mt-1">Add interview prep or research notes.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {notes.map(note => (
                                <div key={note.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm relative group">
                                    <button
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="absolute top-3 right-3 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{note.title}</h3>
                                    <p className="text-xs text-slate-400 mb-3">{new Date(note.created_at).toLocaleDateString()}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                .animate-slide-in-right {
                    animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
