import React, { useRef, useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { UploadCloud, FileText, Loader2, AlertTriangle } from 'lucide-react';
import PaywallModal from '../../../components/common/PaywallModal';

export default function ResumeUploader() {
  // Selective store extraction to intercept rendering noise
  const uploadAndAnalyzeResume = useResumeStore((state) => state.uploadAndAnalyzeResume);
  const retryResumeAnalysis = useResumeStore((state) => state.retryResumeAnalysis);
  const isProcessing = useResumeStore((state) => state.isProcessing);
  const networkError = useResumeStore((state) => state.networkError);
  const validationError = useResumeStore((state) => state.validationError);
  const currentResumeId = useResumeStore((state) => state.currentResumeId);

  const user = useAuthStore((state) => state.user);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);

  const fileInputRef = useRef(null);
  const [localFileError, setLocalFileError] = useState('');
  const [versionName, setVersionName] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const processFileInstance = async (file) => {
    setLocalFileError('');

    if (!file) return;

    if (user && user.usage && user.limits && user.usage.resumes >= user.limits.resumes) {
      setIsPaywallOpen(true);
      return;
    }

    // Enforce localized client-side file format guard rules
    const allowedExtensions = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedExtensions.includes(file.type)) {
      setLocalFileError('Unsupported file type. Please upload a PDF or DOCX file.');
      return;
    }

    // Enforce 5MB structural size limit boundary
    if (file.size > 5 * 1024 * 1024) {
      setLocalFileError('File size limits exceeded. Maximum allowed footprint is 5MB.');
      return;
    }

    // Trigger the decoupled atomic upload request stream
    await uploadAndAnalyzeResume(file, versionName || 'Main Version');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (isProcessing) return;
    const file = e.dataTransfer.files[0];
    processFileInstance(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processFileInstance(file);
  };

  const handleRetry = () => {
    if (currentResumeId) {
      retryResumeAnalysis(currentResumeId);
    }
  };

  const handleContainerClick = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const activeErrorMessage = localFileError || validationError || networkError;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {activeErrorMessage && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-4 rounded-xl flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 text-red-600 dark:text-red-400">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div className="text-xs font-medium space-y-1">
              <p className="font-bold">Parsing Exception Intercepted</p>
              <p>{activeErrorMessage}</p>
            </div>
          </div>
          {currentResumeId && (
            <button
              onClick={handleRetry}
              disabled={isProcessing}
              className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-500/20 dark:hover:bg-red-500/30 text-red-700 dark:text-red-300 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-red-500/50 uppercase tracking-wider"
            >
              Retry Parsing
            </button>
          )}
        </div>
      )}

      <div className="relative mt-4">
        <input
          id="versionName"
          type="text"
          placeholder="e.g. Frontend Developer Resume"
          value={versionName}
          onChange={(e) => setVersionName(e.target.value)}
          className="peer w-full pl-4 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 focus:border-emerald-500 focus:ring-emerald-500 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 transition-all text-sm shadow-sm dark:shadow-inner dark:shadow-black/20 placeholder-transparent focus:placeholder-slate-400 dark:focus:placeholder-slate-500"
          disabled={isProcessing}
        />
        <label
          htmlFor="versionName"
          className="absolute left-3 px-1.5 bg-white dark:bg-slate-900 transition-all duration-200 pointer-events-none text-slate-500 dark:text-slate-400 peer-focus:text-emerald-500 dark:peer-focus:text-emerald-400 -top-2.5 text-[10px] font-bold uppercase tracking-widest peer-placeholder-shown:top-[15px] peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-focus:-top-2.5 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-widest"
        >
          Version Name (Optional)
        </label>
      </div>

      <div
        onClick={handleContainerClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-3xl p-6 md:p-10 text-center transition-all duration-300 flex flex-col items-center justify-center cursor-pointer min-h-[250px] md:min-h-[300px] relative overflow-hidden group ${isProcessing
          ? 'border-emerald-500/50 bg-emerald-500/10 cursor-not-allowed shadow-[0_0_30px_rgba(16,185,129,0.2)]'
          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/80 hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.15)]'
          }`}
      >
        {/* Subtle background glow effect on hover */}
        {!isProcessing && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx"
          className="hidden"
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="space-y-5 animate-pulse relative z-10 w-full">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-400 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-gold-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <div className="space-y-2 text-center">
              <p className="text-sm font-bold text-slate-200 tracking-widest uppercase">
                Parsing Document...
              </p>
              <p className="text-xs text-indigo-300/60 max-w-xs mx-auto font-medium">
                Extracting structured data and verifying compliance formatting.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5 relative z-10">
            <div className="p-5 bg-white dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-2xl w-max mx-auto shadow-xl group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300">
              <UploadCloud className="h-8 w-8 text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <p className="text-[15px] font-bold text-slate-700 dark:text-slate-200">
                Drag and drop your document here, or <span className="text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">browse files</span>
              </p>
              <p className="text-xs text-slate-500 font-medium">Supports industry standard PDF and DOCX formats up to 5MB</p>
            </div>
          </div>
        )}
      </div>
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onUpgrade={() => window.dispatchEvent(new CustomEvent('changeView', { detail: 'billing' }))}
        featureName="Resume Analyzer"
      />
    </div>
  );
}