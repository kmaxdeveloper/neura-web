import React from 'react';
import { InputItem, SelectBox } from '../components/FormElements';

export const GenericForm = ({ activeTab, formData, setFormData, auxiliaryData }: any) => {
  const isInfra = activeTab === 'infrastructure';
  
  return (
    <div className="md:col-span-2 space-y-6">
      <InputItem 
        label="Nomi / Raqami" 
        value={isInfra ? (formData.roomNumber || formData.name) : formData.name} 
        onChange={(v: string) => setFormData(isInfra ? {...formData, roomNumber: v} : {...formData, name: v})} 
      />
      
      {isInfra && (
        <div className="grid grid-cols-2 gap-6">
          <InputItem label="Sig'im" type="number" value={formData.capacity} 
            onChange={(v: any) => setFormData({...formData, capacity: v})} />
          <SelectBox label="Bino" options={auxiliaryData.buildings} value={formData.buildingId} 
            onChange={(v: string) => setFormData({...formData, buildingId: v})} />
        </div>
      )}

      {(activeTab === 'groups' || activeTab === 'departments') && (
        <div className="grid grid-cols-2 gap-6">
          <SelectBox label="Fakultet" options={auxiliaryData.faculties} value={formData.facultyId} 
            onChange={(v: string) => setFormData({...formData, facultyId: v})} />
          {activeTab === 'groups' && 
            <InputItem label="Kurs" type="number" value={formData.course} 
              onChange={(v) => setFormData({...formData, course: v})} />}
        </div>
      )}
    </div>
  );
};