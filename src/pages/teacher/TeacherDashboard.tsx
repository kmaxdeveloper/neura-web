import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, Zap } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import client from '../../api/client';

const TeacherDashboard: React.FC = () => {
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
        // Fallback data for testing
        setSubjects([{ id: 101, name: "Ma'lumotlar tuzilmasi", group: "912-21" }]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleStartSession = async (subject: any) => {
    try {
      const currentUser = user as any; 
      const payload = {
        subjectId: Number(subject.id),
        groupIds: [Number(subject.groupId || 1)],
        teacherId: Number(currentUser?.id || 0),
        teacherUsername: currentUser?.username || ""
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

  if (loading) return <div className="p-10 text-white animate-pulse uppercase font-black italic">Loading Portal...</div>;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500">
      <h1 className="text-4xl font-black text-white uppercase italic">
        Teacher <span className="text-purple-500">Portal</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <button 
            key={subject.id} 
            onClick={() => handleStartSession(subject)}
            className="group p-8 border border-white/5 bg-white/[0.02] rounded-[40px] hover:border-purple-500/40 transition-all block relative overflow-hidden text-left w-full"
          >
            <BrainCircuit className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
            <h2 className="text-2xl font-bold text-white uppercase italic">{subject.name}</h2>
            <p className="text-slate-500 font-mono text-xs mt-2 uppercase tracking-tighter">Subject ID: {subject.id}</p>
            <div className="mt-6 flex items-center gap-2 text-xs font-black text-purple-500 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
              START SESSION <Zap size={14} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboard;