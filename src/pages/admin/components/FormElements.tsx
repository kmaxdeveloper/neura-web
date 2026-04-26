// components/FormElements.tsx
import React from 'react';
import { ChevronDown, Save } from 'lucide-react';

export const SelectBox: React.FC<any> = ({ label, options, onChange, labelKey = "name", value }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-3">{label}</label>
    <div className="relative group">
      <select value={value || ""} required onChange={(e) => onChange(e.target.value)} className="w-full bg-[var(--surface-input)] border border-[var(--border-subtle)] p-5 rounded-[22px] outline-none focus:border-cyan-500/50 text-[var(--text-primary)] text-sm appearance-none cursor-pointer font-bold transition-all">
        <option value="">Resursni tanlang...</option>
        {options.map((opt: any, idx: number) => <option key={opt.id || idx} value={opt.id} className="bg-[var(--surface-card)]">{opt[labelKey] || opt.name}</option>)}
      </select>
      <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none group-focus-within:text-cyan-500 transition-colors" />
    </div>
  </div>
);

export const InputItem: React.FC<any> = ({ label, onChange, type = "text", value }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-3">{label}</label>
    <input type={type} value={value || ""} required onChange={(e) => onChange(e.target.value)} className="w-full bg-[var(--surface-input)] border border-[var(--border-subtle)] p-5 rounded-[22px] outline-none focus:border-cyan-500/50 text-[var(--text-primary)] text-sm font-bold transition-all" />
  </div>
);

export const MultiSelect: React.FC<any> = ({ label, items, selectedItems, onToggle, labelKey = "name" }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest ml-3">{label}</label>
    <div className="bg-[var(--surface-input)] border border-[var(--border-subtle)] p-4 rounded-[25px] max-h-48 overflow-y-auto space-y-2 scrollbar-hide">
      {items.map((item: any, idx: number) => {
        const isSelected = (selectedItems || []).map(Number).includes(Number(item.id));
        return (
          <div key={item.id || idx} onClick={() => onToggle(item.id)} className={`cursor-pointer px-4 py-3 rounded-xl text-xs transition-all flex justify-between items-center group/item ${isSelected ? 'bg-cyan-500 text-black font-black italic scale-[0.98]' : 'bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]'}`}>
            {item[labelKey] || item.name}
            {isSelected && <Save size={12} className="opacity-40" />}
          </div>
        );
      })}
    </div>
  </div>
);