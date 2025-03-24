import React from 'react';
import {
  FileUp,
  FilePlus,
  Calendar,
  ChevronRight,
  Plus,
  MoreVertical,
  FileText,
} from 'lucide-react';

const TeacherDashboardContent: React.FC = () => {
  return (
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
                <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Name</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Date</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">MCQs</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-medium">Status</th>
                <th className="text-right py-3 px-4 text-white/70 text-sm font-medium">Actions</th>
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
  );
};

export default TeacherDashboardContent;