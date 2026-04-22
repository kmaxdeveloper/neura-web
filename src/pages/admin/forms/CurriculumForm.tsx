import React from 'react';
import { InputItem, SelectBox } from '../components/FormElements';

export const CurriculumForm = ({ formData, setFormData, auxiliaryData }: any) => {
  return (
    <div className="md:col-span-2 space-y-6">
      <SelectBox label="Fan" options={auxiliaryData.subjects} value={formData.subjectId} 
        onChange={(v) => setFormData({...formData, subjectId: v})} />
      <SelectBox label="Guruh" options={auxiliaryData.groups} labelKey="name" value={formData.groupId} 
        onChange={(v) => setFormData({...formData, groupId: v})} />
      <div className="grid grid-cols-2 gap-6">
        <InputItem label="Semester" type="number" value={formData.semester} 
          onChange={(v) => setFormData({...formData, semester: v})} />
        <InputItem label="Haftalik Soat" type="number" value={formData.hoursPerWeek} 
          onChange={(v) => setFormData({...formData, hoursPerWeek: v})} />
      </div>
    </div>
  );
};