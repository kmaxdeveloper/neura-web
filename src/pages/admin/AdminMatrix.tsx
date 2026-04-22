import React, { useState, useEffect, useMemo } from 'react';
import { Zap, Loader2, Users, UserCheck, CalendarDays, ChevronDown, Search, CheckCircle, AlertCircle } from 'lucide-react';
import client from '../../api/client';

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
        // Default to first item (index 0)
        if (formatted.length > 0) {
          setSelectedItem(formatted[0]);
        }
      } catch (err) { console.error(err); } finally { setListLoading(false); }
    };
    fetchBaseList();
  }, [viewMode]);

  // Automatically fetch schedule when selectedItem changes
  useEffect(() => {
    if (selectedItem) {
      fetchSchedule(selectedItem.id);
    }
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
      const lessonData = res.data.data || [];
      if (Array.isArray(lessonData)) {
        setSchedule(lessonData);
      }
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
            setStatus('COMPLETED'); 
            setLoading(false); 
            setJobId(null);
            setSuccessMsg("Matrix generatsiya qilindi!");
            setTimeout(() => { setSuccessMsg(null); setStatus(null); }, 4000);
          }
          else if (data.status === 'FAILED') { 
            setStatus('FAILED'); 
            setErrorMsg(data.message); 
            setLoading(false); 
            setJobId(null); 
          }
        } catch (err) { console.error(err); }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [jobId, status]);

  const handleGenerate = async () => {
    if (!window.confirm("Yangi jadval hisoblansinmi?")) return;
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
      setStatus('STOPPED');
      setLoading(false);
      setJobId(null);
      setErrorMsg("Matrix generatsiya to'xtatildi");
      setTimeout(() => { setErrorMsg(null); setStatus(null); }, 4000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const filteredList = useMemo(() => {
    return dataList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [dataList, searchTerm]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 text-white relative">
      
      {/* SUCCESS TOAST */}
      {successMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-10">
          <div className="bg-cyan-500 text-black px-8 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
            <CheckCircle size={20} className="animate-pulse flex-shrink-0" />
            <span className="font-semibold text-sm">{successMsg}</span>
          </div>
        </div>
      )}

      {/* ERROR TOAST */}
      {errorMsg && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-10">
          <div className="bg-red-500 text-white px-8 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-red-400/30">
            <AlertCircle size={20} className="animate-pulse flex-shrink-0" />
            <span className="font-semibold text-sm">{errorMsg}</span>
          </div>
        </div>
      )}

      {/* Header (Medium size) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500 rounded-xl shadow-lg shadow-cyan-500/20">
            <Zap size={20} className="text-black fill-current" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Matrix <span className="text-cyan-500">Engine</span>
          </h1>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleGenerate} 
            disabled={loading} 
            className="px-8 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-cyan-500 transition-all flex items-center gap-3 text-sm disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Zap size={16} />}
            {loading ? "Optimizing..." : "Generate Matrix"}
          </button>
          {loading && (
            <button
              onClick={handleStop}
              className="px-8 py-3.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center gap-3 text-sm shadow-lg shadow-red-500/20"
            >
              To'xtat
            </button>
          )}
        </div>
      </div>

      {/* Solving Status (Medium) */}
      {status === 'SOLVING' && (
        <div className="p-6 border border-cyan-500/20 bg-cyan-500/5 rounded-3xl backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Loader2 className="text-cyan-500 animate-spin" size={32} />
            <div>
              <h3 className="text-lg font-bold">Processing...</h3>
              <p className="text-cyan-400/60 text-sm">Analyzing constraints</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="px-5 py-2 bg-black/40 border border-red-500/20 rounded-xl text-center">
              <p className="text-xs text-red-500 font-semibold">Hard Constraints</p>
              <p className="text-xl font-bold text-red-500">{scores.hard}</p>
            </div>
            <div className="px-5 py-2 bg-black/40 border border-yellow-500/20 rounded-xl text-center">
              <p className="text-xs text-yellow-500 font-semibold">Soft Constraints</p>
              <p className="text-xl font-bold text-yellow-500">{scores.soft}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Interface */}
      <div className="bg-[#0c0c0c] border border-white/5 p-6 rounded-[40px] shadow-xl space-y-8">
        
        {/* Controls (Medium) */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="flex p-1 bg-black/40 rounded-xl border border-white/5">
            <button onClick={() => { setViewMode('group'); setSelectedItem(null); setSchedule([]); }} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'group' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}><Users size={14} /> Guruhlar</button>
            <button onClick={() => { setViewMode('teacher'); setSelectedItem(null); setSchedule([]); }} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${viewMode === 'teacher' ? 'bg-white text-black' : 'text-slate-500 hover:text-white'}`}><UserCheck size={14} /> Ustozlar</button>
          </div>

          <div className="relative flex-1">
            <button onClick={() => setIsSpinnerOpen(!isSpinnerOpen)} className="w-full bg-white/[0.02] border border-white/10 p-3.5 px-6 rounded-2xl flex items-center justify-between text-white font-bold text-sm hover:border-cyan-500/30 transition-all">
              <span className={selectedItem ? "text-white" : "text-slate-600"}>{selectedItem ? selectedItem.name : "Tanlang..."}</span>
              <ChevronDown className={`transition-transform duration-300 ${isSpinnerOpen ? 'rotate-180' : ''}`} size={18} />
            </button>
            {isSpinnerOpen && (
              <div className="absolute top-[110%] left-0 w-full bg-[#0f0f0f] border border-white/10 rounded-2xl z-[100] shadow-2xl overflow-hidden">
                <div className="p-3 border-b border-white/5 bg-white/5 relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                  <input autoFocus placeholder="Qidiruv..." className="w-full bg-black/40 border border-white/5 p-2.5 pl-10 rounded-xl text-sm outline-none text-white font-semibold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {listLoading ? <div className="p-6 text-center"><Loader2 className="animate-spin inline text-cyan-500" /></div> : filteredList.map(item => (
                    <button key={item.id} onClick={() => { setSelectedItem(item); fetchSchedule(item.id); }} className="w-full text-left px-6 py-3.5 text-sm font-semibold hover:bg-cyan-500 hover:text-black transition-all border-b border-white/[0.02] text-slate-300">{item.name}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => selectedItem && fetchSchedule(selectedItem.id)} disabled={viewLoading || !selectedItem} className="px-8 py-3.5 bg-cyan-500 text-black rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-cyan-400 active:scale-95 transition-all disabled:opacity-30 shadow-lg shadow-cyan-500/10">
            {viewLoading ? <Loader2 className="animate-spin" size={16} /> : <CalendarDays size={16} />} Yangilash
          </button>
        </div>

        {/* Schedule Grid (Medium format) */}
        <div className="overflow-x-auto custom-scrollbar rounded-3xl border border-white/5 bg-black/10">
          <div className="min-w-[1200px] p-6">
            {/* Header: Days */}
            <div className="grid grid-cols-7 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl py-3.5 flex items-center justify-center border border-white/5">
                <span className="text-xs font-bold text-cyan-500">PARA</span>
              </div>
              {Object.keys(dayMapping).map((key) => (
                <div key={key} className="bg-white/5 rounded-xl py-3.5 text-center border border-white/5">
                  <span className="text-xs font-bold text-slate-400">{dayMapping[key]}</span>
                </div>
              ))}
            </div>

            {/* Rows: Pair Numbers */}
            {pairNumbers.map((pNum) => (
              <div key={pNum} className="grid grid-cols-7 gap-4 mb-4 items-stretch">
                {/* Pair indicator */}
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-center justify-center p-3">
                  <span className="text-xl font-bold text-white">{pNum}</span>
                  <span className="text-xs text-slate-600 font-semibold">Slot</span>
                </div>

                {/* Days columns */}
                {Object.keys(dayMapping).map((dayKey) => {
                  const lesson = schedule.find(s => s.day?.toUpperCase() === dayKey && s.pairNumber === pNum);
                  return (
                    <div key={`${dayKey}-${pNum}`} className="h-full min-h-[120px]">
                      {lesson ? (
                        <div className="h-full group p-4 bg-white/[0.03] border border-white/5 rounded-[24px] hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <div className="px-3 py-1 bg-cyan-500 text-black text-xs font-bold rounded-full whitespace-nowrap">{lesson.room}</div>
                              <span className="text-xs text-slate-500 font-semibold">{lesson.building}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                              {lesson.subject}
                            </h4>
                          </div>
                          <div className="mt-3 pt-2 border-t border-white/5 space-y-1">
                            <p className="text-xs text-slate-400 truncate flex items-center gap-2">
                              <span>👤</span> {lesson.teacher}
                            </p>
                            <p className="text-xs text-slate-500 truncate flex items-center gap-2">
                              <span>👥</span> {lesson.groups.join(', ')}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full border border-dashed border-white/[0.04] rounded-[24px] flex flex-col items-center justify-center gap-2 p-2">
                          <span className="text-2xl">−</span>
                          <span className="text-xs text-slate-700 text-center">No Lesson</span>
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
    </div>
  );
};

export default AdminMatrix;