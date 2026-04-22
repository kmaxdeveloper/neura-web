import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import QRCodeLib from 'react-qr-code';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { Clock3 } from 'lucide-react';
import client from '../../api/client';

interface StudentRecord {
  studentName: string;
  timestamp: string;
  studentId?: string;
}

const TeacherQRDashboard: React.FC<{ lessonId: number }> = ({ lessonId }) => {
  const [qrToken, setQrToken] = useState<string>("");
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [isConnected, setIsConnected] = useState(false);
  
  const stompClientRef = useRef<Stomp.Client | null>(null);
  const timeLeftRef = useRef(10);
  const isFetchingRef = useRef(false);

  const fetchQrToken = async () => {
    if (isFetchingRef.current || !lessonId) return;
    isFetchingRef.current = true;
    try {
      const res = await client.get(`/api/v1/teacher/refresh-qr/${lessonId}`);
      if (res.data && res.data.qrToken) {
        setQrToken(res.data.qrToken);
        timeLeftRef.current = 10;
        setTimeLeft(10);
      }
    } catch (err: any) {
      if (err.response?.status === 403) alert("Dars faol emas!");
    } finally {
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = new SockJS(`https://api.timora.uz/ws-attendance?token=${token}`, null, {
      transports: ['websocket']
    });
    const stompClient = Stomp.over(socket);
    stompClient.debug = () => {};

    stompClient.connect({ 'Authorization': `Bearer ${token}` }, () => {
      setIsConnected(true);
      fetchQrToken();
      stompClient.subscribe(`/topic/lesson/${lessonId}`, (msg) => {
        const newStudent = JSON.parse(msg.body);
        setStudents(prev => {
          const exists = prev.find(s => s.studentId === newStudent.studentId);
          return exists ? prev : [newStudent, ...prev];
        });
      });
    }, () => setIsConnected(false));

    stompClientRef.current = stompClient;

    const masterInt = setInterval(() => {
      if (timeLeftRef.current > 1) {
        timeLeftRef.current -= 1;
        setTimeLeft(timeLeftRef.current);
      } else if (stompClientRef.current?.connected) {
        fetchQrToken();
      }
    }, 1000);

    return () => {
      clearInterval(masterInt);
      if (stompClientRef.current?.connected) stompClientRef.current.disconnect(() => {});
    };
  }, [lessonId]);

  return (
    <div className="animate-in fade-in duration-1000 space-y-6">
      <Link to="/teacher/dashboard" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-bold uppercase italic">
        ← Fanlar ro'yxatiga qaytish
      </Link>

      {!isConnected ? (
        <div className="p-10 text-center border border-white/5 bg-white/[0.02] rounded-[40px]">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-slate-400 font-mono text-xs uppercase tracking-widest">Securing Connection...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="p-8 border border-white/5 bg-white/[0.02] rounded-[40px] flex flex-col items-center justify-center space-y-6">
            <div className="relative p-6 bg-white rounded-3xl">
              {qrToken ? (
                (() => {
                  const Component: any = (QRCodeLib as any).default || QRCodeLib;
                  return <Component value={qrToken} size={256} style={{ height: "auto", maxWidth: "100%", width: "100%" }} viewBox="0 0 256 256" />;
                })()
              ) : (
                <div className="w-64 h-64 flex items-center justify-center text-slate-900 font-black italic tracking-tighter">GENERATING...</div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${(timeLeft / 10) * 100}%` }} />
              </div>
              <span className="font-mono text-purple-500 font-bold">{timeLeft}s</span>
            </div>
          </div>

          <div className="p-8 border border-white/5 bg-white/[0.02] rounded-[40px] h-[450px] flex flex-col">
            <h3 className="text-xl font-bold uppercase italic mb-6 flex items-center gap-2">
              <Clock3 size={20} className="text-purple-500" /> Live Logs
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
              {students.length === 0 ? (
                <p className="text-slate-600 italic text-sm">Talabalar skan qilishi kutilmoqda...</p>
              ) : (
                students.map((s, idx) => (
                  <div key={idx} className="p-4 border border-white/5 bg-white/[0.01] rounded-2xl flex justify-between items-center animate-in slide-in-from-right-4">
                    <span className="font-bold text-slate-200">{s.studentName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{s.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherQRDashboard;