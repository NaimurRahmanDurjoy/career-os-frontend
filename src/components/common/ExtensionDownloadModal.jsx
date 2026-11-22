import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Download,
  Globe,
  Sparkles,
  CheckCircle2,
  X,
  Copy,
  Check,
  ExternalLink,
  FolderArchive,
  ArrowRight
} from 'lucide-react';

export default function ExtensionDownloadModal({ isOpen, onClose }) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  if (!isOpen || typeof document === 'undefined') return null;

  const handleCopyChromeUrl = () => {
    navigator.clipboard.writeText('chrome://extensions/');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleDownload = () => {
    setDownloadTriggered(true);
    const link = document.createElement('a');
    link.href = '/downloads/career-os-extension.zip';
    link.download = 'career-os-extension.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Ambient Glow */}+
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Globe size={22} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                1-Click Job Clipper Extension
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                  v1.0.0
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Save jobs directly from LinkedIn, Bdjobs, Facebook, or Indeed in 1-click.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Primary Action Button (Download ZIP) */}
        <div className="relative z-10 mb-6 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
              <FolderArchive size={18} className="text-emerald-400" />
              <span>Direct Extension Package (.ZIP)</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Manifest V3 ready. Extract the folder and load it into Chrome, Edge, or Brave.
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 shrink-0 active:scale-95"
          >
            <Download size={16} />
            <span>{downloadTriggered ? 'Downloaded! (Click Again)' : 'Download ZIP'}</span>
          </button>
        </div>

        {/* 3-Step Setup Instructions */}
        <div className="relative z-10 space-y-3.5 mb-6">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-emerald-400" />
            <span>Quick 30-Second Setup Guide:</span>
          </h3>

          {/* Step 1 */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                ডাউনলোড হওয়া <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-[11px]">career-os-extension.zip</code> ফাইলটি আনজিপ (Extract) করুন।
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-200 font-medium leading-relaxed mb-2">
                Chrome-এর নতুন ট্যাবে গিয়ে অ্যাড্রেস বারে যান:
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-300 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 select-all">
                  chrome://extensions/
                </span>
                <button
                  onClick={handleCopyChromeUrl}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  {copiedUrl ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                উপরে ডানে <strong className="text-white">Developer mode</strong> অন করুন এবং উপরে বাঁয়ে <strong className="text-white">Load unpacked</strong> বাটনে ক্লিক করে আনজিপ করা ফোল্ডারটি সিলেক্ট করুন। ব্যস, হয়ে গেল!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Chrome, Brave, Edge & Opera Supported</span>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
