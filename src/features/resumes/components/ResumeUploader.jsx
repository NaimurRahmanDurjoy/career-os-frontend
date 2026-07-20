import React, { useRef, useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { UploadCloud, FileText, Loader2, AlertTriangle } from 'lucide-react';

export default function ResumeUploader() {
  // Selective store extraction to intercept rendering noise
  const uploadAndAnalyzeResume = useResumeStore((state) => state.uploadAndAnalyzeResume);
  const isProcessing = useResumeStore((state) => state.isProcessing);
  const networkError = useResumeStore((state) => state.networkError);
  const validationError = useResumeStore((state) => state.validationError);

  const fileInputRef = useRef(null);
  const [localFileError, setLocalFileError] = useState('');

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const processFileInstance = async (file) => {
    setLocalFileError('');

    if (!file) return;

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
    await uploadAndAnalyzeResume(file);
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

  const handleContainerClick = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const activeErrorMessage = localFileError || validationError || networkError;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {activeErrorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs font-medium space-y-1">
            <p className="font-bold">Parsing Exception Intercepted</p>
            <p>{activeErrorMessage}</p>
          </div>
        </div>
      )}

      <div
        onClick={handleContainerClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-200 flex flex-col items-center justify-center cursor-pointer min-h-[280px] ${
          isProcessing
            ? 'border-blue-500/40 bg-blue-500/5 cursor-not-allowed'
            : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.docx"
          className="hidden"
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="space-y-4 animate-pulse">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
            <div className="space-y-2">
              <p className="text-sm font-bold text-white tracking-wide">Executing Llama 3.3 Semantic Extraction...</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Analyzing structural syntax trees, scoring keyword variations, and auditing document layouts.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-full w-max mx-auto shadow-inner text-slate-400">
              <UploadCloud className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-200">
                Drag and drop your document here, or <span className="text-blue-400 hover:underline">browse</span>
              </p>
              <p className="text-xs text-slate-500">Supports industry standard PDF and DOCX formats up to 5MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}