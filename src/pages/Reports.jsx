import React from 'react';
import { useLeads } from '../context/LeadContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { Link } from 'react-router-dom';

const Reports = () => {
  const { leads, loading } = useLeads();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p className="text-muted fw-bold">Ruk ja bhai, data calculate ho raha hai...</p>
        </div>
      </div>
    );
  }

  // --- DATA PROCESSING ---
  const totalLeads = leads?.length || 0;
  const closedLeads = leads?.filter(l => l.status === 'Qualified').length || 0;
  const inPipelineLeads = totalLeads - closedLeads;

  const pipelineData = [
    { name: 'In Pipeline', value: inPipelineLeads },
    { name: 'Closed', value: closedLeads },
  ];

  const agentCounts = (leads || []).reduce((acc, lead) => {
    const name = lead.salesAgent?.name || "Unassigned";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const agentData = Object.keys(agentCounts).map(name => ({
    name,
    leads: agentCounts[name]
  })).sort((a, b) => b.leads - a.leads);

  const statusCounts = (leads || []).reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map(status => ({
    name: status,
    count: statusCounts[status]
  }));

  const COLORS = ['#0d6efd', '#198754', '#ffc107', '#fd7e14', '#6f42c1'];

  return (
    <div className="d-flex w-100 min-vh-100 bg-light overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="bg-white border-end d-flex flex-column shadow-sm sticky-top vh-100 d-none d-md-flex" style={{ width: '260px', minWidth: '260px' }}>
        <div className="p-4 border-bottom bg-primary text-white">
          <h5 className="mb-0 fw-bold">Anvaya CRM</h5>
          <small className="opacity-75">Reporting Engine</small>
        </div>
        <div className="p-3">
          <Link to="/" className="btn btn-dark w-100 rounded-pill shadow-sm mb-4">
            <i className="bi bi-grid-fill me-2"></i>Dashboard
          </Link>
          <div className="list-group list-group-flush">
            <div className="list-group-item border-0 small text-uppercase fw-bold text-muted">Analytics</div>
            <a href="#" className="list-group-item list-group-item-action border-0 active rounded-3 mb-1">
              <i className="bi bi-bar-chart-line me-2"></i>Performance
            </a>
            <a href="#" className="list-group-item list-group-item-action border-0 rounded-3 mb-1">
              <i className="bi bi-pie-chart me-2"></i>Distributions
            </a>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
  
<div className="flex-grow-1 d-flex flex-column min-w-0">
        
       {/* HEADER */}
      <header className="bg-white border-bottom p-3 p-md-4 sticky-top shadow-sm w-100">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
          <div>
            <h3 className="fw-bold text-dark mb-1 fs-4 fs-md-2">🚀 System Analytics</h3>
            <p className="text-muted small mb-0">Real-time performance metrics</p>
          </div>
          
          <div className="d-flex align-items-center justify-content-between gap-3">
            {/* Mobile Stats (Chote cards) */}
            <div className="d-flex gap-3">
              <div className="text-center">
                <div className="h5 mb-0 fw-bold text-primary">{totalLeads}</div>
                <small className="x-small text-muted">Total</small>
              </div>
              <div className="vr"></div>
              <div className="text-center">
                <div className="h5 mb-0 fw-bold text-success">{closedLeads}</div>
                <small className="x-small text-muted">Won</small>
              </div>
            </div>

            <Link to="/" className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-bold">
              Back <span className="d-none d-sm-inline">to Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

        {/* CHARTS GRID */}
      <main className="p-2 p-md-4">
        <div className="row g-3 g-md-4">
          
          {/* Chart 1: col-12 use karein taaki mobile pe full width ho */}
          <div className="col-12 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3 p-md-4">
              <h6 className="fw-bold text-dark mb-3">Pipeline vs Conversion</h6>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pipelineData} cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" dataKey="value">
                      {pipelineData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

            {/* Chart 2 */}
          <div className="col-12 col-lg-6 col-xl-7">
            <div className="card border-0 shadow-sm rounded-4 h-100 p-3 p-md-4">
              <h6 className="fw-bold text-dark mb-3">Lead Status</h6>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusData} margin={{bottom: 20}}>
                    <XAxis dataKey="name" tick={{fontSize: 10}} interval={0} angle={-20} textAnchor="end" />
                    <YAxis tick={{fontSize: 12}} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#6f42c1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

           {/* Chart 3: Agent Performance */}
          <div className="col-12">
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4">
              <h6 className="fw-bold text-dark mb-3">Agent Performance</h6>
              <div style={{ width: '100%', height: 350 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={agentData} layout="vertical" margin={{ left: -20, right: 30 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                    <Tooltip />
                    <Bar dataKey="leads" fill="#198754" radius={[0, 5, 5, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  </div>
);
};

export default Reports;