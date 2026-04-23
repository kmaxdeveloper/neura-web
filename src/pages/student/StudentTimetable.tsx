import React, { useState, useEffect, useContext } from 'react';
import { Clock, MapPin, User as UserIcon, Loader2, Calendar } from 'lucide-react';
import client from '../../api/client';
import { AuthContext } from '../../context/AuthContext';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const PAIRS = [1, 2, 3, 4, 5, 6];

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext) || {};

  useEffect(() => {
    if (user?.username) {
      setLoading(true);
      client.get(`/api/v1/student/timetable/${user.username}`)
        .then(res => setTimetable(res.data.data || []))
        .catch(err => console.error("Grid Error:", err))
        .finally(() => setLoading(false));
    }
  }, [user?.username]);

  const scheduleMap = timetable.reduce((acc: any, curr: any) => {
    acc[`${curr.day}-${curr.pairNumber}`] = curr;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-emerald-500" size={36} />
        <p className="text-emerald-500 font-black uppercase italic tracking-[0.2em] text-[11px]">Syncing Matrix Grid...</p>
      </div>
    );
  }

  return (
    <div className="p-3 lg:p-6 space-y-6 animate-in fade-in duration-500 text-left">
      {/* Balanced Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-5">
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Academic <span className="text-emerald-500">Grid</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Matrix v2.0 - Personalized View</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-emerald-500 font-mono text-[11px] font-bold">SYSTEM_OPTIMIZED</p>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-hidden rounded-[24px] border border-white/5 bg-black/30 backdrop-blur-md">
        <div className="overflow-x-auto">
          <div className="min-w-[1050px]">
            
            {/* Table Head - Medium Height */}
            <div className="grid grid-cols-7 border-b border-white/10 bg-white/[0.03]">
              <div className="p-4 border-r border-white/10 flex items-center justify-center">
                <Calendar className="text-emerald-500" size={18} />
              </div>
              {DAYS.map(day => (
                <div key={day} className="p-4 text-center border-r border-white/10 last:border-0">
                  <span className="text-white font-black uppercase italic tracking-widest text-[11px]">{day}</span>
                </div>
              ))}
            </div>

            {/* Table Body */}
            {PAIRS.map(pair => (
              <div key={pair} className="grid grid-cols-7 border-b border-white/10 last:border-0 group/row">
                
                {/* Pair Column */}
                <div className="p-3 border-r border-white/10 flex flex-col items-center justify-center bg-white/[0.02] group-hover/row:bg-emerald-500/5 transition-colors">
                  <span className="text-emerald-500 font-black italic text-xl leading-none">{pair}</span>
                  <span className="text-[8px] text-slate-500 uppercase font-black mt-1">Para</span>
                </div>

                {/* Daily Slots - Medium Height (130px) */}
                {DAYS.map(day => {
                  const lesson = scheduleMap[`${day}-${pair}`];
                  return (
                    <div key={`${day}-${pair}`} className="p-2 border-r border-white/10 last:border-0 min-h-[135px] relative group/cell">
                      {lesson ? (
                        <div className="h-full w-full bg-white/[0.03] border border-white/10 rounded-2xl p-3.5 flex flex-col justify-between hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 transform hover:-translate-y-0.5">
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-emerald-500">
                              <Clock size={11} />
                              <span className="text-[10px] font-mono font-black italic tracking-tighter">
                                 {lesson.startTime.substring(0,5)} — {lesson.endTime.substring(0,5)}
                              </span>
                            </div>
                            <h3 className="text-white font-extrabold leading-tight uppercase italic text-[11px] line-clamp-2 tracking-tight group-hover/cell:text-emerald-400 transition-colors">
                              {lesson.subject}
                            </h3>
                          </div>

                          <div className="space-y-1.5 pt-3 border-t border-white/5">
                            <div className="flex items-center gap-2 text-slate-400">
                              <UserIcon size={11} className="text-emerald-500/60" />
                              <span className="text-[9px] font-bold uppercase truncate italic">{lesson.teacher}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-slate-300 font-bold italic text-[9px]">
                                <MapPin size={11} className="text-emerald-500" />
                                {lesson.room}
                              </div>
                              <span className="text-[8px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 text-emerald-500 font-black uppercase italic tracking-tighter">
                                {lesson.type}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full w-full border border-dashed border-white/[0.04] rounded-2xl flex items-center justify-center opacity-30 group-hover/cell:opacity-100 transition-opacity">
                            <div className="w-1 h-1 bg-white/10 rounded-full" />
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

      {/* Balanced Footer Status */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 bg-white/[0.02] rounded-2xl border border-white/5">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <p className="text-[10px] text-slate-400 font-black uppercase italic tracking-widest">
            Automatic Matrix Scheduling: <span className="text-emerald-500">Active</span>
          </p>
        </div>
        <p className="text-[10px] text-slate-500 font-bold italic uppercase tracking-tighter">
          {timetable.length > 0 && timetable[0].groups ? `Assigned to: ${timetable[0].groups[0]}` : 'Ready to Sync'}
        </p>
      </div>
    </div>
  );
};

export default StudentTimetable;