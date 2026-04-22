import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../Sidebar';

const TeacherLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white font-sans">
      {/* Sidebar - Purple Border Glow */}
      <aside className={`fixed md:relative z-40 w-64 h-screen transition-transform duration-300 bg-[#080808] border-r border-purple-500/10 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto relative custom-scrollbar">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] -z-10 pointer-events-none" />
        
        {/* Mobile Menu Button */}
        <div className="md:hidden mb-6">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-purple-500/10 rounded-lg transition-colors">
            <Menu />
          </button>
        </div>

        {children}
      </main>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" 
        />
      )}
    </div>
  );
};

export default TeacherLayout;