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
        <Sidebar />
        
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
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto relative custom-scrollbar">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${glowCol} blur-[120px] -z-10 pointer-events-none`} />
        <div className="md:hidden mb-6">
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 bg-[var(--surface-card)] rounded-xl border border-[var(--border-subtle)]">
            <Menu />
          </button>
        </div>
        {children}
      </main>

      {/* MOBILE OVERLAY */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-[var(--overlay-bg)] z-30 md:hidden backdrop-blur-sm" />}
    </div>
  );
};

export const AdminLayout: React.FC<LayoutProps> = ({ children }) => <BaseLayout color="cyan">{children}</BaseLayout>;
export const TeacherLayout: React.FC<LayoutProps> = ({ children }) => <BaseLayout color="purple">{children}</BaseLayout>;
export const StudentLayout: React.FC<LayoutProps> = ({ children }) => <BaseLayout color="emerald">{children}</BaseLayout>;