import React, { useEffect, useState } from 'react';
import { Target, Plus, RefreshCw, Trash2, CheckCircle2, XCircle, BrainCircuit, ArrowRight, Play, Award } from 'lucide-react';
import { useMockTestStore } from './store/useMockTestStore';
import { useAuthStore } from '../../features/auth/store/useAuthStore';
import PaywallModal from '../../components/common/PaywallModal';

export default function MockTestDashboard() {
    const { tests, fetchTests, generateTest, submitTest, deleteTest, loading, generating } = useMockTestStore();
    const [isCreating, setIsCreating] = useState(false);
    const [newTopic, setNewTopic] = useState('');
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

    const { user } = useAuthStore();
    const [showPaywall, setShowPaywall] = useState(false);

    const handleNewClick = () => {
        if ((user?.usage?.mock_tests || 0) >= (user?.limits?.mock_tests || 0)) {
            setShowPaywall(true);
        } else {
            setIsCreating(true);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const handleGenerate = async () => {
        if (!newTopic.trim()) return;
        const test = await generateTest(newTopic);
        setIsCreating(false);
        setNewTopic('');
        startQuiz(test);
    };

    const startQuiz = (test) => {
        setActiveQuiz(test);
        setCurrentQuestionIndex(0);
        setAnswers({});
    };

    const handleAnswerSelect = (optIndex) => {
        if (activeQuiz.user_answers) return; // Prevent changing if already submitted
        setAnswers(prev => ({ ...prev, [currentQuestionIndex]: optIndex }));
    };

    const handleSubmitQuiz = async () => {
        if (Object.keys(answers).length < activeQuiz.quiz_data.length) {
            if (!window.confirm("You have unanswered questions. Are you sure you want to completely submit?")) {
                return;
            }
        }
        await submitTest(activeQuiz.id, answers);
        // refresh active quiz to show grading
        const updated = await useMockTestStore.getState().tests.find(t => t.id === activeQuiz.id);
        setActiveQuiz(updated);
    };

    if (activeQuiz) {
        const isCompleted = activeQuiz.user_answers !== null;
        const quizData = activeQuiz.quiz_data;
        const q = quizData[currentQuestionIndex];
        const selectedOpt = isCompleted ? activeQuiz.user_answers[currentQuestionIndex] : answers[currentQuestionIndex];

        return (
            <div className="max-w-3xl mx-auto py-8 animate-fadeIn">
                <button
                    onClick={() => setActiveQuiz(null)}
                    className="text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 mb-6 flex items-center gap-1"
                >
                    &larr; Back to Dashboard
                </button>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden mb-6">
                    <div className="bg-slate-50 dark:bg-slate-950 p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <BrainCircuit className="text-indigo-500" />
                                {activeQuiz.topic_name}
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Question {currentQuestionIndex + 1} of {quizData.length}
                            </p>
                        </div>
                        {isCompleted && (
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Final Score</p>
                                <p className={`text-3xl font-black ${activeQuiz.score >= 80 ? 'text-emerald-500' : activeQuiz.score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                                    {activeQuiz.score}%
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="p-8">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6 leading-relaxed">
                            {q?.question}
                        </h3>

                        <div className="space-y-4">
                            {q?.options.map((opt, idx) => {
                                let styleClass = "border-slate-200 dark:border-slate-700 hover:border-indigo-400 bg-white dark:bg-slate-800/50";
                                let icon = null;

                                if (isCompleted) {
                                    styleClass = "border-slate-200 dark:border-slate-700 opacity-60 pointer-events-none";
                                    if (idx === q.correctIndex) {
                                        styleClass = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 font-bold opacity-100";
                                        icon = <CheckCircle2 className="text-emerald-500" />;
                                    } else if (idx === selectedOpt && selectedOpt !== q.correctIndex) {
                                        styleClass = "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300 font-bold opacity-100";
                                        icon = <XCircle className="text-rose-500" />;
                                    }
                                } else if (selectedOpt === idx) {
                                    styleClass = "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-inner";
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerSelect(idx)}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${styleClass}`}
                                    >
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">{opt}</span>
                                        {icon}
                                    </button>
                                );
                            })}
                        </div>

                        {isCompleted && (
                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-xl text-sm">
                                <strong className="text-blue-800 dark:text-blue-400 block mb-1">Explanation:</strong>
                                <span className="text-blue-700 dark:text-blue-300 leading-relaxed">{q.explanation}</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <button
                            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 transition-colors"
                        >
                            Previous
                        </button>

                        {currentQuestionIndex < quizData.length - 1 ? (
                            <button
                                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                className="px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors flex items-center gap-2"
                            >
                                Next <ArrowRight size={16} />
                            </button>
                        ) : !isCompleted ? (
                            <button
                                onClick={handleSubmitQuiz}
                                className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-md shadow-indigo-500/20"
                            >
                                Submit & Score <Award size={16} />
                            </button>
                        ) : (
                            <span className="text-sm font-bold text-slate-500 italic">Exam Completed</span>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-3">
                        <Target size={32} className="text-indigo-500" />
                        AI Mock Tests
                    </h1>
                    <p className="text-slate-500 font-medium mt-2">
                        Generate technical quizzes dynamically on any topic to test your readiness.
                    </p>
                </div>
                <button
                    onClick={handleNewClick}
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 group self-start sm:self-center"
                >
                    <Plus size={18} className="group-hover:scale-110 transition-transform" />
                    New Mock Test
                </button>
            </div>

            {isCreating && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm mb-8 animate-in slide-in-from-top-4">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wide text-sm flex items-center gap-2">
                        <BrainCircuit size={16} className="text-indigo-500" /> Subject / Topic
                    </h3>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            placeholder="e.g. React Hooks, SOLID Principles, System Design..."
                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200 font-medium"
                        />
                        <button
                            onClick={handleGenerate}
                            disabled={generating || !newTopic.trim()}
                            className="px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[140px] justify-center"
                        >
                            {generating ? <RefreshCw size={18} className="animate-spin" /> : "Generate"}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map(test => {
                    const isCompleted = test.user_answers !== null;
                    return (
                        <div key={test.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm group hover:shadow-md transition-shadow relative">
                            <button
                                onClick={() => {
                                    if (window.confirm('Delete this test history?')) deleteTest(test.id);
                                }}
                                className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 dark:text-slate-700 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={16} />
                            </button>
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-xl flex items-center justify-center mb-4 border border-indigo-200 dark:border-indigo-800/50">
                                <BrainCircuit size={24} />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2 truncate" title={test.topic_name}>
                                {test.topic_name}
                            </h3>
                            <div className="flex justify-between items-end mt-6">
                                <div>
                                    {isCompleted ? (
                                        <div className="flex items-baseline gap-1">
                                            <span className={`text-2xl font-black ${test.score >= 80 ? 'text-emerald-500' : test.score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>{test.score}%</span>
                                            <span className="text-xs text-slate-400 font-bold uppercase">Score</span>
                                        </div>
                                    ) : (
                                        <span className="text-sm font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">Pending</span>
                                    )}
                                </div>
                                <button
                                    onClick={() => startQuiz(test)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCompleted
                                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-500 dark:bg-slate-800 dark:hover:bg-slate-700'
                                        : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                        }`}
                                    title={isCompleted ? "Review Test" : "Start Test"}
                                >
                                    <Play size={16} className={!isCompleted ? "ml-1" : ""} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {tests.length === 0 && !isCreating && !loading && (
                <div className="col-span-full border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-16 bg-slate-50/50 dark:bg-slate-900/20 mt-4">
                    <BrainCircuit size={48} className="text-indigo-200 dark:text-indigo-900/50 mb-4" />
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2 text-xl">Test Your Knowledge</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                        Before your real interview, generate an AI mock quiz on specific technical topics to see where you stand.
                    </p>
                    <button
                        onClick={handleNewClick}
                        className="px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                    >
                        Generate First Test
                    </button>
                </div>
            )}

            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                onUpgrade={() => window.dispatchEvent(new CustomEvent('changeView', { detail: 'billing' }))}
                featureName="AI Mock Tests"
            />
        </div>
    );
}
