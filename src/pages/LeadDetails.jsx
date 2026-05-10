import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import useFetch from '../hooks/useFetch';
import { toast } from 'react-toastify';

const STATUS_CONFIG = {
  'New':           { bg: 'rgba(99,102,241,0.15)',  color: '#a5b4fc', dot: '#6366f1' },
  'Contacted':     { bg: 'rgba(234,179,8,0.15)',   color: '#f59e0b', dot: '#eab308' },
  'Qualified':     { bg: 'rgba(34,197,94,0.15)',   color: '#16a34a', dot: '#22c55e' },
  'Proposal Sent': { bg: 'rgba(236,72,153,0.15)',  color: '#ec4899', dot: '#ec4899' },
};
const PRIORITY_CONFIG = {
  'High':   { color: '#dc2626' },
  'Medium': { color: '#d97706' },
  'Low':    { color: '#16a34a' },
};

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead]           = useState(null);
  const [newComment, setNewComment] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData]   = useState({});
  const [submitting, setSubmitting] = useState(false);
  const { updateLeadInState } = useLeads();
  const { data: agents } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  useEffect(() => { fetchLead(); }, [id]);

  const fetchLead = () => {
    fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`)
      .then(r => r.json())
      .then(d => { setLead(d); setEditData(d); })
      .catch(() => toast.error("Failed to load lead."));
  };

  const handleUpdate = async () => {
    setSubmitting(true);
    try {
      const agentId = editData.salesAgent?._id || editData.salesAgent;
      const res = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editData, salesAgent: agentId === "" ? null : agentId }),
      });
      const result = await res.json();
      if (res.ok) {
        setLead(result); setEditData(result);
        updateLeadInState(result);
        setIsEditing(false);
        toast.success("Lead updated!");
      } else {
        toast.error(result.error || "Update failed.");
      }
    } catch { toast.error("Network error."); }
    finally { setSubmitting(false); }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedAgent) return toast.warn("Please select an agent and write a comment.");
    const res = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newComment, authorId: selectedAgent }),
    });
    if (res.ok) {
      const updated = await res.json();
      setLead(prev => ({ ...prev, comments: updated }));
      setNewComment(""); setSelectedAgent("");
      toast.success("Activity logged!");
    } else { toast.error("Failed to add comment."); }
  };

  const sc = STATUS_CONFIG[lead?.status]     || STATUS_CONFIG['New'];
  const pc = PRIORITY_CONFIG[lead?.priority] || PRIORITY_CONFIG['Medium'];

  if (!lead) return (
    <div className="ld-loading"><div className="ld-spinner" /><p>Loading lead details...</p></div>
  );

  return (
    <>
      <style>{`
        .ld-wrap { padding: 28px 28px 48px; font-family: 'Sora','Segoe UI',sans-serif; min-height: 100vh; background: var(--bg); color: var(--text); }

        /* HEADER */
        .ld-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 12px; }
        .ld-back { display: inline-flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text-muted); font-size: 12px; font-weight: 500; font-family: 'Sora',sans-serif; padding: 7px 14px; text-decoration: none; transition: border-color 0.15s, color 0.15s; }
        .ld-back:hover { border-color: var(--accent); color: var(--text); }
        .ld-actions { display: flex; gap: 8px; }
        .ld-btn { display: inline-flex; align-items: center; gap: 6px; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 500; font-family: 'Sora',sans-serif; cursor: pointer; transition: all 0.15s; border: 1px solid var(--border); }
        .ld-btn-edit { background: var(--surface); color: var(--text-muted); }
        .ld-btn-edit:hover { border-color: var(--accent); color: var(--accent-text); }
        .ld-btn-save { background: var(--accent); color: white; border-color: var(--accent); }
        .ld-btn-save:hover { opacity: 0.88; }
        .ld-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .ld-btn-cancel { background: transparent; color: var(--text-muted); }
        .ld-btn-cancel:hover { background: var(--hover); }

        /* INFO CARD */
        .ld-card { background: var(--surface); border-radius: 14px; border: 1px solid var(--border); overflow: hidden; margin-bottom: 20px; }
        .ld-card-head { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
        .ld-lead-name { font-size: 20px; font-weight: 600; color: var(--text); margin: 0; }
        .ld-lead-id { font-size: 12px; color: var(--text-muted); margin: 4px 0 0; }
        .ld-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 500; padding: 4px 12px; border-radius: 20px; }
        .ld-badge-dot { width: 6px; height: 6px; border-radius: 50%; }
        .ld-card-body { padding: 20px 24px; display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
        .ld-field-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 8px; }
        .ld-field-val { font-size: 15px; font-weight: 500; color: var(--text); }
        .ld-select, .ld-input { width: 100%; background: var(--input-bg); border: 1px solid var(--border); border-radius: 8px; padding: 8px 12px; font-size: 13px; font-family: 'Sora',sans-serif; color: var(--text); outline: none; transition: border-color 0.15s; box-sizing: border-box; }
        .ld-select:focus, .ld-input:focus { border-color: var(--accent); }
        .ld-select option { background: var(--surface2); }

        /* ACTIVITY LOG */
        .ld-log-header { padding: 18px 24px 14px; border-bottom: 1px solid var(--border); }
        .ld-log-title { font-size: 14px; font-weight: 600; color: var(--text); margin: 0; }
        .ld-log-subtitle { font-size: 12px; color: var(--text-muted); margin: 3px 0 0; }
        .ld-comments { padding: 16px 24px; max-height: 360px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
        .ld-comment { background: var(--surface2); border-radius: 10px; padding: 14px 16px; border-left: 3px solid var(--accent); }
        .ld-comment-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .ld-comment-author { font-size: 13px; font-weight: 600; color: var(--accent-text); }
        .ld-comment-time { font-size: 11px; color: var(--text-muted); }
        .ld-comment-text { font-size: 13px; color: var(--text-soft); line-height: 1.5; margin: 0; }
        .ld-no-comments { text-align: center; padding: 32px; color: var(--text-muted); font-size: 13px; }

        /* ADD COMMENT */
        .ld-add-comment { padding: 16px 24px 20px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 12px; }
        .ld-textarea { background: var(--input-bg); border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; font-size: 13px; font-family: 'Sora',sans-serif; color: var(--text); outline: none; resize: vertical; min-height: 80px; transition: border-color 0.15s; box-sizing: border-box; width: 100%; }
        .ld-textarea:focus { border-color: var(--accent); }
        .ld-textarea::placeholder { color: var(--text-muted); }
        .ld-add-row { display: flex; gap: 10px; align-items: center; }
        .ld-post-btn { background: var(--accent); color: white; border: none; border-radius: 8px; padding: 9px 20px; font-size: 13px; font-weight: 600; font-family: 'Sora',sans-serif; cursor: pointer; transition: opacity 0.2s; white-space: nowrap; }
        .ld-post-btn:hover { opacity: 0.88; }

        /* LOADING */
        .ld-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: var(--bg); color: var(--text-muted); font-family: 'Sora',sans-serif; gap: 16px; }
        .ld-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: ld-spin 0.8s linear infinite; }
        @keyframes ld-spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) { .ld-wrap { padding: 16px; } .ld-card-body { grid-template-columns: 1fr; } .ld-add-row { flex-direction: column; } }
      `}</style>

      <div className="ld-wrap">

        {/* HEADER */}
        <div className="ld-header">
          <Link to="/" className="ld-back">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Dashboard
          </Link>
          <div className="ld-actions">
            {!isEditing ? (
              <button className="ld-btn ld-btn-edit" onClick={() => setIsEditing(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit Lead
              </button>
            ) : (
              <>
                <button className="ld-btn ld-btn-save" onClick={handleUpdate} disabled={submitting}>
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
                <button className="ld-btn ld-btn-cancel" onClick={() => { setIsEditing(false); setEditData(lead); }}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* LEAD INFO CARD */}
        <div className="ld-card">
          <div className="ld-card-head">
            <div>
              <h1 className="ld-lead-name">{lead.name}</h1>
              <p className="ld-lead-id">Lead ID: #{id?.slice(-8).toUpperCase()}</p>
            </div>
            <span className="ld-badge" style={{ background: sc.bg, color: sc.color }}>
              <span className="ld-badge-dot" style={{ background: sc.dot }} />
              {lead.status}
            </span>
          </div>

          <div className="ld-card-body">
            {/* Agent */}
            <div>
              <p className="ld-field-label">Assigned Agent</p>
              {isEditing ? (
                <select className="ld-select"
                  value={typeof editData?.salesAgent === 'object' ? editData?.salesAgent?._id : editData?.salesAgent || ""}
                  onChange={e => setEditData({ ...editData, salesAgent: e.target.value })}>
                  <option value="">Unassigned</option>
                  {agents?.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              ) : (
                <p className="ld-field-val">{lead.salesAgent?.name || "Unassigned"}</p>
              )}
            </div>

            {/* Priority */}
            <div>
              <p className="ld-field-label">Priority</p>
              {isEditing ? (
                <select className="ld-select" value={editData?.priority} onChange={e => setEditData({ ...editData, priority: e.target.value })}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              ) : (
                <p className="ld-field-val" style={{ color: pc.color }}>{lead.priority}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <p className="ld-field-label">Pipeline Status</p>
              {isEditing ? (
                <select className="ld-select" value={editData?.status} onChange={e => setEditData({ ...editData, status: e.target.value })}>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                </select>
              ) : (
                <p className="ld-field-val">{lead.status}</p>
              )}
            </div>
          </div>
        </div>

        {/* ACTIVITY LOG */}
        <div className="ld-card">
          <div className="ld-log-header">
            <p className="ld-log-title">Activity Log</p>
            <p className="ld-log-subtitle">Follow-up notes and updates</p>
          </div>

          <div className="ld-comments">
            {lead?.comments?.length > 0 ? lead.comments.map((c, i) => (
              <div key={i} className="ld-comment">
                <div className="ld-comment-top">
                  <span className="ld-comment-author">
                    {typeof c.author === 'object' ? c.author?.name : "Agent"}
                  </span>
                  <span className="ld-comment-time">
                    {c.createdAt ? new Date(c.createdAt).toLocaleString('en-IN') : ""}
                  </span>
                </div>
                <p className="ld-comment-text">{c.commentText}</p>
              </div>
            )) : (
              <div className="ld-no-comments">No activity logged yet.</div>
            )}
          </div>

          <div className="ld-add-comment">
            <div className="ld-add-row">
              <select className="ld-select" style={{ flex: 1 }} value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)}>
                <option value="">Select Agent...</option>
                {agents?.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            </div>
            <textarea className="ld-textarea" placeholder="Enter follow-up note..." value={newComment} onChange={e => setNewComment(e.target.value)} />
            <div style={{ textAlign: 'right' }}>
              <button className="ld-post-btn" onClick={handleAddComment}>Post Update</button>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};

export default LeadDetails;