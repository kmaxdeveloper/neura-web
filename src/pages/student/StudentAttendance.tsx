import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle2, 
  ChevronRight, BookOpen, Clock, TrendingDown,
  Info
} from 'lucide-react';
import client from '../../api/client';
import ServerTime from '../../components/ServerTime';
import { useLanguage } from '../../context/LanguageContext';

const StudentAttendance: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/api/v1/student/attendance/stats')
      .then(res => setStats(res.data))
      .catch(err => {
        console.error("Attendance stats error:", err);
        // Fallback for demo
        setStats({
          subjects: [
            { 
              subjectId: 1, 
              subjectName: "Ma'lumotlar tuzilmasi", 
              totalLessons: 20, 
              presentCount: 18, 
              missedCount: 2, 
              missedPercentage: 10,
              riskStatus: "SAFE",
              missedTopics: []
            },
            { 
              subjectId: 2, 
              subjectName: "Dasturiy ta'minot arxitekturasi", 
              totalLessons: 10, 
              presentCount: 7, 
              missedCount: 3, 
              missedPercentage: 30,
              riskStatus: "DANGER",
              missedTopics: [
                { topicTitle: "Microservices Architecture", date: "25.04.2024" },
                { topicTitle: "Event-Driven Design", date: "27.04.2024" }
              ]
            }
          ],
          totalMissedHours: 10,
          overallRiskStatus: "WARNING"
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-emerald-500 font-black italic tracking-widest animate-pulse">SYNCING ATTENDANCE DATA...</p>
      </div>
    </div>
  );

  const getRiskColor = (status: string) => {
    switch(status) {
      case 'DANGER': return 'text-red-500';
      case 'WARNING': return 'text-amber-500';
      default: return 'text-emerald-500';
    }
  };

  const getRiskBg = (status: string) => {
    switch(status) {
      case 'DANGER': return 'bg-red-500/10 border-red-500/20';
      case 'WARNING': return 'bg-amber-500/10 border-amber-500/20';
      default: return 'bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-10 pb-10 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-emerald-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">Performance Analytics</p>
          <h1 className="text-5xl font-black text-[var(--text-primary)] uppercase italic leading-none tracking-tighter">
            {t('attendance')} <span className="text-emerald-500">Report</span>
          </h1>
        </div>
        <ServerTime />
      </div>

      {/* OVERALL SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative group overflow-hidden p-8 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[40px] shadow-lg">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock size={80} />
           </div>
           <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Umumiy NB soatlar</p>
           <h2 className="text-5xl font-black text-[var(--text-primary)] italic">{stats.totalMissedHours} <span className="text-xl text-[var(--text-secondary)] not-italic">soat</span></h2>
           <div className="mt-6 flex items-center gap-2 text-emerald-500 font-bold text-xs">
              <TrendingDown size={14} /> Status: Monitoring
           </div>
        </div>

        <div className={`relative group overflow-hidden p-8 border rounded-[40px] shadow-lg ${getRiskBg(stats.overallRiskStatus)}`}>
           <div className="absolute top-0 right-0 p-6 opacity-10">
              <AlertTriangle size={80} className={getRiskColor(stats.overallRiskStatus)} />
           </div>
           <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${getRiskColor(stats.overallRiskStatus)}`}>Xavf darajasi</p>
           <h2 className={`text-5xl font-black italic ${getRiskColor(stats.overallRiskStatus)}`}>{stats.overallRiskStatus}</h2>
           <p className="mt-6 text-[10px] text-[var(--text-secondary)] font-mono uppercase leading-relaxed max-w-[200px]">
              {stats.overallRiskStatus === 'DANGER' ? 'Sizda fandan yiqilish xavfi juda yuqori!' : 'Hozircha holat barqaror, lekin ehtiyot bo\'ling.'}
           </p>
        </div>

        <div className="relative group overflow-hidden p-8 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[40px] shadow-lg">
           <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
              <CheckCircle2 size={80} />
           </div>
           <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">NB Chegarasi (Limit)</p>
           <h2 className="text-5xl font-black text-[var(--text-primary)] italic">23 <span className="text-xl text-[var(--text-secondary)] not-italic">%</span></h2>
           <p className="mt-6 text-[10px] text-red-500/60 font-bold uppercase tracking-widest">
              Bu chegaradan o'tsangiz, avtomatik ravishda fandan chetlatilasiz.
           </p>
        </div>
      </div>

      {/* SUBJECTS DETAIL GRID */}
      <div className="space-y-6">
        <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] flex items-center gap-4">
          <span className="h-[1px] flex-1 bg-[var(--border-subtle)]"></span>
          Fanlar bo'yicha tahlil
          <span className="h-[1px] flex-1 bg-[var(--border-subtle)]"></span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           {stats.subjects.map((subject: any) => (
             <div key={subject.subjectId} className="group bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[40px] p-8 hover:border-emerald-500/30 transition-all shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <BookOpen size={120} />
                </div>

                <div className="flex items-start justify-between mb-8">
                   <div className="space-y-2">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase italic ${getRiskBg(subject.riskStatus)} ${getRiskColor(subject.riskStatus)}`}>
                        {subject.riskStatus}
                      </span>
                      <h4 className="text-2xl font-black text-[var(--text-primary)] uppercase italic leading-tight">{subject.subjectName}</h4>
                   </div>
                   <div className="text-right">
                      <div className={`text-3xl font-black italic ${getRiskColor(subject.riskStatus)}`}>{subject.missedPercentage.toFixed(1)}%</div>
                      <div className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-tighter">Missed Rate</div>
                   </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 mb-8">
                   <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                      <span>Kelgan darslar: {subject.presentCount}</span>
                      <span>NB: {subject.missedCount} / {subject.totalLessons}</span>
                   </div>
                   <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${subject.missedPercentage > 15 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`} 
                        style={{ width: `${100 - subject.missedPercentage}%` }} 
                      />
                   </div>
                </div>

                {/* Missed Topics List */}
                {subject.missedTopics.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
                      <AlertTriangle size={12} className="text-amber-500" /> Qoldirilgan mavzular
                    </p>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                      {subject.missedTopics.map((topic: any, idx: number) => (
                        <div key={idx} className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between group/topic hover:bg-white/[0.05] transition-all">
                           <span className="text-[11px] font-bold text-[var(--text-secondary)] group-hover/topic:text-[var(--text-primary)] transition-colors">{topic.topicTitle}</span>
                           <span className="text-[10px] font-mono text-emerald-500/40">{topic.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500 uppercase italic">Ushbu fandan NB mavjud emas!</span>
                  </div>
                )}
             </div>
           ))}
        </div>
      </div>

      {/* FOOTER INFO */}
      <div className="p-8 bg-black/20 border border-white/5 rounded-[40px] flex flex-col md:flex-row items-center gap-6">
         <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 animate-pulse">
            <Info size={32} />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h5 className="text-lg font-black text-[var(--text-primary)] uppercase italic">Akademik Qoidalar</h5>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1">
              Universitet nizomiga ko'ra, agar talaba bir fandan umumiy dars soatlarining <span className="text-red-500 font-bold">23 foizidan ko'pini</span> sababsiz qoldirsa, u ushbu fandan yakuniy nazoratga qo'yilmaydi.
            </p>
         </div>
         <button className="px-8 py-4 bg-[var(--surface-input)] hover:bg-[var(--surface-hover)] border border-[var(--border-default)] text-[10px] font-black uppercase italic rounded-2xl transition-all flex items-center gap-3">
           Batafsil ma'lumot <ChevronRight size={16} />
         </button>
      </div>
    </div>
  );
};

export default StudentAttendance;
