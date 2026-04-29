import React, { useState, useRef } from 'react';
import { 
  BrainCircuit, Upload, FileText, Send, 
  Loader2, AlertCircle, 
  Sparkles, ShieldCheck, Cpu, Trash2,
  Award, History, BarChart3
} from 'lucide-react';
import ServerTime from '../components/ServerTime';
import { useLanguage } from '../context/LanguageContext';

import api from '../api';

const MizanAI: React.FC = () => {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);

  React.useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/api/v1/teacher/get-subjects');
        // Backenddan o'qituvchi fanlari keladi (id, name, ... ob'ektlar ko'rinishida)
        setSubjects(response.data);
      } catch (error) {
        console.error("Fanlarni yuklashda xatolik:", error);
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const startEvaluation = async () => {
    if (!file) return;
    if (!subject) {
      alert("Iltimos, tahlil qilish uchun fanni tanlang!");
      return;
    }
    
    setIsEvaluating(true);
    setResult(null);
    setAnalysisStep(1);

    // Animatsiya uchun qadamlar (backend ishlaganda vizual tasavvur uchun)
    const interval = setInterval(() => {
      setAnalysisStep(prev => (prev < 5 ? prev + 1 : prev));
    }, 1500);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Fan id si orqali uning nomini topish va backendga jo'natish
      const selectedSubjectObj = subjects.find(s => s.id === parseInt(subject));
      if (selectedSubjectObj) {
        formData.append('subjectName', selectedSubjectObj.name);
      }

      // Backend API ga jo'natish
      const response = await api.post('/api/v1/teacher/mizan/evaluate', formData);

      clearInterval(interval);
      setAnalysisStep(5);
      
      const data = response.data;
      
      // Backenddan kelgan mezonlarga ikonkalarni ulash
      const iconMap: Record<string, any> = {
        'Originality': Sparkles,
        'Structural Integrity': Cpu,
        'Technical Depth': BarChart3,
        'Clarity & Logic': ShieldCheck
      };

      const mappedCriteria = data.criteria.map((c: any) => ({
        ...c,
        icon: iconMap[c.name] || BrainCircuit // default ikonka
      }));

      setResult({
        ...data,
        criteria: mappedCriteria
      });

    } catch (error) {
      console.error("Mizan AI tahlilida xatolik:", error);
      clearInterval(interval);
      // Xato bo'lsa foydalanuvchiga bildirish (ixtiyoriy alert o'rniga UI da ko'rsatish mumkin)
      alert("Tahlil vaqtida xatolik yuz berdi. Iltimos qayta urinib ko'ring.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-1000 space-y-8 pb-20">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--surface-card)] p-8 rounded-[40px] border border-purple-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/[0.05] blur-[120px] -mr-48 -mt-48 animate-pulse" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-4 bg-purple-500/10 rounded-[28px] border border-purple-500/20 text-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
            <BrainCircuit size={36} className="animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">{t('mizan_title').split(' ')[0]} <span className="text-purple-500">{t('mizan_title').split(' ')[1]}</span></h1>
            <p className="text-[var(--text-secondary)] font-mono text-[9px] uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" /> {t('mizan_subtitle')}
            </p>
          </div>
        </div>
        <ServerTime />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. Upload & Controls (Left) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Fan Tanlash Dropdown (Always visible) */}
          <div className="w-full text-left space-y-2 bg-[var(--surface-card)] p-6 rounded-[32px] border border-purple-500/20 shadow-lg relative z-10">
            <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 ml-2">Fanni Tanlang *</label>
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-4 bg-black/20 border border-purple-500/20 rounded-2xl text-[var(--text-primary)] text-sm outline-none focus:border-purple-500 transition-all font-medium italic cursor-pointer appearance-none"
            >
              {isLoadingSubjects ? (
                <option value="" disabled className="bg-[var(--surface-base)] text-[var(--text-muted)]">Yuklanmoqda...</option>
              ) : subjects.length === 0 ? (
                <option value="" disabled className="bg-[var(--surface-base)] text-[var(--text-muted)]">Sizda biriktirilgan fanlar yo'q</option>
              ) : (
                subjects.map(s => (
                  <option key={s.id} value={s.id} className="bg-[var(--surface-base)] text-[var(--text-primary)]">{s.name}</option>
                ))
              )}
            </select>
          </div>

          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className={`group h-[380px] bg-[var(--surface-card)] border-2 border-dashed rounded-[56px] flex flex-col items-center justify-center p-10 transition-all duration-700 relative overflow-hidden shadow-xl ${
              file ? 'border-purple-500/40 bg-purple-500/[0.02]' : 'border-[var(--border-subtle)] hover:border-purple-500/30'
            }`}
          >
            <div className={`absolute inset-0 bg-purple-500/[0.04] blur-[100px] transition-opacity duration-700 ${file ? 'opacity-100' : 'opacity-0'}`} />

            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
            />

            {!file ? (
              <div className="text-center space-y-8 relative z-10">
                <div className="w-24 h-24 bg-purple-500/10 rounded-[32px] flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-purple-500/20 shadow-2xl">
                  <Upload size={32} className="text-purple-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase italic text-[var(--text-primary)]">{t('upload_work')}</h3>
                  <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-widest leading-relaxed">
                    {t('drop_file')} <br /> PDF • DOCX • TXT
                  </p>
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-12 py-4 bg-purple-500 text-black font-black uppercase italic text-[10px] tracking-widest rounded-2xl shadow-2xl shadow-purple-500/20 hover:bg-purple-400 transition-all active:scale-95"
                >
                  {t('select_file')}
                </button>
              </div>
            ) : (
              <div className="text-center space-y-8 relative z-10 animate-in zoom-in-95 duration-700 w-full px-4">
                <div className="w-24 h-24 bg-emerald-500/10 rounded-[32px] flex items-center justify-center mx-auto border border-emerald-500/20 shadow-2xl rotate-3">
                  <FileText size={32} className="text-emerald-500" />
                </div>
                <div className="p-8 bg-black/20 rounded-[40px] border border-white/5 backdrop-blur-2xl">
                  <h3 className="text-lg font-black uppercase italic text-[var(--text-primary)] truncate px-4">{file.name}</h3>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase rounded border border-emerald-500/20 tracking-tighter">Verified Payload</span>
                    <span className="text-[8px] text-[var(--text-muted)] font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setFile(null)}
                    disabled={isEvaluating}
                    className="p-4 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-black rounded-2xl transition-all border border-rose-500/20 disabled:opacity-30"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={startEvaluation}
                    disabled={isEvaluating || !subject}
                    className="flex-1 py-4 bg-purple-500 text-black rounded-2xl font-black uppercase italic text-[10px] tracking-widest flex items-center justify-center gap-3 hover:bg-purple-400 transition-all shadow-2xl shadow-purple-500/20 disabled:opacity-50"
                  >
                    {isEvaluating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {t('start_analysis')}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[32px] space-y-4">
             <div className="flex items-center gap-3 text-amber-500">
               <AlertCircle size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest italic">Compliance Notice</span>
             </div>
             <p className="text-[10px] text-[var(--text-muted)] leading-relaxed font-medium italic">
               Mizan AI utilizes Gemini Ultra to verify academic integrity. Ensure your submission follows the institutional formatting guidelines for optimal scoring accuracy.
             </p>
          </div>
        </div>

        {/* 3. Analysis & Results (Right) */}
        <div className="lg:col-span-7 relative">
          {!isEvaluating && !result ? (
            <div className="h-full bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[56px] flex flex-col items-center justify-center p-12 text-[var(--text-muted)] shadow-xl group overflow-hidden">
               <div className="absolute inset-0 bg-purple-500/[0.01] group-hover:bg-purple-500/[0.03] transition-colors duration-1000" />
               <Sparkles size={64} strokeWidth={1} className="mb-8 opacity-20 group-hover:rotate-12 transition-transform duration-1000" />
               <div className="text-center space-y-2 relative z-10">
                 <h3 className="text-sm font-black uppercase italic tracking-[0.4em] opacity-40">Awaiting Signal</h3>
                 <p className="text-[9px] font-mono uppercase tracking-widest opacity-30">Analysis payload empty // Ready for ingestion</p>
               </div>
            </div>
          ) : isEvaluating ? (
            <div className="h-full bg-black/10 border border-purple-500/20 rounded-[56px] flex flex-col items-center justify-center p-12 space-y-12 animate-in fade-in duration-1000 overflow-hidden relative">
               <div className="absolute inset-0 bg-purple-500/[0.05] animate-pulse" />
               <div className="relative z-10 flex flex-col items-center space-y-10">
                 <div className="relative">
                    <div className="w-48 h-48 rounded-[48px] border-[1px] border-purple-500/20 border-t-purple-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-purple-500/10 blur-2xl animate-pulse" />
                      <BrainCircuit size={48} className="text-purple-500 relative z-20" />
                    </div>
                 </div>
                 <div className="text-center space-y-6">
                    <h3 className="text-3xl font-black uppercase italic text-purple-500 tracking-tighter">{t('analyzing')}</h3>
                    <div className="flex flex-col gap-4 max-w-xs mx-auto">
                       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 transition-all duration-1000 ease-out shadow-[0_0_15px_purple]" style={{ width: `${(analysisStep / 5) * 100}%` }} />
                       </div>
                       <p className="text-[10px] text-purple-400 font-mono uppercase tracking-[0.2em] italic animate-pulse">
                         Step {analysisStep}/5: {analysisStep === 1 ? "Parsing..." : analysisStep === 2 ? "Entities..." : analysisStep === 3 ? "Logic..." : analysisStep === 4 ? "Base check..." : "Finalizing..."}
                       </p>
                    </div>
                 </div>
               </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-1000">
               {/* Result Score Card */}
               <div className="bg-[var(--surface-card)] border border-purple-500/30 rounded-[56px] p-12 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-20 bg-purple-500/[0.04] rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-1000" />
                  
                  <div className="flex items-center justify-between relative z-10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-purple-500">
                        <BarChart3 size={16} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('overall_score')}</span>
                      </div>
                      <div className="flex items-end gap-3">
                        <span className="text-8xl font-black italic text-[var(--text-primary)] leading-none tracking-tighter">{result.score}</span>
                        <span className="text-3xl font-black text-purple-500 mb-2">/100</span>
                      </div>
                    </div>
                    <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 rotate-6 group-hover:rotate-12 transition-transform duration-700">
                       <span className="text-5xl font-black text-black italic">{result.grade}</span>
                    </div>
                  </div>

                  <div className="mt-12 p-8 bg-black/20 rounded-[40px] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
                    <div className="flex items-center gap-3 text-purple-400 mb-4">
                      <Sparkles size={18} className="animate-pulse" />
                      <span className="text-[11px] font-black uppercase tracking-widest italic">{t('feedback')}</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed italic font-medium">{result.feedback}</p>
                  </div>
               </div>

               {/* Detailed Criteria */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.criteria.map((c: any, i: number) => (
                    <div key={i} className="p-6 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[32px] hover:border-purple-500/30 transition-all group relative overflow-hidden shadow-lg">
                       <div className="absolute inset-0 bg-purple-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity" />
                       <div className="flex justify-between items-center mb-4 relative z-10">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-black/20 rounded-lg text-purple-500"><c.icon size={14} /></div>
                           <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest">{c.name}</span>
                         </div>
                         <span className="text-lg font-black text-purple-500 italic">{c.score}%</span>
                       </div>
                       <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden relative z-10 p-0.5">
                         <div className="h-full bg-purple-500 shadow-[0_0_10px_purple] group-hover:scale-x-105 origin-left transition-transform duration-1000 rounded-full" style={{ width: `${c.score}%` }} />
                       </div>
                    </div>
                  ))}
               </div>

               {/* Action Buttons */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button className="py-5 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[32px] font-black uppercase italic text-[10px] tracking-widest flex items-center justify-center gap-3 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all shadow-xl active:scale-95 group">
                   <Award size={20} className="text-purple-500 group-hover:scale-110 transition-transform" /> {t('download_cert')}
                 </button>
                 <button className="py-5 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[32px] font-black uppercase italic text-[10px] tracking-widest flex items-center justify-center gap-3 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all shadow-xl active:scale-95 group">
                   <History size={20} className="text-purple-500 group-hover:scale-110 transition-transform" /> {t('detailed_report')}
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MizanAI;
