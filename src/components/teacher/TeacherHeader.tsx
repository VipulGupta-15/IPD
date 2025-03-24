import React from 'react';
import { Menu, Search } from 'lucide-react';

interface TeacherHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
}

const TeacherHeader: React.FC<TeacherHeaderProps> = ({ sidebarOpen, setSidebarOpen, activeMenu }) => {
  return (
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
  );
};

export default TeacherHeader;