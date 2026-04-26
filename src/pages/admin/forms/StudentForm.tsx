import { InputItem, SelectBox } from '../components/FormElements';

export const StudentForm = ({ formData, setFormData, isEditMode, auxiliaryData, setSelectedFile }: any) => {
  return (
    <div className="md:col-span-2 space-y-6">
      <InputItem label="Talaba F.I.SH" value={formData.fullName} 
        onChange={(v: string) => setFormData({...formData, fullName: v})} />
      <InputItem label="Student ID / Passport" value={formData.studentId} 
        onChange={(v: string) => setFormData({...formData, studentId: v})} />
      <SelectBox label="Guruh" options={auxiliaryData.groups} labelKey="name" value={formData.groupId} 
        onChange={(v: string) => setFormData({...formData, groupId: v})} />
      
      {!isEditMode && (
        <div className="space-y-3">
          <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-2 italic">
            Profil Identifikatsiyasi (Rasm)
          </label>
          <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
            className="w-full bg-[var(--surface-input)] p-5 rounded-[22px] border border-[var(--border-subtle)] outline-none text-[var(--text-primary)] file:bg-cyan-500 file:border-none file:px-4 file:py-1 file:rounded-lg file:text-[10px] file:font-black file:uppercase file:text-black" />
        </div>
      )}
    </div>
  );
};