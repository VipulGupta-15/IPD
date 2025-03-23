// src/components/student/TakeTest.tsx
import React, { useState, useEffect } from 'react';
import { Check, X, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { MCQ, TestResult } from '../../types';

interface TakeTestProps {
  mcqs: MCQ[];
  testName: string;
  onTestComplete: (result: TestResult) => void;
  setActiveMenu: (menu: string) => void; // Added prop
}

const TakeTest: React.FC<TakeTestProps> = ({ mcqs, testName, onTestComplete, setActiveMenu }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(mcqs.length).fill(''));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(mcqs.length * 60); // 1 minute per question in seconds
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    if (!submitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit('Time’s up! Test submitted automatically.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [submitted, timeLeft]);

  const handleAnswerChange = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mcqs.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = (message: string) => {
    const calculatedScore = mcqs.reduce((acc, mcq, index) => {
      return acc + (answers[index] === mcq.correct_answer ? 1 : 0);
    }, 0);
    const total = mcqs.length;
    const percentage = (calculatedScore / total) * 100;

    const result: TestResult = {
      testName,
      date: new Date().toISOString(),
      score: calculatedScore,
      total,
      percentage,
      answers,
      mcqs, // Include MCQs in result
    };

    setScore(calculatedScore);
    onTestComplete(result);
    setSubmitted(true);
    toast.success(message);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (mcqs.length === 0) {
    return (
      <div className="glass-card p-6">
        <h2 className="text-xl font-medium mb-4">Take Test</h2>
        <p className="text-white/70">No test available. Please upload a PDF to generate questions.</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">{testName}</h2>
        {!submitted && (
          <div className="flex items-center text-white/70">
            <Clock size={16} className="mr-2" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {!submitted ? (
        <>
          <div className="mb-6">
            <div className="w-full bg-white/10 rounded-full h-2 mb-2">
              <div
                className="bg-gradient-to-r from-light-teal to-deep-blue h-2 rounded-full"
                style={{ width: `${((currentQuestion + 1) / mcqs.length) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-white/70">
              <span>Question {currentQuestion + 1} of {mcqs.length}</span>
              <span>{Math.round(((currentQuestion + 1) / mcqs.length) * 100)}% complete</span>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">{mcqs[currentQuestion].question}</h3>
            <div className="space-y-3">
              {mcqs[currentQuestion].options.map((option, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="radio"
                    name={`q${currentQuestion}`}
                    value={option}
                    checked={answers[currentQuestion] === option}
                    onChange={() => handleAnswerChange(option)}
                    className="w-5 h-5 mr-3 text-light-teal focus:ring-light-teal"
                  />
                  <span className="text-white/90">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              className="btn-outline py-2 px-6"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </button>
            {currentQuestion === mcqs.length - 1 ? (
              <button
                className="btn-primary py-2 px-6"
                onClick={() => handleSubmit('Test completed successfully!')}
              >
                Submit Test
              </button>
            ) : (
              <button className="btn-primary py-2 px-6" onClick={handleNext}>
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <div>
          <h3 className="text-lg font-medium mb-4">Test Review</h3>
          <p className="text-white/70 mb-6">
            Your Score: {score}/{mcqs.length} ({((score! / mcqs.length) * 100).toFixed(2)}%)
          </p>
          <div className="space-y-6">
            {mcqs.map((mcq, index) => {
              const isCorrect = answers[index] === mcq.correct_answer;
              return (
                <div key={index} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <span className="font-medium mr-2">{index + 1}. {mcq.question}</span>
                    {isCorrect ? (
                      <CheckCircle size={16} className="text-green-400" />
                    ) : (
                      <AlertCircle size={16} className="text-red-400" />
                    )}
                  </div>
                  <ul className="space-y-2">
                    {mcq.options.map((option, optIndex) => (
                      <li
                        key={optIndex}
                        className={`text-white/90 flex items-center ${
                          option === mcq.correct_answer ? 'text-green-400' : ''
                        } ${answers[index] === option && !isCorrect ? 'text-red-400' : ''}`}
                      >
                        <span className="mr-2">
                          {option === mcq.correct_answer && <Check size={14} />}
                          {answers[index] === option && !isCorrect && <X size={14} />}
                        </span>
                        {option}
                        {option === mcq.correct_answer && ' (Correct Answer)'}
                        {answers[index] === option && !isCorrect && ' (Your Answer - Incorrect)'}
                        {answers[index] === option && isCorrect && ' (Your Answer - Correct)'}
                      </li>
                    ))}
                  </ul>
                  {!answers[index] && (
                    <p className="text-yellow-400 mt-2">You did not answer this question.</p>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-6 text-center">
            <button
              className="btn-primary py-2 px-6"
              onClick={() => setActiveMenu('results')} // Now accessible via props
            >
              Go to Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeTest;