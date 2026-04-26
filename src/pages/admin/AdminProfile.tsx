import React from 'react';
import { 
  Shield, ShieldCheck, LogOut, Camera, 
  Settings, Activity, Database, Server,
  Globe, Zap, Cpu, Terminal, Lock
} from 'lucide-react';
import ServerTime from '../../components/ServerTime';

const AdminProfile: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-6 pb-20">
      
      {/* 1. COMPACT NEURAL HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--surface-card)] p-6 md:p-8 rounded-[32px] border border-cyan-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/[0.04] blur-[100px] -mr-40 -mt-40 animate-pulse" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative group">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-[1.5px] shadow-xl shadow-cyan-500/10 transition-transform group-hover:rotate-3">
              <div className="w-full h-full rounded-2xl bg-[var(--surface-base)] flex items-center justify-center overflow-hidden">
                <span className="text-3xl font-black text-cyan-500 italic uppercase">A</span>
              </div>
            </div>
            <button className="absolute -bottom-1 -right-1 p-1.5 bg-[var(--surface-card)] border border-cyan-500/30 rounded-lg text-cyan-500 hover:bg-cyan-500 hover:text-black transition-all">
              <Camera size={14} />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">Root <span className="text-cyan-500">Admin</span></h1>
              <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[7px] text-cyan-500 font-black uppercase tracking-widest">Verified</div>
            </div>
            <p className="text-[var(--text-secondary)] font-mono text-[9px] uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Infrastructure Authority
            </p>
          </div>
        </div>
        <ServerTime />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 2. SECURITY & ACCESS (Left - Compact) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[32px] p-6 space-y-6 relative overflow-hidden shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase italic text-cyan-500 tracking-widest">Security Layer</h3>
              <Lock size={14} className="text-cyan-500/40" />
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-cyan-500/20 transition-all">
                <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em] mb-1.5">Auth Level</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--text-primary)] uppercase italic">Superuser (0)</span>
                  <ShieldCheck size={16} className="text-emerald-500" />
                </div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-cyan-500/20 transition-all">
                <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-[0.15em] mb-1.5">2FA Protocol</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[var(--text-primary)] uppercase italic">Active</span>
                  <Zap size={16} className="text-amber-500" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-2">
              <button className="w-full p-3.5 bg-cyan-500 text-black font-black uppercase italic text-[9px] tracking-widest rounded-xl shadow-lg shadow-cyan-500/10 hover:bg-cyan-400 transition-all flex items-center justify-center gap-2">
                <Settings size={12} /> Credentials
              </button>
              <button className="w-full p-3.5 bg-rose-500/5 text-rose-500 border border-rose-500/10 font-black uppercase italic text-[9px] tracking-widest rounded-xl hover:bg-rose-500 hover:text-black transition-all flex items-center justify-center gap-2">
                <LogOut size={12} /> Log Out
              </button>
            </div>
          </div>

          <div className="bg-black/10 border border-white/5 rounded-[32px] p-6 flex flex-col items-center text-center space-y-3">
             <Terminal size={24} className="text-cyan-500/60" />
             <p className="text-[9px] text-[var(--text-muted)] font-mono uppercase leading-relaxed tracking-wider">Kernel: 6.4.2-neura-stable // All nodes healthy</p>
          </div>
        </div>

        {/* 3. SYSTEM INFRASTRUCTURE (Right - Medium Density) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[40px] p-8 shadow-xl relative overflow-hidden">
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                 <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-500"><Server size={18} /></div>
                 <div>
                   <h3 className="text-lg font-black uppercase italic text-[var(--text-primary)]">Infrastructure</h3>
                   <p className="text-[8px] text-[var(--text-muted)] uppercase tracking-widest font-mono mt-0.5">DC-01 // Primary Node</p>
                 </div>
               </div>
               <div className="hidden sm:flex gap-4">
                 <div className="flex flex-col items-end">
                   <span className="text-[7px] font-black text-[var(--text-muted)] uppercase tracking-tighter">Latency</span>
                   <span className="text-[9px] font-black text-cyan-500 uppercase">12ms</span>
                 </div>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-5">
                 <div className="space-y-1.5">
                   <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Admin Email</label>
                   <div className="w-full p-4 bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-2xl flex items-center gap-3">
                     <Globe size={16} className="text-cyan-500" />
                     <span className="text-xs font-bold text-[var(--text-primary)]">admin@neura.edu</span>
                   </div>
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Database Role</label>
                   <div className="w-full p-4 bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-2xl flex items-center gap-3">
                     <Database size={16} className="text-cyan-500" />
                     <span className="text-xs font-bold text-[var(--text-primary)]">Superuser Access</span>
                   </div>
                 </div>
               </div>

               <div className="p-6 bg-black/10 rounded-[32px] border border-cyan-500/10 space-y-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[8px] font-black uppercase text-cyan-500 tracking-widest italic">CPU Usage</span>
                      <span className="text-sm font-black text-white italic">24%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full p-0.5">
                      <div className="h-full bg-cyan-500 w-[24%] rounded-full shadow-[0_0_8px_cyan]" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-[8px] font-black uppercase text-purple-500 tracking-widest italic">RAM Load</span>
                      <span className="text-sm font-black text-white italic">4.2GB</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full p-0.5">
                      <div className="h-full bg-purple-500 w-[45%] rounded-full shadow-[0_0_8px_purple]" />
                    </div>
                  </div>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Users', val: '4.8k', icon: Shield, col: 'text-cyan-500' },
              { label: 'Processes', val: '284', icon: Cpu, col: 'text-purple-500' },
              { label: 'Uptime', val: '99.9%', icon: Activity, col: 'text-emerald-500' },
              { label: 'Disk', val: '84%', icon: Database, col: 'text-amber-500' },
            ].map((s, i) => (
              <div key={i} className="p-5 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-3xl hover:border-cyan-500/20 transition-all group">
                <s.icon className={`${s.col} mb-2.5 group-hover:scale-110 transition-transform`} size={18} />
                <div className="text-lg font-black text-[var(--text-primary)] italic uppercase leading-none">{s.val}</div>
                <div className="text-[7px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
