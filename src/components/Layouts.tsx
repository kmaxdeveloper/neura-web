import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps { children: React.ReactNode }

const BaseLayout: React.FC<LayoutProps & { color: string }> = ({ children, color }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    return Number(localStorage.getItem('sidebar-width')) || 280;
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth >= 240 && newWidth <= 480) {
        setSidebarWidth(newWidth);
        localStorage.setItem('sidebar-width', newWidth.toString());
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const borderCol = color === 'cyan' ? 'border-cyan-500/10' : color === 'purple' ? 'border-purple-500/10' : 'border-emerald-500/10';
  const glowCol = color === 'cyan' ? 'bg-cyan-500/5' : color === 'purple' ? 'bg-purple-500/5' : 'bg-emerald-500/5';
  const handleColor = color === 'cyan' ? 'bg-cyan-500' : color === 'purple' ? 'bg-purple-500' : 'bg-emerald-500';

  return (
    <div className={`flex min-h-screen bg-[var(--surface-base)] text-[var(--text-primary)] transition-colors duration-300 ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      {/* SIDEBAR ASIDE */}
      <aside 
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className={`fixed md:relative z-40 h-screen bg-[var(--surface-sidebar)] border-r ${borderCol} ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${isResizing ? '' : 'transition-all duration-300'}`}
      >
        <Sidebar onMobileClose={() => setIsOpen(false)} />
        
        {/* RESIZE HANDLE */}
        <div 
          onMouseDown={startResizing}
          className={`absolute top-0 -right-1 w-2 h-full cursor-col-resize z-50 group`}
        >
          <div className={`absolute top-0 right-[3px] w-[2px] h-full transition-all duration-300 ${isResizing ? handleColor : 'bg-transparent group-hover:' + handleColor + '/40'}`} />
          {/* Accent Handle Visual */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-12 rounded-full border border-white/5 backdrop-blur-xl transition-all duration-500 ${isResizing ? handleColor + ' opacity-100' : 'bg-white/5 opacity-0 group-hover:opacity-100 shadow-2xl shadow-black/50'}`}>
            <div className="flex flex-col items-center justify-center h-full gap-1">
              <div className="w-[1.5px] h-4 bg-white/20 rounded-full" />
              <div className="w-[1.5px] h-4 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-screen overflow-y-auto relative custom-scrollbar">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${glowCol} blur-[120px] -z-10 pointer-events-none`} />
        
        {/* MOBILE HEADER */}
        <div className="md:hidden sticky top-0 z-20 flex items-center justify-between p-4 bg-black/40 backdrop-blur-2xl border-b border-white/5 mb-6">
          <div className="flex items-center gap-3">
             <div className={`w-8 h-8 ${handleColor} rounded-xl shadow-lg flex items-center justify-center`}>
                <span className="text-sm font-black italic text-white leading-none mt-0.5">N</span>
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-black italic uppercase tracking-tighter leading-none text-white">Neura OS</span>
               <span className={`text-[8px] ${color === 'cyan' ? 'text-cyan-400' : color === 'purple' ? 'text-purple-400' : 'text-emerald-400'} font-mono tracking-widest uppercase mt-0.5`}>Mobile Access</span>
             </div>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors">
            <Menu size={20} className="text-white" />
          </button>
        </div>

        <div className="p-4 pt-0 md:p-10">
          {children}
        </div>
      </main>

      {/* MOBILE OVERLAY */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-[var(--overlay-bg)] z-30 md:hidden backdrop-blur-sm" />}
    </div>
  );
};

export const AdminLayout: React.FC<LayoutProps> = ({ children }) => <BaseLayout color="cyan">{children}</BaseLayout>;
export const TeacherLayout: React.FC<LayoutProps> = ({ children }) => <BaseLayout color="purple">{children}</BaseLayout>;
export const StudentLayout: React.FC<LayoutProps> = ({ children }) => <BaseLayout color="emerald">{children}</BaseLayout>;