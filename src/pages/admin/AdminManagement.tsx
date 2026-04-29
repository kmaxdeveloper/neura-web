import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Search, Trash2, Edit3, X, Loader2, Layers, School, BookOpen, 
  GraduationCap, Users, LayoutGrid, Building2, Briefcase, Info, Activity, 
  TrendingUp, ChevronRight, Hash, Database, FileText
} from 'lucide-react';
import client from '../../api/client';

// Bo'laklangan formalar
import { TeacherForm } from './forms/TeacherForm';
import { StudentForm } from './forms/StudentForm';
import { SubjectForm } from './forms/SubjectForm';
import { TopicForm } from './forms/TopicForm';
import { CurriculumForm } from './forms/CurriculumForm';
import { GenericForm } from './forms/GenericForm';
import ServerTime from '../../components/ServerTime';
import { useLanguage } from '../../context/LanguageContext';

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

type TabType = 'teachers' | 'students' | 'groups' | 'subjects' | 'topics' | 'infrastructure' | 'departments' | 'faculties' | 'buildings' | 'patoklar' | 'curriculum';

const AdminManagement: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('subjects');
  const [list, setList] = useState<BaseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  // Aux states
  const [groups, setGroups] = useState<BaseItem[]>([]);
  const [faculties, setFaculties] = useState<BaseItem[]>([]);
  const [buildings, setBuildings] = useState<BaseItem[]>([]);
  const [subjects, setSubjects] = useState<BaseItem[]>([]);
  const [departments, setDepartments] = useState<BaseItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<any>({ subjectIds: [], groupIds: [] });

  const tabConfig: Record<TabType, { label: string, icon: any, desc: string, color: string }> = {
    curriculum: { label: t('timetable'), icon: BookOpen, desc: 'Curriculum & Hours', color: 'text-blue-500' },
    teachers: { label: t('groups').replace('im', ''), icon: Briefcase, desc: 'Academic Staff', color: 'text-cyan-500' },
    students: { label: 'Talabalar', icon: GraduationCap, desc: 'Student Registry', color: 'text-purple-500' },
    groups: { label: t('groups'), icon: Users, desc: 'Class Groups', color: 'text-orange-500' },
    subjects: { label: 'Fanlar', icon: LayoutGrid, desc: 'Subject Catalog', color: 'text-emerald-500' },
    topics: { label: 'Mavzular', icon: FileText, desc: 'Syllabus Topics', color: 'text-yellow-400' },
    infrastructure: { label: 'Xonalar', icon: School, desc: 'Rooms & Labs', color: 'text-rose-500' },
    faculties: { label: 'Fakultetlar', icon: Building2, desc: 'University Faculties', color: 'text-indigo-500' },
    departments: { label: 'Kafedralar', icon: Layers, desc: 'Departments', color: 'text-pink-500' },
    buildings: { label: 'Binolar', icon: Building2, desc: 'Campus Buildings', color: 'text-slate-400' },
    patoklar: { label: 'Patoklar', icon: Activity, desc: 'Unified Streams', color: 'text-yellow-500' },
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoints: Record<TabType, string> = {
        teachers: '/api/v1/admin/get-teachers', students: '/api/v1/admin/get-students',
        groups: '/api/v1/admin/get-groups', subjects: '/api/v1/admin/get-subjects',
        infrastructure: '/api/v1/admin/get-rooms', departments: '/api/v1/admin/get-depart',
        faculties: '/api/v1/admin/get-faculties', buildings: '/api/v1/admin/get-buildings',
        patoklar: '/api/v1/admin/patok/all', curriculum: '/api/v1/admin/curriculum',
        topics: '/api/v1/admin/get-subjects' // Temporary, see logic below
      };
      
      let endpoint = endpoints[activeTab];
      // Maxsus holat: Mavzularni olish uchun fan tanlanishi kerak yoki hammasini olish
      if (activeTab === 'topics') {
         const res = await client.get('/api/v1/admin/get-subjects');
         const allSubjects = res.data || [];
         const allTopics: any[] = [];
         for (const s of allSubjects) {
            const tRes = await client.get(`/api/v1/admin/get-topics/subject/${s.id}`);
            if (Array.isArray(tRes.data)) {
               allTopics.push(...tRes.data.map((t: any) => ({ ...t, subject: s })));
            }
         }
         setList(allTopics);
         return;
      }

      const res = await client.get(endpoint);
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
    } else if (activeTab === 'topics') {
      initialData = { ...item, subjectId: item.subject?.id };
    }
    setFormData(initialData);
    setIsModalOpen(true);
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
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
      } else if (activeTab === 'topics') {
        const params = new URLSearchParams();
        params.append('title', formData.title);
        params.append('description', formData.description || '');
        if (!isEditMode) params.append('subjectId', formData.subjectId);
        
        await client({
           method: isEditMode ? 'put' : 'post',
           url: isEditMode ? `/api/v1/admin/update-topic/${editingId}` : `/api/v1/admin/set-topic`,
           params: params
        });
      } else {
        await (client as any)[method](url, payload);
      }
      setIsModalOpen(false); fetchData();
      setFormData({ subjectIds: [], groupIds: [] });
    } catch (err: any) { alert("Xatolik!"); } finally { setSubmitting(false); }
  };

  const filteredList = useMemo(() => {
    return list.filter(i => (i.fullName || i.name || i.roomNumber || i.subject?.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
  }, [list, searchTerm]);

  return (
    <div className="animate-in fade-in duration-700 space-y-6 pb-10 relative">
      
      {/* 1. Header (Medium) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-500">
            <Database size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">{t('manual_control').split(' ')[0]} <span className="text-cyan-500">{t('manual_control').split(' ')[1]}</span></h1>
            <p className="text-[var(--text-secondary)] font-mono text-[9px] uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Direct Access Layer
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ServerTime />
          <div className="flex items-center gap-3 bg-[var(--surface-card)] p-1.5 rounded-2xl border border-[var(--border-subtle)] shadow-lg">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-cyan-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder={t('search') + "..."}
                className="w-full md:w-56 bg-[var(--surface-hover)] border border-transparent p-2.5 pl-9 rounded-xl text-[var(--text-primary)] text-xs outline-none focus:border-cyan-500/20 transition-all font-bold"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => { setIsEditMode(false); setFormData({subjectIds: [], groupIds: []}); setIsModalOpen(true); }}
              className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 text-black font-black text-[10px] uppercase tracking-widest italic rounded-xl shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all active:scale-95"
            >
              <Plus size={14} strokeWidth={4} /> {t('add_new')}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Navigation & Quick Add (Medium) */}
      <div className="space-y-4">
        <div className="flex overflow-x-auto custom-scrollbar p-1.5 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-3xl shadow-md">
          <div className="flex gap-1.5">
            {(Object.keys(tabConfig) as TabType[]).map((tab) => {
              const Icon = tabConfig[tab].icon;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase italic transition-all duration-300 tracking-tighter whitespace-nowrap ${
                    isActive ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/10' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-black' : 'text-cyan-500/60'} />
                  {tabConfig[tab].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* QUICK ADD BAR (Medium) */}
        {['faculties', 'buildings', 'departments', 'groups', 'patoklar'].includes(activeTab) && (
          <div className="animate-in slide-in-from-top-2 duration-500">
            <div className="relative group overflow-hidden rounded-2xl shadow-md border border-cyan-500/10">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 z-10">
                 <Plus size={18} strokeWidth={3} />
              </div>
              <input 
                type="text" 
                placeholder={`${t('add_new')} ${tabConfig[activeTab].label}...`}
                className="w-full bg-[var(--surface-card)] p-4 pl-12 rounded-2xl outline-none focus:bg-cyan-500/[0.02] text-sm font-black italic tracking-tight transition-all placeholder-[var(--text-muted)] text-cyan-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    setFormData({ name: e.currentTarget.value });
                    handleSave();
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 3. Stats Section (Medium) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t('total').toUpperCase(), value: list.length, icon: Hash, color: 'text-cyan-500' },
          { label: t('status').toUpperCase(), value: 'LIVE', icon: Activity, color: 'text-emerald-500' },
          { label: t('data_integrity').split(' ')[0].toUpperCase(), value: '100%', icon: TrendingUp, color: 'text-purple-500' },
          { label: 'LOAD', value: 'NORM', icon: Info, color: 'text-amber-500' },
        ].map((s, i) => (
          <div key={i} className="p-5 border border-[var(--border-subtle)] bg-[var(--surface-card)] rounded-3xl group hover:border-cyan-500/20 transition-all flex items-center justify-between">
            <div>
              <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-0.5">{s.label}</div>
              <div className="text-xl font-black text-[var(--text-primary)] uppercase italic leading-none">{s.value}</div>
            </div>
            <div className={`p-2.5 rounded-xl bg-[var(--surface-hover)] ${s.color}`}>
              <s.icon size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* 4. Content Grid (Denser - Medium) */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="animate-spin text-cyan-500" size={32} />
            <span className="text-[9px] font-black uppercase text-cyan-500 tracking-widest animate-pulse">Syncing...</span>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-[var(--border-subtle)] rounded-3xl text-[var(--text-muted)]">
            <Search size={40} strokeWidth={1} className="mb-3 opacity-20" />
            <p className="font-bold uppercase italic text-xs tracking-tighter">No results</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredList.map((item, idx) => (
              <div key={item.id || idx} className="group relative bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-3xl p-1 hover:border-cyan-500/30 transition-all duration-300">
                <div className="bg-[var(--surface-elevated)]/40 rounded-[22px] p-5 h-full backdrop-blur-lg relative overflow-hidden border border-white/5">
                  <div className="absolute -top-4 -right-4 text-5xl font-black text-white/[0.02] italic select-none">{idx + 1}</div>
                  
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500">
                      {React.createElement(tabConfig[activeTab].icon, { size: 18 })}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h3 className="font-black uppercase italic text-[11px] tracking-tight truncate text-[var(--text-primary)] group-hover:text-cyan-500 transition-colors">
                        {activeTab === 'curriculum' ? item.subject?.name : (item.fullName || item.name || item.roomNumber)}
                      </h3>
                      <div className="text-[8px] font-mono font-black text-cyan-500/60 uppercase tracking-tighter mt-0.5">ID: #{item.id}</div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3 relative z-10">
                    <div className="p-3 bg-black/10 rounded-xl border border-white/5">
                      <p className="text-[10px] font-bold text-[var(--text-secondary)] truncate">
                        {activeTab === 'teachers' ? item.department?.name : 
                         activeTab === 'infrastructure' ? `${item.building?.name} // Cap: ${item.capacity}` : 
                         activeTab === 'curriculum' ? `${item.group?.name} // ${item.hoursPerWeek}h` : 
                         activeTab === 'students' ? `${item.group?.name || 'Unmapped'}` : 
                         activeTab === 'topics' ? `Subject: ${item.subject?.name}` : 'System Resource'}
                      </p>
                    </div>
                    
                    {['infrastructure', 'curriculum'].includes(activeTab) && (
                      <div className="px-0.5">
                        <div className="h-1 w-full bg-black/20 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500 w-[75%] shadow-[0_0_5px_cyan]" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-5 relative z-10">
                    <button onClick={() => handleEdit(item)} className="flex-1 bg-white/5 hover:bg-cyan-500 hover:text-black py-2.5 rounded-xl text-[9px] font-black uppercase italic transition-all border border-white/5 flex items-center justify-center gap-2">
                      <Edit3 size={12} /> {t('edit')}
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) {
                          client.delete(`/api/v1/admin/delete-${activeTab.replace(/s$/, '')}/${item.id}`)
                            .then(() => fetchData())
                            .catch(() => alert("O'chirishda xatolik!"));
                        }
                      }}
                      className="px-3 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-black py-2.5 rounded-xl border border-rose-500/20 transition-all flex items-center justify-center"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Modal System (Medium) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-xl p-4 overflow-y-auto animate-in fade-in duration-300">
          <div className="bg-[var(--surface-overlay)] border border-white/10 w-full max-w-xl rounded-[40px] p-8 md:p-10 relative my-auto shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-[var(--text-muted)] hover:text-cyan-500 transition-all duration-300">
              <X size={28} />
            </button>
            
            <div className="mb-8">
              <div className="flex items-center gap-2 text-cyan-500 mb-2">
                <Database size={16} />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">Protocol</span>
              </div>
              <h2 className="text-3xl font-black uppercase italic leading-none text-[var(--text-primary)]">
                {isEditMode ? t('edit') : t('add_new')} <span className="text-cyan-500 text-2xl">{tabConfig[activeTab].label}</span>
              </h2>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeTab === 'teachers' && <TeacherForm formData={formData} setFormData={setFormData} isEditMode={isEditMode} toggleSelection={toggleSelection} auxiliaryData={{faculties, departments, subjects, groups}} />}
              {activeTab === 'students' && <StudentForm formData={formData} setFormData={setFormData} isEditMode={isEditMode} setSelectedFile={setSelectedFile} auxiliaryData={{groups}} />}
              {activeTab === 'subjects' && <SubjectForm formData={formData} setFormData={setFormData} auxiliaryData={{departments}} />}
              {activeTab === 'topics' && <TopicForm formData={formData} setFormData={setFormData} auxiliaryData={{subjects}} />}
              {activeTab === 'curriculum' && <CurriculumForm formData={formData} setFormData={setFormData} auxiliaryData={{subjects, groups}} />}
              {['infrastructure', 'groups', 'faculties', 'buildings', 'departments', 'patoklar'].includes(activeTab) && <GenericForm activeTab={activeTab} formData={formData} setFormData={setFormData} auxiliaryData={{buildings, faculties}} />}

              <div className="md:col-span-2 pt-6">
                <button type="submit" disabled={submitting} className="w-full bg-cyan-500 text-black py-4.5 rounded-2xl font-black uppercase italic text-[11px] shadow-xl hover:bg-cyan-400 transition-all flex items-center justify-center gap-2">
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <>{t('save')} <ChevronRight size={16} strokeWidth={3} /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer (Medium) */}
      <div className="flex items-center justify-between border-t border-white/5 pt-6 opacity-40">
        <div className="flex items-center gap-4 text-[8px] font-mono uppercase tracking-[0.3em]">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Status: Stable
           </div>
           <div className="w-1 h-1 bg-white/10 rounded-full" />
           Baza: Online
        </div>
        <div className="text-[8px] font-mono text-cyan-500/40">v2.1.0-MED</div>
      </div>
    </div>
  );
};

export default AdminManagement;