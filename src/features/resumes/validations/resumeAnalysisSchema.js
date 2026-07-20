import { z } from 'zod';

/**
 * Validation schema for individual critique actionable items
 */
const actionableFixSchema = z.object({
  severity: z.enum(['critical', 'warning', 'optimization']),
  section: z.string().min(1, { message: 'Section identification is required' }),
  suggestion: z.string().min(1, { message: 'Suggestion narrative cannot be empty' }),
});

/**
 * Structural contract validating incoming JSON data structures emitted by the AI analysis engine
 */
export const resumeAnalysisSchema = z.object({
  profile: z.object({
    name: z.string().min(1, { message: 'Candidate name parameter missing' }),
    email: z.string().email({ message: 'Invalid or missing candidate email profile' }),
    phone: z.string().nullable(),
    skills: z.array(z.string()),
  }),
  atsScorecard: z.object({
    score: z
      .number()
      .int()
      .min(0)
      .max(100, { message: 'ATS compliance score must sit between 0 and 100' }),
    missingKeywords: z.array(z.string()),
    formattingIssues: z.array(z.string()),
  }),
  critique: z.object({
    summary: z.string().min(1, { message: 'AI critique summary is required' }),
    actionableFixes: z.array(actionableFixSchema),
  }),
});