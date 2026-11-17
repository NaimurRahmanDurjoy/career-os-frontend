import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Career OS
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Privacy Policy & Terms of Service</h1>
            <p className="text-xs text-slate-400 mt-1">Last Updated: November 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Introduction</h2>
            <p>
              Career OS is dedicated to protecting your personal data and career documents. This Privacy Policy details how we handle your uploaded resumes, job application records, and account credentials.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Information We Process</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li><strong>Profile Information:</strong> Name, email address, password hashes, and subscription tier.</li>
              <li><strong>Resume & Career Files:</strong> Uploaded PDF files for the sole purpose of ATS keyword extraction and parsing.</li>
              <li><strong>Job Tracking Data:</strong> Job application URLs, job descriptions, notes, and recruiter contacts you manually save or clip using our browser extension.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Browser Extension Data Collection</h2>
            <p>
              The Career OS Copilot & Job Clipper Chrome Extension only accesses web page contents (such as job title and company name) when you explicitly click the extension action button on job sites (LinkedIn, Bdjobs, Indeed, etc.). We do not record your browsing history, keystrokes, or background traffic.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. AI Processing & Third Parties</h2>
            <p>
              When utilizing AI features (Match Checker, Cover Letter Generator, Interview Prep), sanitized text snippets of your resume and job descriptions are passed to secured enterprise AI models (OpenAI, Gemini). We do not permit AI providers to train public models on your personal documents.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">5. Data Ownership & Deletion</h2>
            <p>
              You maintain 100% ownership of your resume files and job data. You may delete your resumes, individual job cards, or your entire account and associated records at any time from your Profile settings.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

