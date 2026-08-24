import React, { useRef } from 'react';
import { Download, Save, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';

export default function CvPreview({ cvData, onSave, isSaving, saved, onBack }) {
    const printRef = useRef(null);

    const handlePrint = () => {
        // Simple window print which respects CSS @media print
        window.print();
    };

    if (!cvData) return null;

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950">
            {/* Header / Actions (Hidden on Print) */}
            <div className="print:hidden mb-6 flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-semibold transition-colors"
                >
                    <ArrowLeft size={18} /> Edit Information
                </button>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
                    >
                        <Download size={18} /> Download PDF
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving || saved}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${saved
                            ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                            }`}
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                        {saved ? 'Saved Successfully' : 'Save to Profile'}
                    </button>
                </div>
            </div>

            {/* Resume Preview Paper */}
            <div className="flex-1 overflow-auto print:overflow-visible flex justify-center pb-12 print:pb-0">
                {/* 
                  The A4 sizing is mostly respected by browsers during print.
                  print:m-0 print:border-none print:shadow-none removes browser UI borders.
                */}
                <div
                    ref={printRef}
                    className="cv-document bg-white text-black w-[210mm] min-h-[297mm] p-10 shadow-2xl rounded-sm print:shadow-none print:p-8 print:w-auto print:min-h-0 print:border-none forced-color-adjust-exact mx-auto [&_a]:text-black [&_a]:no-underline [&_*]:text-black"
                    style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                    {/* Header */}
                    <div className="text-center mb-6 border-b-2 border-black pb-4">
                        <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-wider mb-2">
                            {cvData.contact_info?.name || 'Your Name'}
                        </h1>
                        <div className="text-sm text-slate-700 flex flex-wrap justify-center gap-x-4 gap-y-1">
                            {cvData.contact_info?.email && <span>{cvData.contact_info.email}</span>}
                            {cvData.contact_info?.phone && <span>• {cvData.contact_info.phone}</span>}
                            {cvData.contact_info?.location && <span>• {cvData.contact_info.location}</span>}
                            {cvData.contact_info?.linkedin && <span>• {cvData.contact_info.linkedin}</span>}
                        </div>
                    </div>

                    {/* Summary */}
                    {cvData.summary && (
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-2 border-b border-slate-300">
                                Professional Summary
                            </h2>
                            <p className="text-[13px] leading-relaxed text-left text-slate-800" contentEditable suppressContentEditableWarning>
                                {cvData.summary}
                            </p>
                        </div>
                    )}

                    {/* Experience */}
                    {cvData.experience && cvData.experience.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-300">
                                Experience
                            </h2>
                            <div className="space-y-4">
                                {cvData.experience.map((exp, index) => (
                                    <div key={index} className="text-left">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="font-bold text-slate-900 text-[14px] leading-tight" contentEditable suppressContentEditableWarning>
                                                {exp.role || 'Role Name'}
                                            </h3>
                                            <span className="text-[12px] font-semibold text-slate-700 whitespace-nowrap" contentEditable suppressContentEditableWarning>
                                                {exp.duration || 'Start - End'}
                                            </span>
                                        </div>
                                        <div className="text-[13px] font-semibold text-slate-700 mb-1.5 flex justify-between">
                                            <span contentEditable suppressContentEditableWarning>{exp.company || 'Company Name'}</span>
                                            {exp.location && <span className="font-normal italic" contentEditable suppressContentEditableWarning>{exp.location}</span>}
                                        </div>

                                        {Array.isArray(exp.description) ? (
                                            <ul className="list-disc pl-5 space-y-1 text-[13px] text-slate-800">
                                                {exp.description.map((desc, i) => (
                                                    <li key={i} contentEditable suppressContentEditableWarning>{desc}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            exp.description && (
                                                <div className="text-[13px] text-slate-800 whitespace-pre-wrap pl-2 leading-relaxed" contentEditable suppressContentEditableWarning>
                                                    {exp.description.split('\n').map((line, idx) => (
                                                        <span key={idx} className="block mb-1 relative pl-3 before:content-['-'] before:absolute before:left-0 before:text-slate-600">
                                                            {line.replace(/^-\s*/, '')}
                                                        </span>
                                                    ))}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {cvData.projects && cvData.projects.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-300">
                                Notable Projects
                            </h2>
                            <div className="space-y-4">
                                {cvData.projects.map((proj, index) => (
                                    <div key={index} className="text-left">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="font-bold text-slate-900 text-[14px]" contentEditable suppressContentEditableWarning>
                                                {proj.name || 'Project Name'}
                                            </h3>
                                        </div>
                                        {proj.technologies && (
                                            <div className="text-[12px] font-semibold text-slate-600 italic mb-1.5" contentEditable suppressContentEditableWarning>
                                                Technologies: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                                            </div>
                                        )}
                                        {Array.isArray(proj.description) ? (
                                            <ul className="list-disc pl-5 space-y-1 text-[13px] text-slate-800">
                                                {proj.description.map((desc, i) => (
                                                    <li key={i} contentEditable suppressContentEditableWarning>{desc}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            proj.description && (
                                                <div className="text-[13px] text-slate-800 whitespace-pre-wrap pl-2" contentEditable suppressContentEditableWarning>
                                                    {proj.description.split('\n').map((line, idx) => (
                                                        <span key={idx} className="block mb-1 relative pl-3 before:content-['-'] before:absolute before:left-0 before:text-slate-600">
                                                            {line.replace(/^-\s*/, '')}
                                                        </span>
                                                    ))}
                                                </div>
                                            )
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {cvData.education && cvData.education.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-300">
                                Education
                            </h2>
                            <div className="space-y-3">
                                {cvData.education.map((edu, index) => (
                                    <div key={index} className="text-left">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-slate-900 text-[14px]" contentEditable suppressContentEditableWarning>
                                                {edu.institution || 'University Name'}
                                            </h3>
                                            <span className="text-[12px] font-semibold text-slate-700" contentEditable suppressContentEditableWarning>
                                                {edu.graduation_year || ''}
                                            </span>
                                        </div>
                                        <div className="text-[13px] text-slate-800 flex justify-between">
                                            <span contentEditable suppressContentEditableWarning>{edu.degree || 'Degree'}</span>
                                            {edu.gpa && <span contentEditable suppressContentEditableWarning>GPA: {edu.gpa}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {cvData.skills && cvData.skills.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-300">
                                Technical Skills
                            </h2>
                            <div className="text-[13px] leading-relaxed text-slate-800 text-left" contentEditable suppressContentEditableWarning>
                                {cvData.skills.map(group => {
                                    if (typeof group === 'string') return <div key={group}>• {group}</div>;
                                    return (
                                        <div key={group.category} className="mb-1">
                                            <span className="font-bold">{group.category}:</span> {Array.isArray(group.items) ? group.items.join(', ') : group.items}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Languages */}
                    {cvData.languages && cvData.languages.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-3 border-b border-slate-300">
                                Languages
                            </h2>
                            <div className="text-[13px] leading-relaxed text-slate-800 flex flex-wrap gap-x-8 gap-y-2 text-left" contentEditable suppressContentEditableWarning>
                                {cvData.languages.map((lang, idx) => lang.language ? (
                                    <div key={idx}>
                                        <span className="font-bold">{lang.language}</span>
                                        {lang.proficiency ? ` - ${lang.proficiency}` : ''}
                                    </div>
                                ) : null)}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page { 
                        size: portrait; 
                        margin: 0; /* Removing margin removes browser headers & footers automatically */
                    }
                    body * {
                        visibility: hidden;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    .forced-color-adjust-exact, .forced-color-adjust-exact * {
                        visibility: visible;
                    }
                    .forced-color-adjust-exact {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
                
                /* Strict block to disable browser format detection rendering (like phones turning blue) */
                .cv-document a, .cv-document a:link, .cv-document font { 
                    color: #000000 !important; 
                    text-decoration: none !important; 
                }
            `}</style>
        </div>
    );
}
