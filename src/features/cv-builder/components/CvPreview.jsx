import React, { useRef, useState } from 'react';
import { Download, Save, CheckCircle2, ArrowLeft, Loader2, Printer } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export default function CvPreview({ cvData, onSave, isSaving, saved, onBack }) {
    const printRef = useRef(null);
    const [isExportingPdf, setIsExportingPdf] = useState(false);

    // 1. Clean Direct PDF Download Engine
    const handleDownloadPdf = async () => {
        if (!printRef.current) return;
        setIsExportingPdf(true);

        const candidateName = cvData.contact_info?.name
            ? cvData.contact_info.name.replace(/\s+/g, '_')
            : 'Candidate';

        const opt = {
            margin: [10, 10, 10, 10], // top, left, bottom, right in mm
            filename: `${candidateName}_ATS_Resume.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, logging: false },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(printRef.current).save();
        } catch (error) {
            console.error('PDF Generation failed, fallback to print:', error);
            window.print();
        } finally {
            setIsExportingPdf(false);
        }
    };

    const handlePrint = () => {
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
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        title="Print Preview"
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all"
                    >
                        <Printer size={18} />
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isExportingPdf}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-70"
                    >
                        {isExportingPdf ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
                        {isExportingPdf ? 'Exporting PDF...' : 'Download PDF'}
                    </button>
                    <button
                        onClick={onSave}
                        disabled={isSaving || saved}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${saved
                            ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                            }`}
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : saved ? <CheckCircle2 size={18} /> : <Save size={18} />}
                        {saved ? 'Saved to Profile' : 'Save to Profile'}
                    </button>
                </div>
            </div>

            {/* Resume Preview Paper */}
            <div className="flex-1 overflow-auto print:overflow-visible flex justify-center pb-12 print:pb-0">
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
                                Work Experience
                            </h2>
                            <div className="space-y-4">
                                {cvData.experience.map((exp, index) => (
                                    <div key={index} className="text-left">
                                        <div className="flex justify-between items-baseline">
                                            <h3 className="font-bold text-slate-900 text-[14px]" contentEditable suppressContentEditableWarning>
                                                {exp.role || 'Job Role'}
                                            </h3>
                                            <span className="text-[12px] font-semibold text-slate-700" contentEditable suppressContentEditableWarning>
                                                {exp.duration || ''}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-[13px] italic font-semibold text-slate-800" contentEditable suppressContentEditableWarning>
                                                {exp.company || 'Company'}
                                            </span>
                                            <span className="text-[12px] text-slate-600" contentEditable suppressContentEditableWarning>
                                                {exp.location || ''}
                                            </span>
                                        </div>
                                        <div className="text-[13px] leading-relaxed text-slate-800 whitespace-pre-line pl-2" contentEditable suppressContentEditableWarning>
                                            {exp.description}
                                        </div>
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
                                {cvData.skills.map((group, idx) => {
                                    if (typeof group === 'string') return <div key={idx}>• {group}</div>;
                                    return (
                                        <div key={idx} className="mb-1">
                                            <span className="font-bold">{group.category}:</span> {Array.isArray(group.items) ? group.items.join(', ') : group.items}
                                        </div>
                                    );
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
        </div>
    );
}
