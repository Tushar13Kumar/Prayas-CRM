import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import AddLeadForm from '../components/AddLeadForm';
import useFetch from '../hooks/useFetch';
import { Link } from 'react-router-dom';

// ── Icons ─────────────────────────────────────────────────────
const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);
const ChevronIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ── Status & Priority config ──────────────────────────────────
const STATUS_CONFIG = {
  New:            { bg: '#eef2ff', color: '#4338ca', dot: '#6366f1' },
  Contacted:      { bg: '#fffbeb', color: '#92400e', dot: '#f59e0b' },
  Qualified:      { bg: '#f0fdf4', color: '#166534', dot: '#22c55e' },
  'Proposal Sent':{ bg: '#fdf4ff', color: '#6b21a8', dot: '#a855f7' },
  Closed:         { bg: '#f0fdf4', color: '#166534', dot: '#22c55e' },
};
const PRIORITY_CONFIG = {
  High:   { bg: '#fef2f2', color: '#b91c1c' },
  Medium: { bg: '#fffbeb', color: '#b45309' },
  Low:    { bg: '#f0fdf4', color: '#15803d' },
};

// ── Stat Card ─────────────────────────────────────────────────
const StatCard = ({ icon, label, value, accent, accentBg }) => (
  <div style={{
    background: 'white', border: '1px solid #e2e8f0', borderRadius: '14px',
    padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px',
  }}>
    <div style={{
      width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: accentBg, color: accent,
    }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 4px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
      <p style={{ fontSize: '26px', fontWeight: '600', margin: 0, color: accent, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</p>
    </div>
  </div>
);

// ── Dashboard ─────────────────────────────────────────────────
const Dashboard = () => {
  const { leads, deleteLead } = useLeads();
  const [activeFilter, setActiveFilter]               = useState("All");
  const [searchTerm, setSearchTerm]                   = useState("");
  const [selectedAgentFilter, setSelectedAgentFilter] = useState("All");
  const [sortBy, setSortBy]                           = useState("Priority");

  const { data: agents } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  const stats = {
    new:       leads?.filter(l => l.status === "New").length       || 0,
    contacted: leads?.filter(l => l.status === "Contacted").length || 0,
    qualified: leads?.filter(l => l.status === "Qualified").length || 0,
    total:     leads?.length || 0,
  };

  const priorityOrder = { High: 3, Medium: 2, Low: 1 };
  const finalLeads = leads
    ?.filter(lead => {
      const matchesStatus = activeFilter === "All" || lead.status === activeFilter;
      const matchesAgent  = selectedAgentFilter === "All" || lead.salesAgent?._id === selectedAgentFilter;
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesAgent && matchesSearch;
    })
    ?.sort((a, b) => {
      if (sortBy === "Priority")      return priorityOrder[b.priority] - priorityOrder[a.priority];
      if (sortBy === "Time to Close") return a.timeToClose - b.timeToClose;
      return 0;
    });

  return (
    <div style={{ fontFamily: "'Sora','Segoe UI',sans-serif" }}>

      {/* PAGE HEADER */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'28px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <h1 style={{ fontSize:'24px', fontWeight:'600', color:'#0f172a', margin:'0 0 4px', letterSpacing:'-0.02em' }}>Dashboard</h1>
          <p style={{ fontSize:'13px', color:'#94a3b8', margin:0 }}>Welcome back, Admin — here's today's overview</p>
        </div>
        <div style={{ fontSize:'13px', color:'#64748b', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', padding:'6px 14px', fontWeight:'500' }}>
          {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'28px' }} className="stats-grid">
        <StatCard icon={<StarIcon />}  label="New Leads"   value={stats.new}       accent="#4f46e5" accentBg="#eef2ff" />
        <StatCard icon={<PhoneIcon />} label="Contacted"   value={stats.contacted} accent="#d97706" accentBg="#fffbeb" />
        <StatCard icon={<CheckIcon />} label="Qualified"   value={stats.qualified} accent="#16a34a" accentBg="#f0fdf4" />
        <StatCard icon={<UsersIcon />} label="Total Leads" value={stats.total}     accent="#7c3aed" accentBg="#f5f3ff" />
      </div>

      {/* MAIN GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'20px', alignItems:'start' }} className="dash-main-grid">

        {/* LEFT: TABLE */}
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:'16px', overflow:'hidden' }}>

          {/* Top bar */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px 24px 16px', gap:'12px', flexWrap:'wrap', borderBottom:'1px solid #f1f5f9' }}>
            <div>
              <h2 style={{ fontSize:'15px', fontWeight:'600', color:'#0f172a', margin:'0 0 2px' }}>Recent Leads</h2>
              <p style={{ fontSize:'12px', color:'#94a3b8', margin:0 }}>{finalLeads?.length || 0} results</p>
            </div>
            <div style={{ display:'flex', gap:'4px', background:'#f1f5f9', padding:'4px', borderRadius:'10px' }}>
              {["All","New","Contacted","Qualified"].map(s => (
                <button key={s} onClick={() => setActiveFilter(s)} style={{
                  border:'none', cursor:'pointer', padding:'5px 13px', borderRadius:'7px',
                  fontSize:'12.5px', fontWeight:'500', fontFamily:"'Sora',sans-serif",
                  transition:'all 0.15s',
                  background: activeFilter === s ? 'white' : 'transparent',
                  color:       activeFilter === s ? '#0f172a' : '#64748b',
                  boxShadow:   activeFilter === s ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Search row */}
          <div style={{ display:'flex', gap:'10px', padding:'14px 24px', borderBottom:'1px solid #f1f5f9', flexWrap:'wrap' }}>
            <div style={{ position:'relative', flex:1, minWidth:'160px' }}>
              <span style={{ position:'absolute', left:'11px', top:'50%', transform:'translateY(-50%)', color:'#94a3b8', display:'flex' }}><SearchIcon /></span>
              <input
                type="text" placeholder="Search client..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{ width:'100%', border:'1px solid #e2e8f0', borderRadius:'9px', padding:'8px 12px 8px 34px', fontSize:'13px', fontFamily:"'Sora',sans-serif", color:'#0f172a', outline:'none', background:'#f8fafc' }}
              />
            </div>
            <select value={selectedAgentFilter} onChange={e => setSelectedAgentFilter(e.target.value)}
              style={{ border:'1px solid #e2e8f0', borderRadius:'9px', padding:'8px 12px', fontSize:'13px', fontFamily:"'Sora',sans-serif", color:'#374151', background:'#f8fafc', cursor:'pointer', outline:'none' }}>
              <option value="All">All Agents</option>
              {agents?.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ border:'1px solid #e2e8f0', borderRadius:'9px', padding:'8px 12px', fontSize:'13px', fontFamily:"'Sora',sans-serif", color:'#374151', background:'#f8fafc', cursor:'pointer', outline:'none' }}>
              <option value="Priority">Sort: Priority</option>
              <option value="Time to Close">Sort: Closing Time</option>
            </select>
          </div>

          {/* Table */}
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:'560px', fontSize:'13.5px' }}>
              <thead>
                <tr style={{ background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                  {['Client','Status','Agent','Priority','Days',''].map((h,i) => (
                    <th key={i} style={{ padding:'10px 16px', fontWeight:'600', fontSize:'11px', color:'#94a3b8', textAlign: i===5 ? 'right' : 'left', textTransform:'uppercase', letterSpacing:'0.06em', whiteSpace:'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {finalLeads?.length === 0 && (
                  <tr><td colSpan="6" style={{ textAlign:'center', padding:'48px', color:'#94a3b8', fontSize:'13px' }}>No leads found</td></tr>
                )}
                {finalLeads?.map(lead => {
                  const sc = STATUS_CONFIG[lead.status]    || STATUS_CONFIG.New;
                  const pc = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG.Medium;
                  return (
                    <tr key={lead._id}
                      style={{ borderBottom:'1px solid #f1f5f9', background:'white', transition:'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background='#fafbff'}
                      onMouseLeave={e => e.currentTarget.style.background='white'}
                    >
                      {/* Client */}
                      <td style={{ padding:'12px 16px', verticalAlign:'middle' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                          <div style={{ width:'32px', height:'32px', borderRadius:'8px', background:'#eef2ff', color:'#4f46e5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'600', flexShrink:0 }}>
                            {lead.name.charAt(0).toUpperCase()}
                          </div>
                          <Link to={`/lead/${lead._id}`} style={{ fontWeight:'500', color:'#0f172a', textDecoration:'none', display:'flex', alignItems:'center', gap:'3px' }}>
                            {lead.name}
                            <span style={{ color:'#cbd5e1', display:'flex' }}><ChevronIcon /></span>
                          </Link>
                        </div>
                      </td>
                      {/* Status */}
                      <td style={{ padding:'12px 16px', verticalAlign:'middle' }}>
                        <span style={{ display:'inline-flex', alignItems:'center', gap:'5px', padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'500', background:sc.bg, color:sc.color, whiteSpace:'nowrap' }}>
                          <span style={{ width:'6px', height:'6px', borderRadius:'50%', background:sc.dot, flexShrink:0 }} />
                          {lead.status}
                        </span>
                      </td>
                      {/* Agent */}
                      <td style={{ padding:'12px 16px', verticalAlign:'middle', color:'#64748b', fontSize:'13px' }}>
                        {lead.salesAgent?.name || <span style={{ color:'#cbd5e1', fontStyle:'italic' }}>Unassigned</span>}
                      </td>
                      {/* Priority */}
                      <td style={{ padding:'12px 16px', verticalAlign:'middle' }}>
                        <span style={{ display:'inline-block', padding:'2px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'500', background:pc.bg, color:pc.color }}>
                          {lead.priority}
                        </span>
                      </td>
                      {/* Days */}
                      <td style={{ padding:'12px 16px', verticalAlign:'middle', color:'#64748b', fontSize:'13px' }}>
                        {lead.timeToClose}d
                      </td>
                      {/* Delete */}
                      <td style={{ padding:'12px 16px', verticalAlign:'middle', textAlign:'right' }}>
                        <button onClick={() => deleteLead(lead._id)}
                          style={{ background:'transparent', border:'none', color:'#cbd5e1', cursor:'pointer', padding:'6px', borderRadius:'7px', display:'inline-flex', alignItems:'center', transition:'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background='#fef2f2'; e.currentTarget.style.color='#ef4444'; }}
                          onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#cbd5e1'; }}
                          title="Delete lead"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div style={{ background:'white', border:'1px solid #e2e8f0', borderRadius:'16px', overflow:'hidden', position:'sticky', top:'24px' }}>
          <div style={{ padding:'20px 24px 4px' }}>
            <h2 style={{ fontSize:'15px', fontWeight:'600', color:'#0f172a', margin:'0 0 2px' }}>New Lead</h2>
            <p style={{ fontSize:'12px', color:'#94a3b8', margin:'0 0 16px' }}>Add a lead to the pipeline</p>
          </div>
          <AddLeadForm agents={agents} />
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        @media (max-width: 1100px) { .dash-main-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 640px)  { .stats-grid { grid-template-columns: 1fr 1fr !important; } }
      `}</style>
    </div>
  );
};

export default Dashboard;