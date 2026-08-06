import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { FileText, CheckCircle2, Trash2, Calendar } from 'lucide-react';

export default function ResumeVersionList({ onSelect }) {
    const { resumes, fetchResumes, deleteResume, setPrimary, analysisData } = useResumeStore();

    React.useEffect(() => {
        fetchResumes();
    }, [fetchResumes]);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this resume?")) {
            await deleteResume(id);
        }
    };

    const handleSetPrimary = async (e, id) => {
        e.stopPropagation();
        await setPrimary(id);
    };

    if (!resumes || resumes.length === 0) return null;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm w-full h-full flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 px-2 uppercase tracking-wider">
                Resume Versions
            </h3>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 pretty-scrollbar">
                {resumes.map(resume => {
                    const isActive = analysisData?.id === resume.id;
                    const isPrimary = resume.is_primary;

                    return (
                        <div
                            key={resume.id}
                            onClick={() => onSelect(resume.id)}
                            className={`group relative p-3 rounded-xl border transition-all cursor-pointer shadow-sm ${isActive
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:border-slate-300 dark:hover:border-slate-700'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <FileText size={16} className={isActive ? 'text-emerald-500' : 'text-slate-400'} />
                                    <span className="font-bold text-sm text-slate-700 dark:text-slate-200 line-clamp-1">
                                        {resume.version_name || 'Main Version'}
                                    </span>
                                </div>

                                {isPrimary && (
                                    <div title="Primary Resume used for AI Matching" className="text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30 rounded-full p-0.5">
                                        <CheckCircle2 size={12} strokeWidth={3} />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center text-[11px] text-slate-500 dark:text-slate-400 font-medium ml-6">
                                <Calendar size={10} className="mr-1" />
                                {new Date(resume.created_at).toLocaleDateString()}
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                {!isPrimary && (
                                    <button
                                        onClick={(e) => handleSetPrimary(e, resume.id)}
                                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-500 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 shadow-sm"
                                        title="Use this resume for AI Job Matching"
                                    >
                                        Make Primary
                                    </button>
                                )}
                                <button
                                    onClick={(e) => handleDelete(e, resume.id)}
                                    className="p-1 rounded bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-700 shadow-sm"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
