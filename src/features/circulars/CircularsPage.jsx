import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  Building2,
  MapPin,
  Clock,
  ExternalLink,
  FileText,
  Sparkles,
  Kanban,
  CheckCircle2,
  AlertCircle,
  Filter,
  DollarSign,
  Briefcase,
  Globe,
  Landmark,
  ShieldCheck,
  ChevronRight,
  Download
} from 'lucide-react';
import { circularApi } from './services/circularApi';

export default function CircularsPage() {
  const navigate = useNavigate();
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all'); // 'all', 'active', 'expired'
  const [trackingId, setTrackingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Detail Modal State
  const [selectedCircular, setSelectedCircular] = useState(null);

  const categories = [
    { id: 'all', label: 'All Circulars', icon: Compass },
    { id: 'govt', label: 'Govt Jobs (সরকারি)', icon: Landmark },
    { id: 'bank', label: 'Bank & Finance', icon: Building2 },
    { id: 'private', label: 'Private & Corporate', icon: Briefcase },
    { id: 'remote', label: 'Remote & Global', icon: Globe }
  ];

  const fetchCirculars = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        category,
        status,
        search: search.trim() || undefined
      };
      const data = await circularApi.getCirculars(params);
      setCirculars(data.data || []);
    } catch (err) {
      console.error('Failed to fetch circulars:', err);
      setError('Could not load circulars. Please check back shortly.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCirculars();
    }, 250);
    return () => clearTimeout(timer);
  }, [category, status, search]);

  const handleTrackInKanban = async (circular, e) => {
    if (e) e.stopPropagation();
    try {
      setTrackingId(circular.id);
      const result = await circularApi.trackCircular(circular.id);
      setToastMessage({
        type: 'success',
        text: result.message || 'Added to your Job Tracker (Kanban)!'
      });
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      setToastMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to track circular.'
      });
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setTrackingId(null);
    }
  };

  const handleMatchWithCv = (circular, e) => {
    if (e) e.stopPropagation();
    navigate('/match-checker', {
      state: {
        prefillJob: {
          title: circular.title,
          company: circular.organization,
          description: `${circular.title}\n${circular.organization}\n\n${circular.description}\n\nRequirements:\n${circular.requirements || ''}`
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold border backdrop-blur-xl animate-in slide-in-from-bottom-3 duration-200 ${
          toastMessage.type === 'success'
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50'
            : 'bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50'
        }`}>
          {toastMessage.type === 'success' ? <CheckCircle2 className="text-emerald-400 shrink-0" size={18} /> : <AlertCircle className="text-rose-400 shrink-0" size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600/10 via-indigo-600/10 to-teal-600/10 border border-slate-200 dark:border-white/10 p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
            <Compass size={14} /> Live Circular Discovery Engine
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Explore Circulars & Opportunities
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Verified Bangladesh Government circulars, Top Corporate hiring, and Global Remote tech roles. Instant 1-Click Match with your primary ATS resume.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 dark:opacity-20 pointer-events-none">
          <Compass size={280} className="text-emerald-500" />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search circular by title, ministry, organization, or keywords..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
            <button
              onClick={() => setStatus('all')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                status === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatus('active')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                status === 'active'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-emerald-500'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatus('expired')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                status === 'expired'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-500 hover:text-rose-500'
              }`}
            >
              Expired (Archive)
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-white dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Circulars */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-100 dark:bg-slate-900/50 animate-pulse border border-slate-200 dark:border-slate-800" />
          ))}
        </div>
      ) : circulars.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center">
            <Compass size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Circulars Found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords or switching category filters to view more opportunities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circulars.map((circular) => {
            const isExpired = circular.is_expired;
            const daysLeft = circular.days_left;

            return (
              <div
                key={circular.id}
                onClick={() => setSelectedCircular(circular)}
                className={`group rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden backdrop-blur-sm ${
                  isExpired
                    ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800/80 opacity-75 hover:opacity-100'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5'
                }`}
              >
                {/* Category & Status Badges */}
                <div className="flex items-start justify-between gap-2 mb-4">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                    circular.category === 'govt'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      : circular.category === 'bank'
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
                      : circular.category === 'remote'
                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  }`}>
                    {circular.category}
                  </span>

                  {isExpired ? (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      Expired
                    </span>
                  ) : daysLeft !== null ? (
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Clock size={11} /> {daysLeft === 0 ? 'Last Day' : `${daysLeft}d left`}
                    </span>
                  ) : null}
                </div>

                {/* Organization & Title */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <Building2 size={13} className="shrink-0" />
                    <span className="truncate">{circular.organization}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    {circular.title}
                  </h3>

                  <div className="space-y-1.5 pt-2">
                    {circular.salary_range && (
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <DollarSign size={13} className="shrink-0" />
                        <span className="truncate">{circular.salary_range}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin size={13} className="shrink-0" />
                      <span className="truncate">{circular.location}</span>
                    </div>
                  </div>

                  {/* Skills preview tags */}
                  {Array.isArray(circular.skills_tags) && circular.skills_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3">
                      {circular.skills_tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {tag}
                        </span>
                      ))}
                      {circular.skills_tags.length > 3 && (
                        <span className="text-[10px] font-semibold text-slate-400 self-center">
                          +{circular.skills_tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-5 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => handleMatchWithCv(circular, e)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-xs font-bold transition-colors"
                    title="Check how well your resume matches this job"
                  >
                    <Sparkles size={13} />
                    <span>Match CV</span>
                  </button>

                  <button
                    onClick={(e) => handleTrackInKanban(circular, e)}
                    disabled={trackingId === circular.id}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="1-Click Track in Kanban Board"
                  >
                    <Kanban size={15} />
                  </button>

                  {circular.circular_pdf_url && (
                    <a
                      href={circular.circular_pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      title="Download Official Circular PDF"
                    >
                      <Download size={15} />
                    </a>
                  )}

                  {circular.source_url && (
                    <a
                      href={circular.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className={`p-2 rounded-xl transition-colors ${
                        isExpired
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20'
                      }`}
                      title={isExpired ? 'Application Expired' : 'Apply on Official Site'}
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal Drawer */}
      {selectedCircular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6 pretty-scrollbar animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {selectedCircular.category} Circular
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
                  {selectedCircular.title}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {selectedCircular.organization} • {selectedCircular.location}
                </p>
              </div>

              <button
                onClick={() => setSelectedCircular(null)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Salary Scale</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedCircular.salary_range || 'Negotiable'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Experience / Grade</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedCircular.experience_level || 'Open'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Deadline</p>
                <p className="text-xs font-bold text-emerald-500 mt-0.5">
                  {selectedCircular.is_expired ? 'Expired' : `${selectedCircular.days_left} days left`}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">About the Role / Circular Details</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedCircular.description}
              </p>
            </div>

            {/* Requirements */}
            {selectedCircular.requirements && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Eligibility & Requirements</h4>
                <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 whitespace-pre-line">
                  {selectedCircular.requirements}
                </div>
              </div>
            )}

            {/* Skills Tags */}
            {Array.isArray(selectedCircular.skills_tags) && selectedCircular.skills_tags.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Key Tags & Competencies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCircular.skills_tags.map((tag, idx) => (
                    <span key={idx} className="text-xs font-medium px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={() => handleMatchWithCv(selectedCircular)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-xs font-bold transition-colors"
              >
                <Sparkles size={15} />
                <span>Match With My CV</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleTrackInKanban(selectedCircular)}
                  disabled={trackingId === selectedCircular.id}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-500 text-xs font-bold transition-colors"
                >
                  <Kanban size={15} />
                  <span>Track in CRM</span>
                </button>

                {selectedCircular.circular_pdf_url && (
                  <a
                    href={selectedCircular.circular_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-400 text-xs font-bold transition-colors"
                  >
                    <Download size={15} />
                    <span>Official PDF</span>
                  </a>
                )}

                {selectedCircular.source_url && (
                  <a
                    href={selectedCircular.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white transition-all ${
                      selectedCircular.is_expired
                        ? 'bg-slate-600 cursor-not-allowed opacity-50'
                        : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                    }`}
                  >
                    <span>{selectedCircular.is_expired ? 'Expired' : 'Apply Now'}</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
