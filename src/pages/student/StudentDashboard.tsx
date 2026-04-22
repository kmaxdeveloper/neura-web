import React, { useState, useEffect, useContext } from 'react';
import { 
  Calendar, Clock, Award, CheckCircle2, 
  TrendingUp, BookOpen, BellRing, Zap 
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import client from '../../api/client';

const StudentDashboard: React.FC = () => {
  const { user } = useContext(AuthContext) || {};
  const [schedule, setSchedule] = useState<any[]>([]);
  const [stats, setStats] = useState({
    attendance: 85,
    points: 1250,
    rank: 12
  });

  useEffect(() => {
    // Talabaning bugungi darslarini olish
    client.get('/api/v1/student/today-lessons')
      .then(res => setSchedule(res.data))
      .catch(() => {
        // Test uchun vaqtinchalik ma'lumot
        setSchedule([
          { id: 1, subject: "Ma'lumotlar tuzilmasi", time: "09:00", room: "412-xona", teacher: "A. Karimov" },
          { id: 2, subject: "Algoritmlar", time: "10:30", room: "205-lab", teacher: "S. Rahmonov" }
        ]);
      });
  }, []);

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-10">
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic">
            Student <span className="text-emerald-500 font-mono">Hub</span>
          </h1>
          <p className="text-slate-500 font-mono text-xs mt-1 uppercase tracking-widest italic">
            Xush kelibsiz, {user?.username || 'Talaba'} // Terminal Active
          </p>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2">
            <Zap size={16} className="text-emerald-500" />
            <span className="text-emerald-500 font-bold text-sm">{stats.points} XP</span>
          </div>
          <button className="p-2 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all relative">
            <BellRing size={20} className="text-slate-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#050505]" />
          </button>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 border border-white/5 bg-white/[0.02] rounded-[35px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 size={60} />
          </div>
          <p className="text-slate-500 text-xs font-black uppercase tracking-tighter">Davomat</p>
          <h3 className="text-4xl font-black mt-1 text-white">{stats.attendance}%</h3>
          <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.attendance}%` }} />
          </div>
        </div>

        <div className="p-6 border border-white/5 bg-white/[0.02] rounded-[35px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={60} />
          </div>
          <p className="text-slate-500 text-xs font-black uppercase tracking-tighter">Reyting</p>
          <h3 className="text-4xl font-black mt-1 text-white">#{stats.rank}</h3>
          <p className="text-emerald-500 text-[10px] mt-2 font-bold uppercase tracking-widest">Top 5% ichida</p>
        </div>

        <div className="p-6 border border-white/5 bg-white/[0.02] rounded-[35px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Award size={60} />
          </div>
          <p className="text-slate-500 text-xs font-black uppercase tracking-tighter">Yutuqlar</p>
          <h3 className="text-4xl font-black mt-1 text-white">8/12</h3>
          <p className="text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">Master of Code Badge</p>
        </div>
      </div>

      {/* 3. Main Content: Today's Schedule & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schedule */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold uppercase italic flex items-center gap-2">
            <Calendar size={20} className="text-emerald-500" /> Bugungi darslar
          </h2>
          <div className="space-y-3">
            {schedule.map((lesson) => (
              <div key={lesson.id} className="p-5 border border-white/5 bg-white/[0.02] rounded-3xl flex items-center justify-between hover:bg-white/[0.04] transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-emerald-400 transition-colors">{lesson.subject}</h4>
                    <p className="text-xs text-slate-500 font-mono uppercase">{lesson.teacher} // {lesson.room}</p>
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
          <h2 className="text-xl font-bold uppercase italic flex items-center gap-2">
            <Zap size={20} className="text-emerald-500" /> Tezkor vazifalar
          </h2>
          <div className="p-8 border border-emerald-500/10 bg-emerald-500/[0.02] rounded-[40px] border-dashed flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/5 rounded-full flex items-center justify-center">
              <Award className="text-emerald-500/40" size={32} />
            </div>
            <p className="text-slate-400 text-sm max-w-[250px]">
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