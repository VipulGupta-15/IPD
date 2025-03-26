import React, { useEffect, useState } from 'react';
import { FileUp, FilePlus, Calendar } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Test } from '../../types';

const TeacherDashboardContent: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [students, setStudents] = useState<{ _id: string; name: string; email: string }[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [results, setResults] = useState<{ [studentId: string]: { score: number; answers: { [questionId: string]: string } } }>({});

  useEffect(() => {
    fetchTests();
    fetchStudents();
  }, []);

  const fetchTests = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5001/api/user-tests', { headers: { Authorization: `Bearer ${token}` } });
      setTests(response.data);
    } catch (error) {
      toast.error('Failed to fetch tests');
    }
  };

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5001/api/students', { headers: { Authorization: `Bearer ${token}` } });
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    }
  };

  const assignTest = async () => {
    const token = localStorage.getItem('token');
    if (!selectedTest || !studentIds.length || !startTime || !endTime) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5001/api/assign-test',
        { test_name: selectedTest, student_ids: studentIds, start_time: startTime, end_time: endTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Test assigned');
      fetchTests();
    } catch (error) {
      toast.error('Failed to assign test');
    }
  };

  const manageTest = async (testName: string, action: 'start' | 'stop') => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5001/api/manage-test',
        { test_name: testName, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Test ${action}ed`);
      fetchTests();
    } catch (error) {
      toast.error(`Failed to ${action} test`);
    }
  };

  const viewResults = async (testName: string) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5001/api/student-results?test_name=${testName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(response.data.results);
    } catch (error) {
      toast.error('Failed to fetch results');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="glass-card p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-light-teal">Dashboard</h2>
        <p className="text-white/80 mt-1">Overview of your assessments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Total Tests', value: tests.length, icon: FileUp },
          { title: 'MCQs Generated', value: tests.reduce((sum, test) => sum + test.mcqs.length, 0), icon: FilePlus },
          { title: 'Active Tests', value: tests.filter(t => t.status === 'active').length, icon: Calendar },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card p-6 rounded-xl shadow-lg flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
            <stat.icon size={24} className="text-light-teal" />
          </div>
        ))}
      </div>

      <div className="glass-card p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-light-teal mb-4">Assign Test</h3>
        <div className="space-y-4">
          <select
            value={selectedTest}
            onChange={(e) => setSelectedTest(e.target.value)}
            className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
          >
            <option value="">Select Test</option>
            {tests.map((test) => (
              <option key={test.test_name} value={test.test_name}>{test.test_name}</option>
            ))}
          </select>
          <select
            multiple
            value={studentIds}
            onChange={(e) => setStudentIds(Array.from(e.target.selectedOptions, option => option.value))}
            className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 text-white h-32 focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
          >
            {students.map((student) => (
              <option key={student._id} value={student._id}>{student.name} ({student.email})</option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={startTime.slice(0, 16)}
            onChange={(e) => setStartTime(new Date(e.target.value).toISOString())}
            className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
          />
          <input
            type="datetime-local"
            value={endTime.slice(0, 16)}
            onChange={(e) => setEndTime(new Date(e.target.value).toISOString())}
            className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
          />
          <button
            onClick={assignTest}
            className="w-full bg-light-teal text-deep-blue font-semibold py-2 rounded-lg hover:bg-light-teal/80 transition-colors"
          >
            Assign Test
          </button>
        </div>
      </div>

      <div className="glass-card p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold text-light-teal mb-4">Recent Tests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-white/60">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">PDF</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.test_name} className="border-b border-white/05 hover:bg-white/05 transition-colors">
                  <td className="py-3 px-4 text-white">{test.test_name}</td>
                  <td className="py-3 px-4 text-white/80">{test.pdf_name}</td>
                  <td className="py-3 px-4 text-white/80">{test.status}</td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <button onClick={() => manageTest(test.test_name, 'start')} className="text-light-teal hover:text-white">Start</button>
                    <button onClick={() => manageTest(test.test_name, 'stop')} className="text-light-teal hover:text-white">Stop</button>
                    <button onClick={() => viewResults(test.test_name)} className="text-light-teal hover:text-white">Results</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {Object.keys(results).length > 0 && (
          <div className="mt-4">
            <h4 className="text-lg font-semibold text-light-teal mb-2">Results</h4>
            {Object.entries(results).map(([studentId, result]) => (
              <div key={studentId} className="p-3 bg-white/05 rounded-lg mb-2">
                <p className="text-white">Student ID: {studentId}</p>
                <p className="text-white/80">Score: {result.score}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardContent;