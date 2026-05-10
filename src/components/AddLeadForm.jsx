import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { toast } from 'react-toastify';

const AddLeadForm = ({ agents }) => {
  const [formData, setFormData] = useState({
    name: "",
    source: "Website",
    salesAgent: "",
    status: "New",
    priority: "Medium",
    timeToClose: 10
  });
  const [loading, setLoading] = useState(false);
  const { fetchLeads } = useLeads();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("https://anvaya-project-backend.vercel.app/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        await fetchLeads();
        toast.success("Lead created successfully!");
        setFormData({ name: "", source: "Website", salesAgent: "", status: "New", priority: "Medium", timeToClose: 10 });
      } else {
        toast.error("Failed to save lead. Please check your data.");
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* ── ALL COLORS USE CSS VARIABLES ── */
        .alf-form { font-family: 'Sora', 'Segoe UI', sans-serif; }

        .alf-group { margin-bottom: 16px; }

        .alf-label {
          display: block; font-size: 12px; font-weight: 500;
          color: var(--text-muted); margin-bottom: 6px; letter-spacing: 0.01em;
        }

        .alf-input, .alf-select {
          width: 100%;
          background: var(--input-bg);
          border: 1px solid var(--border);
          border-radius: 8px; padding: 9px 12px;
          font-size: 13px; font-family: 'Sora', 'Segoe UI', sans-serif;
          color: var(--text); outline: none;
          transition: border-color 0.15s, box-shadow 0.15s, background 0.25s;
          box-sizing: border-box;
        }
        .alf-input::placeholder { color: var(--text-muted); opacity: 0.6; }
        .alf-input:focus, .alf-select:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }
        .alf-select option { background: var(--surface2); color: var(--text); }

        .alf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

        /* Priority buttons */
        .alf-priority-group { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
        .alf-priority-btn {
          border: 1.5px solid var(--border);
          border-radius: 8px; padding: 7px 4px;
          font-size: 12px; font-weight: 500;
          font-family: 'Sora', sans-serif;
          cursor: pointer; text-align: center;
          background: var(--surface2); color: var(--text-muted);
          transition: all 0.15s;
        }
        .alf-priority-btn:hover { color: var(--text); border-color: var(--accent); }
        .alf-priority-high.selected   { background: rgba(239,68,68,0.12);  border-color: rgba(239,68,68,0.5);  color: #dc2626; }
        .alf-priority-medium.selected { background: rgba(234,179,8,0.12);  border-color: rgba(234,179,8,0.5);  color: #d97706; }
        .alf-priority-low.selected    { background: rgba(34,197,94,0.12);  border-color: rgba(34,197,94,0.5);  color: #16a34a; }

        /* Slider */
        .alf-range { width: 100%; accent-color: var(--accent); cursor: pointer; }
        .alf-range-labels { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-top: 4px; }
        .alf-range-value { text-align: center; font-size: 13px; font-weight: 600; color: var(--accent); margin-bottom: 6px; }

        /* Divider */
        .alf-divider { height: 1px; background: var(--border); margin: 18px 0; }

        /* Submit */
        .alf-submit {
          width: 100%; background: var(--accent); color: white;
          border: none; border-radius: 10px; padding: 11px;
          font-size: 13px; font-weight: 600; font-family: 'Sora', sans-serif;
          cursor: pointer; transition: opacity 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .alf-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .alf-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        /* Spinner */
        .alf-spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: white; border-radius: 50%;
          animation: alf-spin 0.7s linear infinite;
        }
        @keyframes alf-spin { to { transform: rotate(360deg); } }
      `}</style>

      <form className="alf-form" onSubmit={handleSubmit}>

        <div className="alf-group">
          <label className="alf-label">Client Full Name *</label>
          <input type="text" name="name" className="alf-input"
            value={formData.name} onChange={handleChange}
            required placeholder="e.g. Rahul Sharma" />
        </div>

        <div className="alf-row">
          <div className="alf-group" style={{ marginBottom: 0 }}>
            <label className="alf-label">Lead Source</label>
            <select name="source" className="alf-select" value={formData.source} onChange={handleChange}>
              <option value="Website">Website</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Referral">Referral</option>
              <option value="Social Media">Social Media</option>
            </select>
          </div>
          <div className="alf-group" style={{ marginBottom: 0 }}>
            <label className="alf-label">Assigned Agent *</label>
            <select name="salesAgent" className="alf-select" value={formData.salesAgent} onChange={handleChange} required>
              <option value="">Select Agent</option>
              {agents?.map(agent => (
                <option key={agent._id} value={agent._id}>{agent.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="alf-divider" />

        <div className="alf-group">
          <label className="alf-label">Pipeline Status</label>
          <select name="status" className="alf-select" value={formData.status} onChange={handleChange}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
          </select>
        </div>

        <div className="alf-group">
          <label className="alf-label">Priority Level</label>
          <div className="alf-priority-group">
            {['High', 'Medium', 'Low'].map(p => (
              <button key={p} type="button"
                className={`alf-priority-btn alf-priority-${p.toLowerCase()} ${formData.priority === p ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, priority: p })}>
                {p === 'High' ? '🔴' : p === 'Medium' ? '🟡' : '🟢'} {p}
              </button>
            ))}
          </div>
        </div>

        <div className="alf-group">
          <label className="alf-label">Estimated Days to Close</label>
          <div className="alf-range-value">{formData.timeToClose} days</div>
          <input type="range" name="timeToClose" className="alf-range"
            value={formData.timeToClose} onChange={handleChange} min="1" max="90" />
          <div className="alf-range-labels">
            <span>1 day</span><span>45 days</span><span>90 days</span>
          </div>
        </div>

        <div className="alf-divider" />

        <button type="submit" className="alf-submit" disabled={loading}>
          {loading ? (
            <><div className="alf-spinner" /> Creating Lead...</>
          ) : (
            <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Create Lead Opportunity
            </>
          )}
        </button>

      </form>
    </>
  );
};

export default AddLeadForm;