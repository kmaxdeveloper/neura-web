import React, { useState, useRef, useEffect } from 'react';
import { Languages, ChevronUp, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const langs = [
    { code: 'UZ', label: 'O\'zbekcha', flag: '🇺🇿' },
    { code: 'RU', label: 'Русский', flag: '🇷🇺' },
    { code: 'EN', label: 'English', flag: '🇺🇸' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = langs.find(l => l.code === language) || langs[0];

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-2xl group hover:border-cyan-500/30 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500 group-hover:scale-110 transition-transform">
            <Languages size={18} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-[var(--text-primary)] uppercase italic leading-none">
              {currentLang.label}
            </p>
            <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">
              Language Select
            </p>
          </div>
        </div>
        <ChevronUp size={16} className={`text-[var(--text-muted)] transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Pop-up Menu */}
      {isOpen && (
        <div className="absolute bottom-[110%] left-0 w-full bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-2xl shadow-2xl p-2 z-[100] animate-in slide-in-from-bottom-2 duration-300 backdrop-blur-xl">
          <div className="p-2 mb-1">
            <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em]">System Language</p>
          </div>
          
          <div className="space-y-1">
            {langs.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code as any);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 ${
                  language === lang.code 
                  ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' 
                  : 'hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-xs font-black uppercase italic tracking-tight">{lang.label}</span>
                </div>
                {language === lang.code && <Check size={14} strokeWidth={3} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
