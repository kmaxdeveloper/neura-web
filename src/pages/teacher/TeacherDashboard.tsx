import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Zap, Users, MapPin } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import client from '../../api/client';
import ServerTime from '../../components/ServerTime';
import { useLanguage } from '../../context/LanguageContext';

const TeacherDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    client.get('/api/v1/teacher/get-subjects')
      .then(res => {
        setSubjects(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Dashboard error:", err);
        // Fallback test ma'lumotlari
        setSubjects([{ id: 101, name: "Dasturiy ta'minot arxitekturasi", group: "941-21", room: "412-xona", time: "09:00" }]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStartSession = async (subject: any) => {
    try {
      const currentUser = user as any; 
      const payload = {
        subjectId: Number(subject.id),
        teacherUsername: currentUser?.username,
        groupIds: [Number(subject.groupId || 1)], // Backendda Matrix bilan bog'lanadi
        lessonType: "PRACTICE"
      };

      const res = await client.post('/api/v1/teacher/start-lesson', payload);
      const lessonId = res.data;

      if (lessonId) {
        navigate(`/teacher/qr-session/${lessonId}`);
      }
    } catch (err: any) {
      alert(`Xatolik: ${err.response?.data?.error || "Darsni boshlashda xato!"}`);
    }
  };

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <p className="text-purple-500 font-black italic tracking-widest animate-pulse">INITIALIZING NEURA OS...</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-purple-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">Operational Command Center</p>
          <h1 className="text-5xl font-black text-[var(--text-primary)] uppercase italic leading-none tracking-tighter">
            {t('groups').replace('im', '').replace('My ', '')}  <span className="text-purple-500">{t('dashboard')}</span>
          </h1>
        </div>
        <ServerTime />
      </div>

      {/* MATRIX SUGGESTION (Aynan hozirgi dars uchun UI) */}
      <div className="relative group">
         <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
         <div className="relative bg-[var(--surface-card)] border border-[var(--border-default)] rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
               <BrainCircuit className="text-purple-500 animate-pulse" size={40} />
            </div>
            <div className="flex-1 text-center md:text-left">
               <span className="text-[10px] font-black bg-purple-500 text-black px-3 py-1 rounded-full uppercase italic tracking-tighter">Current Matrix Recommendation</span>
               <h2 className="text-3xl font-black text-[var(--text-primary)] mt-2 uppercase italic">Software Architecture</h2>
               <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] font-mono text-[11px] uppercase">
                    <Users size={14} className="text-purple-500" /> Group: 310-23
                  </div>
                  <div className="flex items-center gap-2 text-[var(--text-secondary)] font-mono text-[11px] uppercase">
                    <MapPin size={14} className="text-purple-500" /> Room: 312 (E Bino)
                  </div>
               </div>
            </div>
            <button 
              onClick={() => handleStartSession(subjects[0] || {id: 101})}
              className="w-full md:w-auto bg-purple-500 hover:bg-purple-600 text-black font-black px-10 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 italic uppercase text-sm"
            >
              Davomatni boshlash <Zap size={18} fill="black" />
            </button>
         </div>
      </div>

      {/* OTHER SUBJECTS GRID */}
      <div>
        <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
          <span className="h-[1px] flex-1 bg-[var(--border-subtle)]"></span>
          Scheduled Courses
          <span className="h-[1px] flex-1 bg-[var(--border-subtle)]"></span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <button 
              key={subject.id} 
              onClick={() => handleStartSession(subject)}
              className="group p-6 border border-[var(--border-subtle)] bg-[var(--surface-card)] rounded-[32px] hover:bg-[var(--surface-elevated)] hover:border-purple-500/40 transition-all text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                <BrainCircuit className="text-purple-500" size={40} />
              </div>
              
              <h4 className="text-lg font-black text-[var(--text-primary)] uppercase italic group-hover:text-purple-400 transition-colors">{subject.name}</h4>
              <p className="text-[var(--text-secondary)] font-mono text-[10px] mt-1 uppercase tracking-tighter italic">Module: {subject.group || "310-23"}</p>
              
              <div className="mt-8 flex items-center justify-between">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">ID: {subject.id}</div>
                <div className="w-8 h-8 rounded-full border border-[var(--border-default)] flex items-center justify-center group-hover:bg-purple-500 group-hover:border-purple-500 transition-all">
                  <Zap size={14} className="text-[var(--text-secondary)] group-hover:text-black transition-colors" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;