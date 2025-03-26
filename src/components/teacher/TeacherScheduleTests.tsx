import React, { useEffect, useState } from 'react';
import { Calendar, Users } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Test } from '../../types';

const TeacherScheduleTests: React.FC = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [students, setStudents] = useState<{ _id: string; name: string; email: string }[]>([]);
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [studentIds, setStudentIds] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');

  useEffect(() => {
    fetchTests();
    fetchStudents();
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

  const fetchStudents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5001/api/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(response.data);
    } catch (error) {
      toast.error('Failed to fetch students');
    }
  };

  const scheduleTest = async () => {
    const token = localStorage.getItem('token');
    if (!selectedTest || !studentIds.length || !startTime || !endTime) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5001/api/assign-test',
        {
          test_name: selectedTest,
          student_ids: studentIds,
          start_time: startTime,
          end_time: endTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Test scheduled');
      fetchTests();
      resetForm();
    } catch (error) {
      toast.error('Failed to schedule test');
    }
  };

  const reassignTest = async (testName: string) => {
    const token = localStorage.getItem('token');
    if (!studentIds.length || !startTime || !endTime) {
      toast.error('Please fill reassign fields');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5001/api/manage-test',
        {
          test_name: testName,
          action: 'reassign',
          student_ids: studentIds,
          start_time: startTime,
          end_time: endTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Test reassigned');
      fetchTests();
      resetForm();
    } catch (error) {
      toast.error('Failed to reassign test');
    }
  };

  const resetForm = () => {
    setSelectedTest('');
    setStudentIds([]);
    setStartTime('');
    setEndTime('');
  };

  return (
    <div className="p-6">
      <div className="glass-card p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-light-teal mb-4">Schedule Tests</h2>
        <p className="text-white/80 mb-6">Assign and manage test schedules</p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="text-white/80 mb-1 block">Select Test</label>
            <select
              value={selectedTest}
              onChange={(e) => setSelectedTest(e.target.value)}
              className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
            >
              <option value="">Choose a test</option>
              {tests.map((test) => (
                <option key={test.test_name} value={test.test_name}>
                  {test.test_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white/80 mb-1 block">Students</label>
            <select
              multiple
              value={studentIds}
              onChange={(e) => setStudentIds(Array.from(e.target.selectedOptions, (option) => option.value))}
              className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 text-white h-32 focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
            >
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} ({student.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-white/80 mb-1 block">Start Time</label>
            <input
              type="datetime-local"
              value={startTime ? startTime.slice(0, 16) : ''}
              onChange={(e) => setStartTime(new Date(e.target.value).toISOString())}
              className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
            />
          </div>
          <div>
            <label className="text-white/80 mb-1 block">End Time</label>
            <input
              type="datetime-local"
              value={endTime ? endTime.slice(0, 16) : ''}
              onChange={(e) => setEndTime(new Date(e.target.value).toISOString())}
              className="w-full bg-deep-blue/70 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-light-teal transition-all"
            />
          </div>
          <button
            onClick={scheduleTest}
            className="w-full bg-light-teal text-deep-blue font-semibold py-2 rounded-lg hover:bg-light-teal/80 transition-colors"
          >
            Schedule Test
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-light-teal mb-4">Scheduled Tests</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-white/60">
                  <th className="py-3 px-4">Test Name</th>
                  <th className="py-3 px-4">Start Time</th>
                  <th className="py-3 px-4">End Time</th>
                  <th className="py-3 px-4">Students</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tests
                  .filter((t) => t.status === 'assigned' || t.status === 'active')
                  .map((test) => (
                    <tr
                      key={test.test_name}
                      className="border-b border-white/05 hover:bg-white/05 transition-colors"
                    >
                      <td className="py-3 px-4 text-white">{test.test_name}</td>
                      <td className="py-3 px-4 text-white/80">
                        {test.start_time ? new Date(test.start_time).toLocaleString() : 'Not set'}
                      </td>
                      <td className="py-3 px-4 text-white/80">
                        {test.end_time ? new Date(test.end_time).toLocaleString() : 'Not set'}
                      </td>
                      <td className="py-3 px-4 text-white/80">{test.assigned_to.length}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => reassignTest(test.test_name)}
                          className="text-light-teal hover:text-white"
                        >
                          Reassign
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherScheduleTests;