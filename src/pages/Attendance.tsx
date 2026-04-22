import { useEffect, useState } from 'react';
import client from '../api/client';
import { ArrowLeft, UserCheck, RefreshCw, LayoutGrid, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. Interfeys (Backend'dan keladigan aniq fieldlar bilan)
interface AttendanceRecord {
  id: number;
  studentName: string;
  studentId: string;
  groupName: string;
  subjectName: string;
  status: 'PRESENT' | 'ABSENT'; 
  createdAt: string; 
}

const Attendance = () => {
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Ma'lumot olish funksiyasi
  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await client.get('/api/v1/admin/attendance/today'); 
      setLogs(res.data);
    } catch (err) {
      setError("Backend ulanishda xato yuz berdi. Iltimos, serverni tekshiring.");
      console.error("Neura System Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-10 animate-in fade-in duration-700">
      
      {/* 1. NAVIGATION */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-cyan-500 mb-6 md:mb-10 hover:gap-4 transition-all duration-300 font-bold text-xs uppercase tracking-widest group"
      >
        <ArrowLeft size={16} /> 
        <span className="opacity-70 group-hover:opacity-100">Back to Dashboard</span>
      </Link>
      
      {/* 2. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-black flex items-center gap-4 tracking-tighter uppercase italic text-white">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
               <UserCheck className="text-cyan-500 not-italic" size={32} /> 
            </div>
            UniFace <span className="text-cyan-500/50 not-italic">Logs</span>
          </h1>
          <div className="flex items-center gap-3 mt-3">
            <div className={`w-2 h-2 rounded-full animate-pulse ${error ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em]">
              Real-time feed active • v3.0.1
            </p>
          </div>
        </div>

        <button 
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center justify-center gap-3 bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/30 px-8 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-50 group"
        >
          <RefreshCw size={16} className={`${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
          {loading ? "Syncing..." : "Refresh Logs"}
        </button>
      </div>

      {/* 3. TABLE SECTION */}
      <div className="border border-white/5 bg-white/[0.02] rounded-[35px] md:rounded-[45px] overflow-hidden backdrop-blur-3xl shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-white/[0.03] text-slate-500 text-[10px] uppercase tracking-[0.3em] font-black">
              <tr>
                <th className="p-8">Student Identity</th>
                <th className="p-8">Placement & Course</th>
                <th className="p-8 text-center">Timestamp</th>
                <th className="p-8 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {!loading && logs.length > 0 ? logs.map((log) => (
                <tr key={log.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all duration-300 group">
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-black shadow-inner">
                        {log.studentName?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-white text-base tracking-tight">{log.studentName}</div>
                        <div className="text-[10px] font-mono text-cyan-500/50 uppercase mt-1">UUID: {log.studentId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-200 font-bold uppercase text-xs">
                        <LayoutGrid size={14} className="text-cyan-500" /> {log.groupName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono tracking-wider">{log.subjectName}</div>
                    </div>
                  </td>
                  <td className="p-8 text-center">
                    <div className="font-mono text-white font-bold text-base">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <div className="text-[9px] text-slate-600 uppercase mt-1">{new Date(log.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="p-8 text-right">
                    <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      log.status === 'PRESENT' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]' 
                      : 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.05)]'
                    }`}>
                      {log.status === 'PRESENT' ? 'Verified' : 'Absent'}
                    </span>
                  </td>
                </tr>
              )) : null}

              {/* EMPTY / LOADING / ERROR STATES */}
              {(loading || logs.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      {loading ? (
                        <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                      ) : error ? (
                        <AlertCircle className="text-red-500" size={48} />
                      ) : (
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                          <UserCheck className="text-slate-700" size={32} />
                        </div>
                      )}
                      <div className="space-y-2">
                        <p className="text-white font-black uppercase tracking-widest text-sm">
                          {loading ? "Scanning Database..." : error ? "Connection Failed" : "No Activity Detected"}
                        </p>
                        <p className="text-slate-600 text-[10px] font-mono uppercase max-w-xs mx-auto">
                          {error || "There are no biometric logs recorded for the current session."}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. FOOTER */}
      <div className="mt-10 flex justify-between items-center text-slate-700 text-[9px] font-mono uppercase tracking-[0.3em]">
        <p>Neura Biometric Engine // Access Restricted</p>
        <p>Total Payload: {logs.length} Units</p>
      </div>
    </div>
  );
};

export default Attendance;