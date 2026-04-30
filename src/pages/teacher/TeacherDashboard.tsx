import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Zap, Users, MapPin, ChevronRight, BookOpen, Award } from 'lucide-react';

import client from '../../api/client';
import ServerTime from '../../components/ServerTime';
import { useLanguage } from '../../context/LanguageContext';

const TeacherDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [todayLessons, setTodayLessons] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, todayRes, profileRes] = await Promise.all([
          client.get('/api/v1/teacher/get-subjects'),
          client.get('/api/v1/teacher/lessons/today'),
          client.get('/api/v1/teacher/profile')
        ]);
        setSubjects(Array.isArray(subRes.data) ? subRes.data : []);
        setTodayLessons(Array.isArray(todayRes.data) ? todayRes.data : []);
        setProfile(profileRes.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        // Fallback test ma'lumotlari
        setSubjects([{ id: 101, name: "Dasturiy ta'minot arxitekturasi", group: "941-21", room: "412-xona", time: "09:00" }]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const navigateToSyllabus = (subject: any) => {
    navigate(`/teacher/syllabus/${subject.id}`);
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
          <h1 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] uppercase italic leading-none tracking-tighter">
            {t('groups').replace('im', '').replace('My ', '')}  <span className="text-purple-500">{t('dashboard')}</span>
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 md:gap-4 items-center">
          <ServerTime />
          <div className="px-3 py-1.5 md:px-5 md:py-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
            <Award className="text-purple-500" size={16} />
            <div>
              <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest leading-none">Authority</p>
              <p className="text-xs md:text-sm font-black text-purple-500 italic leading-none mt-1">{profile?.irisLevelName || `LVL ${profile?.irisLevel || 1}`}</p>
            </div>
          </div>
          <div className="px-3 py-1.5 md:px-5 md:py-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3">
            <Zap className="text-purple-500" size={16} />
            <div>
              <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest leading-none">Points</p>
              <p className="text-xs md:text-sm font-black text-purple-500 italic leading-none mt-1">{typeof profile?.points === 'number' ? profile.points.toFixed(1) : (profile?.points || '0')} IRIS</p>
            </div>
          </div>
        </div>
      </div>

      {/* MATRIX SUGGESTION (Aynan hozirgi dars uchun UI) */}
      <div className="relative group">
         <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
         <div className="relative bg-[var(--surface-card)] border border-[var(--border-default)] rounded-[30px] md:rounded-[40px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
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
              onClick={() => navigateToSyllabus(subjects[0] || {id: 101})}
              className="w-full md:w-auto bg-purple-500 hover:bg-purple-600 text-black font-black px-10 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 italic uppercase text-sm"
            >
              Mavzuni tanlash <Zap size={18} fill="black" />
            </button>
         </div>
      </div>

      {/* TODAY'S LESSONS GRID */}
      <div>
        <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
          <span className="h-[1px] flex-1 bg-[var(--border-subtle)]"></span>
          BUGUNGI DARSLAR (SCHEDULE)
          <span className="h-[1px] flex-1 bg-[var(--border-subtle)]"></span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {todayLessons.length === 0 ? (
            <div className="col-span-full py-10 text-center text-[var(--text-muted)] italic border-2 border-dashed border-[var(--border-subtle)] rounded-[40px]">
              Bugun uchun darslar topilmadi.
            </div>
          ) : (
            todayLessons.map((lesson) => (
              <div 
                key={lesson.id} 
                className={`group p-6 border border-[var(--border-subtle)] bg-[var(--surface-card)] rounded-[32px] transition-all text-left relative overflow-hidden ${lesson.canStart ? 'hover:border-purple-500/40' : 'opacity-60 cursor-not-allowed'}`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                  <BrainCircuit className={lesson.canStart ? "text-purple-500" : "text-gray-500"} size={40} />
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${lesson.canStart ? 'bg-emerald-500 text-black animate-pulse' : 'bg-gray-700 text-gray-400'}`}>
                    {lesson.canStart ? 'ACTIVE NOW' : 'WAITING'}
                  </span>
                  <span className="text-[8px] font-mono text-[var(--text-muted)] uppercase">{lesson.startTime} - {lesson.endTime}</span>
                </div>

                <h4 className="text-lg font-black text-[var(--text-primary)] uppercase italic group-hover:text-purple-400 transition-colors">{lesson.subjectName}</h4>
                <p className="text-[var(--text-secondary)] font-mono text-[10px] mt-1 uppercase tracking-tighter italic">Groups: {lesson.groupName} | Room: {lesson.room}</p>
                
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">ID: {lesson.id}</div>
                  {lesson.canStart ? (
                    <button 
                      onClick={() => navigateToSyllabus({id: lesson.subjectId})}
                      className="px-6 py-2.5 bg-purple-500 text-black font-black text-[10px] uppercase italic rounded-xl flex items-center gap-2 hover:bg-purple-400 transition-all hover:scale-105 active:scale-95"
                    >
                      Darsni Boshlash <Zap size={14} fill="black" />
                    </button>
                  ) : (
                    <div className="w-8 h-8 rounded-full border border-[var(--border-default)] flex items-center justify-center">
                      <MapPin size={14} className="text-[var(--text-muted)]" />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ALL SUBJECTS SECTION */}
      <div>
        <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
          <span className="h-[1px] flex-1 bg-[var(--border-subtle)]"></span>
          BARCHA FANLARIM (MY COURSES)
          <span className="h-[1px] flex-1 bg-[var(--border-subtle)]"></span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => (
            <button 
              key={subject.id} 
              onClick={() => navigateToSyllabus(subject)}
              className="group p-6 border border-[var(--border-subtle)] bg-[var(--surface-card)] rounded-[32px] hover:border-purple-500/40 transition-all text-left relative overflow-hidden"
            >
              <div className="absolute -bottom-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <BookOpen size={80} className="text-purple-500" />
              </div>
              
              <h4 className="text-md font-black text-[var(--text-primary)] uppercase italic group-hover:text-purple-400 transition-colors leading-tight">{subject.name}</h4>
              
              <div className="mt-6 flex items-center justify-between">
                <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">View Syllabus</div>
                <div className="w-8 h-8 rounded-full border border-[var(--border-default)] flex items-center justify-center group-hover:bg-purple-500 group-hover:border-purple-500 transition-all">
                  <ChevronRight size={14} className="text-[var(--text-secondary)] group-hover:text-black transition-colors" />
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