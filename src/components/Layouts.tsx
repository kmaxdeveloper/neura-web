import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps { children: React.ReactNode }

const BaseLayout: React.FC<LayoutProps & { color: string }> = ({ children, color }) => {
  const [isOpen, setIsOpen] = useState(false);
  const borderCol = color === 'cyan' ? 'border-cyan-500/10' : color === 'purple' ? 'border-purple-500/10' : 'border-emerald-500/10';
  const glowCol = color === 'cyan' ? 'bg-cyan-500/5' : color === 'purple' ? 'bg-purple-500/5' : 'bg-emerald-500/5';

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      <aside className={`fixed md:relative z-40 w-64 h-screen transition-transform duration-300 bg-[#080808] border-r ${borderCol} ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <Sidebar />
      </aside>
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto relative custom-scrollbar">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${glowCol} blur-[120px] -z-10 pointer-events-none`} />
        <div className="md:hidden mb-6"><button onClick={() => setIsOpen(!isOpen)}><Menu /></button></div>
        {children}
      </main>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 z-30 md:hidden" />}
    </div>
  );
};

export const AdminLayout: React.FC<LayoutProps> = ({ children }) => <BaseLayout color="cyan">{children}</BaseLayout>;
export const TeacherLayout: React.FC<LayoutProps> = ({ children }) => <BaseLayout color="purple">{children}</BaseLayout>;
export const StudentLayout: React.FC<LayoutProps> = ({ children }) => <BaseLayout color="emerald">{children}</BaseLayout>;