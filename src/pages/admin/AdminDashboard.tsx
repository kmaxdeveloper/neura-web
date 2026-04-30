import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  LayoutGrid, 
  Activity, 
  Database, 
  ArrowUpRight, 
  Settings2 
} from 'lucide-react';
import ServerTime from '../../components/ServerTime';
import { useLanguage } from '../../context/LanguageContext';

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();

  const cards = [
    { title: t('data_import'), path: '/admin/import', icon: Database, desc: 'Excel orqali talabalar va fanlarni yuklash.' },
    { title: t('matrix_solver'), path: '/admin/matrix', icon: LayoutGrid, desc: 'Avtomatik dars jadvalini shakllantirish.' },
    { title: t('manual_control'), path: '/admin/management', icon: Users, desc: 'Baza ma\'lumotlarini qo\'lda boshqarish.' },
    { title: t('system_logs'), path: '/admin/logs', icon: Activity, desc: 'Tizim harakatlarini monitoring qilish.' },
    { title: t('settings'), path: '/admin/settings', icon: Settings2, desc: 'Tizim parametrlarini sozlash.' },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-6xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">
            {t('control_center').split(' ')[0]} <span className="text-cyan-500 not-italic text-glow-cyan">{t('control_center').split(' ')[1] || 'Center'}</span>
          </h1>
          <p className="text-[var(--text-secondary)] font-mono text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em]">
            Neura OS // Admin Terminal // v1.0.2 // {t('data_active')}
          </p>
        </div>
        <ServerTime />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {cards.map((card, i) => (
          <Link key={i} to={card.path} className="group p-6 md:p-8 border border-[var(--border-subtle)] bg-[var(--surface-card)] rounded-[30px] md:rounded-[40px] hover:border-cyan-500/40 hover:bg-cyan-500/[0.05] transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-cyan-500/10">
            <div className="absolute top-6 right-6 p-2 bg-cyan-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-y-2 group-hover:translate-y-0">
               <ArrowUpRight className="text-cyan-500" size={20} />
            </div>
            <card.icon className="text-cyan-500 mb-6 group-hover:scale-110 transition-transform duration-500" size={32} />
            <h2 className="text-2xl font-bold uppercase italic text-[var(--text-primary)]">{card.title}</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;