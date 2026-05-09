import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { toast } from 'react-toastify';

const AddLeadForm = ({ agents }) => {
  const [formData, setFormData] = useState({
    name: "", source: "Website", salesAgent: "",
    status: "New", priority: "Medium", timeToClose: 10,
  });
  const [submitting, setSubmitting] = useState(false);
  const { fetchLeads } = useLeads();

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("https://anvaya-project-backend.vercel.app/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        await fetchLeads();
        toast.success("Lead created successfully!");
        setFormData({ name:"", source:"Website", salesAgent:"", status:"New", priority:"Medium", timeToClose:10 });
      } else {
        toast.error("Failed to save lead.");
      }
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%', border: '1px solid #e2e8f0', borderRadius: '9px',
    padding: '9px 12px', fontSize: '13px', fontFamily: "'Sora','Segoe UI',sans-serif",
    color: '#0f172a', outline: 'none', background: '#f8fafc',
    transition: 'border-color 0.15s', boxSizing: 'border-box',
  };
  const selectStyle = {
    ...inputStyle, cursor: 'pointer', color: '#374151',
  };
  const labelStyle = {
    display: 'block', fontSize: '11px', fontWeight: '600',
    color: '#64748b', marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: '0 24px 24px', fontFamily: "'Sora','Segoe UI',sans-serif" }}>

      {/* Client Name */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Client Name</label>
        <input
          type="text" name="name" required
          placeholder="e.g. Rahul Sharma"
          value={formData.name} onChange={handleChange}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e  => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      {/* Source + Agent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
        <div>
          <label style={labelStyle}>Lead Source</label>
          <select name="source" value={formData.source} onChange={handleChange} style={selectStyle}>
            <option value="Website">Website</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Referral">Referral</option>
            <option value="Social Media">Social Media</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Agent</label>
          <select name="salesAgent" required value={formData.salesAgent} onChange={handleChange} style={selectStyle}>
            <option value="">Select...</option>
            {agents?.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>
      </div>

      {/* Status + Priority */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
        <div>
          <label style={labelStyle}>Status</label>
          <select name="status" value={formData.status} onChange={handleChange} style={selectStyle}>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Priority</label>
          <select name="priority" value={formData.priority} onChange={handleChange} style={selectStyle}>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Days to Close */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Days to Close</label>
        <input
          type="number" name="timeToClose" min="1"
          value={formData.timeToClose} onChange={handleChange}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#6366f1'}
          onBlur={e  => e.target.style.borderColor = '#e2e8f0'}
        />
        <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>
          Estimated days to convert this lead
        </span>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        style={{
          width: '100%', background: submitting ? '#a5b4fc' : '#6366f1',
          color: 'white', border: 'none', borderRadius: '10px',
          padding: '11px', fontSize: '14px', fontWeight: '600',
          fontFamily: "'Sora','Segoe UI',sans-serif",
          cursor: submitting ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s', letterSpacing: '0.01em',
        }}
        onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = '#4f46e5'; }}
        onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = '#6366f1'; }}
      >
        {submitting ? 'Creating...' : 'Create Lead'}
      </button>

    </form>
  );
};

export default AddLeadForm;