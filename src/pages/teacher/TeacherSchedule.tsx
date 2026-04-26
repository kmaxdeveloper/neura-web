import { useState, useEffect, useContext } from 'react';
import { Clock, MapPin, Users, Loader2, Calendar, Shield } from 'lucide-react';
import client from '../../api/client';
import { AuthContext } from '../../context/AuthContext';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const PAIRS = [1, 2, 3, 4, 5, 6];

const TeacherSchedule = () => {
  const [schedule, setSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date()); // Jonli vaqt uchun state
  const { user } = useContext(AuthContext) || {};

  // Jonli soat mexanizmi
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user?.username) {
      setLoading(true);
      client.get(`/api/v1/teacher/timetable/${user.username}`)
        .then(res => setSchedule(res.data.data || []))
        .catch(err => console.error("Matrix Grid Error:", err))
        .finally(() => setLoading(false));
    }
  }, [user?.username]);

  const scheduleMap = schedule.reduce((acc: any, curr: any) => {
    acc[`${curr.day}-${curr.pairNumber}`] = curr;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="animate-spin text-purple-500" size={48} />
          <div className="absolute inset-0 blur-xl bg-purple-500/20 animate-pulse" />
        </div>
        <p className="text-purple-500 font-black uppercase italic tracking-[0.3em] text-[10px]">Syncing Teacher Matrix...</p>
      </div>
    );
  }

  return (
    <div className="p-3 lg:p-6 space-y-6 animate-in fade-in zoom-in duration-500 text-left">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-[var(--border-default)] pb-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">
            Instructor <span className="text-purple-500">Grid</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest mt-1 italic">Matrix Academic Management</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-purple-500/10 px-4 py-2 rounded-2xl border border-purple-500/20">
          <Shield size={16} className="text-purple-500" />
          <span className="text-[var(--text-primary)] font-black uppercase italic text-[10px]">{user?.username}</span>
        </div>
      </div>

      {/* Grid Table */}
      <div className="overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-[var(--surface-card)] backdrop-blur-xl shadow-2xl transition-colors duration-300">
        <div className="overflow-x-auto">
          <div className="min-w-[1050px]">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-[var(--border-default)] bg-[var(--surface-elevated)]">
              <div className="p-4 border-r border-[var(--border-default)] flex items-center justify-center bg-purple-500/5">
                <Calendar className="text-purple-500" size={20} />
              </div>
              {DAYS.map(day => (
                <div key={day} className="p-4 text-center border-r border-[var(--border-default)] last:border-0">
                  <span className="text-[var(--text-primary)] font-black uppercase italic tracking-widest text-[11px]">{day}</span>
                </div>
              ))}
            </div>

            {/* Rows (Pairs) */}
            {PAIRS.map(pair => (
              <div key={pair} className="grid grid-cols-7 border-b border-[var(--border-default)] last:border-0 group/row">
                <div className="p-3 border-r border-[var(--border-default)] flex flex-col items-center justify-center bg-[var(--surface-elevated)] group-hover/row:bg-purple-500/5 transition-colors">
                  <span className="text-purple-500 font-black italic text-xl leading-none">{pair}</span>
                  <span className="text-[8px] text-[var(--text-secondary)] uppercase font-black mt-1">Slot</span>
                </div>

                {DAYS.map(day => {
                  const lesson = scheduleMap[`${day}-${pair}`];
                  return (
                    <div key={`${day}-${pair}`} className="p-2 border-r border-[var(--border-default)] last:border-0 min-h-[135px] relative group/cell">
                      {lesson ? (
                        <div className="h-full w-full bg-purple-500/5 border border-purple-500/10 rounded-2xl p-3 flex flex-col justify-between hover:bg-purple-500/15 hover:border-purple-500/40 transition-all duration-300 transform group-hover/cell:-translate-y-0.5 shadow-lg hover:shadow-purple-500/5">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-purple-400">
                              <Clock size={11} />
                              <span className="text-[9px] font-mono font-black italic tracking-tighter">
                                 {lesson.startTime.substring(0,5)} — {lesson.endTime.substring(0,5)}
                              </span>
                            </div>
                            <h3 className="text-[var(--text-primary)] font-extrabold leading-tight uppercase italic text-[11px] line-clamp-2 tracking-tight">
                              {lesson.subject}
                            </h3>
                          </div>

                          <div className="space-y-2 pt-3 border-t border-[var(--border-subtle)]">
                            <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                              <Users size={11} className="text-purple-500/60" />
                              <span className="text-[9px] font-bold uppercase truncate italic">
                                {lesson.groups.length > 1 ? `${lesson.groups[0]} +` : lesson.groups[0]}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-[var(--text-secondary)] font-bold italic text-[9px]">
                                <MapPin size={11} className="text-purple-500" />
                                {lesson.room}
                              </div>
                              <span className="text-[7px] bg-[var(--surface-hover)] px-1.5 py-0.5 rounded border border-[var(--border-default)] text-[var(--text-secondary)] font-black uppercase italic">
                                {lesson.type.substring(0, 3)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full w-full border border-dashed border-[var(--border-subtle)] rounded-2xl flex items-center justify-center opacity-20 group-hover/cell:opacity-100 transition-opacity">
                            <div className="w-1 h-1 bg-[var(--text-muted)] rounded-full" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info with Live Time */}
      <div className="flex justify-between items-center px-6 py-4 bg-purple-500/5 rounded-2xl border border-purple-500/10">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="h-2 w-2 bg-purple-500 rounded-full animate-ping absolute" />
            <div className="h-2 w-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,1)]" />
          </div>
          <p className="text-[10px] text-purple-500/70 font-black uppercase italic tracking-[0.2em]">
            Neural Sync: <span className="text-[var(--text-primary)] ml-2">{currentTime.toLocaleTimeString('uz-UZ', { hour12: false })}</span>
          </p>
        </div>
        <div className="text-[9px] font-mono text-[var(--text-muted)] font-bold uppercase tracking-tighter">
          Toshkent Axborot Texnologiyalari Universiteti
        </div>
      </div>
    </div>
  );
};

export default TeacherSchedule;