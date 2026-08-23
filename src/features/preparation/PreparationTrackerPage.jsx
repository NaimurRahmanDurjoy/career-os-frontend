import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Trash2, CheckCircle, ChevronDown, ChevronUp, Loader2, Target, BarChart2 } from 'lucide-react';
import { usePreparationStore } from './store/usePreparationStore';

export default function PreparationTrackerPage() {
    const { trackers, loading, fetchTrackers, createTracker, deleteTracker, toggleTopic } = usePreparationStore();
    const [isCreating, setIsCreating] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newExamType, setNewExamType] = useState('');
    const [expandedModules, setExpandedModules] = useState({});

    useEffect(() => {
        fetchTrackers();
    }, []);

    const handleCreate = async () => {
        if (!newExamType.trim()) return;
        setIsGenerating(true);
        await createTracker(newExamType);
        setIsGenerating(false);
        setIsCreating(false);
        setNewExamType('');
    };

    const toggleModule = (trackerId, moduleIndex) => {
        const key = `${trackerId}-${moduleIndex}`;
        setExpandedModules(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading && trackers.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
            </div>
        );
    }

    return (
        <div className="md:px-8 max-w-[1600px] w-full mx-auto relative z-10 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-5 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300 flex items-center gap-3">
                        <BookOpen size={28} className="text-emerald-500" />
                        Preparation Tracker
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 transition-colors duration-300">
                        Stay focused and track your readiness for major competency exams.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="mt-4 sm:mt-0 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 text-sm"
                >
                    <span className="font-bold">+</span> New Roadmap
                </button>
            </div>

            {isCreating && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm mb-8 animate-in slide-in-from-top-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wide text-sm flex items-center gap-2">
                        <Target size={16} className="text-indigo-500" /> Select Target Exam
                    </h3>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="e.g. Google Senior React Dev, PMP Certification, BCS..."
                            value={newExamType}
                            onChange={(e) => setNewExamType(e.target.value)}
                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700 dark:text-slate-200 font-medium"
                        />
                        <button
                            onClick={handleCreate}
                            disabled={isGenerating || !newExamType.trim()}
                            className="px-6 py-3 bg-slate-900 dark:bg-emerald-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap min-w-[200px] justify-center"
                        >
                            {isGenerating ? <><Loader2 className="animate-spin" size={18} /> Building AI Syllabus...</> : 'Generate Curriculum'}
                        </button>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {trackers.length === 0 && !isCreating ? (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-16 bg-slate-50/50 dark:bg-slate-900/20">
                    <Target size={48} className="text-emerald-200 dark:text-emerald-900/50 mb-4" />
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2 text-xl">No Roadmaps Found</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                        Create a curriculum tracking roadmap to stay organized with your BCS or Bank Job preparation.
                    </p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
                    >
                        Start Your First Track
                    </button>
                </div>
            ) : (
                <div className="space-y-8">
                    {trackers.map((tracker) => (
                        <div key={tracker.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                            {/* Tracker Header */}
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-900/50 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none"></div>
                                <div className="relative z-10 w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                            {tracker.exam_type}
                                        </h2>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                if (window.confirm('Delete this entire roadmap?')) {
                                                    deleteTracker(tracker.id).catch(err => alert("Failed to delete! " + err));
                                                }
                                            }}
                                            className="text-slate-400 hover:text-rose-500 transition-colors p-2 -mr-2"
                                            title="Delete Tracker"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Overall Progress Bar */}
                                    <div className="w-full">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                                <BarChart2 size={14} className="text-emerald-500" /> Overall Readiness
                                            </span>
                                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
                                                {tracker.overall_progress}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-300 dark:border-slate-700">
                                            <div
                                                className="bg-emerald-500 h-full transition-all duration-700 ease-out"
                                                style={{ width: `${tracker.overall_progress}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Syllabus Modules */}
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {tracker.syllabus_roadmap?.map((module, mIndex) => (
                                    <div key={mIndex} className="bg-white dark:bg-slate-900 overflow-hidden">
                                        <button
                                            onClick={() => toggleModule(tracker.id, mIndex)}
                                            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors focus:outline-none"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${module.progress === 100 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
                                                    {Math.round(module.progress)}%
                                                </div>
                                                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-left">
                                                    {module.moduleName}
                                                </h3>
                                            </div>
                                            <div className="text-slate-400">
                                                {expandedModules[`${tracker.id}-${mIndex}`] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                        </button>

                                        {expandedModules[`${tracker.id}-${mIndex}`] && (
                                            <div className="px-5 pb-5 pt-1 space-y-1 bg-slate-50/30 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                                                {module.topics?.map((topic, tIndex) => (
                                                    <label key={tIndex} className="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-slate-800/80 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm hover:shadow group">
                                                        <div className="relative flex items-start">
                                                            <div className="flex h-6 items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={topic.completed}
                                                                    onChange={() => toggleTopic(tracker.id, mIndex, tIndex)}
                                                                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent transition-all checked:border-emerald-500 checked:bg-emerald-500 hover:border-emerald-400"
                                                                />
                                                                <CheckCircle size={14} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100 pointer-events-none" />
                                                            </div>
                                                        </div>
                                                        <span className={`text-sm font-medium select-none transition-colors ${topic.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100'}`}>
                                                            {topic.name}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
