import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ROLES } from '../constants/roles'; 
import { 
  LayoutDashboard, 
  Users, 
  BrainCircuit, 
  LogOut, 
  ShieldCheck, 
  UserCircle,
  Activity,
  CalendarRange, // Ustozlar jadvali uchun
  Clock          // Talabalar jadvali uchun
} from 'lucide-react';

const Sidebar = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  
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
      { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/admin/dashboard' },
      { name: 'UniFace Logs', icon: <Users size={20}/>, path: '/admin/attendance' },
      { name: 'Security', icon: <ShieldCheck size={20}/>, path: '/admin/security' },
    ],
    [ROLES.TEACHER]: [
      { name: 'Dashboard', icon: <LayoutDashboard size={20}/>, path: '/teacher/dashboard' },
      { name: 'Schedule', icon: <CalendarRange size={20}/>, path: '/teacher/schedule' }, // Matrix jadvali
      { name: 'My Groups', icon: <Users size={20}/>, path: '/teacher/groups' },
      { name: 'Mizan AI', icon: <BrainCircuit size={20}/>, path: '/teacher/mizan' },
    ],
    [ROLES.STUDENT]: [
      { name: 'My Profile', icon: <UserCircle size={20}/>, path: '/student/dashboard' },
      { name: 'Timetable', icon: <Clock size={20}/>, path: '/student/timetable' }, // Talaba dars jadvali
      { name: 'Attendance', icon: <Activity size={20}/>, path: '/student/attendance' },
    ]
  };

  const currentMenuItems = user?.role ? (menuConfig[user.role as keyof typeof menuConfig] || []) : [];
  const displayName = String(user?.fullName || user?.username || "Admin");

  return (
    <div className="w-64 h-screen border-r border-white/5 bg-[#080808] flex flex-col p-6 sticky top-0">
      
      {/* LOGO BLOCK */}
      <div className="flex items-center gap-3 mb-10 group">
        <div className={`w-9 h-9 ${theme.bg} rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center transition-transform group-hover:rotate-12`}>
            <span className="text-black font-black text-xs italic">N</span>
        </div>
        <div>
          <span className="text-xl font-black tracking-tighter text-white uppercase italic block leading-none">NEURA</span>
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
                ? `bg-white/[0.03] ${theme.color} ${theme.border} shadow-xl` 
                : 'text-slate-500 border-transparent hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`${isActive ? theme.color : 'group-hover:text-white'} transition-colors`}>
                {item.icon}
              </div>
              <span className="font-bold text-sm tracking-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* USER PROFILE & LOGOUT */}
      <div className="mt-auto border-t border-white/5 pt-6 space-y-4">
        {user && (
          <div className="px-3 flex items-center gap-3 py-3 bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden group hover:border-white/10 transition-colors">
            <div className={`min-w-[32px] w-8 h-8 rounded-lg ${theme.bg} flex items-center justify-center text-[10px] font-black text-black uppercase`}>
              {displayName.charAt(0)}
            </div>
            
            <div className="overflow-hidden">
              <p className="text-[11px] font-black text-white truncate uppercase tracking-tighter">
                {displayName}
              </p>
              <p className={`text-[8px] ${theme.color} font-mono truncate uppercase tracking-[0.2em]`}>
                {String(user?.role || '').replace('ROLE_', '')}
              </p>
            </div>
          </div>
        )}

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