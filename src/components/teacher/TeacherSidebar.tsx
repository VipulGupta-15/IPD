import React from 'react';
import { BookOpen, FileUp, Calendar, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface TeacherSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const TeacherSidebar: React.FC<TeacherSidebarProps> = ({ sidebarOpen, setSidebarOpen, activeMenu, setActiveMenu }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BookOpen },
    { id: 'uploadPdf', label: 'Upload PDF', icon: FileUp },
    { id: 'generateMcqs', label: 'Review MCQs', icon: BookOpen },
    { id: 'scheduleTests', label: 'Schedule Tests', icon: Calendar },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`bg-deep-blue/90 text-white transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0`}
    >
      <div className="p-4 flex justify-between items-center">
        {sidebarOpen && <h1 className="text-xl font-bold text-light-teal">Teacher</h1>}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
          {sidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`w-full flex items-center p-4 text-left ${
              activeMenu === item.id ? 'bg-light-teal/20 text-light-teal' : 'text-white hover:bg-white/10'
            }`}
          >
            <item.icon size={20} className="mr-3" />
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default TeacherSidebar;