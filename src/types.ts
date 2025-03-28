export interface MCQ {
  question: string;
  options: string[];
  correct_answer: string;
  type: 'theory' | 'numerical';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Test {
  user_id: string;
  test_name: string;
  pdf_name: string;
  mcqs: MCQ[];
  created_at: string;
  status: 'generated' | 'assigned' | 'active' | 'stopped';
  assigned_to: string[];
  start_time: string | null;
  end_time: string | null;
  result: { [studentId: string]: { score: number; answers: { [questionId: string]: string } } };
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