import React, { useState, useEffect } from 'react';
import { useLeads } from '../context/LeadContext';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

const SalesAgentView = () => {
  const { leads, loading: leadsLoading, deleteLead } = useLeads();
  const { data: agents, loading: agentsLoading } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  const [selectedAgentId, setSelectedAgentId] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Time to Close");
  // SalesAgentView.jsx ke andar top pe:
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

// Agent select hone par sidebar apne aap band ho jaye (mobile ke liye)
  const handleAgentSelect = (id) => {
  setSelectedAgentId(id);
  setIsSidebarOpen(false); 
};

  if (leadsLoading || agentsLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Stylish Confirmation Function
  const confirmAction = (id, type) => {
    toast(
      ({ closeToast }) => (
        <div className="p-2">
          <p className="mb-2 fw-bold">are you really want delete it?</p>
          <div className="d-flex gap-2">
            <button 
              className="btn btn-sm btn-danger px-3" 
              onClick={() => { 
                type === 'lead' ? executeDeleteLead(id) : executeDeleteAgent(id);
                closeToast();
              }}
            >
              yes , delete it!
            </button>
            <button className="btn btn-sm btn-secondary px-3" onClick={closeToast}>No</button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, draggable: false }
    );
  };

  const executeDeleteAgent = async (agentId) => {
    try {
      const res = await fetch(`https://anvaya-project-backend.vercel.app/agents/${agentId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        toast.success("Agent removed successfully!");
        setTimeout(() => window.location.reload(), 1500); 
      }
    } catch (err) {
      toast.error("Failed to remove agent.");
    }
  };

  const executeDeleteLead = async (id) => {
    try {
      await deleteLead(id);
      toast.success("Lead khalaas! ✅"); 
    } catch (err) {
      toast.error("Lead delete nahi hui. ❌");
    }
  };

  // Filters logic remains same...
  const agentLeads = selectedAgentId === "All" 
    ? leads 
    : leads?.filter(lead => lead.salesAgent?._id === selectedAgentId);       

  const filteredLeads = agentLeads?.filter(lead => {
    const matchesStatus = statusFilter === "All" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "All" || lead.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const sortedLeads = [...(filteredLeads || [])].sort((a, b) => {
    if (sortBy === "Time to Close") return (a.timeToClose || 0) - (b.timeToClose || 0);
    return 0;
  });

  const activeAgentName = selectedAgentId === "All" 
    ? "All Agents" 
    : agents.find(a => a._id === selectedAgentId)?.name || "Select an Agent";

  const getPriorityBadge = (priority) => {
    const colors = { High: 'bg-danger text-white', Medium: 'bg-warning text-dark', Low: 'bg-info text-dark' };
    return <span className={`badge ${colors[priority] || 'bg-secondary'}`}>{priority}</span>;
  };

  return (
<div className="d-flex sales-container min-vh-100 bg-light">
        {/* ToastContainer yahan hona zaroori hai! */}
      <ToastContainer position="top-right" theme="colored" />

      {/* SIDEBAR */}
<div className={`agent-sidebar bg-white border-end shadow-sm ${isSidebarOpen ? 'show' : ''}`}>
  <div className="p-3 border-bottom bg-primary text-white d-flex justify-content-between align-items-center">
    <h5 className="mb-0 fw-bold">Agents List</h5>
    {/* Mobile Close Button */}
    <button className="btn text-white d-md-none" onClick={toggleSidebar}>
      <i className="bi bi-x-lg"></i>
    </button>
  </div>
  
  <div className="list-group list-group-flush agent-list-scroll">
    <button
      className={`list-group-item list-group-item-action py-3 ${selectedAgentId === "All" ? 'active-agent' : ''}`}
      onClick={() => handleAgentSelect("All")}
    >
      All Agents
    </button>

    {agents.map(agent => (
      <div key={agent._id} className="d-flex align-items-center border-bottom">
        <button
          className={`list-group-item list-group-item-action py-3 flex-grow-1 border-0 ${selectedAgentId === agent._id ? 'active-agent' : ''}`}
          onClick={() => handleAgentSelect(agent._id)}
        >
          {agent.name}
        </button>
        <i className="bi bi-trash text-danger p-2 me-2" style={{ cursor: 'pointer' }} onClick={() => confirmAction(agent._id, 'agent')}></i>
      </div>
    ))}
  </div>
</div>

{/* Overlay for Mobile (Jab sidebar khule toh background dhundla ho jaye) */}
{isSidebarOpen && <div className="sidebar-overlay d-md-none" onClick={toggleSidebar}></div>}

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow-1 overflow-auto">
       <header className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center sticky-top shadow-sm">
  <div className="d-flex align-items-center gap-3">
    {/* Hamburger Button - Visible only on Mobile */}
    <button className="btn btn-outline-primary d-md-none" onClick={toggleSidebar}>
      <i className="bi bi-list fs-4">Select Agent</i>
    </button>
    
    <div>
      <h4 className="fw-bold mb-0 fs-5">Agent Performance</h4>
      <p className="text-muted mb-0 x-small">
        <span className="text-primary fw-semibold">{activeAgentName}</span>
      </p>
    </div>
  </div>
  
  <Link to="/" className="btn btn-dark rounded-pill px-3 btn-sm">
    <i className="bi bi-arrow-left me-1"></i>Back
  </Link>
</header>

        <div className="p-4">
          {/* ... (Filters Card same as before) */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <div className="row g-3  align-items-end">
<div className="col-12 col-md-6 col-lg-3">
                    <label className="form-label small fw-bold text-muted">Lead Status</label>
                  <select className="form-select border-0 bg-light" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted">Priority</label>
                  <select className="form-select border-0 bg-light" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                    <option value="All">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label small fw-bold text-muted">Sort By</label>
                  <select className="form-select border-0 bg-light" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="Time to Close">Time to Close</option>
                  </select>
                </div>
                <div className="col-md-3 text-end">
                  <div className="bg-primary text-white p-2 px-3 rounded-3 d-inline-block shadow-sm">
                    <small className="d-block x-small opacity-75">TOTAL LEADS</small>
                    <h4 className="mb-0 fw-bold">{sortedLeads.length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-dark text-white">
                  <tr>
                    <th className="ps-4 py-3 border-0">Lead Name</th>
                    {selectedAgentId === "All" && <th className="border-0">Assigned Agent</th>}
                    <th className="border-0">Status</th>
                    <th className="border-0">Priority</th>
                    <th className="border-0">Closing (Days)</th>
                    <th className="text-end pe-4 border-0">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {sortedLeads.length > 0 ? (
                    sortedLeads.map(lead => (
                      <tr key={lead._id}>
                        <td className="ps-4 py-3">
                          <div className="fw-bold">{lead.name}</div>
                          <div className="text-muted x-small">ID: {lead._id.slice(-6)}</div>
                        </td>
                        {selectedAgentId === "All" && (
                          <td>
                            <span className="badge bg-light text-dark border">{lead.salesAgent?.name || 'Unassigned'}</span>
                          </td>
                        )}
                        <td>
                          <span className="badge rounded-pill bg-light text-primary border border-primary-subtle px-3 py-2">
                            {lead.status}
                          </span>
                        </td>
                        <td>{getPriorityBadge(lead.priority)}</td>
                        <td>
                          <div className="fw-semibold">
                            <i className="bi bi-clock-history me-2 text-primary"></i>
                            {lead.timeToClose} Days
                          </div>
                        </td>
                        <td className="text-end pe-4">
                          <div className="d-flex gap-2 justify-content-end">
                            <Link to={`/lead/${lead._id}`} className="btn btn-sm btn-outline-primary rounded-pill px-3">View</Link>
                            <button 
                              className="btn btn-sm btn-outline-danger rounded-pill px-3"
                              onClick={() => confirmAction(lead._id, 'lead')}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={selectedAgentId === "All" ? "6" : "5"} className="text-center py-5 text-muted">No leads found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesAgentView;