import React, { useEffect, useState } from 'react';
import { FileText, Search } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { MCQ, Test } from '../../types';

const TeacherGenerateMcqs: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5001/api/user-tests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTests(response.data);
    } catch (error) {
      toast.error('Failed to fetch tests');
    }
  };

  const reviewMcqs = async (testName: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5001/api/review-mcqs?test_name=${testName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMcqs(response.data.mcqs);
      setSelectedTest(testName);
    } catch (error) {
      toast.error('Failed to fetch MCQs');
    }
  };

  const filteredTests = tests.filter((test) =>
    test.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.pdf_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="glass-card p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-light-teal mb-4">Review MCQs</h2>
        <p className="text-white/80 mb-6">View generated questions from your tests</p>

        <div className="relative mb-6">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
          <input
            type="text"
            placeholder="Search tests"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.test_name}
              className="glass-card p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => reviewMcqs(test.test_name)}
            >
              <div className="flex items-center mb-2">
                <FileText size={20} className="text-light-teal mr-2" />
                <span className="font-semibold text-white">{test.test_name}</span>
              </div>
              <p className="text-white/80 text-sm">{test.pdf_name} - {test.mcqs.length} MCQs - {test.status}</p>
            </div>
          ))}
        </div>

        {mcqs.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-light-teal mb-4">Questions for {selectedTest}</h3>
            <div className="space-y-4">
              {mcqs.map((mcq, index) => (
                <div key={index} className="bg-white/05 p-4 rounded-lg shadow-md">
                  <p className="font-semibold text-white mb-2">{index + 1}. {mcq.question}</p>
                  <ul className="space-y-1">
                    {mcq.options.map((option, i) => (
                      <li
                        key={i}
                        className={option === mcq.correct_answer ? 'text-light-teal' : 'text-white/80'}
                      >
                        {String.fromCharCode(97 + i)}. {option}
                      </li>
                    ))}
                  </ul>
                  <p className="text-white/60 mt-2">Type: {mcq.type} | Difficulty: {mcq.difficulty}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherGenerateMcqs;