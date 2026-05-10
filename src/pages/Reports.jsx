import React from 'react';
import { useLeads } from '../context/LeadContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ec4899', '#14b8a6'];

const Reports = () => {
  const { leads, loading } = useLeads();

  if (loading) {
    return (
      <div className="rep-loading">
        <div className="rep-spinner" />
        <p>Calculating analytics...</p>
      </div>
    );
  }

  const totalLeads    = leads?.length || 0;
  const closedLeads   = leads?.filter(l => l.status === 'Qualified').length || 0;
  const inPipeline    = totalLeads - closedLeads;
  const highPriority  = leads?.filter(l => l.priority === 'High').length || 0;

  const pipelineData = [
    { name: 'In Pipeline', value: inPipeline },
    { name: 'Qualified',   value: closedLeads },
  ];

  const agentCounts = (leads || []).reduce((acc, lead) => {
    const name = lead.salesAgent?.name || "Unassigned";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});
  const agentData = Object.keys(agentCounts)
    .map(name => ({ name, leads: agentCounts[name] }))
    .sort((a, b) => b.leads - a.leads);

  const statusCounts = (leads || []).reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.keys(statusCounts).map(status => ({
    name: status, count: statusCounts[status]
  }));

  // Custom tooltip dark theme
  const DarkTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontFamily: 'Sora, sans-serif', fontSize: 12, color: 'var(--text)' }}>
        {label && <p style={{ margin: '0 0 4px', color: 'var(--text-muted)', fontSize: 11 }}>{label}</p>}
        {payload.map((p, i) => <p key={i} style={{ margin: 0, color: p.color || 'var(--accent)' }}>{p.name}: <strong>{p.value}</strong></p>)}
      </div>
    );
  };

  return (
    <>
      <style>{`
        .rep-wrap {
          padding: 28px 28px 48px;
          font-family: 'Sora', 'Segoe UI', sans-serif;
          min-height: 100vh;
          background: var(--bg);
          color: var(--text);
        }

        /* HEADER */
        .rep-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 16px; }
        .rep-title { font-size: 22px; font-weight: 600; color: var(--text); margin: 0; }
        .rep-subtitle { font-size: 13px; color: var(--text-muted); margin: 4px 0 0; }
        .rep-back {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 8px; color: var(--text-muted); font-size: 12px;
          font-weight: 500; font-family: 'Sora',sans-serif; padding: 7px 14px;
          text-decoration: none; transition: border-color 0.15s, color 0.15s;
        }
        .rep-back:hover { border-color: var(--accent); color: var(--text); }

        /* STAT PILLS */
        .rep-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 24px; }
        .rep-stat {
          background: var(--surface); border-radius: 12px; padding: 16px 20px;
          border: 1px solid var(--border); text-align: center;
        }
        .rep-stat-val { font-size: 26px; font-weight: 600; line-height: 1; margin: 0 0 4px; }
        .rep-stat-lbl { font-size: 11px; color: var(--text-muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }

        /* CHARTS GRID */
        .rep-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .rep-grid-full { grid-column: 1 / -1; }

        /* CARD */
        .rep-card {
          background: var(--surface); border-radius: 14px;
          border: 1px solid var(--border); padding: 20px 22px;
        }
        .rep-card-title { font-size: 14px; font-weight: 600; color: var(--text); margin: 0 0 16px; }

        /* LOADING */
        .rep-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: var(--bg); color: var(--text-muted); font-family: 'Sora',sans-serif; gap: 16px; }
        .rep-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid var(--border); border-top-color: var(--accent); animation: rep-spin 0.8s linear infinite; }
        @keyframes rep-spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) { .rep-stats { grid-template-columns: repeat(2, 1fr); } .rep-grid { grid-template-columns: 1fr; } }
        @media (max-width: 576px) { .rep-wrap { padding: 16px; } .rep-stats { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="rep-wrap">

        {/* HEADER */}
        <div className="rep-header">
          <div>
            <h1 className="rep-title">Analytics & Reports</h1>
            <p className="rep-subtitle">Real-time pipeline performance metrics</p>
          </div>
          <Link to="/" className="rep-back">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Dashboard
          </Link>
        </div>

        {/* STAT PILLS */}
        <div className="rep-stats">
          <div className="rep-stat">
            <p className="rep-stat-val" style={{ color: '#6366f1' }}>{totalLeads}</p>
            <p className="rep-stat-lbl">Total Leads</p>
          </div>
          <div className="rep-stat">
            <p className="rep-stat-val" style={{ color: '#22c55e' }}>{closedLeads}</p>
            <p className="rep-stat-lbl">Qualified</p>
          </div>
          <div className="rep-stat">
            <p className="rep-stat-val" style={{ color: '#f59e0b' }}>{inPipeline}</p>
            <p className="rep-stat-lbl">In Pipeline</p>
          </div>
          <div className="rep-stat">
            <p className="rep-stat-val" style={{ color: '#dc2626' }}>{highPriority}</p>
            <p className="rep-stat-lbl">High Priority</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="rep-grid">

          {/* Pie Chart */}
          <div className="rep-card">
            <p className="rep-card-title">Pipeline vs Qualified</p>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pipelineData} cx="50%" cy="50%" innerRadius="55%" outerRadius="78%" dataKey="value" paddingAngle={3}>
                  {pipelineData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontFamily: 'Sora, sans-serif', color: 'var(--text-muted)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Status Bar Chart */}
          <div className="rep-card">
            <p className="rep-card-title">Leads by Status</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusData} margin={{ bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'Sora' }} angle={-15} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="count" fill="#6366f1" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Agent Performance — full width */}
          <div className="rep-card rep-grid-full">
            <p className="rep-card-title">Agent Performance</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 12, fill: 'var(--text-muted)', fontFamily: 'Sora' }} />
                <Tooltip content={<DarkTooltip />} />
                <Bar dataKey="leads" fill="#22c55e" radius={[0, 6, 6, 0]} barSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </>
  );
};

export default Reports;