import React, { useState, useEffect, useContext } from 'react';
import { 
  Calendar, Clock, Award, CheckCircle2, 
  TrendingUp, BookOpen, BellRing, Zap 
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import client from '../../api/client';
import ServerTime from '../../components/ServerTime';
import { useLanguage } from '../../context/LanguageContext';

const StudentDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useContext(AuthContext) || {};
  const [schedule, setSchedule] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scheduleRes, statsRes, profileRes] = await Promise.all([
          client.get('/api/v1/student/today-lessons'),
          client.get('/api/v1/student/attendance/stats'),
          client.get('/api/v1/student/profile')
        ]);
        setSchedule(Array.isArray(scheduleRes.data) ? scheduleRes.data : []);
        setStats(statsRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setSchedule([
          { id: 1, subject: "Software Architecture", time: "09:00", room: "412-xona", teacher: "A. Karimov" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const overallAttendance = stats?.subjects?.length > 0 
    ? (stats.subjects.reduce((acc: number, s: any) => acc + (100 - s.missedPercentage), 0) / stats.subjects.length).toFixed(1)
    : "100";

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-10">
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase italic">
            {t('groups').replace('im', '').replace('My ', '')} <span className="text-emerald-500 font-mono">Hub</span>
          </h1>
          <p className="text-[var(--text-secondary)] font-mono text-xs mt-1 uppercase tracking-widest italic">
            {t('welcome')}, {user?.username || 'Talaba'} // Terminal Active
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-3 items-center">
          <ServerTime />
          <div className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl md:rounded-2xl flex items-center gap-2">
            <Award size={14} className="text-emerald-500" />
            <span className="text-emerald-500 font-bold text-xs md:text-sm">{profile?.irisLevelName || `LVL ${profile?.irisLevel || 1}`}</span>
          </div>
          <div className="px-3 py-1.5 md:px-4 md:py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl md:rounded-2xl flex items-center gap-2">
            <Zap size={14} className="text-emerald-500" />
            <span className="text-emerald-500 font-bold text-xs md:text-sm">{typeof profile?.irisPoints === 'number' ? profile.irisPoints.toFixed(1) : (profile?.irisPoints || '0')} XP</span>
          </div>
          <button className="p-1.5 md:p-2 bg-[var(--surface-input)] border border-[var(--border-default)] rounded-xl md:rounded-2xl hover:bg-[var(--surface-hover)] transition-all relative">
            <BellRing size={18} className="text-[var(--text-secondary)]" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--surface-base)]" />
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 md:p-6 border border-[var(--border-subtle)] bg-[var(--surface-card)] rounded-[25px] md:rounded-[35px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 size={60} />
          </div>
          <p className="text-[var(--text-secondary)] text-xs font-black uppercase tracking-tighter">Davomat</p>
          <h3 className="text-4xl font-black mt-1 text-[var(--text-primary)]">{overallAttendance}%</h3>
          <div className="mt-4 h-1.5 w-full bg-[var(--progress-bg)] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${overallAttendance}%` }} />
          </div>
        </div>

        <div className="p-5 md:p-6 border border-[var(--border-subtle)] bg-[var(--surface-card)] rounded-[25px] md:rounded-[35px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={60} />
          </div>
          <p className="text-[var(--text-secondary)] text-xs font-black uppercase tracking-tighter">Status</p>
          <h3 className={`text-4xl font-black mt-1 ${stats?.overallRiskStatus === 'DANGER' ? 'text-red-500' : 'text-emerald-500'}`}>{stats?.overallRiskStatus || 'SAFE'}</h3>
          <p className="text-[var(--text-secondary)] text-[10px] mt-2 font-bold uppercase tracking-widest italic">Academic Risk Assessment</p>
        </div>

        <div className="p-5 md:p-6 border border-[var(--border-subtle)] bg-[var(--surface-card)] rounded-[25px] md:rounded-[35px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award size={60} />
          </div>
          <p className="text-[var(--text-secondary)] text-xs font-black uppercase tracking-tighter">Missed Hours</p>
          <h3 className="text-4xl font-black mt-1 text-[var(--text-primary)]">{stats?.totalMissedHours || 0}h</h3>
          <p className="text-[var(--text-secondary)] text-[10px] mt-2 font-mono uppercase tracking-widest">Total NB hours</p>
        </div>
      </div>

      {/* 3. Main Content: Today's Schedule & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schedule */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold uppercase italic flex items-center gap-2 text-[var(--text-primary)]">
            <Calendar size={20} className="text-emerald-500" /> Bugungi darslar
          </h2>
          <div className="space-y-3">
            {schedule.map((lesson) => (
              <div key={lesson.id} className="p-5 border border-[var(--border-subtle)] bg-[var(--surface-card)] rounded-3xl flex items-center justify-between hover:bg-[var(--surface-elevated)] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors">{lesson.subject}</h4>
                    <p className="text-xs text-[var(--text-secondary)] font-mono uppercase">{lesson.teacher} // {lesson.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-emerald-500 font-mono text-sm font-bold">
                    <Clock size={14} /> {lesson.time}
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 uppercase font-black">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gamification Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold uppercase italic flex items-center gap-2 text-[var(--text-primary)]">
            <Zap size={20} className="text-emerald-500" /> Tezkor vazifalar
          </h2>
          <div className="p-8 border border-emerald-500/10 bg-emerald-500/[0.02] rounded-[40px] border-dashed flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/5 rounded-full flex items-center justify-center">
              <Award className="text-emerald-500/40" size={32} />
            </div>
            <p className="text-[var(--text-secondary)] text-sm max-w-[250px]">
              Bugungi barcha darslarda qatnashing va qo'shimcha <span className="text-emerald-500 font-bold">50 XP</span> ballni qo'lga kiriting!
            </p>
            <button className="px-6 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 text-xs font-black rounded-full transition-all uppercase tracking-widest">
              Vazifalarni ko'rish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;