import React, { useState } from 'react';
import { Download, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2, Database, Building2, Users, BookOpen, CalendarDays, Link, GraduationCap } from 'lucide-react';
import client from '../../api/client';

const AdminImport: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleDownloadTemplate = async (type: string, fileName: string) => {
    try {
      setUploading(true);
      const response = await client.get(`/api/v1/admin/import/template/${type}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setStatus({ type: 'error', msg: "Templateni yuklab olishda xatolik!" });
    } finally {
      setUploading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>, endpoint: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setStatus(null);

    try {
      const res = await client.post(`/api/v1/admin/import/${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ type: 'success', msg: res.data || "Muvaffaqiyatli yakunlandi!" });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.response?.data?.err || "Faylni yuklashda xatolik!" });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // --- KARTALAR UCHUN KOMPONENT ---
  const ImportCard = ({ title, desc, icon: Icon, type, endpoint, fileName, color = "cyan" }: any) => (
    <div className={`p-8 border border-white/5 bg-white/[0.02] rounded-[40px] space-y-6 hover:border-${color === 'white' ? 'white' : color + '-500'}/20 transition-all group`}>
      <div className="flex justify-between items-start">
        <div className={`p-3 bg-white/5 rounded-2xl ${color === 'white' ? 'text-white' : 'text-' + color + '-500'}`}><Icon size={28} /></div>
        <button 
          onClick={() => handleDownloadTemplate(type, fileName)}
          className="text-[10px] font-black text-slate-500 hover:text-cyan-500 flex items-center gap-1 uppercase tracking-tighter transition-colors"
        >
          <Download size={12} /> Template
        </button>
      </div>
      <div>
        <h3 className="text-2xl font-bold uppercase italic">{title}</h3>
        <p className="text-slate-500 text-sm mt-1">{desc}</p>
      </div>
      <label className="block cursor-pointer">
        <div className={`w-full py-4 ${color === 'white' ? 'bg-white/10 hover:bg-white/20 border-white/30 text-white' : `bg-${color}-500/10 hover:bg-${color}-500/20 border-${color}-500/30 text-${color}-500`} border rounded-2xl flex items-center justify-center gap-2 font-bold transition-all uppercase italic text-sm`}>
          {uploading ? <Loader2 className="animate-spin" /> : <><Upload size={18} /> Yuklash</>}
        </div>
        <input type="file" className="hidden" onChange={(e) => handleImport(e, endpoint)} accept=".xlsx, .xls" disabled={uploading} />
      </label>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 space-y-10 pb-10">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-cyan-500/10 rounded-3xl border border-cyan-500/20">
          <Database className="text-cyan-500" size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white uppercase italic">UniFace <span className="text-cyan-500">Terminal</span></h1>
          <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Excel Bridge // Enterprise Data Control</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ImportCard title="Fakultetlar" desc="Struktura asosi." icon={Building2} type="faculties" endpoint="faculties" fileName="faculties.xlsx" />
        <ImportCard title="Binolar" desc="Xonalar va sig'imlar." icon={Database} type="rooms" endpoint="rooms" fileName="infrastructure.xlsx" />
        <ImportCard title="Fanlar" desc="O'quv reja bazasi." icon={BookOpen} type="subjects" endpoint="subjects" fileName="subjects.xlsx" />
        <ImportCard title="Sillabus" desc="Fan-Guruh bog'lanishi." icon={GraduationCap} type="curriculum" endpoint="curriculum" fileName="curriculum.xlsx" color="emerald" />
        <ImportCard title="O'qituvchilar" desc="Akademik tarkib." icon={Users} type="teachers" endpoint="teachers" fileName="teachers.xlsx" />
        <ImportCard title="Talabalar" desc="Guruhlar va o'quvchilar." icon={Users} type="students" endpoint="students" fileName="students.xlsx" color="white" />
        <ImportCard title="Dars Jadvali" desc="Eng asosiy modul." icon={CalendarDays} type="lessons" endpoint="lessons" fileName="timetable.xlsx" />
        <ImportCard title="Biriktiruvlar" desc="Allocations: Fan-O'qituvchi." icon={Link} type="allocations" endpoint="allocations" fileName="allocations.xlsx" />
      </div>

      {status && (
        <div className={`p-6 rounded-[30px] flex items-center gap-4 animate-in zoom-in-95 sticky bottom-10 shadow-2xl ${status.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-md' : 'bg-red-500/10 border border-red-500/20 text-red-400 backdrop-blur-md'}`}>
          {status.type === 'success' ? <CheckCircle2 /> : <AlertCircle />}
          <p className="font-bold">{status.msg}</p>
        </div>
      )}
    </div>
  );
};

export default AdminImport;