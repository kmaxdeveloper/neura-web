import { useEffect, useState, useRef } from 'react';
import { Moon, Sun, Monitor, ChevronRight } from 'lucide-react';

type ThemeMode = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('theme') as ThemeMode) || 'system';
  });
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = window.document.documentElement;

    const applyTheme = () => {
      if (mode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.toggle('dark', prefersDark);
      } else {
        root.classList.toggle('dark', mode === 'dark');
      }
    };

    applyTheme();
    localStorage.setItem('theme', mode);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => { if (mode === 'system') applyTheme(); };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [mode]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: { id: ThemeMode; label: string; icon: any; color: string }[] = [
    { id: 'light', label: 'Light Mode', icon: <Sun size={16} />, color: 'text-amber-500' },
    { id: 'dark', label: 'Dark Mode', icon: <Moon size={16} />, color: 'text-purple-400' },
    { id: 'system', label: 'System', icon: <Monitor size={16} />, color: 'text-cyan-400' },
  ];

  const currentTheme = themes.find(t => t.id === mode) || themes[2];

  return (
    <div className="relative" ref={menuRef}>
      {/* TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3.5 rounded-2xl text-[var(--text-secondary)] border border-[var(--border-subtle)] bg-[var(--surface-hover)]/30 hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)] transition-all duration-300 group"
      >
        <div className="flex items-center gap-3">
          <div className={`${isOpen ? 'rotate-12 scale-110' : ''} transition-all duration-300 ${currentTheme.color}`}>
            {currentTheme.icon}
          </div>
          <span className="font-bold text-sm tracking-tight">
            {currentTheme.label}
          </span>
        </div>
        <ChevronRight size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''} text-[var(--text-muted)]`} />
      </button>

      {/* POPUP MENU */}
      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-2xl shadow-2xl p-1.5 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <p className="px-3 py-2 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest border-b border-[var(--border-subtle)] mb-1">
            Appearance
          </p>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setMode(t.id);
                setIsOpen(false);
              }}
              className={`flex items-center gap-3 w-full p-3 rounded-xl text-xs font-bold transition-all ${
                mode === t.id 
                ? 'bg-[var(--surface-hover)] text-[var(--text-primary)]' 
                : 'text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]/50 hover:text-[var(--text-primary)]'
              }`}
            >
              <div className={t.color}>{t.icon}</div>
              {t.label}
              {mode === t.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_var(--shadow-color)]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}