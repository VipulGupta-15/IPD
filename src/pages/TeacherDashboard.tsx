
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileUp,
  BookOpen,
  FilePlus,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart4,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Download,
  FileText
} from 'lucide-react';

const TeacherDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <div className="min-h-screen bg-deep-blue text-white flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-deep-blue to-deep-blue/95 transition-all duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Sidebar Header */}
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

        {/* Sidebar Navigation */}
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
                  onClick={() => setActiveMenu('generateMcqs')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === 'generateMcqs'
                      ? 'bg-white/10 text-light-teal'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <FilePlus size={18} />
                  <span>Generate MCQs</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu('students')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === 'students'
                      ? 'bg-white/10 text-light-teal'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Users size={18} />
                  <span>Students</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveMenu('scheduleTests')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeMenu === 'scheduleTests'
                      ? 'bg-white/10 text-light-teal'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Calendar size={18} />
                  <span>Schedule Tests</span>
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
                <Link
                  to="/login"
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-white/70 hover:bg-white/5 hover:text-white"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
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
                {activeMenu === 'generateMcqs' && 'Generate MCQs'}
                {activeMenu === 'students' && 'Students'}
                {activeMenu === 'scheduleTests' && 'Schedule Tests'}
                {activeMenu === 'settings' && 'Settings'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors">
                  <Search size={16} />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-light-teal to-deep-blue">
                  <img
                    src="https://i.pravatar.cc/100"
                    alt="User"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="hidden md:block text-sm font-medium">John Doe</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 md:p-6">
          {activeMenu === 'dashboard' && (
            <div className="animate-fade-in">
              {/* Greeting Section */}
              <div className="glass-card p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      Welcome back, <span className="text-light-teal">John</span>!
                    </h2>
                    <p className="text-white/70">
                      Here's what's happening with your assessments today.
                    </p>
                  </div>
                  <button className="btn-primary mt-4 md:mt-0">
                    <span className="flex items-center">
                      New Assessment
                      <Plus size={16} className="ml-2" />
                    </span>
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card p-6 hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Total PDFs</p>
                      <h3 className="text-3xl font-bold">24</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-light-teal/20 to-light-teal/10 flex items-center justify-center">
                      <FileUp size={20} className="text-light-teal" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-green-400 text-sm flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      3 new this week
                    </span>
                  </div>
                </div>

                <div className="glass-card p-6 hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/70 text-sm mb-1">MCQs Generated</p>
                      <h3 className="text-3xl font-bold">459</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-pink/20 to-neon-pink/10 flex items-center justify-center">
                      <FilePlus size={20} className="text-neon-pink" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-green-400 text-sm flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      42 new this week
                    </span>
                  </div>
                </div>

                <div className="glass-card p-6 hover:translate-y-[-5px] transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white/70 text-sm mb-1">Tests Created</p>
                      <h3 className="text-3xl font-bold">12</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-light-teal/20 to-deep-blue/20 flex items-center justify-center">
                      <Calendar size={20} className="text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-green-400 text-sm flex items-center">
                      <svg
                        className="w-3 h-3 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      2 new this week
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="glass-card p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Recent Activity</h3>
                  <button className="text-white/70 hover:text-white text-sm flex items-center">
                    View All
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start p-3 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-full bg-light-teal/20 flex items-center justify-center mr-4">
                      <FileUp size={16} className="text-light-teal" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">Biology Chapter 5.pdf uploaded</p>
                        <span className="text-white/50 text-sm">2h ago</span>
                      </div>
                      <p className="text-white/70 text-sm">You uploaded a new PDF document</p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-full bg-neon-pink/20 flex items-center justify-center mr-4">
                      <FilePlus size={16} className="text-neon-pink" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">Generated 35 MCQs</p>
                        <span className="text-white/50 text-sm">5h ago</span>
                      </div>
                      <p className="text-white/70 text-sm">From Chemistry Unit 3.pdf</p>
                    </div>
                  </div>

                  <div className="flex items-start p-3 hover:bg-white/5 rounded-lg transition-colors">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-4">
                      <Calendar size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium">Test scheduled</p>
                        <span className="text-white/50 text-sm">Yesterday</span>
                      </div>
                      <p className="text-white/70 text-sm">Physics Mid-term for Class 11A</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Documents */}
              <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Recent Documents</h3>
                  <button className="text-white/70 hover:text-white text-sm flex items-center">
                    View All
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">
                          MCQs
                        </th>
                        <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">
                          Status
                        </th>
                        <th className="text-right py-3 px-4 text-white/70 text-sm font-medium">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <FileText size={16} className="text-light-teal mr-2" />
                            <span>Physics Chapter 1.pdf</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white/70">Today</td>
                        <td className="py-3 px-4">42</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Complete
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-white/70 hover:text-white">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <FileText size={16} className="text-light-teal mr-2" />
                            <span>Chemistry Unit 3.pdf</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white/70">Yesterday</td>
                        <td className="py-3 px-4">35</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                            Complete
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-white/70 hover:text-white">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                      <tr className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <FileText size={16} className="text-light-teal mr-2" />
                            <span>Biology Chapter 5.pdf</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white/70">2 days ago</td>
                        <td className="py-3 px-4">28</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                            In Progress
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button className="text-white/70 hover:text-white">
                            <MoreVertical size={16} />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'uploadPdf' && (
            <div className="animate-fade-in">
              <div className="glass-card p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Upload PDF Document</h2>
                <p className="text-white/70 mb-6">
                  Upload your PDF document to generate multiple-choice questions. Our AI will analyze
                  the content and create relevant questions.
                </p>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-light-teal transition-colors mb-6 group cursor-pointer relative overflow-hidden animate-pulse-glow">
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf"
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-light-teal/20 to-light-teal/10 flex items-center justify-center mb-4">
                      <FileUp size={24} className="text-light-teal" />
                    </div>
                    <h3 className="text-lg font-medium mb-2 group-hover:text-light-teal transition-colors">
                      Drag & Drop your PDF here
                    </h3>
                    <p className="text-white/70 mb-4">or click to browse your files</p>
                    <button className="btn-primary">Browse Files</button>
                  </div>
                </div>

                <div className="text-white/70 text-sm">
                  <p>Supported file: PDF only (Max size: 10MB)</p>
                </div>
              </div>

              {/* Recent Uploads */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-medium mb-4">Recent Uploads</h3>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center flex-1 mb-3 sm:mb-0">
                      <FileText size={20} className="text-light-teal mr-3" />
                      <div>
                        <h4 className="font-medium">Physics Chapter 1.pdf</h4>
                        <p className="text-white/70 text-sm">2.4 MB • Uploaded today</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="btn-primary text-sm py-2 px-4">
                        Generate MCQs
                      </button>
                      <button className="text-white/70 hover:text-white">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center flex-1 mb-3 sm:mb-0">
                      <FileText size={20} className="text-light-teal mr-3" />
                      <div>
                        <h4 className="font-medium">Chemistry Unit 3.pdf</h4>
                        <p className="text-white/70 text-sm">1.8 MB • Uploaded yesterday</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button className="border border-light-teal text-light-teal rounded-lg text-sm py-1.5 px-3 hover:bg-light-teal/10 transition-colors">
                        View MCQs
                      </button>
                      <button className="text-white/70 hover:text-white">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center flex-1 mb-3 sm:mb-0">
                      <FileText size={20} className="text-light-teal mr-3" />
                      <div>
                        <h4 className="font-medium">Biology Chapter 5.pdf</h4>
                        <p className="text-white/70 text-sm">3.2 MB • Uploaded 2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-blue-400 text-sm flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </div>
                      <button className="text-white/70 hover:text-white">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'generateMcqs' && (
            <div className="animate-fade-in">
              <div className="glass-card p-6 mb-6">
                <h2 className="text-xl font-medium mb-4">Generate MCQs</h2>
                <p className="text-white/70 mb-6">
                  Select a PDF document to generate multiple-choice questions or edit previously
                  generated questions.
                </p>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search documents"
                      className="input-glow w-full pl-10"
                    />
                  </div>
                  <button className="btn-outline flex items-center">
                    <Filter size={16} className="mr-2" />
                    Filter
                  </button>
                </div>

                {/* PDF Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="glass-card hover:translate-y-[-5px] transition-all duration-300 cursor-pointer group">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText size={18} className="text-light-teal mr-2" />
                        <span className="font-medium group-hover:text-light-teal transition-colors">Physics Chapter 1.pdf</span>
                      </div>
                      <div>
                        <button className="text-white/70 hover:text-white">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">Uploaded today</span>
                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs">
                          Complete
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">42 MCQs generated</span>
                        <button className="text-light-teal text-sm hover:text-white transition-colors">
                          View
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card hover:translate-y-[-5px] transition-all duration-300 cursor-pointer group">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText size={18} className="text-light-teal mr-2" />
                        <span className="font-medium group-hover:text-light-teal transition-colors">Chemistry Unit 3.pdf</span>
                      </div>
                      <div>
                        <button className="text-white/70 hover:text-white">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">Uploaded yesterday</span>
                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-xs">
                          Complete
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">35 MCQs generated</span>
                        <button className="text-light-teal text-sm hover:text-white transition-colors">
                          View
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card hover:translate-y-[-5px] transition-all duration-300 cursor-pointer group">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                      <div className="flex items-center">
                        <FileText size={18} className="text-light-teal mr-2" />
                        <span className="font-medium group-hover:text-light-teal transition-colors">Biology Chapter 5.pdf</span>
                      </div>
                      <div>
                        <button className="text-white/70 hover:text-white">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white/70 text-sm">Uploaded 2 days ago</span>
                        <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">
                          Processing
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70 text-sm">In progress...</span>
                        <button className="text-light-teal/50 text-sm cursor-not-allowed">
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Questions */}
              <div className="glass-card p-6">
                <h3 className="text-lg font-medium mb-4">Recent Questions</h3>

                <div className="space-y-6">
                  <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <h4 className="text-lg font-medium mb-2">What is Newton's first law of motion?</h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                        <span className="text-white/70">Objects at rest stay at rest unless acted upon by a force</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-green-500 bg-green-500/20 mr-3 flex-shrink-0 flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-white">Objects in motion stay in motion unless acted upon by a force</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                        <span className="text-white/70">For every action, there is an equal and opposite reaction</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                        <span className="text-white/70">Force equals mass times acceleration</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-sm">From: Physics Chapter 1.pdf</span>
                      <div className="flex space-x-2">
                        <button className="text-white/70 hover:text-white transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="text-white/70 hover:text-white transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <h4 className="text-lg font-medium mb-2">What is the chemical formula for water?</h4>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                        <span className="text-white/70">H₂O₂</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-green-500 bg-green-500/20 mr-3 flex-shrink-0 flex items-center justify-center">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                        </div>
                        <span className="text-white">H₂O</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                        <span className="text-white/70">HO₂</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-5 h-5 rounded-full border border-white/30 mr-3 flex-shrink-0"></div>
                        <span className="text-white/70">OH</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-sm">From: Chemistry Unit 3.pdf</span>
                      <div className="flex space-x-2">
                        <button className="text-white/70 hover:text-white transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="text-white/70 hover:text-white transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <button className="btn-outline">
                    Load More Questions
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
