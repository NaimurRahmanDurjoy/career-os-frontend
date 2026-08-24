import React, { useState } from 'react';
import { Sparkles, Save, ChevronRight, ChevronLeft, Bot, MousePointerClick, X, Loader2 } from 'lucide-react';
import api from '../../lib/apiClient';
import CvPreview from './components/CvPreview';

export default function CvBuilderApp() {
    const [step, setStep] = useState(1);
    const [useAi, setUseAi] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [savedToAnalyzer, setSavedToAnalyzer] = useState(false);
    const [builtCv, setBuiltCv] = useState(null);

    const [formData, setFormData] = useState({
        contact_info: { name: '', email: '', phone: '', location: '', linkedin: '' },
        summary: '',
        experience: [{ company: '', role: '', duration: '', location: '', description: '' }],
        education: [{ institution: '', degree: '', graduation_year: '', gpa: '' }],
        skills: [{ category: 'Core Skills', items: '' }, { category: 'Frameworks Tools', items: '' }],
        projects: [],
        languages: [{ language: '', proficiency: '' }]
    });

    const handleInputChange = (section, index, field, value) => {
        setFormData(prev => {
            const newData = { ...prev };
            if (index !== null) {
                newData[section][index][field] = value;
            } else if (field !== null) {
                newData[section][field] = value;
            } else {
                newData[section] = value;
            }
            return newData;
        });
    };

    const addArrayItem = (section, defaultObj) => {
        setFormData(prev => ({ ...prev, [section]: [...prev[section], defaultObj] }));
    };

    const removeArrayItem = (section, index) => {
        setFormData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Convert skills items to arrays for the API if they are strings
            const formattedData = { ...formData };
            formattedData.skills = formData.skills.map(s => ({
                category: s.category,
                items: typeof s.items === 'string' ? s.items.split(',').map(i => i.trim()).filter(Boolean) : s.items
            }));

            const response = await api.post('/ai-tools/build-cv', {
                cv_data: formattedData,
                use_ai: useAi
            });

            if (response.data.success) {
                setBuiltCv(response.data.cv_data);
                setStep('preview');
            }
        } catch (error) {
            console.error("Failed to build CV", error);
            // Basic fallback on UI side if needed
            setBuiltCv(formData);
            setStep('preview');
        } finally {
            setIsGenerating(false);
        }
    };

    const saveBuiltResume = async () => {
        setIsSaving(true);
        try {
            await api.post('/resumes/built', {
                cv_data: builtCv,
                version_name: 'AI Generated ATS CV'
            });
            setSavedToAnalyzer(true);
        } catch (error) {
            console.error("Save failure", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (step === 'preview' && builtCv) {
        return (
            <div className="h-full max-h-[85vh] overflow-hidden rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <CvPreview
                    cvData={builtCv}
                    onSave={saveBuiltResume}
                    isSaving={isSaving}
                    saved={savedToAnalyzer}
                    onBack={() => setStep(4)}
                />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-4">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                    <Sparkles className="text-emerald-500" /> ATS CV Builder
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Create a perfectly formatted, ATS-compliant resume engineered for maximum callback rates.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 pt-6">

                {/* Stepper */}
                <div className="flex items-center gap-2 mb-8 select-none">
                    {[1, 2, 3, 4].map(s => (
                        <React.Fragment key={s}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm ${step === s ? 'bg-emerald-500 text-white shadow-lg' : step > s ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                {s}
                            </div>
                            {s < 4 && <div className={`h-1 flex-1 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Content */}
                <div className="min-h-[400px] mb-8">
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Contact & Basics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Full Name <input type="text" className="mt-1 w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" value={formData.contact_info.name} onChange={e => handleInputChange('contact_info', null, 'name', e.target.value)} placeholder="John Doe" />
                                </label>
                                <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Email <input type="email" className="mt-1 w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" value={formData.contact_info.email} onChange={e => handleInputChange('contact_info', null, 'email', e.target.value)} placeholder="john@example.com" />
                                </label>
                                <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Phone Number <input type="tel" className="mt-1 w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" value={formData.contact_info.phone} onChange={e => handleInputChange('contact_info', null, 'phone', e.target.value)} placeholder="+1 234 567 890" />
                                </label>
                                <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Location <input type="text" className="mt-1 w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" value={formData.contact_info.location} onChange={e => handleInputChange('contact_info', null, 'location', e.target.value)} placeholder="City, Country" />
                                </label>
                                <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300 md:col-span-2">
                                    LinkedIn / Website <input type="text" className="mt-1 w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl" value={formData.contact_info.linkedin} onChange={e => handleInputChange('contact_info', null, 'linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
                                </label>
                            </div>

                            <div className="mt-6">
                                <label className="block mb-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Professional Summary (Draft)
                                    <textarea className="mt-1 w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl h-24" value={formData.summary} onChange={e => handleInputChange('summary', null, null, e.target.value)} placeholder="Briefly describe your career, strengths, and goals. AI will enhance this later." />
                                </label>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Work Experience</h2>
                                    <button onClick={() => addArrayItem('experience', { company: '', role: '', duration: '', location: '', description: '' })} className="text-sm font-bold text-emerald-500 hover:text-emerald-600 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">+ Add Role</button>
                                </div>
                                {formData.experience.map((exp, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl mb-4 relative">
                                        <button onClick={() => removeArrayItem('experience', idx)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"><X size={16} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="Company Name" value={exp.company} onChange={e => handleInputChange('experience', idx, 'company', e.target.value)} />
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="Job Title" value={exp.role} onChange={e => handleInputChange('experience', idx, 'role', e.target.value)} />
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="Jan 2020 - Present" value={exp.duration} onChange={e => handleInputChange('experience', idx, 'duration', e.target.value)} />
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="Location (Optional)" value={exp.location} onChange={e => handleInputChange('experience', idx, 'location', e.target.value)} />
                                        </div>
                                        <textarea className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm h-24" placeholder="Describe your responsibilities and achievements as a draft. Example: Led a team of 5 to build an e-commerce platform. Increased sales by 20%." value={exp.description} onChange={e => handleInputChange('experience', idx, 'description', e.target.value)} />
                                    </div>
                                ))}
                            </div>

                            {/* Projects Section */}
                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Notable Projects</h2>
                                    <button onClick={() => addArrayItem('projects', { name: '', technologies: '', description: '' })} className="text-sm font-bold text-emerald-500 hover:text-emerald-600 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">+ Add Project</button>
                                </div>
                                {formData.projects?.map((proj, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl mb-4 relative">
                                        <button onClick={() => removeArrayItem('projects', idx)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"><X size={16} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold" placeholder="Project Name" value={proj.name} onChange={e => handleInputChange('projects', idx, 'name', e.target.value)} />
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="Technologies (e.g. React, Node.js)" value={proj.technologies} onChange={e => handleInputChange('projects', idx, 'technologies', e.target.value)} />
                                        </div>
                                        <textarea className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm h-24" placeholder="Describe the project's purpose and your contributions." value={proj.description} onChange={e => handleInputChange('projects', idx, 'description', e.target.value)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Education</h2>
                                    <button onClick={() => addArrayItem('education', { institution: '', degree: '', graduation_year: '', gpa: '' })} className="text-sm font-bold text-emerald-500 hover:text-emerald-600 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">+ Add Degree</button>
                                </div>
                                {formData.education.map((edu, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl mb-4 relative">
                                        <button onClick={() => removeArrayItem('education', idx)} className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"><X size={16} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="University Name" value={edu.institution} onChange={e => handleInputChange('education', idx, 'institution', e.target.value)} />
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="Degree (e.g. B.S. Computer Science)" value={edu.degree} onChange={e => handleInputChange('education', idx, 'degree', e.target.value)} />
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="Graduation Year" value={edu.graduation_year} onChange={e => handleInputChange('education', idx, 'graduation_year', e.target.value)} />
                                            <input type="text" className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" placeholder="GPA (Optional)" value={edu.gpa} onChange={e => handleInputChange('education', idx, 'gpa', e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Technical Skills</h2>
                                    <button onClick={() => addArrayItem('skills', { category: 'New Category', items: '' })} className="text-sm font-bold text-emerald-500 hover:text-emerald-600 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">+ Add Group</button>
                                </div>
                                {formData.skills.map((skill, idx) => (
                                    <div key={idx} className="flex gap-3 mb-3 items-start relative pr-8">
                                        <input type="text" className="w-1/3 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold" value={skill.category} onChange={e => handleInputChange('skills', idx, 'category', e.target.value)} placeholder="Category (Languages)" />
                                        <input type="text" className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" value={skill.items} onChange={e => handleInputChange('skills', idx, 'items', e.target.value)} placeholder="Comma separated, e.g. React, Node, Python" />
                                        <button onClick={() => removeArrayItem('skills', idx)} className="absolute top-2.5 right-1 text-slate-400 hover:text-rose-500"><X size={16} /></button>
                                    </div>
                                ))}
                            </div>

                            {/* Languages */}
                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-white">Language Proficiency</h2>
                                    <button onClick={() => addArrayItem('languages', { language: '', proficiency: '' })} className="text-sm font-bold text-emerald-500 hover:text-emerald-600 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg">+ Add Language</button>
                                </div>
                                {formData.languages?.map((lang, idx) => (
                                    <div key={idx} className="flex gap-3 mb-3 items-start relative pr-8">
                                        <input type="text" className="w-1/2 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold" value={lang.language} onChange={e => handleInputChange('languages', idx, 'language', e.target.value)} placeholder="Language (e.g. English)" />
                                        <input type="text" className="flex-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm" value={lang.proficiency} onChange={e => handleInputChange('languages', idx, 'proficiency', e.target.value)} placeholder="Proficiency (Native, Fluent, Beginner)" />
                                        <button onClick={() => removeArrayItem('languages', idx)} className="absolute top-2.5 right-1 text-slate-400 hover:text-rose-500"><X size={16} /></button>
                                    </div>
                                ))}
                            </div>

                            {/* Configuration */}
                            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                                <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Generation Engine</h2>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setUseAi(true)}
                                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${useAi ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'}`}
                                    >
                                        <Bot size={24} className={useAi ? 'text-emerald-500' : ''} />
                                        <div className="text-center">
                                            <p className="font-bold">AI Enhancement</p>
                                            <p className="text-xs opacity-80 mt-1">Automatically rewrites drafts into powerful ATS action bullet points.</p>
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => setUseAi(false)}
                                        className={`flex-1 p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${!useAi ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400' : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'}`}
                                    >
                                        <MousePointerClick size={24} className={!useAi ? 'text-indigo-500' : ''} />
                                        <div className="text-center">
                                            <p className="font-bold">Raw Formatting Only</p>
                                            <p className="text-xs opacity-80 mt-1">Keeps your exact phrasing. Zero AI modifications.</p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 mt-auto">
                    <button
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1 || isGenerating}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
                    >
                        <ChevronLeft size={18} /> Back
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors shadow-md"
                        >
                            Next Step <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Generating Magic...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} /> Build Resume
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
