import React from 'react';
import { 
  BookOpen, GraduationCap, Users, 
  BrainCircuit, Award, Star, History,
  Mail, Calendar, Trophy, Sparkles,
  Camera, FileText, Share2, Heart
} from 'lucide-react';
import ServerTime from '../../components/ServerTime';

const TeacherProfile: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-10 pb-20 text-[var(--text-primary)]">
      
      {/* 1. ACADEMIC HEADER */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10 rounded-[60px] blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
        <div className="relative bg-[var(--surface-card)] border border-purple-500/20 rounded-[60px] p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden shadow-2xl">
          
          <div className="flex items-center gap-10 z-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-[48px] bg-gradient-to-br from-purple-500 to-indigo-600 p-1 shadow-2xl shadow-purple-500/30">
                <div className="w-full h-full rounded-[44px] bg-[var(--surface-base)] flex items-center justify-center overflow-hidden">
                  <span className="text-5xl font-black text-purple-500 italic">P</span>
                </div>
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-white text-black rounded-2xl shadow-xl hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <h1 className="text-5xl font-black uppercase italic tracking-tighter">Prof. John <span className="text-purple-500">Doe</span></h1>
                <div className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full flex items-center gap-2">
                   <Star size={12} className="text-purple-500" fill="currentColor" />
                   <span className="text-[10px] font-black text-purple-500 uppercase tracking-widest italic">4.9 Rating</span>
                </div>
              </div>
              <p className="text-lg font-bold text-[var(--text-secondary)] italic flex items-center gap-3">
                Senior Lecturer // <span className="text-purple-500 underline decoration-2 underline-offset-4">Department of AI Engineering</span>
              </p>
              <div className="flex gap-4 pt-2">
                 {['Curriculum', 'Research', 'Mentor'].map(t => (
                   <span key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">#{t}</span>
                 ))}
              </div>
            </div>
          </div>

          <ServerTime />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* 2. STATS & ACHIVEMENTS (Left) */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[50px] p-10 space-y-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 bg-purple-500/[0.03] rounded-full -mr-12 -mt-12" />
             
             <h3 className="text-sm font-black uppercase italic tracking-[0.3em] text-purple-500 flex items-center gap-3">
               <Trophy size={16} /> Academic Impact
             </h3>

             <div className="space-y-6">
                {[
                  { label: 'Total Students', val: '1,240', icon: Users, color: 'text-cyan-500' },
                  { label: 'Courses Taught', val: '18', icon: BookOpen, color: 'text-purple-500' },
                  { label: 'Mizan Score', val: '98%', icon: BrainCircuit, color: 'text-amber-500' },
                  { label: 'Awards Won', val: '12', icon: Award, color: 'text-rose-500' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-purple-500/20 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-2xl bg-black/20 ${s.color} group-hover:scale-110 transition-transform`}><s.icon size={24} /></div>
                      <div>
                        <p className="text-2xl font-black italic">{s.val}</p>
                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">{s.label}</p>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
           </div>

           <div className="p-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[40px] text-black shadow-2xl shadow-purple-500/20 group">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/20 rounded-2xl"><Sparkles size={24} /></div>
                <h4 className="text-xl font-black uppercase italic leading-none">Next Lecture</h4>
              </div>
              <p className="font-bold italic text-white/90">Advanced Neural Networks // Room 402</p>
              <div className="mt-6 pt-6 border-t border-black/10 flex justify-between items-center">
                 <span className="text-[10px] font-black uppercase tracking-widest">Starts in 45m</span>
                 <button className="px-4 py-2 bg-black text-white text-[9px] font-black uppercase rounded-xl hover:scale-105 transition-transform">Get QR Code</button>
              </div>
           </div>
        </div>

        {/* 3. DETAILS & ACTIONS (Right) */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[60px] p-12 shadow-2xl relative">
            <h3 className="text-xl font-black uppercase italic text-[var(--text-primary)] mb-10 flex items-center gap-4">
               <FileText className="text-purple-500" /> Academic Dossier
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-8">
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Official Email</label>
                   <div className="flex items-center gap-4 p-5 bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-3xl">
                     <Mail size={20} className="text-purple-500" />
                     <span className="text-sm font-bold truncate">j.doe@university.edu</span>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Academic Status</label>
                   <div className="flex items-center gap-4 p-5 bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-3xl">
                     <GraduationCap size={20} className="text-purple-500" />
                     <span className="text-sm font-bold">Senior Research Fellow</span>
                   </div>
                 </div>
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] ml-1">Office Location</label>
                   <div className="flex items-center gap-4 p-5 bg-[var(--surface-hover)] border border-[var(--border-subtle)] rounded-3xl">
                     <Calendar size={20} className="text-purple-500" />
                     <span className="text-sm font-bold">Tech Tower, Wing B-102</span>
                   </div>
                 </div>
               </div>

               <div className="bg-black/10 rounded-[48px] p-10 border border-white/5 space-y-8 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-6 opacity-10"><Heart size={80} className="text-purple-500" /></div>
                 <h4 className="text-sm font-black uppercase italic text-purple-500 tracking-widest relative z-10">Student Feedback</h4>
                 <p className="text-sm font-medium italic leading-relaxed text-[var(--text-secondary)] relative z-10">"The way Prof. Doe explains backpropagation is incredibly intuitive. Always supportive during office hours."</p>
                 <div className="pt-6 border-t border-white/5 flex gap-3 relative z-10">
                   <button className="flex-1 py-4 bg-purple-500 text-black font-black uppercase italic text-[9px] rounded-2xl shadow-lg shadow-purple-500/20">Read Reviews</button>
                   <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all text-purple-500"><Share2 size={18} /></button>
                 </div>
               </div>
            </div>
          </div>

          <div className="p-10 bg-purple-500/[0.02] border border-purple-500/10 rounded-[60px] flex flex-col md:flex-row items-center justify-between gap-10 shadow-inner">
             <div className="flex items-center gap-6">
                <div className="p-4 bg-purple-500/10 rounded-3xl text-purple-500"><History size={32} /></div>
                <div>
                   <h4 className="text-lg font-black uppercase italic">Activity Stream</h4>
                   <p className="text-xs text-[var(--text-muted)] font-medium">Last updated student grades 2 hours ago. Matrix solver synchronized.</p>
                </div>
             </div>
             <button className="px-10 py-5 bg-[var(--surface-card)] border border-purple-500/30 text-purple-500 font-black uppercase italic text-[10px] tracking-widest rounded-3xl hover:bg-purple-500 hover:text-black transition-all shadow-2xl">
                View All Activity
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
