import React, { useState } from 'react';
import TeacherSidebar from '../components/teacher/TeacherSidebar';
import TeacherHeader from '../components/teacher/TeacherHeader';
import TeacherDashboardContent from '../components/teacher/TeacherDashboardContent';
import TeacherPdfUpload from '../components/teacher/TeacherPdfUpload';
import TeacherGenerateMcqs from '../components/teacher/TeacherGenerateMcqs';
import TeacherScheduleTests from '../components/teacher/TeacherScheduleTests';

const TeacherDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  return (
    <div className="min-h-screen bg-deep-blue text-white flex">
      <TeacherSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
      />
      <main className="flex-1 overflow-y-auto">
        <TeacherHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeMenu={activeMenu}
        />
        <div className="p-4 md:p-6">
          {activeMenu === 'dashboard' && <TeacherDashboardContent />}
          {activeMenu === 'uploadPdf' && <TeacherPdfUpload />}
          {activeMenu === 'generateMcqs' && <TeacherGenerateMcqs />}
          {activeMenu === 'scheduleTests' && <TeacherScheduleTests />}
          {activeMenu === 'students' && (
            <div className="glass-card p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-light-teal">Students</h2>
              <p className="text-white/80 mt-2">Student management coming soon!</p>
            </div>
          )}
          {activeMenu === 'settings' && (
            <div className="glass-card p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-light-teal">Settings</h2>
              <p className="text-white/80 mt-2">Settings coming soon!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;