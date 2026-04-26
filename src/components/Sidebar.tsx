import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ROLES } from '../constants/roles'; 
import { 
  LayoutDashboard, 
  Shield, 
  Users, 
  BrainCircuit, 
  LogOut, 
  UserCircle,
  Activity,
  CalendarRange, 
  Clock,
  Settings2
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const user = auth?.user as any;

  const getRoleTheme = () => {
    const role = user?.role;
    switch(role) {
      case ROLES.ADMIN: 
        return { color: 'text-cyan-400', bg: 'bg-cyan-500', shadow: 'shadow-cyan-500/20', border: 'border-cyan-500/20' };
      case ROLES.TEACHER: 
        return { color: 'text-purple-400', bg: 'bg-purple-500', shadow: 'shadow-purple-500/20', border: 'border-purple-500/20' };
      case ROLES.STUDENT: 
        return { color: 'text-emerald-400', bg: 'bg-emerald-500', shadow: 'shadow-emerald-500/20', border: 'border-emerald-500/20' };
      default: 
        return { color: 'text-cyan-400', bg: 'bg-cyan-500', shadow: 'shadow-cyan-500/20', border: 'border-cyan-500/20' };
    }
  };

  const theme = getRoleTheme();

  const menuConfig = {
    [ROLES.ADMIN]: [
      { name: t('dashboard'), icon: <LayoutDashboard size={20}/>, path: '/admin/dashboard' },
      { name: t('logs'), icon: <Shield size={20}/>, path: '/admin/logs' },
      { name: t('settings'), icon: <Settings2 size={20}/>, path: '/admin/settings' },
    ],
    [ROLES.TEACHER]: [
      { name: t('dashboard'), icon: <LayoutDashboard size={20}/>, path: '/teacher/dashboard' },
      { name: t('schedule'), icon: <CalendarRange size={20}/>, path: '/teacher/schedule' },
      { name: t('groups'), icon: <Users size={20}/>, path: '/teacher/groups' },
      { name: t('mizan'), icon: <BrainCircuit size={20}/>, path: '/teacher/mizan' },
    ],
    [ROLES.STUDENT]: [
      { name: t('profile'), icon: <UserCircle size={20}/>, path: '/student/dashboard' },
      { name: t('timetable'), icon: <Clock size={20}/>, path: '/student/timetable' },
      { name: t('attendance'), icon: <Activity size={20}/>, path: '/student/attendance' },
      { name: t('mizan'), icon: <BrainCircuit size={20}/>, path: '/student/mizan' },
    ]
  };

  const currentMenuItems = user?.role ? (menuConfig[user.role as keyof typeof menuConfig] || []) : [];
  const displayName = String(user?.fullName || user?.username || "Admin");

  return (
    <div className="w-full h-full flex flex-col p-6 transition-colors duration-300 overflow-hidden">
      
      {/* LOGO BLOCK */}
      <div className="flex items-center gap-3 mb-10 group">
        <div className={`w-9 h-9 ${theme.bg} rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center transition-transform group-hover:rotate-12`}>
            <span className="text-black font-black text-xs italic">N</span>
        </div>
        <div>
          <span className="text-xl font-black tracking-tighter text-[var(--text-primary)] uppercase italic block leading-none">NEURA</span>
          <span className={`text-[9px] ${theme.color} font-mono tracking-[0.2em] uppercase`}>Control OS</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
        {currentMenuItems.map((item: any) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex items-center gap-4 p-3.5 rounded-2xl transition-all duration-300 group border ${
                isActive 
                ? `bg-[var(--surface-hover)] ${theme.color} ${theme.border} shadow-xl` 
                : 'text-[var(--text-secondary)] border-transparent hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]'
              }`}
            >
              <div className={`${isActive ? theme.color : 'group-hover:text-[var(--text-primary)]'} transition-colors`}>
                {item.icon}
              </div>
              <span className="font-bold text-sm tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* SYSTEM CONTROLS */}
      <div className="border-t border-[var(--border-subtle)] pt-4 space-y-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* USER PROFILE & LOGOUT */}
      <div className="mt-auto border-t border-[var(--border-subtle)] pt-6 space-y-4">
        {user && (() => {
          const roleSlug = String(user.role || '').toLowerCase().replace('role_', '').trim();
          const profilePath = `/${roleSlug}/profile`;
          
          return (
            <div 
              onClick={() => navigate(profilePath)}
              className="px-3 flex items-center gap-3 py-3 bg-[var(--surface-hover)] rounded-2xl border border-[var(--border-subtle)] overflow-hidden group hover:border-cyan-500/30 transition-all cursor-pointer shadow-lg hover:shadow-cyan-500/5 active:scale-95"
            >
              <div className={`min-w-[32px] w-8 h-8 rounded-lg ${theme.bg} flex items-center justify-center text-[10px] font-black text-black uppercase group-hover:scale-110 transition-transform`}>
                {displayName.charAt(0)}
              </div>
              
              <div className="flex-1 overflow-hidden">
                <p className="text-[11px] font-black text-[var(--text-primary)] truncate uppercase tracking-tighter group-hover:text-cyan-500 transition-colors">
                  {displayName}
                </p>
                <p className={`text-[8px] ${theme.color} font-mono truncate uppercase tracking-[0.2em] opacity-60`}>
                  {roleSlug}
                </p>
              </div>
            </div>
          );
        })()}

        <button 
          onClick={() => auth?.logout()}
          className="flex items-center gap-4 w-full p-3.5 rounded-2xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 group"
        >
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase text-[10px] tracking-[0.2em]">Log out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;