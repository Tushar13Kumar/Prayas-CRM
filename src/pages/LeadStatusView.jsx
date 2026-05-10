import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

const STATUS_TABS = ["New", "Contacted", "Qualified", "Proposal Sent"];
const PRIORITY_CONFIG = {
  'High':   { bg: 'rgba(239,68,68,0.15)',  color: '#dc2626' },
  'Medium': { bg: 'rgba(234,179,8,0.15)',  color: '#d97706' },
  'Low':    { bg: 'rgba(34,197,94,0.15)',  color: '#16a34a' },
};

const LeadStatusView = () => {
  const { leads, loading } = useLeads();
  const { data: agents } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  const [activeStatus, setActiveStatus] = useState("New");
  const [selectedAgent, setSelectedAgent] = useState("All");
  const [sortBy, setSortBy] = useState("Time to Close");

  const sortedLeads = [...(leads || [])]
    .filter(l => l.status === activeStatus && (selectedAgent === "All" || l.salesAgent?._id === selectedAgent))
    .sort((a, b) => {
      if (sortBy === "Time to Close") return (a.timeToClose || 0) - (b.timeToClose || 0);
      if (sortBy === "Priority") {
        const o = { High: 3, Medium: 2, Low: 1 };
        return (o[b.priority] || 0) - (o[a.priority] || 0);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="lsv-loading">
        <div className="lsv-spinner" />
        <p>Loading leads...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .lsv-wrap {
          padding: 28px 28px 48px;
          font-family: 'Sora', 'Segoe UI', sans-serif;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* HEADER */
        .lsv-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .lsv-title { font-size: 22px; font-weight: 600; color: var(--text); margin: 0; }
        .lsv-subtitle { font-size: 13px; color: var(--text-muted); margin: 4px 0 0; }
        .lsv-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; color: var(--text-muted); font-size: 12px;
          font-weight: 500; font-family: 'Sora',sans-serif; padding: 7px 14px;
          text-decoration: none; transition: border-color 0.15s, color 0.15s;
        }
        .lsv-back:hover { border-color: var(--accent); color: var(--text); }

        /* STATUS TABS */
        .lsv-tabs { display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; }
        .lsv-tab {
          border: 1.5px solid var(--border); background: var(--surface);
          border-radius: 10px; padding: 8px 18px;
          font-size: 13px; font-weight: 500; font-family: 'Sora',sans-serif;
          cursor: pointer; color: var(--text-muted); transition: all 0.15s;
        }
        .lsv-tab:hover { border-color: var(--accent); color: var(--text); }
        .lsv-tab.active { background: var(--accent-dim); border-color: var(--accent); color: var(--accent-text); }

        /* CARD */
        .lsv-card { background: var(--surface); border-radius: 14px; border: 1px solid var(--border); overflow: hidden; }
        .lsv-card-head {
          padding: 14px 20px; border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
        }
        .lsv-status-pill {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: var(--text);
        }
        .lsv-status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
        .lsv-count { font-size: 12px; color: var(--text-muted); background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 3px 10px; }
        .lsv-filters { display: flex; gap: 8px; align-items: center; }
        .lsv-select {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 8px; padding: 6px 10px; font-size: 12px;
          font-family: 'Sora',sans-serif; color: var(--text); outline: none; cursor: pointer;
        }
        .lsv-select:focus { border-color: var(--accent); }
        .lsv-select option { background: var(--surface2); }

        /* TABLE */
        .lsv-table-scroll { overflow-x: auto; }
        .lsv-table { width: 100%; border-collapse: collapse; min-width: 500px; }
        .lsv-table th { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--text-muted); padding: 11px 18px; background: var(--surface2); border-bottom: 1px solid var(--border); text-align: left; }
        .lsv-table th:last-child { text-align: right; }
        .lsv-table td { padding: 13px 18px; border-bottom: 1px solid var(--border2); vertical-align: middle; }
        .lsv-table tr:last-child td { border-bottom: none; }
        .lsv-table tr:hover td { background: var(--hover); }

        .lsv-lead-name { font-size: 13px; font-weight: 500; color: var(--text); }
        .lsv-lead-id { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
        .lsv-agent { font-size: 13px; color: var(--text-soft); }
        .lsv-badge { display: inline-flex; align-items: center; font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px; }
        .lsv-days { font-size: 13px; color: var(--text-soft); font-weight: 500; }
        .lsv-view {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 12px; color: var(--accent); font-weight: 500;
          text-decoration: none; padding: 5px 12px; border-radius: 6px;
          border: 1px solid var(--border); transition: all 0.15s; float: right;
        }
        .lsv-view:hover { background: var(--accent-dim); border-color: var(--accent); color: var(--accent-text); }
        .lsv-empty { padding: 48px; text-align: center; color: var(--text-muted); font-size: 13px; }

        /* LOADING */
        .lsv-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: var(--bg); color: var(--text-muted); font-family: 'Sora',sans-serif; gap: 16px; }
        .lsv-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: lsv-spin 0.8s linear infinite; }
        @keyframes lsv-spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) { .lsv-wrap { padding: 16px; } .lsv-card-head { flex-direction: column; align-items: flex-start; } }
      `}</style>

      <div className="lsv-wrap">

        {/* HEADER */}
        <div className="lsv-header">
          <div>
            <h1 className="lsv-title">Lead Status</h1>
            <p className="lsv-subtitle">View leads by pipeline stage</p>
          </div>
          <Link to="/" className="lsv-back">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Dashboard
          </Link>
        </div>

        {/* STATUS TABS */}
        <div className="lsv-tabs">
          {STATUS_TABS.map(s => (
            <button key={s} className={`lsv-tab ${activeStatus === s ? "active" : ""}`} onClick={() => setActiveStatus(s)}>
              {s}
            </button>
          ))}
        </div>

        {/* TABLE CARD */}
        <div className="lsv-card">
          <div className="lsv-card-head">
            <div className="lsv-status-pill">
              <span className="lsv-status-dot" />
              Status: {activeStatus}
              <span className="lsv-count">{sortedLeads.length} leads</span>
            </div>
            <div className="lsv-filters">
              <select className="lsv-select" value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}>
                <option value="All">All Agents</option>
                {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
              <select className="lsv-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="Time to Close">Fastest Close</option>
                <option value="Priority">By Priority</option>
              </select>
            </div>
          </div>

          <div className="lsv-table-scroll">
            <table className="lsv-table">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Agent</th>
                  <th>Priority</th>
                  <th>Days to Close</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeads.length > 0 ? sortedLeads.map(lead => {
                  const pc = PRIORITY_CONFIG[lead.priority] || PRIORITY_CONFIG['Medium'];
                  return (
                    <tr key={lead._id}>
                      <td>
                        <div className="lsv-lead-name">{lead.name}</div>
                        <div className="lsv-lead-id">#{lead._id.slice(-5).toUpperCase()}</div>
                      </td>
                      <td><span className="lsv-agent">{lead.salesAgent?.name || "Unassigned"}</span></td>
                      <td><span className="lsv-badge" style={{ background: pc.bg, color: pc.color }}>{lead.priority}</span></td>
                      <td><span className="lsv-days">{lead.timeToClose} days</span></td>
                      <td>
                        <Link to={`/lead/${lead._id}`} className="lsv-view">
                          View
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                        </Link>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="5" className="lsv-empty">No {activeStatus} leads found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadStatusView;