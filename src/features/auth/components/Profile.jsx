import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Settings, Shield, Bell, Loader2, CheckCircle2, AlertCircle, Lock } from 'lucide-react';

export default function Profile() {
    const user = useAuthStore((state) => state.user);
    const updateProfile = useAuthStore((state) => state.updateProfile);
    const updatePassword = useAuthStore((state) => state.updatePassword);
    const updateApiKeys = useAuthStore((state) => state.updateApiKeys);

    // Tab State
    const [activeTab, setActiveTab] = useState('overview');

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [passwordStatusMessage, setPasswordStatusMessage] = useState(null);

    // AI Integrations State
    const [openaiKey, setOpenaiKey] = useState(user?.custom_api_keys?.openai || '');
    const [geminiKey, setGeminiKey] = useState(user?.custom_api_keys?.gemini || '');
    const [groqKey, setGroqKey] = useState(user?.custom_api_keys?.groq || '');
    const [isUpdatingKeys, setIsUpdatingKeys] = useState(false);
    const [keysStatusMessage, setKeysStatusMessage] = useState(null);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setOpenaiKey(user.custom_api_keys?.openai || '');
            setGeminiKey(user.custom_api_keys?.gemini || '');
            setGroqKey(user.custom_api_keys?.groq || '');
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setStatusMessage(null);
        try {
            await updateProfile(name, email);
            setStatusMessage({ type: 'success', text: 'Profile information updated successfully.' });
            setTimeout(() => setStatusMessage(null), 3000);
        } catch (error) {
            setStatusMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setIsUpdatingPassword(true);
        setPasswordStatusMessage(null);
        try {
            await updatePassword(currentPassword, newPassword, newPasswordConfirmation);
            setPasswordStatusMessage({ type: 'success', text: 'Password successfully updated.' });
            setCurrentPassword('');
            setNewPassword('');
            setNewPasswordConfirmation('');
            setTimeout(() => setPasswordStatusMessage(null), 3000);
        } catch (error) {
            setPasswordStatusMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password.' });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleUpdateKeys = async (e) => {
        e.preventDefault();
        setIsUpdatingKeys(true);
        setKeysStatusMessage(null);
        try {
            await updateApiKeys(openaiKey, geminiKey, groqKey);
            setKeysStatusMessage({ type: 'success', text: 'AI capabilities synced successfully.' });
            setTimeout(() => setKeysStatusMessage(null), 3000);
        } catch (error) {
            setKeysStatusMessage({ type: 'error', text: error.response?.data?.message || 'Failed to sync providers.' });
        } finally {
            setIsUpdatingKeys(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 tracking-tight transition-colors duration-300">
                    Account Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 transition-colors duration-300">
                    Manage your profile details and application preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Navigation / Overview */}
                <div className="col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-lg shadow-emerald-900/5 dark:shadow-black/20 text-center">
                        <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-black text-4xl mb-4 border-4 border-white dark:border-slate-800 shadow-md">
                            {user?.name ? user.name.charAt(0).toUpperCase() : <User size={40} />}
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{user?.name}</h3>
                        <p className="text-xs text-slate-500 font-medium tracking-wide">{user?.email}</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg shadow-emerald-900/5 dark:shadow-black/20">
                        <ul className="flex flex-col">
                            <li>
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'overview' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'}`}
                                >
                                    <User size={18} /> Profile Overview
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('security')}
                                    className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'security' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'}`}
                                >
                                    <Shield size={18} /> Password & Security
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('ai_integrations')}
                                    className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'ai_integrations' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'}`}
                                >
                                    <Settings size={18} /> AI Integrations
                                </button>
                            </li>
                            <li>
                                <button className="w-full flex items-center gap-3 px-6 py-4 text-sm font-bold text-slate-400 dark:text-slate-600 cursor-not-allowed border-l-4 border-transparent border-t border-slate-100 dark:border-white/5">
                                    <Bell size={18} /> Notifications
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="col-span-1 md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-lg shadow-emerald-900/5 dark:shadow-black/20">

                        {/* Profile Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
                                    Personal Information
                                </h3>

                                {statusMessage && (
                                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${statusMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400'}`}>
                                        {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                        {statusMessage.text}
                                    </div>
                                )}

                                <form className="space-y-6" onSubmit={handleUpdateProfile}>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm shadow-sm dark:shadow-inner"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                                            Email Address
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm shadow-sm dark:shadow-inner"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUpdating || (name === user?.name && email === user?.email)}
                                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-md shadow-emerald-500/20 text-sm mt-4 flex items-center justify-center gap-2 min-w-[180px]"
                                    >
                                        {isUpdating ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving... </>
                                        ) : (
                                            'Update Information'
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Password & Security Tab */}
                        {activeTab === 'security' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
                                    Update Password
                                </h3>

                                {passwordStatusMessage && (
                                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${passwordStatusMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400'}`}>
                                        {passwordStatusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                        {passwordStatusMessage.text}
                                    </div>
                                )}

                                <form className="space-y-6" onSubmit={handleUpdatePassword}>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                                            Current Password
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm shadow-sm dark:shadow-inner"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                                            New Password
                                        </label>
                                        <div className="relative group">
                                            <Shield className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm shadow-sm dark:shadow-inner"
                                                required
                                                minLength={8}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                                            Confirm New Password
                                        </label>
                                        <div className="relative group">
                                            <Shield className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={newPasswordConfirmation}
                                                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm shadow-sm dark:shadow-inner"
                                                required
                                                minLength={8}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUpdatingPassword || !currentPassword || !newPassword || !newPasswordConfirmation}
                                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-md shadow-emerald-500/20 text-sm mt-4 flex items-center justify-center gap-2 min-w-[180px]"
                                    >
                                        {isUpdatingPassword ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving... </>
                                        ) : (
                                            'Update Password'
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'ai_integrations' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
                                    Bring Your Own Key (BYOK)
                                </h3>

                                <div className="mb-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 p-4 rounded-xl text-sm text-slate-600 dark:text-slate-300 shadow-inner">
                                    By providing your own API keys, CareerOS will bypass default quotas and route AI generation heavily through your personal plans securely. Keys are heavily encrypted securely at rest in the database.
                                </div>

                                {keysStatusMessage && (
                                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${keysStatusMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400'}`}>
                                        {keysStatusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                        {keysStatusMessage.text}
                                    </div>
                                )}

                                <form className="space-y-6" onSubmit={handleUpdateKeys}>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 mb-1.5 flex justify-between">
                                            <span>OpenAI Key</span>
                                            <span className="text-[10px] text-slate-400">sk-proj-...</span>
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={openaiKey}
                                                onChange={(e) => setOpenaiKey(e.target.value)}
                                                placeholder="sk-..."
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm shadow-sm dark:shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 mb-1.5 flex justify-between">
                                            <span>Gemini Key</span>
                                            <span className="text-[10px] text-slate-400">AIzaSy...</span>
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={geminiKey}
                                                onChange={(e) => setGeminiKey(e.target.value)}
                                                placeholder="AIzaSy..."
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm shadow-sm dark:shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 mb-1.5 flex justify-between">
                                            <span>Groq Key</span>
                                            <span className="text-[10px] text-slate-400">gsk_...</span>
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 dark:group-focus-within:text-emerald-400 transition-colors" />
                                            <input
                                                type="password"
                                                value={groqKey}
                                                onChange={(e) => setGroqKey(e.target.value)}
                                                placeholder="gsk_..."
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm shadow-sm dark:shadow-inner"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUpdatingKeys}
                                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-xl transition-colors shadow-md shadow-emerald-500/20 text-sm mt-4 flex items-center justify-center gap-2 min-w-[180px]"
                                    >
                                        {isUpdatingKeys ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving... </>
                                        ) : (
                                            'Save AI Keys'
                                        )}
                                    </button>
                                </form>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
