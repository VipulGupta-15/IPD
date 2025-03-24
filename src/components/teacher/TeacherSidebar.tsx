import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileUp,
  BookOpen,
  FilePlus,
  Users,
  Calendar,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

interface TeacherSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeMenu,
  setActiveMenu,
}) => {
  return (
    <aside
      className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-deep-blue to-deep-blue/95 transition-all duration-300 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="text-white font-semibold text-xl">
          <span className="bg-gradient-to-r from-white to-light-teal bg-clip-text text-transparent">
            MCQ Generator
          </span>
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
  );
};

export default TeacherSidebar;