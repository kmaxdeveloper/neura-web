import React from 'react';
import { InputItem, SelectBox } from '../components/FormElements';

export const SubjectForm = ({ formData, setFormData, auxiliaryData }: any) => {
  return (
    <div className="md:col-span-2 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <InputItem label="Fan Nomi" value={formData.name} 
          onChange={(v: string) => setFormData({...formData, name: v})} />
        <InputItem label="Fan Kodi" value={formData.code} 
          onChange={(v: string) => setFormData({...formData, code: v})} />
      </div>
      <div className="grid grid-cols-2 gap-6">
        <InputItem label="Ma'ruza soati" type="number" value={formData.lectureHours} 
          onChange={(v: string) => setFormData({...formData, lectureHours: v})} />
        <InputItem label="Laboratoriya soati" type="number" value={formData.labHours} 
          onChange={(v: string) => setFormData({...formData, labHours: v})} />
      </div>
      <SelectBox label="Kafedra" options={auxiliaryData.departments} value={formData.departmentId} 
        onChange={(v: string) => setFormData({...formData, departmentId: v})} />
    </div>
  );
};