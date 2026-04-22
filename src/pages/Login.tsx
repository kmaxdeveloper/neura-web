import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { 
  Lock, User, ArrowRight, Loader2, 
  School, Eye, EyeOff, ShieldCheck 
} from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await client.post('/api/v1/auth/login', { 
        username: username, 
        password: password 
      });
      
      const { token, role } = res.data; 

      if (token && auth) {
        // MUHIM: 3 ta argument yuborilyapti (token, role, fullData)
        // Error yo'qolishi uchun uchinchi argument sifatida butun res.data yuborildi
        auth.login(token, role, res.data); 
        
        console.log("Muvaffaqiyatli kirildi! Rol:", role);
        navigate('/', { replace: true }); 
      }
    } catch (err: any) {
      console.error("Login xatosi:", err.response?.data || err.message);
      alert("Xatolik: " + (err.response?.data?.message || "Login yoki parol xato!"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-0 md:p-6 font-sans text-white">
      
      {/* Asosiy Konteyner */}
      <div className="w-full max-w-[1100px] min-h-[650px] bg-[#0A0A0A] rounded-none md:rounded-[40px] shadow-[0_20px_80px_rgba(0,0,0,0.8)] overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-white/5 animate-in fade-in duration-1000">
        
        {/* --- CHAP TOMON: Vizual qism --- */}
        <div className="relative hidden md:block overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2000&auto=format&fit=crop" 
            alt="AI Technology" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 transition-transform duration-[2000ms] group-hover:scale-110"
          />
          {/* Siyohrang-qora gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
          
          {/* Logo va Matn */}
          <div className="relative z-10 h-full flex flex-col justify-between p-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <School className="text-black" size={24} strokeWidth={3} />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">Neura<span className="text-cyan-500"> System</span></h1>
            </div>
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <ShieldCheck size={14} /> Neura Access Control
              </div>
              <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.9] text-white">
                <span className="text-cyan-500">Tizimga</span> <br /> Kirish
              </h2>
              <p className="text-slate-500 max-w-sm text-sm font-medium leading-relaxed italic pt-4">
                Yuzni aniqlash va neyron tarmoqlar asosida boshqariladigan innovatsion platforma.
              </p>
            </div>
          </div>
        </div>

        {/* --- O'NG TOMON: Login Formasi --- */}
        <div className="p-8 md:p-16 flex flex-col justify-center bg-white/[0.01]">
          
          {/* Mobile Logo (Faqat telefonda ko'rinadi) */}
          <div className="flex items-center gap-2 md:hidden mb-10">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
              <School className="text-black" size={18} strokeWidth={3} />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tighter text-white italic">Uni<span className="text-cyan-500">Face</span></h1>
          </div>

          <div className="mb-10">
            <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-2">Avtorizatsiya</h3>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Xush Kelibsiz</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Username / ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  required
                  placeholder="ID raqamingizni kiriting"
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl text-white text-sm outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all placeholder:text-slate-700"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Parol</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-cyan-500 transition-colors" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 p-4 pl-12 pr-12 rounded-2xl text-white text-sm outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all placeholder:text-slate-700"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button 
              disabled={isLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all mt-8 shadow-[0_10px_30px_rgba(6,182,212,0.2)]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  TIZIMGA KIRISH <ArrowRight size={20} strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-[10px] text-center text-slate-700 font-bold uppercase tracking-widest">
            &copy; {new Date().getFullYear()} UniFace AI Technology
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;