import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Zap, Clock, BookOpen 
} from 'lucide-react';
import client from '../../api/client';
import { AuthContext } from '../../context/AuthContext';
import ServerTime from '../../components/ServerTime';

const TeacherSyllabus: React.FC = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const [subject, setSubject] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fanning nomi va mavzularini olish
        const [subRes, topicsRes] = await Promise.all([
          client.get('/api/v1/teacher/get-subjects'), // Barcha fanlardan qidiramiz
          client.get(`/api/v1/teacher/subjects/${subjectId}/topics`)
        ]);
        
        const currentSub = subRes.data.find((s: any) => s.id === Number(subjectId));
        setSubject(currentSub || { name: "Software Architecture", id: subjectId });
        setTopics(Array.isArray(topicsRes.data) ? topicsRes.data : []);
      } catch (err) {
        console.error("Syllabus fetch error:", err);
        // Fallback
        setTopics([
          { id: 1, title: "1-mavzu: Kirish va asosiy tushunchalar", description: "Tizim arxitekturasining asoslari va rivojlanish tarixi." },
          { id: 2, title: "2-mavzu: Arxitektura uslublari", description: "Monolit, Microservices va Serverless uslublari tahlili." },
          { id: 3, title: "3-mavzu: Dizayn printsiplari", description: "SOLID, DRY va KISS printsiplari." }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [subjectId]);

  const handleStartLesson = async (topicId: number) => {
    try {
      const currentUser = user as any; 
      const payload = {
        subjectId: Number(subjectId),
        teacherUsername: currentUser?.username,
        groupIds: [1], // Default group
        lessonType: "PRACTICE",
        topicId: topicId
      };

      const res = await client.post('/api/v1/teacher/lessons/start', payload);
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
        <p className="text-purple-500 font-black italic tracking-widest animate-pulse">LOADING SYLLABUS...</p>
      </div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 space-y-10 pb-10 max-w-5xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/teacher/dashboard')}
            className="flex items-center gap-2 text-purple-500 font-black uppercase italic text-xs hover:text-purple-400 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div>
            <p className="text-purple-400 font-mono text-[10px] tracking-[0.3em] uppercase mb-2">Subject Syllabus & Curriculum</p>
            <h1 className="text-5xl font-black text-[var(--text-primary)] uppercase italic leading-none tracking-tighter">
              {subject?.name} <span className="text-purple-500">Topics</span>
            </h1>
          </div>
        </div>
        <ServerTime />
      </div>

        <div className="space-y-4">
          {topics.length === 0 ? (
            <div className="py-20 text-center text-[var(--text-muted)] italic border-2 border-dashed border-[var(--border-subtle)] rounded-[40px]">
              Ushbu fan uchun mavzular topilmadi.
            </div>
          ) : (
            topics.map((topic, index) => (
              <div 
                key={topic.id} 
                className="group relative bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[24px] hover:border-purple-500/30 transition-all shadow-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-stretch min-h-[100px]">
                  {/* Sequence Number */}
                  <div className="w-16 bg-white/[0.02] border-r border-white/5 flex items-center justify-center group-hover:bg-purple-500/5 transition-colors">
                    <span className="text-xl font-black text-purple-500/40 italic">{(index + 1).toString().padStart(2, '0')}</span>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 p-6 pr-40">
                    <div className="flex items-center gap-2 mb-1">
                       <Clock size={12} className="text-purple-500/60" />
                       <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-widest">Duration: 80 min</span>
                    </div>
                    <h3 className="text-xl font-black text-[var(--text-primary)] uppercase italic leading-tight group-hover:text-purple-400 transition-colors">
                       {topic.title}
                    </h3>
                    {topic.description && (
                       <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
                         {topic.description}
                       </p>
                    )}
                  </div>

                  {/* Docked Button on the Edge */}
                  <button 
                    onClick={() => handleStartLesson(topic.id)}
                    className="absolute right-0 top-0 bottom-0 w-32 bg-purple-500 hover:bg-purple-400 text-black flex flex-col items-center justify-center gap-2 transition-all group-hover:w-36 active:scale-95"
                  >
                    <Zap size={20} fill="black" className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase italic tracking-tighter">Davomatni<br/>Boshlash</span>
                  </button>
                </div>

                {/* Decorative background element */}
                <div className="absolute -top-10 -left-10 w-20 h-20 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-all"></div>
              </div>
            ))
          )}
        </div>

      {/* FOOTER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
         {[
           { label: "Total Topics", value: topics.length, icon: BookOpen },
           { label: "Completed", value: "0", icon: CheckCircleIcon },
           { label: "Hours Remaining", value: topics.length * 2, icon: Clock }
         ].map((stat, i) => (
           <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between">
              <div>
                 <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</p>
                 <p className="text-2xl font-black text-[var(--text-primary)] italic">{stat.value}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                 <stat.icon size={20} className="text-purple-500" />
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

// Simple icon mapping since Lucide might not have CheckCircleIcon directly in the same way
const CheckCircleIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default TeacherSyllabus;
