import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';

const LeadStatusView = () => {
  const { leads, loading } = useLeads();
  const { data: agents } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  const [activeStatus, setActiveStatus] = useState("New");
  const [selectedAgent, setSelectedAgent] = useState("All");
  const [sortBy, setSortBy] = useState("Time to Close");
  
  // Mobile Sidebar Toggle State
  const [showSidebar, setShowSidebar] = useState(false);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 w-100 bg-light text-primary">
        <div className="spinner-border me-2" role="status"></div>
        <span className="fw-bold">Leads load ho rahi hain...</span>
      </div>
    );
  }

  const sortedLeads = [...(leads || [])]
    .filter(lead => (lead.status === activeStatus && (selectedAgent === "All" || lead.salesAgent?._id === selectedAgent)))
    .sort((a, b) => {
      if (sortBy === "Time to Close") return (a.timeToClose || 0) - (b.timeToClose || 0);
      if (sortBy === "Priority") {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
      }
      return 0;
    });

  return (
    <div className="d-flex w-100 min-vh-100 bg-light overflow-hidden position-relative">
      
      {/* MOBILE OVERLAY (Sidebar khulne par background dark karne ke liye) */}
      {showSidebar && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none" 
          style={{ zIndex: 1040 }}
          onClick={() => setShowSidebar(false)}
        > </div>
      )}

      {/* 1. LEFT NAVIGATION SIDEBAR */}
      <div className={`bg-white border-end d-flex flex-column shadow-sm vh-100 custom-sidebar ${showSidebar ? 'show' : ''}`}>
        <div className="p-4 border-bottom bg-primary text-white d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0 fw-bold">Anvaya CRM</h5>
            <small className="opacity-75">Status Management</small>
          </div>
          <button className="btn btn-sm text-white d-md-none" onClick={() => setShowSidebar(false)}>
            <i className="bi bi-x-lg">Back</i>
          </button>
        </div>
        
        <div className="p-3 flex-grow-1 overflow-auto">
          <p className="small text-uppercase fw-bold text-muted mb-3 px-2">Filter by Status</p>
          <div className="nav flex-column nav-pills">
            {["New", "Contacted", "Qualified", "Proposal Sent"].map(status => (
              <button
                key={status}
                className={`nav-link text-start mb-2 py-3 px-4 border-0 rounded-3 fw-semibold ${activeStatus === status ? 'active shadow-sm' : 'text-dark bg-transparent'}`}
                onClick={() => { setActiveStatus(status); setShowSidebar(false); }}
              >
                {status} Leads
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 border-top mt-auto">
          <Link to="/" className="btn btn-outline-dark w-100 rounded-pill fw-bold">Dashboard</Link>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-grow-1 d-flex flex-column min-w-0">
        
        <header className="bg-white border-bottom p-3 p-md-4 sticky-top shadow-sm w-100">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              {/* HAMBURGER BUTTON FOR MOBILE */}
              <button className="btn btn-primary d-md-none" onClick={() => setShowSidebar(true)}>
                <i className="bi bi-list">Filter By</i>
              </button>
              <div>
                <h2 className="fw-bold text-dark mb-0 fs-4 fs-md-2">Status: <span className="text-primary">{activeStatus}</span></h2>
              </div>
            </div>
            
            <div className="d-none d-sm-block">
               <div className="bg-primary bg-opacity-10 text-primary px-3 py-1 rounded-pill fw-bold small">
                  Total: {sortedLeads.length}
               </div>
            </div>
          </div>
        </header>

        <main className="p-2 p-md-4">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-header bg-white border-bottom p-3">
              <div className="row g-2">
                <div className="col-6 col-md-4">
                  <select className="form-select border-0 bg-light" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
                    <option value="All">All Agents</option>
                    {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                  </select>
                </div>
                <div className="col-6 col-md-4">
                  <select className="form-select border-0 bg-light" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="Time to Close">Fastest</option>
                    <option value="Priority">Priority</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ minWidth: '600px' }}>
                <thead className="bg-light">
                  <tr className="small text-muted">
                    <th className="ps-4">LEAD</th>
                    <th>AGENT</th>
                    <th className="text-center">PRIORITY</th>
                    <th className="text-center">CLOSING</th>
                    <th className="pe-4 text-end">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeads.map(lead => (
                    <tr key={lead._id}>
                      <td className="ps-4">
                        <span className="fw-bold d-block">{lead.name}</span>
                        <small className="text-muted">ID: {lead._id.slice(-4)}</small>
                      </td>
                      <td>{lead.salesAgent?.name || "Unassigned"}</td>
                      <td className="text-center">
                        <span className={`badge rounded-pill ${lead.priority === 'High' ? 'bg-danger' : 'bg-warning'} bg-opacity-10 text-dark`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="text-center">{lead.timeToClose} Days</td>
                      <td className="pe-4 text-end">
                        <Link to={`/lead/${lead._id}`} className="btn btn-sm btn-light border">View</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeadStatusView;