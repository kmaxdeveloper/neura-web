import React, { useState, useEffect, useContext } from 'react';
import { 
  Mail, GraduationCap, Zap, 
  Trophy, Clock, Activity, Target,
  Camera, ShieldCheck, Star, 
  Award, TrendingUp, Compass, Cpu,
  Sparkles, Flame, CheckCircle2
} from 'lucide-react';
import ServerTime from '../../components/ServerTime';
import client from '../../api/client';
import { AuthContext } from '../../context/AuthContext';

const StudentProfile: React.FC = () => {
  const { user } = useContext(AuthContext) || {};
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          client.get('/api/v1/student/profile'),
          client.get('/api/v1/student/attendance/stats')
        ]);
        setProfile(profileRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        // Fallback for demo
        setProfile({
          fullName: "Alex Johnson",
          studentId: "2100101",
          groupName: "CS-202 // AI Specialty",
          username: user?.username || "ajohnson"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  const firstName = profile?.fullName?.split(' ')[0] || "User";
  const lastName = profile?.fullName?.split(' ').slice(1).join(' ') || "";

  // Davomat foizini hisoblash
  const overallAttendance = stats?.subjects?.length > 0 
    ? (stats.subjects.reduce((acc: number, s: any) => acc + (100 - s.missedPercentage), 0) / stats.subjects.length).toFixed(1)
    : "100";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-6 pb-20 text-[var(--text-primary)]">
      
      {/* 1. COMPACT EVOLUTIONARY HEADER */}
      <div className="relative group">
        <div className="absolute inset-0 bg-emerald-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="relative bg-[var(--surface-card)] border border-emerald-500/20 rounded-[40px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl overflow-hidden">
          
          <div className="flex flex-col md:flex-row items-center gap-6 z-10">
            <div className="relative">
               <div className="w-28 h-28 rounded-[32px] bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-xl shadow-emerald-500/20 group-hover:rotate-3 transition-transform duration-700">
                 <div className="w-full h-full rounded-[30px] bg-[var(--surface-base)] flex items-center justify-center overflow-hidden relative">
                   <span className="text-4xl font-black text-emerald-500 italic">{firstName[0]}</span>
                   <div className="absolute bottom-0 inset-x-0 h-1/4 bg-emerald-500/10 backdrop-blur-sm flex items-center justify-center border-t border-white/5">
                     <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">ID: {profile?.studentId}</span>
                   </div>
                 </div>
               </div>
            </div>

            <div className="text-center md:text-left space-y-2">
               <div className="flex flex-col md:flex-row items-center gap-3">
                 <h1 className="text-3xl font-black uppercase italic tracking-tighter">{firstName} <span className="text-emerald-500">{lastName}</span></h1>
                 <div className="px-3 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                    <Flame size={12} className={`text-orange-500 ${stats?.overallRiskStatus === 'DANGER' ? 'animate-ping' : 'animate-bounce'}`} />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                       {stats?.overallRiskStatus === 'SAFE' ? 'Elite Student' : 'Attention Required'}
                    </span>
                 </div>
               </div>
               <p className="text-sm font-bold text-[var(--text-secondary)] italic">Undergraduate // {profile?.groupName}</p>
               <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                  {['Neural Networks', 'Python', 'UX Design'].map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-black/20 border border-white/5 rounded-lg text-[7px] font-black uppercase tracking-widest text-emerald-500">#{tag}</span>
                  ))}
               </div>
            </div>
          </div>

          <ServerTime />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 2. PROGRESS & SKILLS (Left - Medium) */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[40px] p-8 space-y-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 bg-emerald-500/[0.02] rounded-full -mr-12 -mt-12" />
              
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase italic tracking-[0.3em] text-emerald-500 flex items-center gap-2">
                  <TrendingUp size={14} /> Academic Performance
                </h3>
                <Sparkles size={14} className="text-emerald-500/30" />
              </div>

              <div className="space-y-6">
                {[
                  { name: 'Core GPA', val: '3.92', icon: Star, color: 'text-amber-500', progress: 92 },
                  { name: 'Attendance', val: `${overallAttendance}%`, icon: CheckCircle2, color: 'text-emerald-500', progress: parseFloat(overallAttendance) },
                  { name: 'Missed Hours', val: `${stats?.totalMissedHours || 0}h`, icon: Clock, color: 'text-red-500', progress: Math.min(100, (stats?.totalMissedHours || 0) * 2) },
                ].map((s, i) => (
                  <div key={i} className="space-y-2 group">
                    <div className="flex justify-between items-end">
                       <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-black/20 ${s.color}`}><s.icon size={14} /></div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">{s.name}</span>
                       </div>
                       <span className="text-lg font-black italic">{s.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full p-0.5">
                       <div className={`h-full ${s.color.replace('text', 'bg')} rounded-full shadow-[0_0_8px_currentColor] transition-all duration-1000 group-hover:scale-x-[1.02] origin-left`} style={{ width: `${s.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-3">
                 <button 
                   onClick={() => window.location.href='/student/attendance'}
                   className="flex-1 py-4 bg-emerald-500 text-black font-black uppercase italic text-[9px] tracking-widest rounded-2xl shadow-lg shadow-emerald-500/10 hover:bg-emerald-400 transition-all"
                 >
                    Full Attendance Report
                 </button>
                 <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-emerald-500 border border-white/5"><Compass size={18} /></button>
              </div>
           </div>

           <div className="bg-black/20 border border-white/5 rounded-[32px] p-6 space-y-4">
              <div className="flex items-center gap-3 text-emerald-500">
                <ShieldCheck size={20} />
                <h4 className="text-[10px] font-black uppercase italic tracking-widest">Neura OS Security</h4>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-medium leading-relaxed italic">Your face identity and attendance logs are cryptographically secured by Neura Guard.</p>
           </div>
        </div>

        {/* 3. PERFORMANCE & ACHIEVEMENTS (Right - Compact) */}
        <div className="lg:col-span-7 space-y-6">
           <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[40px] p-8 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/[0.01] blur-[80px]" />
             
             <h3 className="text-sm font-black uppercase italic text-[var(--text-primary)] mb-8 flex items-center gap-3">
                <Award className="text-emerald-500" size={18} /> Credentials & Info
             </h3>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                   {[
                     { label: 'Username', value: profile?.username || "---", icon: Mail },
                     { label: 'Group', value: profile?.groupName || "---", icon: GraduationCap },
                     { label: 'Risk Status', value: stats?.overallRiskStatus || "SAFE", icon: Activity },
                   ].map((item, i) => (
                     <div key={i} className="space-y-1.5">
                       <label className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">{item.label}</label>
                       <div className="flex items-center gap-3 p-4 bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-2xl">
                         <item.icon size={16} className={item.value === 'DANGER' ? 'text-red-500' : 'text-emerald-500'} />
                         <span className={`text-xs font-bold truncate ${item.value === 'DANGER' ? 'text-red-500' : 'text-[var(--text-primary)]'}`}>{item.value}</span>
                       </div>
                     </div>
                   ))}
                </div>

                <div className="grid grid-cols-1 gap-3">
                   {[
                     { name: 'Top Coder', desc: 'Solved 100+ matrix challenges.', icon: Cpu, col: 'text-cyan-500' },
                     { name: 'Perfect Streak', desc: '100% attendance for 30 days.', icon: Activity, col: 'text-emerald-500' },
                     { name: 'AI Scholar', desc: 'Ranked Top 5 in Mizan AI.', icon: Zap, col: 'text-amber-500' },
                   ].map((a, i) => (
                     <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4 group hover:border-emerald-500/20 transition-all">
                        <div className={`p-3 rounded-xl bg-black/20 ${a.col} group-hover:scale-110 transition-transform`}><a.icon size={20} /></div>
                        <div>
                           <p className="text-xs font-black uppercase italic text-[var(--text-primary)]">{a.name}</p>
                           <p className="text-[8px] text-[var(--text-muted)] font-medium mt-0.5 leading-tight">{a.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           </div>

           <div className="p-8 bg-gradient-to-br from-emerald-500/[0.05] to-cyan-500/[0.05] border border-emerald-500/10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-inner group">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-xl shadow-emerald-500/5 group-hover:rotate-12 transition-transform">
                   <Target size={28} className="text-emerald-500" />
                 </div>
                 <div>
                   <h4 className="text-lg font-black uppercase italic text-[var(--text-primary)]">Next Milestone</h4>
                   <p className="text-xs text-[var(--text-muted)] font-medium">Reach Lv. 25 to unlock advanced tools.</p>
                 </div>
              </div>
              <button className="px-8 py-4 bg-emerald-500 text-black font-black uppercase italic text-[9px] tracking-widest rounded-2xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-400 transition-all active:scale-95">
                 Claim Skill Point
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
