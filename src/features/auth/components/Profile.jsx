import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Settings, Shield, Bell, Loader2, CheckCircle2, AlertCircle, Lock, Camera, Trash2, Globe, Copy, Check, ExternalLink, Plus } from 'lucide-react';

export default function Profile() {
    const user = useAuthStore((state) => state.user);
    const updateProfile = useAuthStore((state) => state.updateProfile);
    const updatePassword = useAuthStore((state) => state.updatePassword);
    const updateApiKeys = useAuthStore((state) => state.updateApiKeys);
    const updatePortfolio = useAuthStore((state) => state.updatePortfolio);

    // Tab State
    const [activeTab, setActiveTab] = useState('overview');

    // Portfolio State
    const [username, setUsername] = useState(user?.username || '');
    const [headline, setHeadline] = useState(user?.headline || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [isPortfolioPublic, setIsPortfolioPublic] = useState(user?.is_portfolio_public ?? true);
    const [socialGithub, setSocialGithub] = useState(user?.social_links?.github || '');
    const [socialLinkedin, setSocialLinkedin] = useState(user?.social_links?.linkedin || '');
    const [socialTwitter, setSocialTwitter] = useState(user?.social_links?.twitter || '');
    const [socialWebsite, setSocialWebsite] = useState(user?.social_links?.website || '');
    const [isUpdatingPortfolio, setIsUpdatingPortfolio] = useState(false);
    const [portfolioStatusMessage, setPortfolioStatusMessage] = useState(null);
    const [copiedPortfolioUrl, setCopiedPortfolioUrl] = useState(false);

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatar, setAvatar] = useState(user?.settings?.avatar || '');
    const [isUpdating, setIsUpdating] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);
    const fileInputRef = useRef(null);

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
            setAvatar(user.settings?.avatar || '');
            setOpenaiKey(user.custom_api_keys?.openai || '');
            setGeminiKey(user.custom_api_keys?.gemini || '');
            setGroqKey(user.custom_api_keys?.groq || '');
            setUsername(user.username || '');
            setHeadline(user.headline || '');
            setBio(user.bio || '');
            setIsPortfolioPublic(user.is_portfolio_public ?? true);
            setSocialGithub(user.social_links?.github || '');
            setSocialLinkedin(user.social_links?.linkedin || '');
            setSocialTwitter(user.social_links?.twitter || '');
            setSocialWebsite(user.social_links?.website || '');
        }
    }, [user]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setStatusMessage({ type: 'error', text: 'Please upload an image file (PNG, JPG, WebP).' });
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            setStatusMessage({ type: 'error', text: 'Image size should be less than 2MB.' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveAvatar = () => {
        setAvatar('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setStatusMessage(null);
        try {
            await updateProfile(name, email, avatar);
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

    const handleUpdatePortfolio = async (e) => {
        e.preventDefault();
        setIsUpdatingPortfolio(true);
        setPortfolioStatusMessage(null);
        try {
            await updatePortfolio({
                username: username.trim().toLowerCase(),
                headline: headline.trim(),
                bio: bio.trim(),
                is_portfolio_public: isPortfolioPublic,
                social_links: {
                    github: socialGithub.trim(),
                    linkedin: socialLinkedin.trim(),
                    twitter: socialTwitter.trim(),
                    website: socialWebsite.trim(),
                }
            });
            setPortfolioStatusMessage({ type: 'success', text: 'Portfolio settings successfully published!' });
            setTimeout(() => setPortfolioStatusMessage(null), 3000);
        } catch (error) {
            setPortfolioStatusMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save portfolio.' });
        } finally {
            setIsUpdatingPortfolio(false);
        }
    };

    const handleCopyPortfolioUrl = () => {
        if (!username) return;
        const url = `${window.location.origin}/p/${username}`;
        navigator.clipboard.writeText(url);
        setCopiedPortfolioUrl(true);
        setTimeout(() => setCopiedPortfolioUrl(false), 2000);
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
                        <div className="relative w-24 h-24 mx-auto mb-4 group">
                            {avatar ? (
                                <img
                                    src={avatar}
                                    alt={name || 'User Avatar'}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-md ring-2 ring-emerald-500/20"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center text-white font-black text-4xl border-4 border-white dark:border-slate-800 shadow-md">
                                    {name ? name.charAt(0).toUpperCase() : <User size={40} />}
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/jpg"
                                onChange={handleFileChange}
                                className="hidden"
                                id="avatar-upload"
                            />
                            
                            <label
                                htmlFor="avatar-upload"
                                className="absolute bottom-0 right-0 p-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white cursor-pointer shadow-lg transition-transform hover:scale-110 active:scale-95 border-2 border-white dark:border-slate-900"
                                title="Upload Photo"
                            >
                                <Camera size={14} />
                            </label>

                            {avatar && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAvatar}
                                    className="absolute top-0 right-0 p-1.5 rounded-full bg-rose-500/90 hover:bg-rose-600 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
                                    title="Remove Photo"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 truncate">{name || user?.name}</h3>
                        <p className="text-xs text-slate-500 font-medium tracking-wide truncate">{email || user?.email}</p>
                        
                        <div className="mt-3">
                            <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                {user?.current_plan?.name || 'Career OS Basic'}
                            </span>
                        </div>
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
                                    onClick={() => setActiveTab('portfolio')}
                                    className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-bold transition-colors ${activeTab === 'portfolio' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-4 border-emerald-500' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-4 border-transparent'}`}
                                >
                                    <Globe size={18} /> Public Portfolio
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
                                        disabled={isUpdating || (name === user?.name && email === user?.email && avatar === (user?.settings?.avatar || ''))}
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

                        {/* Public Portfolio Tab */}
                        {activeTab === 'portfolio' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-white/5">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
                                            Public Career Portfolio
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                            Your personal web page displaying your CV, verified skills, and projects.
                                        </p>
                                    </div>

                                    {username && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleCopyPortfolioUrl}
                                                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
                                                title="Copy public link"
                                            >
                                                {copiedPortfolioUrl ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                                <span>{copiedPortfolioUrl ? 'Copied' : 'Copy Link'}</span>
                                            </button>

                                            <a
                                                href={`/p/${username}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl transition-all shadow-sm"
                                            >
                                                <span>View Live</span>
                                                <ExternalLink size={14} />
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {portfolioStatusMessage && (
                                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${portfolioStatusMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400'}`}>
                                        {portfolioStatusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                                        {portfolioStatusMessage.text}
                                    </div>
                                )}

                                <form className="space-y-6" onSubmit={handleUpdatePortfolio}>
                                    {/* Visibility Toggle */}
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/5">
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-800 dark:text-white">Enable Public Portfolio</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Allow anyone with your link to view your verified public CV & portfolio.
                                            </p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isPortfolioPublic}
                                                onChange={(e) => setIsPortfolioPublic(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                                        </label>
                                    </div>

                                    {/* Username field */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 mb-1.5 flex justify-between">
                                            <span>Your Custom URL</span>
                                            <span className="text-[10px] text-emerald-500 font-mono">careeros.me/p/{username || 'yourname'}</span>
                                        </label>
                                        <div className="flex items-center rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-950/50 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                                            <span className="px-3.5 py-3.5 text-xs text-slate-400 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 font-mono select-none">
                                                /p/
                                            </span>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                                                placeholder="username"
                                                required
                                                maxLength={30}
                                                className="w-full px-4 py-3.5 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-sm font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Headline */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                                            Headline / Professional Title
                                        </label>
                                        <input
                                            type="text"
                                            value={headline}
                                            onChange={(e) => setHeadline(e.target.value)}
                                            placeholder="e.g. Senior Full-Stack Engineer | React & Laravel Specialist"
                                            maxLength={150}
                                            className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm shadow-sm"
                                        />
                                    </div>

                                    {/* Bio */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                                            Short Bio / Elevator Pitch
                                        </label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={3}
                                            placeholder="Write a concise overview of what you do, problems you solve, and what roles you are seeking..."
                                            maxLength={1000}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm resize-none"
                                        />
                                    </div>

                                    {/* Social Links */}
                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">
                                            Social & Contact Handles
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                value={socialGithub}
                                                onChange={(e) => setSocialGithub(e.target.value)}
                                                placeholder="GitHub Profile (https://github.com/...)"
                                                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-xs"
                                            />
                                            <input
                                                type="text"
                                                value={socialLinkedin}
                                                onChange={(e) => setSocialLinkedin(e.target.value)}
                                                placeholder="LinkedIn Profile (https://linkedin.com/in/...)"
                                                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-xs"
                                            />
                                            <input
                                                type="text"
                                                value={socialTwitter}
                                                onChange={(e) => setSocialTwitter(e.target.value)}
                                                placeholder="Twitter / X (https://x.com/...)"
                                                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-xs"
                                            />
                                            <input
                                                type="text"
                                                value={socialWebsite}
                                                onChange={(e) => setSocialWebsite(e.target.value)}
                                                placeholder="Personal Website (https://...)"
                                                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 text-xs"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isUpdatingPortfolio || !username}
                                        className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md shadow-emerald-500/20 text-sm mt-4 flex items-center justify-center gap-2 min-w-[200px]"
                                    >
                                        {isUpdatingPortfolio ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" /> Publishing... </>
                                        ) : (
                                            'Save & Publish Portfolio'
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
