import React from 'react';
import { InputItem, SelectBox, MultiSelect } from '../components/FormElements'; // Asosiy fayldan helperlarni olamiz

export const TeacherForm = ({ formData, setFormData, isEditMode, auxiliaryData, toggleSelection }: any) => {
  return (
    <>
      <div className="md:col-span-2">
        <InputItem label="F.I.SH (To'liq)" value={formData.fullName} 
          onChange={(v: string) => setFormData({...formData, fullName: v})} />
      </div>
      <InputItem label="Login / Username" value={formData.username} 
        onChange={(v: string) => setFormData({...formData, username: v})} />
      
      {!isEditMode && (
        <InputItem label="Xavfsiz Parol" type="password" value={formData.password}
          onChange={(v: string) => setFormData({...formData, password: v})} />
      )}

      <SelectBox label="Fakultet" options={auxiliaryData.faculties} value={formData.facultyId} 
        onChange={(v: string) => setFormData({...formData, facultyId: v})} />
      
      <SelectBox label="Kafedra" options={auxiliaryData.departments} value={formData.departmentId} 
        onChange={(v: string) => setFormData({...formData, departmentId: v})} />

      <MultiSelect label="Biriktirilgan Fanlar" items={auxiliaryData.subjects} 
        selectedItems={formData.subjectIds || []} onToggle={(id: number) => toggleSelection('subjectIds', id)} />
      
      {/* Guruh biriktirish olib tashlandi */}
    </>
  );
};