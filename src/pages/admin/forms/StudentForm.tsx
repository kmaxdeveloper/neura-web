import React from 'react';
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
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 italic">
            Profil Identifikatsiyasi (Rasm)
          </label>
          <input type="file" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} 
            className="w-full bg-white/5 p-5 rounded-[22px] border border-white/5 outline-none file:bg-cyan-500 file:border-none file:px-4 file:py-1 file:rounded-lg file:text-[10px] file:font-black file:uppercase" />
        </div>
      )}
    </div>
  );
};