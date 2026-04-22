import React from 'react';
import { InputItem, SelectBox } from '../components/FormElements';

interface GenericFormProps {
  activeTab: string;
  formData: any;
  setFormData: (data: any) => void;
  auxiliaryData: {
    buildings: any[];
    faculties: any[];
  };
}

export const GenericForm: React.FC<GenericFormProps> = ({ 
  activeTab, 
  formData, 
  setFormData, 
  auxiliaryData 
}) => {
  const isInfra = activeTab === 'infrastructure';
  const isGroup = activeTab === 'groups';
  const isDepartment = activeTab === 'departments';

  return (
    <div className="md:col-span-2 space-y-6">
      {/* 1. Asosiy Nom yoki Raqam maydoni */}
      <div className="relative">
        <InputItem 
          label={isInfra ? "Xona Raqami" : "Nomi / Sarlavhasi"} 
          value={isInfra ? (formData.roomNumber || formData.name) : formData.name} 
          onChange={(v: string) => setFormData(isInfra ? { ...formData, roomNumber: v } : { ...formData, name: v })} 
        />
      </div>

      {/* 2. Xonalar (Infrastructure) uchun qo'shimcha maydonlar */}
      {isInfra && (
        <div className="grid grid-cols-2 gap-6">
          <InputItem 
            label="Sig'im (Odam soni)" 
            type="number" 
            value={formData.capacity} 
            onChange={(v: any) => setFormData({ ...formData, capacity: v })} 
          />
          <SelectBox 
            label="Bino" 
            options={auxiliaryData.buildings} 
            value={formData.buildingId} 
            onChange={(v: string) => setFormData({ ...formData, buildingId: v })} 
          />
        </div>
      )}

      {/* 3. Guruhlar va Kafedralar uchun Fakultet tanlovi */}
      {(isGroup || isDepartment) && (
        <div className="grid grid-cols-2 gap-6">
          <SelectBox 
            label="Tegishli Fakultet" 
            options={auxiliaryData.faculties} 
            value={formData.facultyId} 
            onChange={(v: string) => setFormData({ ...formData, facultyId: v })} 
          />
          
          {/* Faqat guruhlar uchun Kurs raqami */}
          {isGroup && (
            <InputItem 
              label="Kurs" 
              type="number" 
              value={formData.course} 
              onChange={(v: any) => setFormData({ ...formData, course: v })} 
            />
          )}
        </div>
      )}

      {/* 4. Agar oddiy bino yoki fakultet bo'lsa, qo'shimcha maydon shart emas */}
      {['faculties', 'buildings', 'patoklar'].includes(activeTab) && (
        <p className="text-[10px] text-slate-600 font-mono uppercase tracking-widest ml-3 italic">
          * Ushbu bo'lim uchun faqat nom kiritish kifoya.
        </p>
      )}
    </div>
  );
};