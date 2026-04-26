import React, { useState, useEffect, useMemo } from 'react';
import { 
  Zap, Loader2, Users, UserCheck, ChevronDown, 
  Search, CheckCircle, AlertCircle, Settings, Play, Square, 
  Activity, Filter, Layout
} from 'lucide-react';
import client from '../../api/client';
import ServerTime from '../../components/ServerTime';
import { useLanguage } from '../../context/LanguageContext';

// Interfaces
interface Lesson {
  lessonId: number;
  subject: string;
  teacher: string;
  day: string;
  pairNumber: number;
  room: string;
  building: string;
  groups: string[];
}

interface ListItem {
  id: number;
  name: string;
}

const AdminMatrix: React.FC = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<'SOLVING' | 'COMPLETED' | 'FAILED' | 'STOPPED' | null>(null);
  const [scores, setScores] = useState({ hard: 0, soft: 0 });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [viewLoading, setViewLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [schedule, setSchedule] = useState<Lesson[]>([]);
  const [viewMode, setViewMode] = useState<'group' | 'teacher'>('group');
  
  const [isSpinnerOpen, setIsSpinnerOpen] = useState(false);
  const [dataList, setDataList] = useState<ListItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const dayMapping: Record<string, string> = {
    'MONDAY': 'DUSHANBA', 'TUESDAY': 'SESHANBA', 'WEDNESDAY': 'CHORSHANBA',
    'THURSDAY': 'PAYSHANBA', 'FRIDAY': 'JUMA', 'SATURDAY': 'SHANBA'
  };

  const pairNumbers = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    const fetchBaseList = async () => {
      setListLoading(true);
      try {
        const endpoint = viewMode === 'group' ? '/api/v1/admin/get-groups' : '/api/v1/admin/get-teachers';
        const res = await client.get(endpoint);
        const rawData = res.data.data || res.data;
        const formatted = rawData.map((item: any) => ({
          id: item.id,
          name: viewMode === 'group' ? item.name : (item.fullName || item.name)
        }));
        setDataList(formatted);
        if (formatted.length > 0) setSelectedItem(formatted[0]);
      } catch (err) { console.error(err); } finally { setListLoading(false); }
    };
    fetchBaseList();
  }, [viewMode]);

  useEffect(() => {
    if (selectedItem) fetchSchedule(selectedItem.id);
  }, [selectedItem]);

  const fetchSchedule = async (id: number) => {
    if (!id) return;
    setViewLoading(true);
    setIsSpinnerOpen(false); 
    setSchedule([]); 
    try {
      const url = viewMode === 'group' 
        ? `/api/v1/admin/matrix/timetable/group/${id}`
        : `/api/v1/admin/matrix/timetable/teacher/${id}`;
      const res = await client.get(url);
      setSchedule(res.data.data || []);
    } catch (err: any) { console.error(err); } finally { setViewLoading(false); }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobId && status === 'SOLVING') {
      interval = setInterval(async () => {
        try {
          const res = await client.get(`/api/v1/admin/matrix/status/${jobId}`);
          const data = res.data.data;
          setScores({ hard: data.hardScore, soft: data.softScore });
          if (data.status === 'COMPLETED') { 
            setStatus('COMPLETED'); setLoading(false); setJobId(null);
            setSuccessMsg("Optimizatsiya muvaffaqiyatli yakunlandi!");
            setTimeout(() => { setSuccessMsg(null); setStatus(null); }, 4000);
          } else if (data.status === 'FAILED') { 
            setStatus('FAILED'); setErrorMsg(data.message); setLoading(false); setJobId(null); 
          }
        } catch (err) { console.error(err); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleGenerate = async () => {
    setLoading(true); setStatus('SOLVING'); setErrorMsg(null); setSuccessMsg(null);
    try {
      const res = await client.post('/api/v1/admin/matrix/solve?semester=3'); 
      setJobId(res.data.data.jobId);
    } catch (err: any) { setLoading(false); setStatus(null); }
  };

  const handleStop = async () => {
    if (!jobId) return;
    try {
      await client.post(`/api/v1/admin/matrix/stop/${jobId}`);
      setStatus('STOPPED'); setLoading(false); setJobId(null);
      setErrorMsg("Algoritm to'xtatildi");
      setTimeout(() => { setErrorMsg(null); setStatus(null); }, 4000);
    } catch (err: any) { console.error(err); }
  };

  const filteredList = useMemo(() => {
    return dataList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [dataList, searchTerm]);

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-10">
      
      {/* 1. Header with Solver Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-cyan-500/10 rounded-[32px] border border-cyan-500/20 text-cyan-500 relative">
            <Zap size={32} />
            {status === 'SOLVING' && <div className="absolute inset-0 bg-cyan-500/20 rounded-[32px] animate-ping" />}
          </div>
          <div>
            <h1 className="text-4xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">{t('matrix').split(' ')[0]} <span className="text-cyan-500">{t('matrix').split(' ')[1] || 'Solver'}</span></h1>
            <p className="text-[var(--text-secondary)] font-mono text-[10px] uppercase tracking-[0.4em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> {t('data_active')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ServerTime />
          <button className="p-4 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-2xl text-[var(--text-secondary)] hover:text-cyan-500 transition-all">
            <Settings size={20} />
          </button>
          
          {status === 'SOLVING' ? (
            <button onClick={handleStop} disabled={loading} className="flex items-center gap-3 px-8 py-4 bg-rose-500 text-black font-black text-xs uppercase tracking-widest italic rounded-2xl shadow-xl shadow-rose-500/20 hover:bg-rose-400 transition-all active:scale-95 disabled:opacity-50">
              <Square size={16} fill="black" /> Stop Algorithm
            </button>
          ) : (
            <button onClick={handleGenerate} disabled={loading} className="flex items-center gap-3 px-8 py-4 bg-cyan-500 text-black font-black text-xs uppercase tracking-widest italic rounded-2xl shadow-xl shadow-cyan-500/20 hover:bg-cyan-400 transition-all active:scale-95 disabled:opacity-50">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} fill="black" />} Run Optimization
            </button>
          )}
        </div>
      </div>

      {/* 2. Solving Monitor (Shown only when solving) */}
      {status === 'SOLVING' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-4 duration-500">
          <div className="p-8 border border-cyan-500/30 bg-cyan-500/[0.03] rounded-[40px] md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] uppercase italic">Solver Active</h3>
                <p className="text-[var(--text-secondary)] text-xs font-mono">Job ID: {jobId?.substring(0, 8)}...</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-4 bg-black/20 border border-rose-500/30 rounded-2xl text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 mb-1">Hard Constraints</p>
                <p className="text-2xl font-black text-rose-500 font-mono">{scores.hard}</p>
              </div>
              <div className="px-6 py-4 bg-black/20 border border-amber-500/30 rounded-2xl text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-500 mb-1">Soft Constraints</p>
                <p className="text-2xl font-black text-amber-500 font-mono">{scores.soft}</p>
              </div>
            </div>
          </div>
          <div className="p-8 border border-[var(--border-subtle)] bg-[var(--surface-card)] rounded-[40px] flex flex-col justify-center">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-black uppercase text-[var(--text-secondary)]">Search Progress</span>
              <Activity size={14} className="text-cyan-500" />
            </div>
            <div className="h-2 w-full bg-[var(--surface-hover)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
               <div className="h-full bg-cyan-500 w-[65%] animate-pulse" />
            </div>
            <p className="mt-3 text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-tighter text-right">Iteration: 4.2k/s</p>
          </div>
        </div>
      )}

      {/* 3. Main Interface Section */}
      <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] p-2 rounded-[48px] shadow-2xl relative overflow-hidden transition-all duration-500">
        
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-center gap-3 p-4 bg-[var(--surface-elevated)] rounded-[40px] border border-[var(--border-subtle)] mb-2">
          <div className="flex p-1.5 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border-subtle)] w-full lg:w-auto">
            <button 
              onClick={() => { setViewMode('group'); setSelectedItem(null); setSchedule([]); }} 
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'group' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            >
              <Users size={16} /> Groups
            </button>
            <button 
              onClick={() => { setViewMode('teacher'); setSelectedItem(null); setSchedule([]); }} 
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'teacher' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}
            >
              <UserCheck size={16} /> Teachers
            </button>
          </div>

          <div className="relative flex-1 w-full lg:w-auto">
            <button 
              onClick={() => setIsSpinnerOpen(!isSpinnerOpen)} 
              className="w-full bg-[var(--surface-input)] border border-[var(--border-subtle)] p-4 px-8 rounded-2xl flex items-center justify-between text-[var(--text-primary)] font-bold text-sm hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Search size={16} className="text-[var(--text-muted)] group-hover:text-cyan-500 transition-colors" />
                <span className={selectedItem ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}>
                  {selectedItem ? selectedItem.name : "Select Target Resources..."}
                </span>
              </div>
              <ChevronDown className={`transition-transform duration-300 ${isSpinnerOpen ? 'rotate-180' : ''} text-[var(--text-muted)]`} size={20} />
            </button>
            
            {isSpinnerOpen && (
              <div className="absolute top-[115%] left-0 w-full bg-[var(--surface-overlay)] border border-[var(--border-default)] rounded-3xl z-[100] shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300 backdrop-blur-xl">
                <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--surface-elevated)]">
                  <input autoFocus placeholder="Qidiruv..." className="w-full bg-[var(--surface-input)] border border-[var(--border-subtle)] p-3.5 px-6 rounded-xl text-sm outline-none text-[var(--text-primary)] font-semibold placeholder-[var(--text-muted)]" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="max-h-72 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {listLoading ? (
                    <div className="p-10 text-center flex flex-col items-center gap-4">
                      <Loader2 className="animate-spin text-cyan-500" size={32} />
                      <span className="text-[10px] font-black uppercase text-cyan-500">Loading Base Data</span>
                    </div>
                  ) : filteredList.map(item => (
                    <button key={item.id} onClick={() => { setSelectedItem(item); fetchSchedule(item.id); }} className="w-full text-left px-6 py-4 text-sm font-bold hover:bg-cyan-500 hover:text-black transition-all rounded-xl border-b border-transparent text-[var(--text-secondary)] flex items-center justify-between group">
                      {item.name}
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 w-full lg:w-auto">
            <button onClick={() => selectedItem && fetchSchedule(selectedItem.id)} disabled={viewLoading || !selectedItem} className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all disabled:opacity-30">
              {viewLoading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCcw size={16} />} Refresh
            </button>
            <button className="p-4 bg-[var(--surface-elevated)] border border-[var(--border-subtle)] rounded-2xl text-[var(--text-secondary)] hover:text-cyan-500 transition-all">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Matrix Grid Container */}
        <div className="p-4">
          <div className="overflow-x-auto custom-scrollbar rounded-[32px] border border-[var(--border-subtle)] bg-[var(--surface-elevated)]/50">
            <div className="min-w-[1100px] p-6">
              
              {/* Grid Header (Days) */}
              <div className="grid grid-cols-7 gap-4 mb-6">
                <div className="bg-[var(--surface-hover)] rounded-2xl py-4 flex items-center justify-center border border-[var(--border-subtle)] shadow-sm">
                  <span className="text-[10px] font-black text-cyan-500 tracking-[0.2em]">SLOT</span>
                </div>
                {Object.keys(dayMapping).map((key) => (
                  <div key={key} className="bg-[var(--surface-hover)] rounded-2xl py-4 text-center border border-[var(--border-subtle)] shadow-sm group">
                    <span className="text-[10px] font-black text-[var(--text-secondary)] group-hover:text-cyan-500 transition-colors tracking-[0.2em]">{dayMapping[key]}</span>
                  </div>
                ))}
              </div>

              {/* Grid Rows (Pairs) */}
              {pairNumbers.map((pNum) => (
                <div key={pNum} className="grid grid-cols-7 gap-4 mb-4 items-stretch">
                  
                  {/* Pair indicator with Time */}
                  <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-3xl flex flex-col items-center justify-center p-4 shadow-inner">
                    <span className="text-3xl font-black text-[var(--text-primary)] italic leading-none">{pNum}</span>
                    <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-2">{pNum === 1 ? '08:30' : pNum === 2 ? '10:00' : pNum === 3 ? '11:30' : '13:30'}</span>
                  </div>

                  {/* Day Slots */}
                  {Object.keys(dayMapping).map((dayKey) => {
                    const lesson = schedule.find(s => s.day?.toUpperCase() === dayKey && s.pairNumber === pNum);
                    return (
                      <div key={`${dayKey}-${pNum}`} className="h-full min-h-[140px]">
                        {lesson ? (
                          <div className="h-full group p-5 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[32px] hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 transition-all flex flex-col justify-between relative overflow-hidden">
                            {/* Decorative background accent */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full -mr-8 -mt-8 group-hover:bg-cyan-500/10 transition-colors" />
                            
                            <div className="space-y-3 relative z-10">
                              <div className="flex justify-between items-center">
                                <div className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] font-black rounded-lg">
                                  {lesson.room}
                                </div>
                                <div className="text-[9px] font-bold text-[var(--text-muted)] uppercase italic">{lesson.building}</div>
                              </div>
                              <h4 className="text-sm font-black text-[var(--text-primary)] leading-tight group-hover:text-cyan-500 transition-colors line-clamp-2">
                                {lesson.subject}
                              </h4>
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] space-y-1.5 relative z-10">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)]">
                                <div className="w-5 h-5 rounded-md bg-[var(--surface-hover)] flex items-center justify-center text-[8px] border border-[var(--border-subtle)] text-cyan-500">👤</div>
                                <span className="truncate">{lesson.teacher}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-muted)]">
                                <div className="w-5 h-5 rounded-md bg-[var(--surface-hover)] flex items-center justify-center text-[8px] border border-[var(--border-subtle)]">👥</div>
                                <span className="truncate">{lesson.groups.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full border-2 border-dashed border-[var(--border-subtle)] rounded-[32px] flex flex-col items-center justify-center gap-3 p-4 opacity-40 hover:opacity-100 hover:border-cyan-500/20 hover:bg-cyan-500/[0.02] transition-all">
                            <div className="w-8 h-8 rounded-xl bg-[var(--surface-hover)] flex items-center justify-center text-[var(--text-muted)]">
                              <Layout size={16} />
                            </div>
                            <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest">Empty Slot</span>
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

        {/* Success/Error Toasts (Updated designs) */}
        {successMsg && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10">
            <div className="bg-[var(--surface-overlay)] text-[var(--text-primary)] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-emerald-500/30 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-emerald-500">Success</p>
                <p className="font-bold text-sm">{successMsg}</p>
              </div>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10">
            <div className="bg-[var(--surface-overlay)] text-[var(--text-primary)] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-rose-500/30 backdrop-blur-xl">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-rose-500">Alert</p>
                <p className="font-bold text-sm">{errorMsg}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-center gap-6 text-[var(--text-muted)] text-[9px] font-mono uppercase tracking-[0.4em] pt-4">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full shadow-[0_0_8px_cyan]" />
           Quantum Engine Linked
        </div>
        <div className="w-1 h-1 bg-[var(--border-subtle)] rounded-full" />
        Last Optim: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

// Internal components
const ArrowRight = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
);

const RefreshCcw = ({ size, className }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 16h5v5" />
  </svg>
);

export default AdminMatrix;