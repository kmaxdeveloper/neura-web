import React from 'react';
import Sidebar from '../components/Sidebar';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <aside className="hidden md:block w-66 border-r border-cyan-500/5 bg-[#080808] shadow-[20px_0_50px_rgba(0,0,0,0.5)]">
        <Sidebar />
      </aside>
      <main className="flex-1 h-screen overflow-y-auto p-6 md:p-10 relative">
        {/* Admin uchun maxsus fon nuri */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] -z-10 pointer-events-none" />
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;