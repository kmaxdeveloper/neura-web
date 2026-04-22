import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  LayoutGrid, 
  Activity, 
  Database, 
  ArrowUpRight, 
  Settings2, 
  ShieldAlert 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
          Control <span className="text-cyan-500 not-italic text-glow-cyan">Center</span>
        </h1>
        <p className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em]">
          Neura OS // Admin Terminal // v1.0.2 // Data Active
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        
        {/* 1. Data Import */}
        <Link to="/admin/import" className="group p-8 border border-white/5 bg-white/[0.02] rounded-[40px] hover:border-cyan-500/40 hover:bg-cyan-500/[0.05] transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-cyan-500/10">
          <div className="absolute top-6 right-6 p-2 bg-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
             <ArrowUpRight className="text-cyan-500" size={20} />
          </div>
          <Database className="text-cyan-500 mb-6 group-hover:scale-110 transition-transform duration-500" size={32} />
          <h2 className="text-2xl font-bold uppercase italic">Data Import</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Excel orqali talabalar va fanlarni yuklash.</p>
        </Link>

        {/* 2. Matrix Solver */}
        <Link to="/admin/matrix" className="group p-8 border border-white/5 bg-white/[0.02] rounded-[40px] hover:border-cyan-500/40 hover:bg-cyan-500/[0.05] transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-cyan-500/10">
          <div className="absolute top-6 right-6 p-2 bg-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
             <ArrowUpRight className="text-cyan-500" size={20} />
          </div>
          <LayoutGrid className="text-cyan-500 mb-6 group-hover:rotate-90 transition-transform duration-500" size={32} />
          <h2 className="text-2xl font-bold uppercase italic">Matrix Solver</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Avtomatik dars jadvalini shakllantirish.</p>
        </Link>

        {/* 3. NEW: Manual Control - Qo'lda boshqarish */}
        <Link to="/admin/management" className="group p-8 border border-white/10 bg-cyan-500/[0.03] rounded-[40px] hover:border-cyan-500/60 hover:bg-cyan-500/[0.08] transition-all duration-300 relative overflow-hidden ring-1 ring-white/5 shadow-lg hover:shadow-cyan-500/20">
          <div className="absolute top-6 right-6 p-2 bg-cyan-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
             <ArrowUpRight className="text-cyan-500" size={20} />
          </div>
          <Settings2 className="text-cyan-400 mb-6 group-hover:rotate-45 transition-transform duration-500" size={32} />
          <h2 className="text-2xl font-bold uppercase italic text-white">Manual Control</h2>
          <p className="text-cyan-500/60 text-sm mt-2 font-medium">Bazani qo'lda tahrirlash va CRUD amallari.</p>
        </Link>

        {/* 4. UniFace Logs */}
        <Link to="/admin/attendance" className="group p-8 border border-white/5 bg-white/[0.02] rounded-[40px] hover:border-cyan-500/40 hover:bg-cyan-500/[0.05] transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-cyan-500/10">
          <div className="absolute top-6 right-6 p-2 bg-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
             <ArrowUpRight className="text-cyan-500" size={20} />
          </div>
          <Users className="text-cyan-500 mb-6 group-hover:translate-x-1 transition-transform duration-500" size={32} />
          <h2 className="text-2xl font-bold uppercase italic">UniFace Logs</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">Biometrik davomat va talabalar nazorati.</p>
        </Link>

        {/* 5. System Status Card */}
        <div className="p-8 border border-white/5 bg-white/[0.02] rounded-[40px] relative overflow-hidden md:col-span-2 lg:col-span-2 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <Activity className="text-cyan-500 animate-pulse" size={32} />
            <div>
              <h2 className="text-2xl font-bold uppercase italic">System Core</h2>
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-tighter text-glow-cyan-small">AWS EC2 // Ubuntu 24.04 LTS</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>CPU Load</span>
                <span className="text-cyan-500">42%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-[42%] shadow-[0_0_10px_cyan] rounded-full" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>RAM Usage</span>
                <span className="text-emerald-500">1.2GB / 8GB</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[15%] rounded-full" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Database Connected</span>
             </div>
             <span className="text-[10px] font-mono text-slate-600">Ping: 24ms</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;