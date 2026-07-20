import { create } from 'zustand';
import apiClient from '../../../lib/apiClient';
import { resumeAnalysisSchema } from '../validations/resumeAnalysisSchema';

export const useResumeStore = create((set, get) => ({
  analysisData: null,
  isProcessing: false,
  networkError: null,
  validationError: null,
  currentResumeId: null,

  clearAnalysisState: () => {
    set({
      analysisData: null,
      isProcessing: false,
      networkError: null,
      validationError: null,
      currentResumeId: null,
    });
  },

  /**
   * Step 1: Uploads the binary and handles Laravel's immediate 202 Queue Response
   */
  uploadAndAnalyzeResume: async (resumeFileBinary) => {
    set({ isProcessing: true, networkError: null, validationError: null, analysisData: null });

    const formData = new FormData();
    formData.append('resume', resumeFileBinary);
    formData.append('version_name', 'Main Version');

    try {
      // Hit the explicit upload endpoint provided in your controller
      const response = await apiClient.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const resumeRecord = response.data?.resume;

      if (resumeRecord && resumeRecord.id) {
        set({ currentResumeId: resumeRecord.id });
        
        // Step 2: Since Laravel queued the task, start polling the show($id) route
        return await get().pollResumeStatus(resumeRecord.id);
      } else {
        throw new Error('Invalid server response tracking ID missing.');
      }
    } catch (error) {
      console.error('Upload phase failure:', error);
      set({
        networkError: error.response?.data?.message || 'Network handshake failed during file transfer.',
        isProcessing: false,
      });
      return { success: false, variant: 'network' };
    }
  },

  /**
   * Step 2: Polls the backend show($id) endpoint until status changes from 'processing'
   */
  pollResumeStatus: async (id) => {
    const maxAttempts = 20; // 20 attempts * 3 seconds = 60 seconds timeout guard
    let attempts = 0;

    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        attempts++;

        try {
          // Hits your exact public function show($id) API endpoint
          const response = await apiClient.get(`/resumes/${id}`);
          const resumeData = response.data?.resume;

          if (!resumeData) {
            clearInterval(interval);
            set({ networkError: 'Received malformed record payload from server.', isProcessing: false });
            resolve({ success: false });
            return;
          }

          // Case A: Still working in background queue
          if (resumeData.status === 'processing' || resumeData.status === 'pending') {
            if (attempts >= maxAttempts) {
              clearInterval(interval);
              set({ networkError: 'AI parsing session timed out. Check backend workers queue state.', isProcessing: false });
              resolve({ success: false, variant: 'timeout' });
            }
            return; // Exit and wait for next tick interval
          }

          // Case B: Background execution failed on backend
          if (resumeData.status === 'failed') {
            clearInterval(interval);
            set({ networkError: 'Laravel background queue failed to process this specific PDF document.', isProcessing: false });
            resolve({ success: false, variant: 'server_job_failed' });
            return;
          }

          // Case C: Background job completed! Now parse data via Zod Guard
          clearInterval(interval);

          // SAFE PARSING DEFENDER: ডাটাবেজ থেকে ডেটা স্ট্রিং হিসেবে আসলেও যেন ক্র্যাশ না করে
          let parsedContent = resumeData.parsed_content;
          if (typeof parsedContent === 'string') {
            try { parsedContent = JSON.parse(parsedContent); } catch (e) { parsedContent = {}; }
          }

          let aiSuggestions = resumeData.ai_suggestions;
          if (typeof aiSuggestions === 'string') {
            try { aiSuggestions = JSON.parse(aiSuggestions); } catch (e) { aiSuggestions = {}; }
          }

          // ল্যারাভেল জবের নতুন অবজেক্ট স্ট্রাকচারের সাথে ফ্রন্টএন্ড Zod-এর ম্যাপিং
          const preparedPayload = {
            profile: {
              name: parsedContent?.structured_data?.name || 'Candidate Name Missing',
              email: parsedContent?.structured_data?.email || 'email@example.com',
              phone: parsedContent?.structured_data?.phone || null,
              skills: parsedContent?.structured_data?.skills || [],
            },
            atsScorecard: {
              score: Number(resumeData.ats_score) || 0,
              missingKeywords: aiSuggestions?.missing_keywords || [],
              formattingIssues: aiSuggestions?.formatting_issues || [],
            },
            critique: {
              summary: aiSuggestions?.summary || 'No review summary provided.',
              actionableFixes: (aiSuggestions?.actionable_fixes || []).map((fix) => ({
                severity: fix.severity || 'optimization',
                section: fix.section || 'General',
                suggestion: fix.suggestion || '',
              })),
            },
          };

          // Synchronous validation test via Zod Guard
          const structuralCheck = resumeAnalysisSchema.safeParse(preparedPayload);

          if (!structuralCheck.success) {
            console.error('Zod schema validation failed on polled data:', structuralCheck.error);
            set({
              validationError: 'The database payload schema structure does not match client contract rules.',
              isProcessing: false,
            });
            resolve({ success: false, variant: 'validation' });
            return;
          }

          // Success deployment!
          set({
            analysisData: structuralCheck.data,
            isProcessing: false,
          });
          resolve({ success: true });

        } catch (error) {
          console.error('Error during status polling cycle:', error);
          clearInterval(interval);
          set({
            networkError: 'Lost connection to backend server during live polling cycles.',
            isProcessing: false,
          });
          resolve({ success: false, variant: 'network' });
        }
      }, 3000); // Polls every 3000ms (3 seconds) safely
    });
  },
}));