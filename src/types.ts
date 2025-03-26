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