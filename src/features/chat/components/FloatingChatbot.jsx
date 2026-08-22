import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Maximize2, Minimize2 } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';

export default function FloatingChatbot() {
    const { isOpen, toggleChat, messages, isLoading, sendMessage } = useChatStore();
    const [input, setInput] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        sendMessage(input);
        setInput('');
    };

    if (!isOpen) {
        return (
            <button
                onClick={toggleChat}
                className="fixed bottom-6 right-6 p-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/30 transition-transform hover:scale-110 z-[100] flex items-center justify-center animate-in zoom-in"
                title="Career AI Assistant"
            >
                <Bot size={28} />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl flex flex-col border border-slate-200 dark:border-slate-800 z-[100] animate-in slide-in-from-bottom-8 duration-300 transition-all ${isExpanded ? 'w-[80vw] h-[85vh] sm:w-[500px]' : 'w-[360px] h-[550px]'}`}>
            <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <div className="bg-emerald-500/20 p-1.5 rounded-lg">
                        <Bot size={18} className="text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">CareerOS Co-Pilot</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span className="text-[10px] text-slate-300 uppercase tracking-widest font-bold">Online</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors">
                        {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                    <button onClick={toggleChat} className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors">
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
                {messages.map((m, idx) => (
                    <div key={idx} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${m.role === 'user' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400'}`}>
                            {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-500 text-white rounded-tr-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-sm'}`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Bot size={16} />
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-b-2xl">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask for interview prep or strategy..."
                        disabled={isLoading}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 text-slate-800 dark:text-white"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:dark:bg-slate-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                        <Send size={16} className="translate-x-[-1px] translate-y-[1px]" />
                    </button>
                </div>
            </form>
        </div>
    );
}
