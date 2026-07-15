import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { 
  UploadCloud, FileText, CheckCircle, Loader2, AlertCircle, 
  Briefcase, GraduationCap, Award, Lightbulb, TrendingUp 
} from 'lucide-react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export default function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [versionName, setVersionName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState('idle'); 
  const [resumeId, setResumeId] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setErrorMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);
    if (versionName) {
      formData.append('version_name', versionName);
    }

    try {
      setStatus('uploading');
      setUploadProgress(0);

      const response = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      if (response.data.success) {
        setResumeId(response.data.resume.id);
        setStatus('processing'); 
      }
    } catch (error) {
      setStatus('failed');
      setErrorMessage(error.response?.data?.message || 'Upload failed. Check CORS or Server connection.');
    }
  };

  useEffect(() => {
    let intervalId;

    if (resumeId && status === 'processing') {
      intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/resumes/${resumeId}`);
          const resume = response.data.resume;

          if (resume.status === 'completed') {
            setParsedData(resume.parsed_content?.structured_data);
            setAtsScore(resume.ats_score);
            setAiSuggestions(resume.ai_suggestions || []);
            setStatus('completed');
            clearInterval(intervalId); 
          } else if (resume.status === 'failed') {
            setStatus('failed');
            setErrorMessage(resume.parsed_content?.error_message || 'AI processing failed.');
            clearInterval(intervalId);
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 3000); 
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [resumeId, status]);

  const safeString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map(v => safeString(v)).join(', ');
      }
      return Object.values(value).filter(v => typeof v !== 'object').join(', ');
    }
    return String(value);
  };

  // স্কোরের উপর ভিত্তি করে কালার নির্ধারণ
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {status !== 'completed' && (
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
          <p className="text-slate-400 mb-6 text-sm">Our AI-Powered system will parse, index, and score your resume for ATS optimization.</p>

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Resume Version Title</label>
              <input
                type="text"
                value={versionName}
                onChange={(e) => setVersionName(e.target.value)}
                placeholder="e.g., Full-Stack Engineer v1"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={status === 'uploading' || status === 'processing'}
              />
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-900'
              } ${(status === 'uploading' || status === 'processing') ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-12 w-12 text-blue-400 mb-4" />
              <p className="text-slate-300 font-medium">
                {isDragActive ? "Drop the PDF here..." : "Drag & Drop your resume, or click to browse"}
              </p>
              <p className="text-xs text-slate-500 mt-2">Only PDF format is supported (Max 5MB)</p>

              {file && (
                <div className="mt-4 inline-flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">{file.name}</span>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            {status === 'uploading' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Uploading file...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {status === 'processing' && (
              <div className="flex flex-col items-center justify-center p-6 bg-slate-900/40 rounded-xl border border-slate-700/50">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-3" />
                <p className="text-sm font-semibold text-white">AI is reading & analyzing your resume...</p>
              </div>
            )}

            {status !== 'uploading' && status !== 'processing' && (
              <button
                type="submit"
                disabled={!file}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all"
              >
                Upload and Analyze with AI
              </button>
            )}
          </form>
        </div>
      )}

      {status === 'completed' && parsedData && (
        <div className="space-y-6">
          {/* হেডার সেকশন */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-10 w-10 text-emerald-400 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-white">Successfully Parsed!</h2>
                <p className="text-sm text-slate-400">Candidate: <strong className="text-slate-200">{safeString(parsedData.name)}</strong></p>
              </div>
            </div>

            {/* ATS Score ভিজ্যুয়ালাইজেশন */}
            {atsScore !== null && (
              <div className={`flex items-center gap-4 px-5 py-3 rounded-2xl border ${getScoreColor(atsScore)}`}>
                <Award className="h-8 w-8" />
                <div>
                  <div className="text-[10px] uppercase font-black tracking-wider opacity-70">ATS Score</div>
                  <div className="text-2xl font-black">{atsScore} <span className="text-sm font-normal">/ 100</span></div>
                </div>
              </div>
            )}
          </div>

          {/* সাজেশন ও ফিডব্যাক গ্রিড */}
          {aiSuggestions.length > 0 && (
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="h-5 w-5 text-blue-400" />
                <h3 className="text-md font-bold text-white">AI Optimization Suggestions</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex gap-3">
                    <span className="text-blue-400 font-bold text-sm">0{index + 1}.</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{safeString(suggestion)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* মেইন বডি ডাটা */}
          <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl space-y-6">
            <div>
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3 block">Skills Extracted</span>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills && Array.isArray(parsedData.skills) && parsedData.skills.length > 0 ? (
                  parsedData.skills.map((skill, index) => (
                    <span key={index} className="bg-slate-900 border border-slate-700 text-slate-300 px-3 py-1 rounded-full text-xs font-semibold">
                      {safeString(skill)}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-500">No skills found.</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-700">
              {/* ১. WORK EXPERIENCE SECTION */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5 text-blue-400" />
                  <span className="text-sm text-slate-300 uppercase font-bold tracking-wider">Work Experience</span>
                </div>
                
                {parsedData.experience && Array.isArray(parsedData.experience) && parsedData.experience.length > 0 ? (
                  <div className="space-y-6">
                    {parsedData.experience.map((exp, idx) => (
                      <div key={idx} className="border-l-2 border-blue-500/30 pl-4 py-1 relative">
                        <div className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-blue-500"></div>
                        <h4 className="text-white font-bold text-sm">
                          {exp && typeof exp === 'object' ? safeString(exp.title) : safeString(exp)}
                        </h4>
                        {exp && typeof exp === 'object' && (
                          <>
                            <p className="text-slate-300 text-xs mt-0.5">
                              {safeString(exp.company)} 
                              {exp.duration && <span className="text-slate-400"> • {safeString(exp.duration)}</span>}
                            </p>
                            {exp.location && <p className="text-slate-500 text-[11px] mt-0.5">{safeString(exp.location)}</p>}
                            {exp.achievements && (
                              <div className="text-slate-400 text-xs mt-2 leading-relaxed">
                                {Array.isArray(exp.achievements) ? (
                                  <ul className="list-disc pl-4 space-y-1">
                                    {exp.achievements.map((ach, aIdx) => <li key={aIdx}>{safeString(ach)}</li>)}
                                  </ul>
                                ) : (
                                  <p>{safeString(exp.achievements)}</p>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-500">No experience listed.</span>
                )}
              </div>

              {/* ২. EDUCATION SECTION */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="h-5 w-5 text-indigo-400" />
                  <span className="text-sm text-slate-300 uppercase font-bold tracking-wider">Education</span>
                </div>

                {parsedData.education && Array.isArray(parsedData.education) && parsedData.education.length > 0 ? (
                  <div className="space-y-6">
                    {parsedData.education.map((edu, idx) => (
                      <div key={idx} className="border-l-2 border-indigo-500/30 pl-4 py-1 relative">
                        <div className="absolute -left-[5px] top-2 h-2 w-2 rounded-full bg-indigo-500"></div>
                        <h4 className="text-white font-bold text-sm">
                          {edu && typeof edu === 'object' ? safeString(edu.degree || edu.title) : safeString(edu)}
                        </h4>
                        {edu && typeof edu === 'object' && (
                          <>
                            <p className="text-slate-300 text-xs mt-0.5">{safeString(edu.school || edu.institution)}</p>
                            {edu.duration && <p className="text-slate-500 text-[11px] mt-0.5">{safeString(edu.duration)}</p>}
                            {edu.cgpa && (
                              <span className="inline-block mt-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded">
                                CGPA: {safeString(edu.cgpa)}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-slate-500">No education details listed.</span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                setStatus('idle');
                setFile(null);
                setResumeId(null);
                setParsedData(null);
                setAtsScore(null);
                setAiSuggestions([]);
                setErrorMessage('');
              }}
              className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Upload Another Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
}