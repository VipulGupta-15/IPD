import React from 'react';
import { Menu } from 'lucide-react';

interface TeacherHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
}

const TeacherHeader: React.FC<TeacherHeaderProps> = ({ sidebarOpen, setSidebarOpen, activeMenu }) => {
  const menuTitles: { [key: string]: string } = {
    dashboard: 'Dashboard',
    uploadPdf: 'Upload PDF',
    generateMcqs: 'Review MCQs',
    scheduleTests: 'Schedule Tests',
    students: 'Students',
    settings: 'Settings',
  };

  return (
    <header className="bg-deep-blue/90 p-4 flex items-center justify-between border-b border-white/10">
      <div className="flex items-center">
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} className="text-white mr-4">
            <Menu size={24} />
          </button>
        )}
        <h2 className="text-xl font-semibold text-light-teal">{menuTitles[activeMenu]}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-white/80">Teacher</span>
        <button
          onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
          className="text-light-teal hover:text-white"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default TeacherHeader;