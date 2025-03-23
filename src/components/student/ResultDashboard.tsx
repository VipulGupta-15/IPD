// src/components/student/ResultDashboard.tsx
import React, { useState } from 'react';
import { TestResult } from '../../types';
import { Check, X, CheckCircle, AlertCircle } from 'lucide-react';

interface ResultDashboardProps {
  results: TestResult[];
}

const ResultDashboard: React.FC<ResultDashboardProps> = ({ results }) => {
  const [selectedTestIndex, setSelectedTestIndex] = useState<number | null>(null);
  const maxHeight = 200; // Max height of the chart in pixels

  const handleReviewClick = (index: number) => {
    setSelectedTestIndex(selectedTestIndex === index ? null : index);
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-medium mb-6">Test Results</h2>
      {results.length === 0 ? (
        <p className="text-white/70">No test results available yet. Take a test to see your performance!</p>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Score Trend</h3>
            <div className="bg-white/5 p-4 rounded-lg h-64 flex items-end">
              {results.map((result, index) => {
                const barHeight = (result.percentage / 100) * maxHeight;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="bg-gradient-to-t from-light-teal to-deep-blue w-2/3 rounded-t-sm"
                      style={{ height: `${barHeight}px` }}
                    ></div>
                    <span className="text-xs text-white/70 mt-2">
                      {new Date(result.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="text-white/70 text-sm mt-2">Percentage Score Over Time</div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Test Name</th>
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Date</th>
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Score</th>
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Percentage</th>
                  <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">{result.testName}</td>
                      <td className="py-3 px-4 text-white/70">
                        {new Date(result.date).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {result.score}/{result.total}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            result.percentage >= 80
                              ? 'bg-green-500/20 text-green-400'
                              : result.percentage >= 60
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {result.percentage.toFixed(2)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          className="text-light-teal hover:text-white transition-colors text-sm"
                          onClick={() => handleReviewClick(index)}
                        >
                          {selectedTestIndex === index ? 'Hide Review' : 'Review'}
                        </button>
                      </td>
                    </tr>
                    {selectedTestIndex === index && result.mcqs && (
                      <tr>
                        <td colSpan={5} className="py-4 px-4">
                          <div className="bg-white/5 p-4 rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Test Review</h3>
                            <p className="text-white/70 mb-6">
                              Your Score: {result.score}/{result.total} (
                              {((result.score / result.total) * 100).toFixed(2)}%)
                            </p>
                            <div className="space-y-6">
                              {result.mcqs.map((mcq, qIndex) => {
                                const isCorrect = result.answers[qIndex] === mcq.correct_answer;
                                return (
                                  <div key={qIndex} className="bg-white/10 p-4 rounded-lg">
                                    <div className="flex items-center mb-2">
                                      <span className="font-medium mr-2">
                                        {qIndex + 1}. {mcq.question}
                                      </span>
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
                                          } ${
                                            result.answers[qIndex] === option && !isCorrect
                                              ? 'text-red-400'
                                              : ''
                                          }`}
                                        >
                                          <span className="mr-2">
                                            {option === mcq.correct_answer && <Check size={14} />}
                                            {result.answers[qIndex] === option &&
                                              !isCorrect && <X size={14} />}
                                          </span>
                                          {option}
                                          {option === mcq.correct_answer && ' (Correct Answer)'}
                                          {result.answers[qIndex] === option &&
                                            !isCorrect &&
                                            ' (Your Answer - Incorrect)'}
                                          {result.answers[qIndex] === option &&
                                            isCorrect &&
                                            ' (Your Answer - Correct)'}
                                        </li>
                                      ))}
                                    </ul>
                                    {!result.answers[qIndex] && (
                                      <p className="text-yellow-400 mt-2">
                                        You did not answer this question.
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ResultDashboard;