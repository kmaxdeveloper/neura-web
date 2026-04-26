import React, { useState, useMemo, useEffect } from 'react';
import api from '../../api';
import ServerTime from '../../components/ServerTime';
import { 
  Shield, Search, Download, 
  Terminal as TerminalIcon, 
  Cpu, Network, ChevronDown, 
  RefreshCcw, Filter, Eye,
  Activity, Globe, User, Clock
} from 'lucide-react';

interface LogEntry {
  id: string;
  action: string;
  username: string;
  role: string;
  timestamp: string;
  status: string;
  ipAddress: string;
  details: string;
  category: string;
  method: string;
  endpoint: string;
}

const SystemLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const fetchLogs = async () => {
    setIsRefreshing(true);
    try {
      const response = await api.get('/api/v1/admin/logs');
      console.log("Fetched logs:", response.data);
      setLogs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Logs yuklashda xatolik:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const exportToCSV = () => {
    if (logs.length === 0) return;
    
    const headers = ['ID', 'Action', 'Username', 'Role', 'Time', 'Status', 'IP', 'Method', 'Endpoint', 'Category'];
    const rows = logs.map(log => [
      log.id,
      log.action,
      log.username,
      log.role,
      log.timestamp,
      log.status,
      log.ipAddress,
      log.method,
      log.endpoint,
      log.category
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `system_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
        log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        activeFilter === 'ALL' || 
        log.status === activeFilter || 
        log.category === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [logs, searchTerm, activeFilter]);

  const getStatusColor = (status: string) => {
    const s = status.toUpperCase();
    if (s.includes('SUCCESS') || s.includes('OK')) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (s.includes('WARN')) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    if (s.includes('CRIT') || s.includes('ERR') || s.includes('FAIL')) return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
    return 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20';
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-6 pb-20">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-cyan-500/10 rounded-[28px] border border-cyan-500/20 text-cyan-500 relative">
            <Shield size={28} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--surface-base)]" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] uppercase italic tracking-tighter">System <span className="text-cyan-500">Analytics</span></h1>
            <p className="text-[var(--text-secondary)] font-mono text-[9px] uppercase tracking-[0.3em] flex items-center gap-2">
              <Activity size={10} className="text-emerald-500 animate-pulse" /> Real-time Kernel Monitoring
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <ServerTime />
          <button 
            onClick={fetchLogs} 
            disabled={isRefreshing}
            className={`p-3 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] hover:text-cyan-500 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
          >
            <RefreshCcw size={18} />
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-black text-[9px] uppercase tracking-widest italic rounded-xl shadow-lg shadow-cyan-500/10 hover:bg-cyan-400 transition-all active:scale-95"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* 2. Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', val: logs.length, icon: TerminalIcon, col: 'text-purple-500' },
          { label: 'Security Level', val: 'ALPHA', icon: Shield, col: 'text-cyan-500' },
          { label: 'DB Latency', val: '14ms', icon: Cpu, col: 'text-emerald-500' },
          { label: 'Active Nodes', val: '4', icon: Network, col: 'text-amber-500' },
        ].map((s, i) => (
          <div key={i} className="p-5 bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[24px] flex items-center gap-4 group hover:border-cyan-500/20 transition-all">
            <div className={`p-2.5 rounded-xl bg-black/20 ${s.col}`}><s.icon size={18} /></div>
            <div>
              <div className="text-lg font-black text-[var(--text-primary)] italic uppercase leading-none">{s.val}</div>
              <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-[var(--surface-card)] p-3 rounded-[28px] border border-[var(--border-subtle)] shadow-xl">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
          <input 
            type="text" 
            placeholder="Search action, user or details..."
            className="w-full bg-[var(--surface-hover)] border border-transparent p-3 pl-12 rounded-xl text-xs outline-none focus:border-cyan-500/20 transition-all font-bold text-[var(--text-primary)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter size={14} className="text-[var(--text-muted)] ml-2 shrink-0" />
          {['ALL', 'SUCCESS', 'WARNING', 'CRITICAL', 'AUTH', 'SYSTEM', 'DATABASE', 'SERVICE'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-[9px] font-black uppercase italic transition-all shrink-0 border ${
                activeFilter === f 
                ? 'bg-cyan-500 text-black border-cyan-500 shadow-md shadow-cyan-500/10' 
                : 'text-[var(--text-muted)] border-transparent hover:bg-[var(--surface-hover)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Logs Content */}
      <div className="bg-[var(--surface-card)] border border-[var(--border-subtle)] rounded-[32px] overflow-hidden shadow-2xl relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 border-b border-[var(--border-subtle)]">
                <th className="p-5 text-[9px] font-black uppercase tracking-widest text-cyan-500/60">Protocol / Action</th>
                <th className="p-5 text-[9px] font-black uppercase tracking-widest text-cyan-500/60">Authorized User</th>
                <th className="p-5 text-[9px] font-black uppercase tracking-widest text-cyan-500/60">Timestamp</th>
                <th className="p-5 text-[9px] font-black uppercase tracking-widest text-cyan-500/60">Status</th>
                <th className="p-5 text-[9px] font-black uppercase tracking-widest text-cyan-500/60 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <tr 
                      onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                      className={`group cursor-pointer transition-colors ${expandedId === log.id ? 'bg-cyan-500/[0.05]' : 'hover:bg-white/[0.02]'}`}
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-black/20 ${
                            expandedId === log.id ? 'text-cyan-500' : 
                            log.category === 'SERVICE' ? 'text-purple-400' :
                            log.category === 'AUTH' ? 'text-emerald-400' :
                            'text-[var(--text-muted)]'
                          }`}>
                             {log.category === 'SERVICE' ? <Activity size={14} /> : <TerminalIcon size={14} />}
                          </div>
                          <div>
                            <p className="font-mono text-xs font-bold text-[var(--text-primary)] group-hover:text-cyan-500 transition-colors uppercase">{log.action}</p>
                            <p className={`text-[8px] uppercase font-black tracking-widest mt-0.5 ${
                              log.category === 'SERVICE' ? 'text-purple-500/80' : 
                              log.category === 'AUTH' ? 'text-emerald-500/80' : 
                              'text-[var(--text-muted)]'
                            }`}>{log.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-[var(--surface-hover)] rounded-lg text-cyan-500/60"><User size={12} /></div>
                          <div className="flex flex-col">
                            <span className="text-xs font-black italic uppercase text-[var(--text-primary)]">{log.username}</span>
                            <span className="text-[8px] font-mono text-[var(--text-muted)] uppercase tracking-tighter">{log.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center gap-2 text-[var(--text-muted)] font-mono text-[10px]">
                           <Clock size={12} className="opacity-40" />
                           {log.timestamp}
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <button className={`p-2 transition-transform duration-300 ${expandedId === log.id ? 'rotate-180 text-cyan-500' : 'text-[var(--text-muted)]'}`}>
                          <ChevronDown size={16} />
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expandable Detail Row */}
                    {expandedId === log.id && (
                      <tr className="bg-black/20 animate-in slide-in-from-top-2 duration-300">
                        <td colSpan={5} className="p-8 border-t border-cyan-500/10">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-4">
                               <div className="flex items-center gap-2 text-cyan-500 mb-2">
                                 <Eye size={14} />
                                 <span className="text-[9px] font-black uppercase tracking-widest italic">Technical Payload</span>
                               </div>
                               <div className="bg-black/30 p-6 rounded-2xl border border-white/5 font-mono text-[11px] leading-relaxed text-[var(--text-secondary)] whitespace-pre-wrap italic">
                                 {log.details || "No additional metadata provided by the kernel."}
                               </div>
                            </div>
                            <div className="space-y-6">
                               <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                  <div className="flex items-center gap-2 text-emerald-500 mb-3">
                                    <Globe size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Network Origin</span>
                                  </div>
                                  <p className="text-xs font-black text-[var(--text-primary)] font-mono">{log.ipAddress}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                     <span className="text-[8px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-500 rounded font-bold">{log.method}</span>
                                     <span className="text-[8px] text-[var(--text-muted)] font-mono truncate">{log.endpoint}</span>
                                  </div>
                               </div>
                               <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                                  <div className="flex items-center gap-2 text-cyan-500 mb-3">
                                    <Activity size={14} />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Action Sequence</span>
                                  </div>
                                  <p className="text-[10px] font-mono text-[var(--text-muted)] tracking-tighter truncate">UUID: {log.id}</p>
                               </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                       <Shield size={48} strokeWidth={1} />
                       <p className="text-sm font-black uppercase italic tracking-widest italic">No matching logs found in secure storage</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;
