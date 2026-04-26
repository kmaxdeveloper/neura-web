import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, Shield, Bell, Cpu, 
  Palette, Save, ChevronRight, 
  Lock, Globe, BellRing, Zap, History,
  Upload, Smartphone, Mail
} from 'lucide-react';
import ServerTime from '../../components/ServerTime';

type SettingTab = 'general' | 'security' | 'notifications' | 'algorithm' | 'appearance';

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingTab>('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const tabs: { id: SettingTab; label: string; icon: any; color: string }[] = [
    { id: 'general', label: 'General', icon: Globe, color: 'text-cyan-500' },
    { id: 'security', label: 'Security', icon: Shield, color: 'text-rose-500' },
    { id: 'notifications', label: 'Alerts', icon: Bell, color: 'text-amber-500' },
    { id: 'algorithm', label: 'AI Solver', icon: Cpu, color: 'text-purple-500' },
    { id: 'appearance', label: 'Design', icon: Palette, color: 'text-emerald-500' },
  ];

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-20">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-cyan-500/10 rounded-[32px] border border-cyan-500/20 text-cyan-500">
            <SettingsIcon size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">System <span className="text-cyan-500">Settings</span></h1>
            <p className="text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-[0.4em]">Core Configuration // Secure Layer</p>
          </div>
        </div>
        <ServerTime />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* 2. Sidebar Tabs */}
        <div className="lg:w-80 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between p-5 rounded-[28px] transition-all duration-300 group border ${
                activeTab === tab.id 
                ? 'bg-[var(--surface-card)] border-cyan-500/30 shadow-xl shadow-cyan-500/5' 
                : 'border-transparent hover:bg-[var(--surface-hover)]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-[var(--surface-hover)] ${activeTab === tab.id ? tab.color : 'text-[var(--text-muted)]'}`}>
                  <tab.icon size={20} />
                </div>
                <span className={`font-black uppercase italic text-xs tracking-widest ${activeTab === tab.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                  {tab.label}
                </span>
              </div>
              <ChevronRight size={16} className={`transition-all ${activeTab === tab.id ? 'text-cyan-500 translate-x-0' : 'text-[var(--text-muted)] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
            </button>
          ))}
        </div>

        {/* 3. Settings Content */}
        <div className="flex-1 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[48px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/[0.02] rounded-full -mr-32 -mt-32" />
          
          <div className="relative z-10 space-y-12">
            
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-subtle)]">
                   <div className="p-3 bg-cyan-500/10 rounded-2xl text-cyan-500"><Globe size={24} /></div>
                   <div>
                     <h3 className="text-2xl font-black uppercase italic text-[var(--text-primary)]">Core Identity</h3>
                     <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Global platform parameters</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">University Name</label>
                    <input type="text" defaultValue="Neura University of Technology" className="w-full bg-[var(--surface-hover)] border border-[var(--border-subtle)] p-5 rounded-[24px] outline-none focus:border-cyan-500/30 text-sm font-bold text-[var(--text-primary)] transition-all" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Current Academic Year</label>
                    <select className="w-full bg-[var(--surface-hover)] border border-[var(--border-subtle)] p-5 rounded-[24px] outline-none focus:border-cyan-500/30 text-sm font-bold text-[var(--text-primary)] transition-all">
                      <option>2023 - 2024</option>
                      <option>2024 - 2025</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Semester Selection</label>
                    <div className="flex gap-4">
                      {['Spring', 'Autumn'].map((s) => (
                        <button key={s} className={`flex-1 p-4 rounded-2xl font-black uppercase italic text-[10px] transition-all border ${s === 'Spring' ? 'bg-cyan-500 text-black border-transparent shadow-lg shadow-cyan-500/20' : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Platform Logo</label>
                    <button className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-[var(--border-subtle)] rounded-2xl text-[var(--text-muted)] hover:border-cyan-500/30 hover:text-cyan-500 transition-all">
                      <Upload size={18} /> <span className="text-[10px] font-black uppercase italic">Upload New Asset</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-subtle)]">
                   <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500"><Lock size={24} /></div>
                   <div>
                     <h3 className="text-2xl font-black uppercase italic text-[var(--text-primary)]">Security Protocol</h3>
                     <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Authentication & Access layers</p>
                   </div>
                </div>

                <div className="space-y-6">
                  {[
                    { label: 'Two-Factor Authentication (2FA)', desc: 'Add an extra layer of security to all accounts.', icon: Smartphone, enabled: true },
                    { label: 'IP White-listing', desc: 'Only allow specific IP addresses to access admin panel.', icon: Shield, enabled: false },
                    { label: 'Automatic Logout', desc: 'Logout users after 30 minutes of inactivity.', icon: History, enabled: true },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-[var(--surface-hover)] rounded-[32px] border border-[var(--border-subtle)] hover:border-rose-500/20 transition-all">
                      <div className="flex items-center gap-5">
                        <div className="p-3 bg-rose-500/5 rounded-2xl text-rose-500"><s.icon size={20} /></div>
                        <div>
                          <p className="text-sm font-black text-[var(--text-primary)] uppercase italic tracking-tight">{s.label}</p>
                          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">{s.desc}</p>
                        </div>
                      </div>
                      <div className={`w-14 h-8 rounded-full relative p-1 cursor-pointer transition-all ${s.enabled ? 'bg-rose-500' : 'bg-white/10'}`}>
                         <div className={`w-6 h-6 bg-white rounded-full transition-all ${s.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                 <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-subtle)]">
                   <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500"><BellRing size={24} /></div>
                   <div>
                     <h3 className="text-2xl font-black uppercase italic text-[var(--text-primary)]">Global Alerts</h3>
                     <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Internal & External notifications</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="p-8 bg-[var(--surface-hover)] rounded-[40px] border border-[var(--border-subtle)] space-y-6">
                      <div className="flex items-center gap-4 text-amber-500">
                        <Mail size={24} />
                        <span className="font-black uppercase italic text-sm">Email Gateway</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">Configure SMTP server for transactional emails and announcements.</p>
                      <button className="w-full py-4 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-2xl font-black uppercase italic text-[10px] hover:bg-amber-500 hover:text-black transition-all">Configure SMTP</button>
                   </div>
                   <div className="p-8 bg-[var(--surface-hover)] rounded-[40px] border border-[var(--border-subtle)] space-y-6">
                      <div className="flex items-center gap-4 text-cyan-500">
                        <Zap size={24} />
                        <span className="font-black uppercase italic text-sm">Telegram Bot</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed font-medium">Connect official Telegram Bot to send instant alerts to students.</p>
                      <button className="w-full py-4 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-2xl font-black uppercase italic text-[10px] hover:bg-cyan-500 hover:text-black transition-all">Link Bot API</button>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'algorithm' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                 <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-subtle)]">
                   <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500"><Cpu size={24} /></div>
                   <div>
                     <h3 className="text-2xl font-black uppercase italic text-[var(--text-primary)]">AI Solver Logic</h3>
                     <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Matrix optimization parameters</p>
                   </div>
                </div>

                <div className="space-y-10">
                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Optimization Depth</span>
                         <span className="text-xl font-black text-purple-500 uppercase italic">High (Safe)</span>
                      </div>
                      <div className="h-3 w-full bg-black/20 rounded-full p-1">
                         <div className="h-full bg-purple-500 w-[85%] rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                      </div>
                      <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-widest">Higher depth ensures better timetable but takes more time.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between p-6 bg-[var(--surface-hover)] rounded-3xl border border-[var(--border-subtle)]">
                         <span className="text-xs font-black uppercase italic text-[var(--text-primary)]">Hard Constraints Only</span>
                         <div className="w-10 h-6 bg-purple-500 rounded-full relative p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full translate-x-4" />
                         </div>
                      </div>
                      <div className="flex items-center justify-between p-6 bg-[var(--surface-hover)] rounded-3xl border border-[var(--border-subtle)]">
                         <span className="text-xs font-black uppercase italic text-[var(--text-primary)]">Parallel Processing</span>
                         <div className="w-10 h-6 bg-white/10 rounded-full relative p-1 cursor-pointer">
                            <div className="w-4 h-4 bg-white rounded-full translate-x-0" />
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                 <div className="flex items-center gap-4 pb-6 border-b border-[var(--border-subtle)]">
                   <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500"><Palette size={24} /></div>
                   <div>
                     <h3 className="text-2xl font-black uppercase italic text-[var(--text-primary)]">Visual Excellence</h3>
                     <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">Personalize the platform aesthetics</p>
                   </div>
                </div>

                <div className="space-y-10">
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">Brand Primary Color</label>
                      <div className="flex gap-4">
                        {['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'].map((c) => (
                          <div key={c} className="w-12 h-12 rounded-2xl cursor-pointer hover:scale-110 transition-all border-4 border-white/10 hover:border-white/30 shadow-lg" style={{ backgroundColor: c }} />
                        ))}
                      </div>
                   </div>
                   
                   <div className="p-8 bg-[var(--surface-hover)] rounded-[40px] border border-emerald-500/10 space-y-6">
                      <div className="flex items-center gap-3 text-emerald-500">
                        <Palette size={20} />
                        <span className="font-black uppercase italic text-sm">Theme Mode</span>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] font-medium">Current theme is synchronized with your system settings.</p>
                      <div className="flex gap-4">
                        {['Light', 'Dark', 'System'].map((m) => (
                          <button key={m} className="flex-1 py-3.5 bg-black/20 border border-white/5 rounded-xl font-black uppercase italic text-[10px] hover:bg-emerald-500 hover:text-black transition-all">
                            {m}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="pt-10 border-t border-[var(--border-subtle)]">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="w-full md:w-auto px-12 py-5 bg-cyan-500 text-black font-black uppercase italic text-xs tracking-widest rounded-[28px] shadow-2xl shadow-cyan-500/20 hover:bg-cyan-400 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isSaving ? (
                  <>Saving Protocol... <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /></>
                ) : (
                  <>Commit Changes <Save size={18} /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
