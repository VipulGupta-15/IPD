// src/types.ts
export interface MCQ {
    question: string;
    options: string[];
    correct_answer: string;
    type: 'theory' | 'numerical';
    difficulty: 'easy' | 'medium' | 'hard';
  }
  
  export interface PdfUploadProps {
    onMcqsGenerated: (mcqs: MCQ[], testName: string) => void;
  }
  
  export interface TestResult {
    testName: string;
    date: string; // ISO string, e.g., "2025-03-23T12:00:00Z"
    score: number; // Correct answers
    total: number; // Total questions
    percentage: number; // Score percentage
    answers: string[]; // Student's answers for review
    mcqs: MCQ[]; // Add MCQs to TestResult for review
  }