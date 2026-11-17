import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Sparkles,
  Target,
  FileText,
  Kanban,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  BrainCircuit,
  Star,
  Globe
} from 'lucide-react';
import { useAuthStore } from '../features/auth/store/useAuthStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Header / Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-emerald-500 to-teal-400 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/20">
              <Briefcase className="h-6 w-6 text-slate-950" strokeWidth={2.5} />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                Career <span className="text-emerald-400">OS</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block -mt-1">
                AI Career Suite
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#extension" className="hover:text-emerald-400 transition-colors">Chrome Extension</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                Go to Dashboard <ArrowRight size={16} />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden sm:block text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
                >
                  Start Free <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-36 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles size={14} className="animate-spin" /> Next-Gen AI Job Search Co-Pilot
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8">
            Land Your Dream Job <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">
              3x Faster With AI Intelligence
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Stop sending 100s of ignored applications. Analyze your resume against real job descriptions, clip jobs from LinkedIn & Bdjobs in 1-click, and prep for interviews seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-base transition-all shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              Get Started for Free <ArrowRight size={18} />
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 rounded-2xl font-bold text-base transition-all flex items-center justify-center"
            >
              See Live Demo
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-6 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-400" /> Free forever tier</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-400" /> No credit card needed</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={15} className="text-emerald-400" /> 100% ATS compliant</span>
          </div>
        </div>
      </section>

      {/* 3. Social Proof Stats */}
      <section className="border-y border-slate-900 bg-slate-900/30 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl md:text-4xl font-black text-white">85%+</p>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mt-1">Average ATS Score Boost</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-emerald-400">1-Click</p>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mt-1">Job Clipping Extension</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-white">10,000+</p>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mt-1">Applications Tracked</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-indigo-400">3.5x</p>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500 mt-1">Higher Interview Call Rate</p>
          </div>
        </div>
      </section>

      {/* 4. Core Features Grid */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            All-In-One Powerhouse
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-4">
            Everything you need to beat the hiring algorithms
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-8 rounded-3xl transition-all duration-300 relative group overflow-hidden">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Resume ATS Analyzer</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Scan your resume with real ATS scoring algorithms. Get instant feedback on missing keywords, formatting errors, and recruiter suggestions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-8 rounded-3xl transition-all duration-300 relative group overflow-hidden">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
              <Kanban size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Kanban Job CRM</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Organize all your job applications across stages: Wishlist, Applied, Interviewing, Offer. Keep private notes, recruiter contacts, and reminders.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-8 rounded-3xl transition-all duration-300 relative group overflow-hidden">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">CV vs JD Match Checker</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Paste any job post to see your percentage match score before applying. Uncover exact skill gaps and generate tailor-made cover letters in seconds.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-8 rounded-3xl transition-all duration-300 relative group overflow-hidden">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-6">
              <BrainCircuit size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Mock Test & Prep Tracker</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Test your technical and behavioral skills with AI-driven mock questions customized to your specific job applications.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-8 rounded-3xl transition-all duration-300 relative group overflow-hidden">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Rejection Analysis & Negotiation</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Turn rejections into actionable learning points, and learn exactly how to counter-offer and negotiate higher salaries with confidence.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-slate-900/50 border border-slate-800 hover:border-slate-700 p-8 rounded-3xl transition-all duration-300 relative group overflow-hidden">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">ATS CV Builder</h3>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              Build an ATS-optimized resume from scratch. Let AI polish your bullet points into impactful, metric-driven achievements.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Chrome Extension Showcase */}
      <section id="extension" className="py-20 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
              <Globe size={16} /> Browser Companion
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
              Clip Any Job in 1-Click <br />
              <span className="text-emerald-400">Directly From Your Browser</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              No more copying and pasting job titles, company names, and requirements. Browse LinkedIn, Bdjobs, Facebook groups, or Indeed—click the Career OS extension, and it saves into your application board automatically.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 size={18} className="text-emerald-400" /> Works natively on LinkedIn, Bdjobs & Facebook
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 size={18} className="text-emerald-400" /> Automatically captures salary & full descriptions
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 size={18} className="text-emerald-400" /> Instant sync with your Career OS account
              </div>
            </div>

            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3.5 bg-white hover:bg-slate-200 text-slate-950 font-black rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg"
            >
              <Globe size={18} className="text-emerald-600" /> Get Extension Free
            </button>
          </div>

          <div className="flex-1 w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl shadow-emerald-500/5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
              </div>
              <span className="text-xs font-bold text-slate-400">Career OS Clipper</span>
            </div>
            <div className="mt-4 space-y-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Extracted Title</span>
                <p className="text-sm font-bold text-white">Senior Software Engineer</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Company Detected</span>
                <p className="text-sm font-bold text-white">Google / Remote</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Stage</span>
                <p className="text-sm font-bold text-emerald-400">Applied (Added to CRM)</p>
              </div>
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center text-xs font-bold text-emerald-400">
                ✓ Synced to your Career OS Kanban
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action Footer */}
      <footer className="py-20 border-t border-slate-900 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-slate-400 text-base mb-8 max-w-lg mx-auto">
            Join thousands of professionals landing higher-paying roles with Career OS.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-500/30 hover:scale-105"
          >
            Create Your Free Account Now
          </button>
          <p className="text-xs text-slate-600 mt-12 font-medium">
            © {new Date().getFullYear()} Career OS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
