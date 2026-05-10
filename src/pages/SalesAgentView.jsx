import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { toast, ToastContainer } from 'react-toastify';

/* ── Icons ── */
const IcoMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IcoBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IcoTrash = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
  </svg>
);
const IcoEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const STATUS_CONFIG = {
  'New':           { bg: 'rgba(99,102,241,0.15)',  color: '#a5b4fc', dot: '#6366f1' },
  'Contacted':     { bg: 'rgba(234,179,8,0.15)',   color: '#f59e0b', dot: '#eab308' },
  'Qualified':     { bg: 'rgba(34,197,94,0.15)',   color: '#16a34a', dot: '#22c55e' },
  'Proposal Sent': { bg: 'rgba(236,72,153,0.15)',  color: '#ec4899', dot: '#ec4899' },
};
const PRIORITY_CONFIG = {
  'High':   { bg: 'rgba(239,68,68,0.15)',  color: '#dc2626' },
  'Medium': { bg: 'rgba(234,179,8,0.15)',  color: '#d97706' },
  'Low':    { bg: 'rgba(34,197,94,0.15)',  color: '#16a34a' },
};

const SalesAgentView = () => {
  const { leads, loading: leadsLoading, deleteLead } = useLeads();
  const { data: agents, loading: agentsLoading } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  const [selectedAgentId, setSelectedAgentId]   = useState("All");
  const [statusFilter, setStatusFilter]         = useState("All");
  const [priorityFilter, setPriorityFilter]     = useState("All");
  const [sortBy, setSortBy]                     = useState("Time to Close");
  const [isSidebarOpen, setIsSidebarOpen]       = useState(false);

  const handleAgentSelect = (id) => { setSelectedAgentId(id); setIsSidebarOpen(false); };

  const confirmDelete = (id) => {
    toast(({ closeToast }) => (
      <div style={{ fontFamily: 'Sora, sans-serif' }}>
        <p style={{ marginBottom: 8, fontWeight: 500 }}>Delete this lead?</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, padding: '5px 14px', cursor: 'pointer', fontSize: 12 }}
            onClick={() => { deleteLead(id); toast.success("Lead deleted!"); closeToast(); }}>
            Delete
          </button>
          <button style={{ background: 'transparent', border: '1px solid #374151', borderRadius: 6, padding: '5px 14px', cursor: 'pointer', fontSize: 12, color: 'inherit' }}
            onClick={closeToast}>Cancel</button>
        </div>
      </div>
    ), { autoClose: false, closeOnClick: false });
  };

  const agentLeads = selectedAgentId === "All"
    ? leads
    : leads?.filter(l => l.salesAgent?._id === selectedAgentId);

  const finalLeads = [...(agentLeads || [])]
    .filter(l => {
      const ms = statusFilter === "All"   || l.status === statusFilter;
      const mp = priorityFilter === "All" || l.priority === priorityFilter;
      return ms && mp;
    })
    .sort((a, b) => sortBy === "Time to Close" ? (a.timeToClose || 0) - (b.timeToClose || 0) : 0);

  const activeAgentName = selectedAgentId === "All"
    ? "All Agents"
    : agents.find(a => a._id === selectedAgentId)?.name || "Select Agent";

  if (leadsLoading || agentsLoading) {
    return (
      <div className="sav-loading">
        <div className="sav-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .sav-layout {
          display: flex; min-height: 100vh;
          background: var(--bg); font-family: 'Sora','Segoe UI',sans-serif;
          color: var(--text); position: relative;
        }

        /* AGENT SIDEBAR */
        .sav-sidebar {
          width: 240px; min-width: 240px; height: 100vh;
          background: var(--surface); border-right: 1px solid var(--border);
          display: flex; flex-direction: column;
          position: sticky; top: 0; flex-shrink: 0;
          transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .sav-sidebar-head {
          padding: 18px 16px; border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .sav-sidebar-title { font-size: 14px; font-weight: 600; color: var(--text); margin: 0; }
        .sav-sidebar-close { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; line-height: 0; border-radius: 6px; display: none; }
        .sav-sidebar-close:hover { color: var(--text); }
        .sav-agent-list { flex: 1; overflow-y: auto; padding: 8px; }
        .sav-agent-btn {
          width: 100%; display: flex; align-items: center; justify-content: space-between;
          gap: 8px; padding: 10px 12px; border-radius: 8px;
          border: none; background: transparent; color: var(--text-muted);
          font-size: 13px; font-weight: 500; font-family: 'Sora',sans-serif;
          cursor: pointer; text-align: left; transition: all 0.15s; margin-bottom: 2px;
        }
        .sav-agent-btn:hover { background: var(--hover); color: var(--text); }
        .sav-agent-btn.active { background: var(--accent-dim); color: var(--text); }
        .sav-agent-btn.active .sav-agent-dot { background: var(--accent); }
        .sav-agent-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); flex-shrink: 0; transition: background 0.15s; }
        .sav-agent-del { display: flex; align-items: center; color: var(--text-muted); background: transparent; border: none; cursor: pointer; padding: 3px; border-radius: 4px; opacity: 0; transition: opacity 0.15s, color 0.15s; }
        .sav-agent-btn:hover .sav-agent-del { opacity: 1; }
        .sav-agent-del:hover { color: #dc2626; }

        /* MAIN */
        .sav-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }

        /* TOPBAR */
        .sav-topbar {
          padding: 14px 24px; border-bottom: 1px solid var(--border);
          background: var(--surface); display: flex; justify-content: space-between; align-items: center;
          position: sticky; top: 0; z-index: 10;
        }
        .sav-topbar-left { display: flex; align-items: center; gap: 12px; }
        .sav-ham { display: none; background: transparent; border: 1px solid var(--border); border-radius: 8px; color: var(--text); cursor: pointer; padding: 7px; line-height: 0; }
        .sav-agent-label { font-size: 11px; color: var(--text-muted); }
        .sav-agent-name { font-size: 15px; font-weight: 600; color: var(--text); }
        .sav-back-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 8px; color: var(--text-muted); font-size: 12px; font-weight: 500;
          font-family: 'Sora',sans-serif; padding: 7px 14px; text-decoration: none;
          transition: border-color 0.15s, color 0.15s;
        }
        .sav-back-btn:hover { border-color: var(--accent); color: var(--text); }

        /* CONTENT */
        .sav-content { padding: 24px; flex: 1; }

        /* FILTER BAR */
        .sav-filters {
          display: flex; gap: 12px; flex-wrap: wrap; align-items: center;
          margin-bottom: 20px;
        }
        .sav-filter-label { font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
        .sav-select {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; padding: 7px 12px; font-size: 12px;
          font-family: 'Sora',sans-serif; color: var(--text); outline: none; cursor: pointer;
        }
        .sav-select:focus { border-color: var(--accent); }
        .sav-select option { background: var(--surface2); }
        .sav-count-pill {
          margin-left: auto; background: var(--accent-dim);
          color: var(--accent-text); font-size: 12px; font-weight: 600;
          padding: 6px 14px; border-radius: 20px;
        }

        /* TABLE */
        .sav-card { background: var(--surface); border-radius: 12px; border: 1px solid var(--border); overflow: hidden; }
        .sav-card-head { padding: 14px 20px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .sav-card-title { font-size: 14px; font-weight: 600; color: var(--text); margin: 0; }
        .sav-table-scroll { overflow-x: auto; }
        .sav-table { width: 100%; border-collapse: collapse; min-width: 500px; }
        .sav-table th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); padding: 11px 16px; background: var(--surface2); border-bottom: 1px solid var(--border); text-align: left; }
        .sav-table th:last-child { text-align: right; }
        .sav-table td { padding: 12px 16px; border-bottom: 1px solid var(--border2); vertical-align: middle; }
        .sav-table tr:last-child td { border-bottom: none; }
        .sav-table tr:hover td { background: var(--hover); }

        .sav-lead-name { font-size: 13px; font-weight: 500; color: var(--text); }
        .sav-lead-id { font-size: 11px; color: var(--text-muted); }
        .sav-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 500; padding: 3px 9px; border-radius: 20px; }
        .sav-badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .sav-days { font-size: 13px; color: var(--text-soft); font-weight: 500; }
        .sav-actions { display: flex; gap: 6px; justify-content: flex-end; }
        .sav-btn-view { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: var(--accent); font-weight: 500; text-decoration: none; padding: 5px 10px; border-radius: 6px; transition: background 0.15s; }
        .sav-btn-view:hover { background: var(--accent-dim); }
        .sav-btn-del { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; color: #dc2626; border: none; background: transparent; font-weight: 500; font-family: 'Sora',sans-serif; cursor: pointer; padding: 5px 10px; border-radius: 6px; transition: background 0.15s; }
        .sav-btn-del:hover { background: rgba(239,68,68,0.1); }
        .sav-empty { padding: 48px; text-align: center; color: var(--text-muted); font-size: 13px; }

        /* LOADING */
        .sav-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: var(--bg); color: var(--text-muted); font-family: 'Sora',sans-serif; gap: 16px; }
        .sav-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: sav-spin 0.8s linear infinite; }
        @keyframes sav-spin { to { transform: rotate(360deg); } }

        /* BACKDROP */
        .sav-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 1090; backdrop-filter: blur(2px); }

        /* MOBILE */
        @media (max-width: 767px) {
          .sav-sidebar { position: fixed; top: 0; left: 0; z-index: 1100; transform: translateX(-100%); }
          .sav-sidebar.open { transform: translateX(0); }
          .sav-sidebar-close { display: flex !important; }
          .sav-ham { display: flex; }
          .sav-content { padding: 16px; }
        }
      `}</style>

      <ToastContainer position="top-right" theme="colored" />

      <div className="sav-layout">

        {/* Backdrop */}
        {isSidebarOpen && <div className="sav-backdrop" onClick={() => setIsSidebarOpen(false)} />}

        {/* AGENT SIDEBAR */}
        <aside className={`sav-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sav-sidebar-head">
            <p className="sav-sidebar-title">Select Agent</p>
            <button className="sav-sidebar-close" onClick={() => setIsSidebarOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div className="sav-agent-list">
            <button className={`sav-agent-btn ${selectedAgentId === "All" ? "active" : ""}`} onClick={() => handleAgentSelect("All")}>
              <span className="sav-agent-dot" />
              All Agents
            </button>
            {agents.map(agent => (
              <button key={agent._id} className={`sav-agent-btn ${selectedAgentId === agent._id ? "active" : ""}`} onClick={() => handleAgentSelect(agent._id)}>
                <span className="sav-agent-dot" />
                <span style={{ flex: 1 }}>{agent.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN */}
        <div className="sav-main">
          {/* Top bar */}
          <div className="sav-topbar">
            <div className="sav-topbar-left">
              <button className="sav-ham" onClick={() => setIsSidebarOpen(true)}><IcoMenu /></button>
              <div>
                <div className="sav-agent-label">Viewing</div>
                <div className="sav-agent-name">{activeAgentName}</div>
              </div>
            </div>
            <Link to="/" className="sav-back-btn"><IcoBack /> Dashboard</Link>
          </div>

          {/* Content */}
          <div className="sav-content">
            {/* Filters */}
            <div className="sav-filters">
              <span className="sav-filter-label">Filter:</span>
              <select className="sav-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
              </select>
              <select className="sav-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <select className="sav-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="Time to Close">Sort: Time to Close</option>
              </select>
              <span className="sav-count-pill">{finalLeads.length} leads</span>
            </div>

            {/* Table */}
            <div className="sav-card">
              <div className="sav-card-head">
                <p className="sav-card-title">Lead Pipeline</p>
              </div>
              <div className="sav-table-scroll">
                <table className="sav-table">
                  <thead>
                    <tr>
                      <th>Lead</th>
                      {selectedAgentId === "All" && <th>Agent</th>}
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Days to Close</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalLeads.length > 0 ? finalLeads.map(lead => {
                      const sc = STATUS_CONFIG[lead.status]     || STATUS_CONFIG['New'];
                      const pc = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG['Medium'];
                      return (
                        <tr key={lead._id}>
                          <td>
                            <div className="sav-lead-name">{lead.name}</div>
                            <div className="sav-lead-id">#{lead._id.slice(-6).toUpperCase()}</div>
                          </td>
                          {selectedAgentId === "All" && (
                            <td style={{ fontSize: 13, color: 'var(--text-soft)' }}>{lead.salesAgent?.name || 'Unassigned'}</td>
                          )}
                          <td>
                            <span className="sav-badge" style={{ background: sc.bg, color: sc.color }}>
                              <span className="sav-badge-dot" style={{ background: sc.dot }} />
                              {lead.status}
                            </span>
                          </td>
                          <td>
                            <span className="sav-badge" style={{ background: pc.bg, color: pc.color }}>{lead.priority}</span>
                          </td>
                          <td><span className="sav-days">{lead.timeToClose} days</span></td>
                          <td>
                            <div className="sav-actions">
                              <Link to={`/lead/${lead._id}`} className="sav-btn-view"><IcoEye /> View</Link>
                              <button className="sav-btn-del" onClick={() => confirmDelete(lead._id)}><IcoTrash /> Delete</button>
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr><td colSpan={selectedAgentId === "All" ? "6" : "5"} className="sav-empty">No leads found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesAgentView;