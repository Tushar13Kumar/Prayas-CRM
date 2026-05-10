import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import AddLeadForm from '../components/AddLeadForm';
import useFetch from '../hooks/useFetch';
import { Link } from 'react-router-dom';

/* ── Icons ── */
const IcoUsers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.85"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IcoPhone = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.58a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IcoCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcoSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IcoTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IcoArrow = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const STATUS_CONFIG = {
  'New':           { bg: 'rgba(99,102,241,0.15)',  color: '#a5b4fc', dot: '#6366f1' },
  'Contacted':     { bg: 'rgba(234,179,8,0.15)',   color: '#f59e0b', dot: '#eab308' },
  'Qualified':     { bg: 'rgba(34,197,94,0.15)',   color: '#16a34a', dot: '#22c55e' },
  'Proposal Sent': { bg: 'rgba(236,72,153,0.15)',  color: '#ec4899', dot: '#ec4899' },
  'Closed':        { bg: 'rgba(148,163,184,0.15)', color: '#64748b', dot: '#64748b' },
};
const PRIORITY_CONFIG = {
  'High':   { bg: 'rgba(239,68,68,0.15)',  color: '#dc2626' },
  'Medium': { bg: 'rgba(234,179,8,0.15)',  color: '#d97706' },
  'Low':    { bg: 'rgba(34,197,94,0.15)',  color: '#16a34a' },
};

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
    <>
      <style>{`
        /* ── ALL COLORS USE CSS VARIABLES — theme automatically switches ── */

        .db-wrap {
          padding: 28px 28px 48px;
          font-family: 'Sora', 'Segoe UI', sans-serif;
          min-height: 100vh;
          background: var(--bg);        /* #0a0c12 dark | #f5f6fa light */
          color: var(--text);           /* #f1f2f5 dark | #0f1117 light */
          transition: background 0.25s ease, color 0.25s ease;
        }

        /* HEADER */
        .db-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .db-header h1 { font-size: 22px; font-weight: 600; color: var(--text); margin: 0; }
        .db-header-sub { font-size: 13px; color: var(--text-muted); margin: 4px 0 0; }
        .db-date {
          font-size: 12px; color: var(--text-muted);
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 6px 14px;
          transition: background 0.25s, border-color 0.25s;
        }

        /* STAT CARDS */
        .db-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 28px; }
        .db-stat {
          background: var(--surface);
          border-radius: 12px; padding: 20px 22px;
          border: 1px solid var(--border);
          display: flex; align-items: center; gap: 16px;
          transition: background 0.25s, border-color 0.25s;
        }
        .db-stat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .db-stat-label { font-size: 12px; color: var(--text-muted); font-weight: 500; margin: 0 0 4px; }
        .db-stat-value { font-size: 28px; font-weight: 600; line-height: 1; margin: 0; }
        .db-stat-footer { font-size: 11px; color: var(--text-muted); margin: 6px 0 0; }

        /* MAIN GRID */
        .db-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: start; }

        /* CARD */
        .db-card {
          background: var(--surface);
          border-radius: 12px; border: 1px solid var(--border); overflow: hidden;
          transition: background 0.25s, border-color 0.25s;
        }
        .db-card-header {
          padding: 18px 22px 14px; border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .db-card-title { font-size: 15px; font-weight: 600; color: var(--text); margin: 0; }
        .db-card-count {
          font-size: 12px; color: var(--text-muted);
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 20px; padding: 3px 10px;
        }

        /* FILTER BAR */
        .db-filters {
          padding: 14px 22px; border-bottom: 1px solid var(--border);
          display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
        }
        .db-tab-group {
          display: flex; gap: 3px;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 8px; padding: 3px;
        }
        .db-tab {
          border: none; background: transparent;
          font-size: 12px; font-weight: 500; color: var(--text-muted);
          padding: 5px 12px; border-radius: 6px; cursor: pointer;
          font-family: 'Sora', sans-serif; transition: all 0.15s;
        }
        .db-tab.active { background: var(--accent-dim); color: var(--accent-text); }
        .db-search-wrap { flex: 1; min-width: 140px; position: relative; }
        .db-search-wrap svg { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
        .db-search {
          width: 100%; background: var(--input-bg);
          border: 1px solid var(--border); border-radius: 8px;
          padding: 7px 12px 7px 32px; font-size: 13px;
          font-family: 'Sora', sans-serif; color: var(--text);
          outline: none; transition: border-color 0.15s; box-sizing: border-box;
        }
        .db-search::placeholder { color: var(--text-muted); }
        .db-search:focus { border-color: var(--accent); }
        .db-select {
          background: var(--input-bg); border: 1px solid var(--border);
          border-radius: 8px; padding: 7px 12px; font-size: 12px;
          font-family: 'Sora', sans-serif; color: var(--text);
          outline: none; cursor: pointer;
          transition: background 0.25s, border-color 0.25s;
        }
        .db-select:focus { border-color: var(--accent); }
        .db-select option { background: var(--surface2); color: var(--text); }

        /* TABLE */
        .db-table { width: 100%; border-collapse: collapse; min-width: 520px; }
        .db-table th {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--text-muted);
          padding: 12px 16px; text-align: left;
          background: var(--surface2); border-bottom: 1px solid var(--border);
        }
        .db-table th:last-child { text-align: right; }
        .db-table td { padding: 13px 16px; border-bottom: 1px solid var(--border2); vertical-align: middle; }
        .db-table tr:last-child td { border-bottom: none; }
        .db-table tr:hover td { background: var(--hover); }
        .db-table-scroll { overflow-x: auto; }

        /* LEAD CELL */
        .db-lead-name { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .db-lead-avatar {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--accent-dim); color: var(--accent-text);
          font-size: 12px; font-weight: 600;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .db-lead-text { font-size: 13px; font-weight: 500; color: var(--text); }
        .db-lead-id { font-size: 11px; color: var(--text-muted); }

        /* BADGES */
        .db-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px; }
        .db-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

        /* BUTTONS */
        .db-delete {
          display: inline-flex; align-items: center; gap: 5px;
          border: none; background: transparent; color: #dc2626;
          font-size: 12px; font-weight: 500; font-family: 'Sora', sans-serif;
          cursor: pointer; padding: 5px 8px; border-radius: 6px; transition: background 0.15s;
        }
        .db-delete:hover { background: rgba(239,68,68,0.1); }
        .db-view {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 12px; color: var(--accent); font-weight: 500;
          text-decoration: none; padding: 5px 8px; border-radius: 6px; transition: background 0.15s;
        }
        .db-view:hover { background: var(--accent-dim); }

        /* EMPTY */
        .db-empty { padding: 48px 24px; text-align: center; color: var(--text-muted); font-size: 13px; }

        /* FORM CARD */
        .db-form-card {
          background: var(--surface); border-radius: 12px;
          border: 1px solid var(--border); overflow: hidden;
          position: sticky; top: 20px;
          transition: background 0.25s, border-color 0.25s;
        }
        .db-form-header { padding: 18px 22px 14px; border-bottom: 1px solid var(--border); }
        .db-form-title { font-size: 15px; font-weight: 600; color: var(--text); margin: 0 0 2px; }
        .db-form-sub { font-size: 12px; color: var(--text-muted); margin: 0; }
        .db-form-body { padding: 18px 22px 22px; }

        /* RESPONSIVE */
        @media (max-width: 1100px) { .db-grid { grid-template-columns: 1fr; } .db-form-card { position: static; } }
        @media (max-width: 768px)  { .db-stats { grid-template-columns: 1fr; } .db-wrap { padding: 16px; } }
        @media (max-width: 576px)  { .db-stats { grid-template-columns: repeat(3,1fr); } .db-stat { flex-direction: column; align-items: flex-start; gap: 8px; padding: 14px; } .db-stat-value { font-size: 22px; } }
      `}</style>

      <div className="db-wrap">

        {/* HEADER */}
        <div className="db-header">
          <div>
            <h1>Dashboard</h1>
            <p className="db-header-sub">Welcome back, Admin — here's what's happening today.</p>
          </div>
          <span className="db-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* STAT CARDS */}
        <div className="db-stats">
          <div className="db-stat">
            <div className="db-stat-icon" style={{ background: 'rgba(99,102,241,0.15)' }}>
              <IcoUsers style={{ color: '#6366f1' }} />
            </div>
            <div>
              <p className="db-stat-label">New Leads</p>
              <p className="db-stat-value" style={{ color: '#6366f1' }}>{stats.new}</p>
              <p className="db-stat-footer">In pipeline</p>
            </div>
          </div>
          <div className="db-stat">
            <div className="db-stat-icon" style={{ background: 'rgba(234,179,8,0.15)' }}>
              <IcoPhone style={{ color: '#d97706' }} />
            </div>
            <div>
              <p className="db-stat-label">Contacted</p>
              <p className="db-stat-value" style={{ color: '#d97706' }}>{stats.contacted}</p>
              <p className="db-stat-footer">Awaiting response</p>
            </div>
          </div>
          <div className="db-stat">
            <div className="db-stat-icon" style={{ background: 'rgba(34,197,94,0.15)' }}>
              <IcoCheck style={{ color: '#16a34a' }} />
            </div>
            <div>
              <p className="db-stat-label">Qualified</p>
              <p className="db-stat-value" style={{ color: '#16a34a' }}>{stats.qualified}</p>
              <p className="db-stat-footer">Ready to close</p>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="db-grid">

          {/* LEFT — Leads Table */}
          <div className="db-card">
            <div className="db-card-header">
              <p className="db-card-title">Recent Leads</p>
              <span className="db-card-count">{finalLeads?.length || 0} leads</span>
            </div>

            <div className="db-filters">
              <div className="db-tab-group">
                {["All", "New", "Contacted", "Qualified"].map(s => (
                  <button key={s} className={`db-tab ${activeFilter === s ? "active" : ""}`} onClick={() => setActiveFilter(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="db-search-wrap">
                <IcoSearch />
                <input className="db-search" type="text" placeholder="Search client..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <select className="db-select" value={selectedAgentFilter} onChange={e => setSelectedAgentFilter(e.target.value)}>
                <option value="All">All Agents</option>
                {agents?.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
              <select className="db-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="Priority">By Priority</option>
                <option value="Time to Close">By Closing Time</option>
              </select>
            </div>

            <div className="db-table-scroll">
              <table className="db-table">
                <thead>
                  <tr>
                    <th>Client</th><th>Status</th><th>Agent</th><th>Priority</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {finalLeads?.length > 0 ? finalLeads.map(lead => {
                    const sc = STATUS_CONFIG[lead.status]     || STATUS_CONFIG['New'];
                    const pc = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG['Medium'];
                    const initials = lead.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <tr key={lead._id}>
                        <td>
                          <Link to={`/lead/${lead._id}`} className="db-lead-name">
                            <div className="db-lead-avatar">{initials}</div>
                            <div>
                              <div className="db-lead-text">{lead.name}</div>
                              <div className="db-lead-id">#{lead._id.slice(-5).toUpperCase()}</div>
                            </div>
                          </Link>
                        </td>
                        <td>
                          <span className="db-badge" style={{ background: sc.bg, color: sc.color }}>
                            <span className="db-badge-dot" style={{ background: sc.dot }} />
                            {lead.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '13px', color: 'var(--text-soft)' }}>{lead.salesAgent?.name || "Unassigned"}</td>
                        <td>
                          <span className="db-badge" style={{ background: pc.bg, color: pc.color }}>{lead.priority}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Link to={`/lead/${lead._id}`} className="db-view">View <IcoArrow /></Link>
                          <button className="db-delete" onClick={() => deleteLead(lead._id)}><IcoTrash /> Delete</button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="5" className="db-empty">No leads found. Try adjusting filters.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div className="db-form-card">
            <div className="db-form-header">
              <p className="db-form-title">Create New Lead</p>
              <p className="db-form-sub">Fill in the details to add a lead</p>
            </div>
            <div className="db-form-body">
              <AddLeadForm agents={agents || []} />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;