import React, { useState, useEffect } from 'react';
import { 
  Trophy, Medal, Search, 
  Award, ChevronRight, TrendingUp, Sparkles,
  Zap
} from 'lucide-react';
import client from '../api/client';
import ServerTime from '../components/ServerTime';

const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentRes, teacherRes] = await Promise.all([
          client.get('/api/v1/leaderboard/students?limit=100'),
          client.get('/api/v1/leaderboard/teachers?limit=100')
        ]);
        setStudents(studentRes.data);
        setTeachers(teacherRes.data);
      } catch (err) {
        console.error("Leaderboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = activeTab === 'students' ? students : teachers;
  const filteredData = data.filter(item => 
    item.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleData = showAll ? filteredData : filteredData.slice(0, 10);

  const getRankColor = (rank: number) => {
    if (rank === 0) return 'text-yellow-400';
    if (rank === 1) return 'text-slate-300';
    if (rank === 2) return 'text-amber-600';
    return 'text-[var(--text-muted)]';
  };

  const getRankBg = (rank: number) => {
    if (rank === 0) return 'bg-yellow-400/10 border-yellow-400/20';
    if (rank === 1) return 'bg-slate-300/10 border-slate-300/20';
    if (rank === 2) return 'bg-amber-600/10 border-amber-600/20';
    return 'bg-[var(--surface-hover)] border-[var(--border-subtle)]';
  };

  return (
    <div className="animate-in fade-in duration-1000 space-y-10 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--surface-card)] p-10 rounded-[50px] border border-[var(--border-subtle)] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/[0.03] blur-[120px] -mr-48 -mt-48" />
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-[28px] flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.3)] rotate-3">
            <Trophy size={40} className="text-black" />
          </div>
          <div>
            <h1 className="text-5xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter leading-none">
              Global <span className="text-cyan-500">Leaderboard</span>
            </h1>
            <p className="text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-[0.4em] mt-3 flex items-center gap-2">
              <Sparkles size={12} className="text-yellow-500" /> Neura IRIS Integrity Index
            </p>
          </div>
        </div>
        <ServerTime />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex bg-[var(--surface-card)] p-2 rounded-[28px] border border-[var(--border-subtle)] shadow-lg w-full md:w-auto">
           <button 
             onClick={() => { setActiveTab('students'); setShowAll(false); }}
             className={`flex-1 md:flex-none px-10 py-4 rounded-[22px] text-xs font-black uppercase italic tracking-widest transition-all ${activeTab === 'students' ? 'bg-cyan-500 text-black shadow-xl shadow-cyan-500/20' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
           >
             Students
           </button>
           <button 
             onClick={() => { setActiveTab('teachers'); setShowAll(false); }}
             className={`flex-1 md:flex-none px-10 py-4 rounded-[22px] text-xs font-black uppercase italic tracking-widest transition-all ${activeTab === 'teachers' ? 'bg-purple-500 text-black shadow-xl shadow-purple-500/20' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
           >
             Teachers
           </button>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-cyan-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-8 py-5 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[28px] text-sm outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/5 transition-all font-medium italic"
          />
        </div>
      </div>

      {!loading && searchTerm === '' && filteredData.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
           {[1, 0, 2].map((idx) => {
             const person = filteredData[idx];
             const rank = idx;
             return (
               <div key={idx} className={`relative p-8 border rounded-[48px] shadow-2xl transition-all hover:scale-[1.02] overflow-hidden group ${getRankBg(rank)} ${rank === 0 ? 'md:-mt-8 md:mb-8' : ''}`}>
                  <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Trophy size={120} />
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <div className="relative">
                      <div className={`w-24 h-24 rounded-[32px] ${rank === 0 ? 'bg-yellow-400' : rank === 1 ? 'bg-slate-300' : 'bg-amber-600'} flex items-center justify-center text-black text-3xl font-black italic shadow-2xl`}>
                        {person.fullName.charAt(0)}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black rounded-xl border-2 border-white/10 flex items-center justify-center shadow-xl">
                        <Medal size={20} className={getRankColor(rank)} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[var(--text-primary)] uppercase italic leading-tight truncate max-w-[200px]">{person.fullName}</h3>
                      <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${activeTab === 'students' ? 'text-cyan-500' : 'text-purple-500'}`}>{person.levelName}</p>
                    </div>
                    <div className="w-full pt-6 border-t border-white/5 flex items-center justify-center gap-4">
                       <div className="text-center">
                         <p className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest">Points</p>
                          <p className="text-xl font-black text-[var(--text-primary)] italic">{typeof person.points === 'number' ? person.points.toFixed(1) : person.points}</p>
                       </div>
                       <div className="h-8 w-[1px] bg-white/5" />
                       <div className="text-center">
                         <p className="text-[8px] font-black uppercase text-[var(--text-muted)] tracking-widest">Rank</p>
                         <p className={`text-xl font-black italic ${getRankColor(rank)}`}>#{rank + 1}</p>
                       </div>
                    </div>
                  </div>
               </div>
             );
           })}
        </div>
      )}

      <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[50px] overflow-hidden shadow-2xl">
         <div className="p-8 border-b border-[var(--border-subtle)] flex items-center justify-between px-12">
            <h4 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.3em] flex items-center gap-3">
              <TrendingUp size={14} className="text-cyan-500" /> Integrity Ranking
            </h4>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">Showing {visibleData.length} of {filteredData.length} records</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] w-24">Rank</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Identity</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{activeTab === 'students' ? 'Group' : 'Department'}</th>
                  <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Progress</th>
                  <th className="px-12 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500 animate-pulse">Syncing Leaderboard...</p>
                      </div>
                    </td>
                  </tr>
                ) : visibleData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center italic text-[var(--text-muted)]">Hech narsa topilmadi...</td>
                  </tr>
                ) : (
                  visibleData.map((item, index) => (
                    <tr key={index} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-12 py-6">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-xs ${index < 3 ? getRankBg(index) + ' ' + getRankColor(index) : 'bg-black/20 text-[var(--text-muted)]'}`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black text-black uppercase ${activeTab === 'students' ? 'bg-cyan-500' : 'bg-purple-500'}`}>
                            {item.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-black text-[var(--text-primary)] uppercase italic group-hover:text-cyan-500 transition-colors">{item.fullName}</p>
                            <p className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-tighter">{item.levelName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                         <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{activeTab === 'students' ? item.group : item.department}</span>
                      </td>
                      <td className="px-6 py-6 text-right">
                         <div className="flex items-center justify-end gap-3">
                           <div className="w-24 h-1.5 bg-black/20 rounded-full overflow-hidden">
                              <div className={`h-full ${activeTab === 'students' ? 'bg-cyan-500 shadow-[0_0_10px_cyan]' : 'bg-purple-500 shadow-[0_0_10px_purple]'} rounded-full`} style={{ width: `${(item.level / 20) * 100}%` }} />
                           </div>
                           <span className="text-[10px] font-black text-[var(--text-muted)]">LVL {item.level}</span>
                         </div>
                      </td>
                      <td className="px-12 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <span className="text-lg font-black text-[var(--text-primary)] italic">{typeof item.points === 'number' ? item.points.toFixed(1) : item.points}</span>
                           <Zap size={14} className={activeTab === 'students' ? 'text-cyan-500' : 'text-purple-500'} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
         </div>
         {!loading && !showAll && filteredData.length > 10 && (
           <div className="p-10 flex justify-center bg-gradient-to-t from-[var(--surface-card)] to-transparent">
              <button 
                onClick={() => setShowAll(true)}
                className="px-12 py-4 bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-full text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)] hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all active:scale-95 flex items-center gap-3"
              >
                Top 100 ni ko'rish <ChevronRight size={16} />
              </button>
           </div>
         )}
      </div>

      <div className="p-10 bg-cyan-500/5 border border-cyan-500/10 rounded-[40px] flex flex-col md:flex-row items-center gap-10">
         <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0">
            <Award size={40} />
         </div>
         <div className="flex-1 text-center md:text-left space-y-2">
            <h5 className="text-xl font-black text-[var(--text-primary)] uppercase italic">Transparency & Fairness</h5>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium italic">
              Leaderboard IRIS tizimi orqali avtomatik yangilanadi. Har bir ball real akademik harakatlar (davomat, topshiriqlar, AI tahlili) asosida yoziladi. Shaffoflik — bizning asosiy qadriyatimiz.
            </p>
         </div>
         <div className="flex gap-4">
            <div className="p-4 bg-black/20 rounded-2xl border border-white/5 text-center min-w-[120px]">
               <p className="text-[8px] font-black text-[var(--text-muted)] uppercase mb-1">Total XP Awarded</p>
               <p className="text-xl font-black text-cyan-500 italic">2.4M+</p>
            </div>
            <div className="p-4 bg-black/20 rounded-2xl border border-white/5 text-center min-w-[120px]">
               <p className="text-[8px] font-black text-[var(--text-muted)] uppercase mb-1">Active Users</p>
               <p className="text-xl font-black text-purple-500 italic">850+</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Leaderboard;
