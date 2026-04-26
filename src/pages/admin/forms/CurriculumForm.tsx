import { InputItem, SelectBox } from '../components/FormElements';

export const CurriculumForm = ({ formData, setFormData, auxiliaryData }: any) => {
  return (
    <div className="md:col-span-2 space-y-6">
      <SelectBox label="Fan" options={auxiliaryData.subjects} value={formData.subjectId} 
        onChange={(v: string) => setFormData({...formData, subjectId: v})} />
      <SelectBox label="Guruh" options={auxiliaryData.groups} labelKey="name" value={formData.groupId} 
        onChange={(v: string) => setFormData({...formData, groupId: v})} />
      <div className="grid grid-cols-2 gap-6">
        <InputItem label="Semester" type="number" value={formData.semester} 
          onChange={(v: string) => setFormData({...formData, semester: v})} />
        <InputItem label="Haftalik Soat" type="number" value={formData.hoursPerWeek} 
          onChange={(v: string) => setFormData({...formData, hoursPerWeek: v})} />
      </div>
    </div>
  );
};