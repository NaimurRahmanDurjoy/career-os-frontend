import React from 'react';
import ResumeUploader from './components/ResumeUploader';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* সুন্দর ব্র্যান্ড হেডার */}
      <div className="text-center mb-8">
        <span className="bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs px-3 py-1.5 rounded-full font-semibold uppercase tracking-wider">
          AI-Powered Career OS
        </span>
        <h1 className="text-3xl font-extrabold text-white mt-4 tracking-tight">
          Enterprise Resume Parser
        </h1>
        <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">
          Optimized with Groq Llama-3 and PostgreSQL JSONB for maximum speed and accuracy.
        </p>
      </div>

      {/* আপলোডার কম্পোনেন্ট */}
      <ResumeUploader />
    </div>
  );
}

export default App;