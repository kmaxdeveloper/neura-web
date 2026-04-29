import { InputItem, SelectBox } from '../components/FormElements';

export const TopicForm = ({ formData, setFormData, auxiliaryData }: any) => {
  return (
    <div className="md:col-span-2 space-y-6">
      <SelectBox 
        label="Fan (Subject)" 
        options={auxiliaryData.subjects} 
        value={formData.subjectId} 
        onChange={(v: string) => setFormData({...formData, subjectId: v})} 
      />
      <InputItem 
        label="Mavzu Nomi (Topic Title)" 
        value={formData.title} 
        onChange={(v: string) => setFormData({...formData, title: v})} 
      />
      <div className="space-y-3">
        <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-3">
          Tavsif (Description)
        </label>
        <textarea 
          value={formData.description || ""} 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
          className="w-full bg-[var(--surface-input)] border border-[var(--border-subtle)] p-5 rounded-[22px] outline-none focus:border-cyan-500/50 text-[var(--text-primary)] text-sm font-bold transition-all min-h-[100px]"
          placeholder="Mavzu haqida qisqacha ma'lumot..."
        />
      </div>
    </div>
  );
};
