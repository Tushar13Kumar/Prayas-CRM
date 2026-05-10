import React from 'react';
import useFetch from '../hooks/useFetch';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const PlusIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
);

const Agents = () => {
  const { data: agents, loading, setData } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  const deleteAgent = async (id) => {
    const result = await Swal.fire({
      title: 'Remove this agent?',
      text: "This will permanently remove the agent from the system.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'Cancel',
      background: 'var(--surface)',
      color: 'var(--text)',
    });

    if (result.isConfirmed) {
      const previousAgents = [...agents];
      setData(agents.filter(a => a._id !== id));
      try {
        const res = await fetch(`https://anvaya-project-backend.vercel.app/agents/${id}`, { method: "DELETE" });
        if (res.ok || res.status === 204) {
          toast.success("Agent removed successfully!");
        } else {
          setData(previousAgents);
          toast.error("Could not delete. Please try again.");
        }
      } catch {
        setData(previousAgents);
        toast.error("Network error.");
      }
    }
  };

  if (loading) {
    return (
      <div className="ag-loading">
        <div className="ag-spinner" />
        <p>Loading agents...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .ag-wrap {
          padding: 28px 28px 48px;
          font-family: 'Sora', 'Segoe UI', sans-serif;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* HEADER */
        .ag-header {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
        }
        .ag-title { font-size: 22px; font-weight: 600; color: var(--text); margin: 0; }
        .ag-subtitle { font-size: 13px; color: var(--text-muted); margin: 4px 0 0; }
        .ag-header-right { display: flex; align-items: center; gap: 16px; }
        .ag-count-pill {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 10px; padding: 8px 16px; text-align: center;
        }
        .ag-count-num { font-size: 22px; font-weight: 600; color: var(--accent); line-height: 1; }
        .ag-count-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px; }
        .ag-add-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--accent); color: white;
          border: none; border-radius: 10px; padding: 10px 20px;
          font-size: 13px; font-weight: 600; font-family: 'Sora', sans-serif;
          text-decoration: none; transition: opacity 0.2s, transform 0.15s;
        }
        .ag-add-btn:hover { opacity: 0.88; transform: translateY(-1px); color: white; }

        /* TABLE CARD */
        .ag-card {
          background: var(--surface); border-radius: 14px;
          border: 1px solid var(--border); overflow: hidden;
        }
        .ag-card-header {
          padding: 16px 22px; border-bottom: 1px solid var(--border);
          display: flex; justify-content: space-between; align-items: center;
        }
        .ag-card-title { font-size: 14px; font-weight: 600; color: var(--text); margin: 0; }

        /* TABLE */
        .ag-table-scroll { overflow-x: auto; }
        .ag-table { width: 100%; border-collapse: collapse; min-width: 500px; }
        .ag-table th {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: var(--text-muted);
          padding: 12px 20px; text-align: left;
          background: var(--surface2); border-bottom: 1px solid var(--border);
        }
        .ag-table th:last-child { text-align: right; }
        .ag-table td { padding: 14px 20px; border-bottom: 1px solid var(--border2); vertical-align: middle; }
        .ag-table tr:last-child td { border-bottom: none; }
        .ag-table tr:hover td { background: var(--hover); }

        /* AGENT CELL */
        .ag-profile { display: flex; align-items: center; gap: 12px; }
        .ag-avatar {
          width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
          background: var(--accent-dim); color: var(--accent-text);
          font-size: 15px; font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Sora', sans-serif;
        }
        .ag-name { font-size: 14px; font-weight: 500; color: var(--text); }
        .ag-id { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

        /* CONTACT CELL */
        .ag-email { font-size: 13px; color: var(--text-soft); }
        .ag-role { font-size: 11px; color: var(--text-muted); margin-top: 3px; }

        /* STATUS BADGE */
        .ag-status {
          display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 20px;
          background: rgba(34,197,94,0.12); color: #16a34a;
          border: 1px solid rgba(34,197,94,0.3);
        }
        .ag-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }

        /* DELETE BTN */
        .ag-delete {
          display: inline-flex; align-items: center; gap: 6px;
          border: 1px solid var(--border); background: transparent;
          color: var(--text-muted); font-size: 12px; font-weight: 500;
          font-family: 'Sora', sans-serif; cursor: pointer;
          padding: 6px 14px; border-radius: 8px; transition: all 0.15s;
        }
        .ag-delete:hover { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.4); color: #dc2626; }

        /* EMPTY */
        .ag-empty { padding: 60px 24px; text-align: center; color: var(--text-muted); font-size: 14px; }
        .ag-empty-icon { font-size: 40px; margin-bottom: 12px; opacity: 0.4; }

        /* FOOTER */
        .ag-footer {
          padding: 14px 22px; border-top: 1px solid var(--border);
          font-size: 12px; color: var(--text-muted); text-align: center;
        }

        /* LOADING */
        .ag-loading {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 100vh; background: var(--bg); color: var(--text-muted);
          font-family: 'Sora', sans-serif; gap: 16px;
        }
        .ag-spinner {
          width: 36px; height: 36px; border-radius: 50%;
          border: 3px solid var(--border); border-top-color: var(--accent);
          animation: ag-spin 0.8s linear infinite;
        }
        @keyframes ag-spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) { .ag-wrap { padding: 16px; } .ag-header { gap: 12px; } }
      `}</style>

      <div className="ag-wrap">

        {/* HEADER */}
        <div className="ag-header">
          <div>
            <h1 className="ag-title">Sales Team</h1>
            <p className="ag-subtitle">Manage your agents and their access</p>
          </div>
          <div className="ag-header-right">
            <div className="ag-count-pill">
              <div className="ag-count-num">{agents.length}</div>
              <div className="ag-count-label">Active Agents</div>
            </div>
            <Link to="/agents/add" className="ag-add-btn">
              <PlusIcon /> Add Agent
            </Link>
          </div>
        </div>

        {/* TABLE */}
        <div className="ag-card">
          <div className="ag-card-header">
            <p className="ag-card-title">All Agents</p>
          </div>

          <div className="ag-table-scroll">
            <table className="ag-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {agents.length > 0 ? agents.map(agent => (
                  <tr key={agent._id}>
                    <td>
                      <div className="ag-profile">
                        <div className="ag-avatar">{agent.name.charAt(0).toUpperCase()}</div>
                        <div>
                          <div className="ag-name">{agent.name}</div>
                          <div className="ag-id">ID: {agent._id.slice(-8).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="ag-email">{agent.email}</div>
                      <div className="ag-role">Sales Representative</div>
                    </td>
                    <td>
                      <span className="ag-status">
                        <span className="ag-status-dot" />
                        Active
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="ag-delete" onClick={() => deleteAgent(agent._id)}>
                        <TrashIcon /> Remove
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4">
                      <div className="ag-empty">
                        <div className="ag-empty-icon">👥</div>
                        <p>No agents found. Add your first agent.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="ag-footer">
            © 2026 Prayas CRM — Sales Portal
          </div>
        </div>

      </div>
    </>
  );
};

export default Agents;