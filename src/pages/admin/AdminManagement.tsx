import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Trash2, Edit3, X, Save, Loader2, Layers, School, BookOpen, 
  GraduationCap, Users, LayoutGrid, Building2, Briefcase, Info, Activity, TrendingUp
} from 'lucide-react';
import client from '../../api/client';

// Bo'laklangan formalar
import { TeacherForm } from './forms/TeacherForm';
import { StudentForm } from './forms/StudentForm';
import { SubjectForm } from './forms/SubjectForm';
import { CurriculumForm } from './forms/CurriculumForm';
import { GenericForm } from './forms/GenericForm';

interface BaseItem {
  id: number | string;
  name?: string;       
  fullName?: string;   
  roomNumber?: string;
  course?: number;
  department?: any;
  faculty?: any;
  groups?: any[]; 
  subjects?: any[];
  subject?: { id: number; name: string };
  group?: { id: number; name: string };
  semester?: number;
  hoursPerWeek?: number;
  capacity?: number;
  building?: any;
  code?: string;
  lectureHours?: number;
  labHours?: number;
  username?: string;
}

type TabType = 'teachers' | 'students' | 'groups' | 'subjects' | 'infrastructure' | 'departments' | 'faculties' | 'buildings' | 'patoklar' | 'curriculum';

const AdminManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('subjects');
  const [list, setList] = useState<BaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  // Aux states (Yordamchi ma'lumotlar)
  const [groups, setGroups] = useState<BaseItem[]>([]);
  const [faculties, setFaculties] = useState<BaseItem[]>([]);
  const [buildings, setBuildings] = useState<BaseItem[]>([]);
  const [subjects, setSubjects] = useState<BaseItem[]>([]);
  const [departments, setDepartments] = useState<BaseItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<any>({ subjectIds: [], groupIds: [] });

  // TIZIM KONFIGURATSIYASI
  const tabConfig: Record<TabType, { label: string, icon: any, desc: string, color: string }> = {
    curriculum: { label: 'Sillabus', icon: BookOpen, desc: 'O\'quv rejalari va soatlar taqsimoti.', color: 'text-blue-500' },
    teachers: { label: 'O\'qituvchilar', icon: Briefcase, desc: 'Professorlar va ilmiy xodimlar bazasi.', color: 'text-cyan-500' },
    students: { label: 'Talabalar', icon: GraduationCap, desc: 'Kontingent va guruhlar boshqaruvi.', color: 'text-purple-500' },
    groups: { label: 'Guruhlar', icon: Users, desc: 'Akademik guruhlar ierarxiyasi.', color: 'text-orange-500' },
    subjects: { label: 'Fanlar', icon: LayoutGrid, desc: 'Fanlar katalogi va yuklamalar.', color: 'text-emerald-500' },
    infrastructure: { label: 'Xonalar', icon: School, desc: 'Auditoriyalar va binolar fondi.', color: 'text-rose-500' },
    faculties: { label: 'Fakultetlar', icon: Building2, desc: 'OTM tarkibiy fakultetlari.', color: 'text-indigo-500' },
    departments: { label: 'Kafedralar', icon: Layers, desc: 'Kafedralar va yo\'nalishlar.', color: 'text-pink-500' },
    buildings: { label: 'Binolar', icon: Building2, desc: 'O\'quv korpuslari va manzillar.', color: 'text-slate-400' },
    patoklar: { label: 'Patoklar', icon: Activity, desc: 'Oqimlar va birlashtirilgan guruhlar.', color: 'text-yellow-500' },
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints: Record<TabType, string> = {
        teachers: '/api/v1/admin/get-teachers', students: '/api/v1/admin/get-students',
        groups: '/api/v1/admin/get-groups', subjects: '/api/v1/admin/get-subjects',
        infrastructure: '/api/v1/admin/get-rooms', departments: '/api/v1/admin/get-depart',
        faculties: '/api/v1/admin/get-faculties', buildings: '/api/v1/admin/get-buildings',
        patoklar: '/api/v1/admin/patok/all', curriculum: '/api/v1/admin/curriculum'
      };
      const res = await client.get(endpoints[activeTab]);
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) { setList([]); } finally { setLoading(false); }
  };

  const fetchAuxiliaryData = async () => {
    try {
      const [gRes, fRes, bRes, sRes, dRes] = await Promise.all([
        client.get('/api/v1/admin/get-groups'), client.get('/api/v1/admin/get-faculties'),
        client.get('/api/v1/admin/get-buildings'), client.get('/api/v1/admin/get-subjects'),
        client.get('/api/v1/admin/get-depart')
      ]);
      setGroups(gRes.data || []); setFaculties(fRes.data || []);
      setBuildings(bRes.data || []); setSubjects(sRes.data || []);
      setDepartments(dRes.data || []);
    } catch (err) { console.error("Aux Data Error:", err); }
  };

  useEffect(() => { fetchData(); }, [activeTab]);
  useEffect(() => { if (isModalOpen) fetchAuxiliaryData(); }, [isModalOpen]);

  const toggleSelection = (field: string, id: number) => {
    setFormData((prev: any) => {
      const current = prev[field] || [];
      const updated = current.includes(Number(id)) ? current.filter((i: number) => i !== Number(id)) : [...current, Number(id)];
      return { ...prev, [field]: updated };
    });
  };

  const handleEdit = (item: BaseItem) => {
    setIsEditMode(true);
    setEditingId(item.id);
    let initialData: any = { ...item };
    if (activeTab === 'teachers') {
      initialData = { ...item, facultyId: item.faculty?.id, departmentId: item.department?.id, 
        subjectIds: item.subjects?.map(s => s.id) || [], groupIds: item.groups?.map(g => g.id) || [], password: '' };
    } else if (activeTab === 'students') {
      initialData = { fullName: item.fullName, groupId: (item as any).group?.id, studentId: item.id };
    } else if (activeTab === 'infrastructure') {
      initialData = { ...item, buildingId: item.building?.id };
    }
    setFormData(initialData);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = isEditMode ? 'put' : 'post';
      let url = isEditMode 
        ? (activeTab === 'students' ? `/api/v1/admin/update-student/${editingId}` : `/api/v1/admin/update-${activeTab.replace(/s$/, '')}/${editingId}`)
        : (activeTab === 'students' ? '/api/v1/admin/student/register' : `/api/v1/admin/set-${activeTab.replace(/s$/, '')}`);
      
      let payload: any = { ...formData };
      if (activeTab === 'teachers') {
        payload = { fullName: formData.fullName, username: formData.username, faculty: formData.facultyId.toString(), 
          department: formData.departmentId.toString(), subjectIds: formData.subjectIds, groupIds: formData.groupIds };
        if (!isEditMode) payload.password = formData.password;
      }

      if (activeTab === 'students' && !isEditMode) {
        const data = new FormData();
        data.append('id', formData.studentId);
        data.append('fullName', formData.fullName);
        data.append('groupId', formData.groupId);
        if (selectedFile) data.append('image', selectedFile);
        await client.post(url, data);
      } else {
        await (client as any)[method](url, payload);
      }

      setIsModalOpen(false); fetchData();
    } catch (err: any) { alert("Xatolik!"); } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] text-white p-4 md:p-8 space-y-10 font-sans pb-32">
      
      {/* 1. TOP HEADER & SEARCH */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none bg-gradient-to-r from-white to-cyan-500 bg-clip-text text-transparent">
            Uni<span className="text-cyan-500">Face</span> <span className="text-white/20">OS</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] ml-1">Enterprise Management System</p>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors duration-300" size={18} />
            <input 
              type="text" 
              placeholder="Tizim bo'ylab qidirish..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/5 pl-14 pr-6 py-5 rounded-[25px] outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-sm font-bold shadow-2xl backdrop-blur-sm"
            />
          </div>
          <button 
            onClick={() => { setIsEditMode(false); setFormData({subjectIds: [], groupIds: []}); setIsModalOpen(true); }}
            className="p-5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-black rounded-[25px] hover:from-cyan-600 hover:to-cyan-700 transition-all duration-300 active:scale-95 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40"
          >
            <Plus size={24} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* 2. STATS WIDGETS */}
      {/* 2. STATS WIDGETS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Jami Ma\'lumot', value: list.length, icon: Layers, color: 'text-cyan-500' },
          { label: 'Aktiv Seanslar', value: '12', icon: Activity, color: 'text-emerald-500' },
          { label: 'Tizim Barqarorligi', value: '99.9%', icon: TrendingUp, color: 'text-purple-500' },
          { label: 'Foydalanish', value: 'High', icon: Info, color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 p-6 rounded-[35px] backdrop-blur-xl group hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
            <stat.icon size={20} className={`${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
            <div className="text-3xl font-black italic mb-1">{stat.value}</div>
            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 3. NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 p-2 bg-white/[0.02] border border-white/5 rounded-[35px] w-fit backdrop-blur-md shadow-lg">
        {(Object.keys(tabConfig) as TabType[]).map((tab) => {
          const Icon = tabConfig[tab].icon;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-3 px-6 py-4 rounded-[28px] text-[10px] font-black uppercase italic transition-all duration-300 tracking-tighter ${
                isActive ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-black shadow-2xl scale-[1.05] shadow-cyan-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5 hover:shadow-md'
              }`}
            >
              <Icon size={16} />
              {tabConfig[tab].label}
            </button>
          );
        })}
      </div>

      {/* 4. SMART GRID CONTENT */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="animate-spin text-cyan-500" size={40} />
            <span className="text-[10px] font-black uppercase text-slate-500 animate-pulse">Ma'lumotlar yuklanmoqda...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {list.filter(i => (i.fullName || i.name || i.roomNumber || i.subject?.name || "").toLowerCase().includes(searchTerm.toLowerCase())).map((item, idx) => {
              const Icon = tabConfig[activeTab].icon;
              return (
                <div key={item.id || idx} className="group relative bg-gradient-to-br from-[#0D0D0D] to-[#0A0A0A] border border-white/5 rounded-[45px] p-2 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-500 overflow-hidden">
                  <div className="bg-white/[0.01] rounded-[40px] p-8 h-full backdrop-blur-sm">
                    <div className="flex items-start gap-5">
                      <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/5 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500 shadow-lg`}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-black uppercase italic text-sm tracking-tight truncate text-white group-hover:text-cyan-400 transition-colors duration-300">
                          {activeTab === 'curriculum' ? item.subject?.name : (item.fullName || item.name || item.roomNumber)}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">ID: {item.id}</span>
                        </div>
                      </div>
                    </div>

                    {/* DINAMIK TAVSILOTLAR */}
                    <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-slate-600 uppercase italic tracking-widest">Asosiy Ma'lumot</span>
                        <span className="text-[11px] font-bold text-slate-300">
                          {activeTab === 'teachers' ? item.department?.name : 
                           activeTab === 'infrastructure' ? `${item.capacity} kishi` : 
                           activeTab === 'curriculum' ? item.group?.name : 'Standart Resurs'}
                        </span>
                      </div>
                      
                      {(activeTab === 'infrastructure' || activeTab === 'curriculum') && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[8px] font-black text-slate-500 uppercase">
                            <span>Yuklama</span>
                            <span>{activeTab === 'infrastructure' ? 'Bandlik' : 'O\'zlashtirish'}</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full w-[65%] shadow-[0_0_10px_cyan]" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-8">
                      <button onClick={() => handleEdit(item)} className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-[22px] text-[10px] font-black uppercase italic transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/10">
                        <Edit3 size={14} /> Tahrirlash
                      </button>
                      <button className="px-5 bg-rose-500/5 hover:bg-rose-500/20 text-rose-500 py-4 rounded-[22px] transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/20">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. MODAL SYSTEM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-[#0A0A0A] to-[#050505] border border-white/10 w-full max-w-2xl rounded-[55px] p-8 md:p-14 relative my-auto shadow-3xl shadow-cyan-500/10">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors duration-300"><X size={32} /></button>
            
            <div className="mb-10">
              <h2 className="text-3xl font-black uppercase italic leading-none bg-gradient-to-r from-white to-cyan-500 bg-clip-text text-transparent">
                Resurs <span className="text-cyan-500">{isEditMode ? 'Tahriri' : 'Qabulnomasi'}</span>
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Active Path: Admin / {tabConfig[activeTab].label}</p>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {activeTab === 'teachers' && <TeacherForm formData={formData} setFormData={setFormData} isEditMode={isEditMode} toggleSelection={toggleSelection} auxiliaryData={{faculties, departments, subjects, groups}} />}
              {activeTab === 'students' && <StudentForm formData={formData} setFormData={setFormData} isEditMode={isEditMode} setSelectedFile={setSelectedFile} auxiliaryData={{groups}} />}
              {activeTab === 'subjects' && <SubjectForm formData={formData} setFormData={setFormData} auxiliaryData={{departments}} />}
              {activeTab === 'curriculum' && <CurriculumForm formData={formData} setFormData={setFormData} auxiliaryData={{subjects, groups}} />}
              {['infrastructure', 'groups', 'faculties', 'buildings', 'departments', 'patoklar'].includes(activeTab) && <GenericForm activeTab={activeTab} formData={formData} setFormData={setFormData} auxiliaryData={{buildings, faculties}} />}

              <div className="md:col-span-2 pt-10">
                <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-black py-7 rounded-[30px] font-black uppercase italic text-sm hover:from-cyan-600 hover:to-cyan-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? <Loader2 className="animate-spin m-auto" size={20} /> : "Ma'lumotlarni Tasdiqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;