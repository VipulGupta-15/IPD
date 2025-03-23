import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FileUp,
  BookOpen,
  Calendar,
  Bell,
  BarChart4,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import PdfUpload from '../components/student/PdfUpload';
import TakeTest from '../components/student/TakeTest';
import ResultDashboard from '../components/student/ResultDashboard';
import { MCQ, TestResult } from '../types';

const StudentDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [generatedMcqs, setGeneratedMcqs] = useState<MCQ[]>([]);
  const [testName, setTestName] = useState<string>('');
  const [results, setResults] = useState<TestResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      fetchUserTests(token);
    }
  }, [navigate]);

  const fetchUserTests = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:5001/api/user-tests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tests = response.data;

      // Sync generated MCQs and results from MongoDB
      const pendingTest = tests.find((t: any) => t.status === 'generated');
      if (pendingTest) {
        setGeneratedMcqs(pendingTest.mcqs);
        setTestName(pendingTest.test_name);
        setActiveMenu('takeTest');
      }

      const completedTests = tests
        .filter((t: any) => t.status === 'completed' && t.result)
        .map((t: any) => ({
          testName: t.test_name,
          date: t.completed_at,
          score: t.result.score,
          total: t.result.total,
          percentage: t.result.percentage,
          answers: t.result.answers,
          mcqs: t.mcqs,
        }));
      setResults(completedTests);
    } catch (error) {
      console.error('Error fetching user tests:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleMcqsGenerated = (mcqs: MCQ[], generatedTestName: string) => {
    setGeneratedMcqs(mcqs);
    setTestName(generatedTestName);
    setActiveMenu('takeTest');
  };

  const handleTestComplete = async (result: TestResult) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Save result to MongoDB
      await axios.post(
        'http://localhost:5001/api/save-test-result',
        { test_name: testName, result },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResults((prev) => [...prev, { ...result, mcqs: generatedMcqs }]);
      setGeneratedMcqs([]);
      setTestName('');
      setActiveMenu('results');
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-deep-blue text-white flex">
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-deep-blue to-deep-blue/95 transition-all duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="text-white font-semibold text-xl">
            <span className="bg-gradient-to-r from-white to-light-teal bg-clip-text text-transparent">MCQ Generator</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white/70 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4">
          <div className="mb-6">
            <h3 className="text-white/50 uppercase text-xs font-medium mb-2 px-3">Main</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveMenu('dashboard')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === 'dashboard'
                      ? 'bg-white/10 text-light-teal'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <BookOpen size={18} />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu('uploadPdf')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === 'uploadPdf'
                      ? 'bg-white/10 text-light-teal'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FileUp size={18} />
                  <span>Upload PDF</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu('takeTest')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === 'takeTest'
                      ? 'bg-white/10 text-light-teal'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Calendar size={18} />
                  <span>Take Test</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu('results')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === 'results'
                      ? 'bg-white/10 text-light-teal'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <BarChart4 size={18} />
                  <span>Results</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu('notifications')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === 'notifications'
                      ? 'bg-white/10 text-light-teal'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Bell size={18} />
                  <span>Notifications</span>
                  <span className="ml-auto bg-neon-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    3
                  </span>
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white/50 uppercase text-xs font-medium mb-2 px-3">Settings</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveMenu('settings')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === 'settings'
                      ? 'bg-white/10 text-light-teal'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Settings size={18} />
                  <span>Settings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-white/70 hover:bg-white/5 hover:text-white"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-deep-blue/90 backdrop-blur-md sticky top-0 z-40 border-b border-white/10 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-4 text-white/70 hover:text-white md:hidden"
              >
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-medium">
                {activeMenu === 'dashboard' && 'Dashboard'}
                {activeMenu === 'uploadPdf' && 'Upload PDF'}
                {activeMenu === 'takeTest' && 'Take Test'}
                {activeMenu === 'results' && 'Results'}
                {activeMenu === 'notifications' && 'Notifications'}
                {activeMenu === 'settings' && 'Settings'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                  <Bell size={16} />
                </button>
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-neon-pink"></span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-light-teal to-deep-blue">
                  <img
                    src="https://i.pravatar.cc/100?img=4"
                    alt="User"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="hidden md:block text-sm font-medium">Jane Smith</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          {activeMenu === 'dashboard' && (
            <div className="animate-fade-in">
              <div className="glass-card p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Welcome back, <span className="text-light-teal">Jane</span>!
                    </h2>
                    <p className="text-white/70">
                      Upload a PDF to generate and take a new test.
                    </p>
                  </div>
                  <button
                    className="btn-primary mt-4 md:mt-0"
                    onClick={() => setActiveMenu('uploadPdf')}
                  >
                    <span className="flex items-center">
                      Upload PDF
                      <ChevronRight size={16} className="ml-1" />
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-6 hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Tests Completed</p>
                      <h3 className="text-3xl font-bold">{results.length}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-light-teal/20 to-light-teal/10 flex items-center justify-center">
                      <CheckCircle size={20} className="text-light-teal" />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Average Score</p>
                      <h3 className="text-3xl font-bold">
                        {results.length > 0
                          ? `${Math.round(
                              results.reduce((sum, r) => sum + r.percentage, 0) / results.length
                            )}%`
                          : 'N/A'}
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-pink/20 to-neon-pink/10 flex items-center justify-center">
                      <BarChart4 size={20} className="text-neon-pink" />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6 hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Tests Available</p>
                      <h3 className="text-3xl font-bold">{generatedMcqs.length > 0 ? 1 : 0}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-light-teal/20 to-deep-blue/20 flex items-center justify-center">
                      <Clock size={20} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'uploadPdf' && <PdfUpload onMcqsGenerated={handleMcqsGenerated} />}

          {activeMenu === 'takeTest' && (
            <TakeTest
              mcqs={generatedMcqs}
              testName={testName}
              onTestComplete={handleTestComplete}
              setActiveMenu={setActiveMenu}
            />
          )}

          {activeMenu === 'results' && <ResultDashboard results={results} />}

          {activeMenu === 'notifications' && (
            <div className="animate-fade-in">
              <div className="glass-card p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">Notifications</h2>
                  <button className="btn-outline text-sm py-1.5 px-3">Mark All Read</button>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/5 border-l-4 border-neon-pink p-4 rounded-r-lg hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-neon-pink/20 flex items-center justify-center mr-4 mt-1">
                          <Bell size={18} className="text-neon-pink" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">New Test Generated</h4>
                          <p className="text-white/70 text-sm mb-2">A new test is ready to take.</p>
                          <button
                            className="text-light-teal hover:text-white transition-colors text-sm flex items-center"
                            onClick={() => setActiveMenu('takeTest')}
                          >
                            Take Test
                            <ChevronRight size={14} className="ml-1" />
                          </button>
                        </div>
                      </div>
                      <span className="text-white/50 text-xs">Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;