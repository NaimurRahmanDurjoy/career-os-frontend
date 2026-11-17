import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Globe, ExternalLink, Download, 
  Briefcase, GraduationCap, Award, Sparkles, CheckCircle2, 
  MapPin, Mail, ArrowUpRight, Copy, Check, Share2, AlertCircle
} from 'lucide-react';
import { authApi } from '../auth/services/authApi';

// Custom lightweight SVG icons for brand socials
function GithubIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function LinkedinIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TwitterIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

export default function PublicPortfolioPage() {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchPortfolio() {
      setLoading(true);
      setError(null);
      try {
        const res = await authApi.getPublicPortfolio(username);
        if (res.success) {
          setPortfolioData(res.data);
        } else {
          setError(res.message || 'Portfolio not found.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Portfolio not found or is currently private.');
      } finally {
        setLoading(false);
      }
    }

    if (username) {
      fetchPortfolio();
    }
  }, [username]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-emerald-500 selection:text-white">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 animate-pulse blur-xl opacity-60 absolute" />
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-center relative z-10 shadow-2xl">
            <Sparkles className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Loading Portfolio...
        </p>
      </div>
    );
  }

  if (error || !portfolioData) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 text-rose-400">
          <AlertCircle size={28} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Portfolio Unavailable</h1>
        <p className="text-slate-400 max-w-md text-sm mb-6">
          {error || 'This user has either made their portfolio private or the link is incorrect.'}
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-emerald-500/20"
        >
          Explore Career OS
        </Link>
      </div>
    );
  }

  const { user, resume } = portfolioData;
  const social = user.social_links || {};
  const projects = user.featured_projects || [];
  const skills = Array.isArray(resume?.skills) ? resume.skills : [];
  const experience = Array.isArray(resume?.experience) ? resume.experience : [];
  const education = Array.isArray(resume?.education) ? resume.education : [];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Floating Mini Navbar */}
      <nav className="sticky top-4 z-40 max-w-4xl mx-auto px-4">
        <div className="bg-slate-900/70 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 flex items-center justify-between shadow-2xl shadow-black/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">Available For Hire</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition-all active:scale-95"
              title="Copy public portfolio link"
            >
              {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <Link
              to="/register"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-all"
            >
              <span>Build Yours</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-10 pb-28 space-y-12">
        {/* Profile Hero Section */}
        <header className="relative bg-gradient-to-b from-slate-900/80 to-slate-900/40 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-1 shadow-xl">
                <div className="w-full h-full rounded-[22px] bg-slate-900 flex items-center justify-center overflow-hidden">
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-tr from-emerald-400 to-indigo-300">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-full ring-4 ring-slate-900">
                <CheckCircle2 size={16} />
              </div>
            </div>

            {/* Header Details */}
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {user.name}
                </h1>
                <p className="text-emerald-400 font-semibold text-base sm:text-lg mt-0.5">
                  {user.headline || 'Software Engineer & Builder'}
                </p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  careeros.me/p/{user.username}
                </p>
              </div>

              {user.bio && (
                <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                  {user.bio}
                </p>
              )}

              {/* Social Links Row */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-2">
                {social.github && (
                  <a
                    href={social.github.startsWith('http') ? social.github : `https://${social.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white rounded-xl border border-white/5 transition-all hover:scale-105"
                    title="GitHub"
                  >
                    <GithubIcon size={18} />
                  </a>
                )}
                {social.linkedin && (
                  <a
                    href={social.linkedin.startsWith('http') ? social.linkedin : `https://${social.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 text-sky-400 hover:text-sky-300 rounded-xl border border-white/5 transition-all hover:scale-105"
                    title="LinkedIn"
                  >
                    <LinkedinIcon size={18} />
                  </a>
                )}
                {social.twitter && (
                  <a
                    href={social.twitter.startsWith('http') ? social.twitter : `https://${social.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl border border-white/5 transition-all hover:scale-105"
                    title="Twitter / X"
                  >
                    <TwitterIcon size={18} />
                  </a>
                )}
                {social.website && (
                  <a
                    href={social.website.startsWith('http') ? social.website : `https://${social.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 hover:text-emerald-300 rounded-xl border border-white/5 transition-all hover:scale-105"
                    title="Website"
                  >
                    <Globe size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <span>Core Expertise & Tech Stack</span>
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => {
                const skillName = typeof skill === 'string' ? skill : skill.name || JSON.stringify(skill);
                return (
                  <span
                    key={index}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-200 text-xs font-semibold shadow-sm hover:border-emerald-500/50 hover:text-emerald-300 transition-colors cursor-default"
                  >
                    {skillName}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* Featured Projects Section */}
        {projects.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-indigo-400" />
              <span>Featured Projects</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-bold text-white group-hover:text-emerald-400 transition-colors text-base">
                        {proj.title}
                      </h3>
                      {proj.link && (
                        <a
                          href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          <ArrowUpRight size={16} />
                        </a>
                      )}
                    </div>
                    {proj.description && (
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {proj.description}
                      </p>
                    )}
                  </div>

                  {proj.tech_stack && Array.isArray(proj.tech_stack) && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {proj.tech_stack.map((t, ti) => (
                        <span
                          key={ti}
                          className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 text-[11px] font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Work Experience Timeline */}
        {experience.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <span>Work Experience</span>
            </h2>
            <div className="space-y-4 border-l-2 border-slate-800 pl-4 sm:pl-6 ml-2 sm:ml-3">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[23px] sm:-left-[31px] top-1.5 w-3 h-3 rounded-full bg-slate-700 group-hover:bg-emerald-400 ring-4 ring-slate-950 transition-colors" />
                  <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="font-bold text-white text-base">
                        {exp.title || exp.position || exp.role}
                      </h3>
                      <span className="text-xs font-mono text-slate-400">
                        {exp.duration || exp.dates || `${exp.start_date || ''} - ${exp.end_date || 'Present'}`}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-emerald-400 mb-2">
                      {exp.company || exp.organization}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Timeline */}
        {education.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span>Education</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/50 border border-white/5 rounded-2xl p-5"
                >
                  <h3 className="font-bold text-white text-sm">
                    {edu.degree || edu.field_of_study || 'Degree Program'}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">
                    {edu.institution || edu.school || edu.university}
                  </p>
                  {(edu.graduation_year || edu.duration) && (
                    <p className="text-[11px] font-mono text-slate-500 mt-2">
                      {edu.graduation_year || edu.duration}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Persistent Bottom Sticky Viral Banner */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-lg border-t border-white/10 py-3 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-xs">
              C
            </span>
            <p className="text-xs text-slate-300 font-medium">
              Want your own live portfolio link & AI ATS CV?
            </p>
          </div>

          <Link
            to="/register"
            className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <span>Create Your Free Portfolio</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
