import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Compass,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export default function AdminCirculars({ onLogout }) {
  const [circulars, setCirculars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [toast, setToast] = useState(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCircular, setEditingCircular] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    category: 'govt',
    location: 'Bangladesh',
    job_type: 'full-time',
    experience_level: '',
    salary_range: '',
    application_deadline: '',
    source_url: '',
    circular_pdf_url: '',
    description: '',
    requirements: '',
    skills_tags: '',
    is_featured: false,
    is_active: true
  });

  const getAdminAuthHeader = () => {
    const token = localStorage.getItem('admin_token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchCirculars = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/admin/circulars`, {
        ...getAdminAuthHeader(),
        params: { search, category }
      });
      setCirculars(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) onLogout();
      showToast('error', 'Failed to load circulars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCirculars();
  }, [category]);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 3000);
  };

  const handleOpenModal = (circular = null) => {
    if (circular) {
      setEditingCircular(circular);
      setFormData({
        title: circular.title,
        organization: circular.organization,
        category: circular.category,
        location: circular.location || 'Bangladesh',
        job_type: circular.job_type || 'full-time',
        experience_level: circular.experience_level || '',
        salary_range: circular.salary_range || '',
        application_deadline: circular.application_deadline ? circular.application_deadline.substring(0, 10) : '',
        source_url: circular.source_url || '',
        circular_pdf_url: circular.circular_pdf_url || '',
        description: circular.description || '',
        requirements: circular.requirements || '',
        skills_tags: Array.isArray(circular.skills_tags) ? circular.skills_tags.join(', ') : '',
        is_featured: circular.is_featured || false,
        is_active: circular.is_active !== undefined ? circular.is_active : true
      });
    } else {
      setEditingCircular(null);
      setFormData({
        title: '',
        organization: '',
        category: 'govt',
        location: 'Bangladesh',
        job_type: 'full-time',
        experience_level: '',
        salary_range: '',
        application_deadline: '',
        source_url: '',
        circular_pdf_url: '',
        description: '',
        requirements: '',
        skills_tags: '',
        is_featured: false,
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...formData,
        skills_tags: formData.skills_tags
          ? formData.skills_tags.split(',').map((s) => s.trim()).filter(Boolean)
          : []
      };

      if (editingCircular) {
        await axios.put(`${API_BASE}/admin/circulars/${editingCircular.id}`, payload, getAdminAuthHeader());
        showToast('success', 'Circular updated successfully!');
      } else {
        await axios.post(`${API_BASE}/admin/circulars`, payload, getAdminAuthHeader());
        showToast('success', 'New circular published successfully!');
      }

      setIsModalOpen(false);
      fetchCirculars();
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save circular.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this circular?')) return;
    try {
      await axios.delete(`${API_BASE}/admin/circulars/${id}`, getAdminAuthHeader());
      showToast('success', 'Circular deleted successfully.');
      fetchCirculars();
    } catch (err) {
      showToast('error', 'Failed to delete circular.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border flex items-center gap-2 text-sm font-semibold shadow-2xl ${
          toast.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-200' : 'bg-rose-950 border-rose-500 text-rose-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
            <Compass className="text-emerald-400" size={22} />
            Job Circulars Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">Publish and manage verified Govt, Bank, Corporate and Remote opportunities.</p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-emerald-600/20"
        >
          <Plus size={16} />
          <span>Post New Circular</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCirculars()}
            placeholder="Search circular title or organization and press Enter..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-emerald-500"
        >
          <option value="all">All Categories</option>
          <option value="govt">Govt Jobs (সরকারি)</option>
          <option value="bank">Bank & Finance</option>
          <option value="private">Private & Corporate</option>
          <option value="remote">Remote & Tech</option>
        </select>
      </div>

      {/* Circulars Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin text-emerald-400" size={20} />
            <span>Loading circulars...</span>
          </div>
        ) : circulars.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No job circulars found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/50 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Title & Organization</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Salary / Pay Scale</th>
                  <th className="px-6 py-4">Deadline</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {circulars.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-sm line-clamp-1">{c.title}</p>
                      <p className="text-slate-400 mt-0.5">{c.organization}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                        {c.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-400 font-medium">
                      {c.salary_range || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {c.application_deadline ? c.application_deadline.substring(0, 10) : 'Open'}
                      {c.is_expired && <span className="ml-2 text-rose-400 font-bold">(Expired)</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {c.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(c)}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit Circular"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Delete Circular"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto space-y-5 pretty-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingCircular ? 'Edit Job Circular' : 'Post New Job Circular'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. সহকারী প্রোগ্রামার (Grade 9)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Organization / Ministry *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g. বাংলাদেশ ব্যাংক"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="govt">Govt Jobs (সরকারি)</option>
                    <option value="bank">Bank & Finance</option>
                    <option value="private">Private & Corporate</option>
                    <option value="remote">Remote & Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Salary Range / Scale</label>
                  <input
                    type="text"
                    value={formData.salary_range}
                    onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                    placeholder="e.g. ৳২২,০০০ - ৳৫৩,০৬০"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    value={formData.application_deadline}
                    onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Experience Level / Grade</label>
                  <input
                    type="text"
                    value={formData.experience_level}
                    onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                    placeholder="e.g. Grade 9 / Fresher / 2-3 yrs"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Online Application URL (Teletalk/Portal)</label>
                  <input
                    type="url"
                    value={formData.source_url}
                    onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                    placeholder="http://bb.teletalk.com.bd"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Circular PDF URL</label>
                  <input
                    type="url"
                    value={formData.circular_pdf_url}
                    onChange={(e) => setFormData({ ...formData, circular_pdf_url: e.target.value })}
                    placeholder="https://example.com/circular.pdf"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Skills Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.skills_tags}
                  onChange={(e) => setFormData({ ...formData, skills_tags: e.target.value })}
                  placeholder="PHP, Laravel, PostgreSQL, Computer Networks"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">About the Role / Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Details of the circular..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Eligibility & Requirements</label>
                <textarea
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Educational background, age limits, syllabus etc."
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                  />
                  <span>Mark as Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
                  />
                  <span>Active (Visible on public feed)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50"
                >
                  {saving && <Loader2 className="animate-spin" size={14} />}
                  <span>{editingCircular ? 'Update Circular' : 'Publish Circular'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
