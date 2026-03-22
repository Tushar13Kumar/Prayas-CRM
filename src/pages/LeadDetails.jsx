import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch'; 
import { toast } from 'react-toastify';

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  
  // Edit mode ke liye states
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const { data: agents } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = () => {
    fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`)
      .then(res => res.json())
      .then(data => {
        setLead(data);
        setEditData(data); // Edit form ke liye initial data set karein
      })
      .catch(err => toast.error("Failed to load lead details."));
  };

  // Lead update karne ka function
  const handleUpdateLead = async () => {
  try {
    const res = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editData,
        // Yahan dhyan dein: Backend sirf ID expect karta hai ya pura object? 
        // Agar ID expect karta hai toh salesAgent ko string bana kar bhejein:
        salesAgent: typeof editData.salesAgent === 'object' ? editData.salesAgent?._id : editData.salesAgent
      }),
    });

    const result = await res.json();

    if (res.ok) {
      setLead(result);
      setEditData(result);
      setIsEditing(false);
      toast.success("Lead details updated successfully!");
    } else {
      // Backend se aane wala error message dikhayein
      toast.error(result.error || "Update failed on server.");
    }
  } catch (error) {
    console.error("Update Error:", error);
    toast.error("Network error or server down.");
  }
};

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedAgent) {
      return toast.warn("Please select an agent and enter a comment.");
    }

    const response = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        text: newComment, 
        authorId: selectedAgent,
      }),
    });

    if (response.ok) {
      const updatedComments = await response.json();
      setLead(prev => ({ ...prev, comments: updatedComments }));
      setNewComment(""); 
      setSelectedAgent(""); 
      toast.success("Activity log updated.");
    } else {
      toast.error("Failed to add comment.");
    }
  };

  if (!lead) return (
    <div className="container p-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 text-muted">Retrieving lead information...</p>
    </div>
  );

  return (
    <div className="container py-5">
      {/* Lead Information Header */}
      <div className="card p-4 shadow-sm mb-4 border-0 bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="mb-1 fw-bold">{lead.name}</h2>
            <p className="text-muted mb-0">Lead ID: #{id.slice(-6).toUpperCase()}</p>
          </div>
          <div>
            {!isEditing ? (
              <button className="btn btn-outline-primary me-2" onClick={() => setIsEditing(true)}>Edit Lead</button>
            ) : (
              <>
                <button className="btn btn-success me-2" onClick={handleUpdateLead}>Save Changes</button>
                <button className="btn btn-light" onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            )}
          </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row">
          {/* Editable Fields Logic */}
          <div className="col-md-3">
            <small className="text-uppercase text-muted fw-bold d-block">Assigned Agent</small>
            {isEditing ? (
              <select 
                className="form-select mt-1" 
                value={editData.salesAgent?._id || ""} 
                onChange={(e) => setEditData({...editData, salesAgent: e.target.value})}
              >
                <option value="">Unassigned</option>
                {agents?.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
              </select>
            ) : (
              <p className="fs-5">{lead.salesAgent?.name || "Unassigned"}</p>
            )}
          </div>

          <div className="col-md-3">
            <small className="text-uppercase text-muted fw-bold d-block">Priority</small>
            {isEditing ? (
              <select 
                className="form-select mt-1" 
                value={editData.priority} 
                onChange={(e) => setEditData({...editData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            ) : (
              <p className={`fs-5 fw-bold ${lead.priority === 'High' ? 'text-danger' : 'text-dark'}`}>{lead.priority}</p>
            )}
          </div>

          <div className="col-md-3">
            <small className="text-uppercase text-muted fw-bold d-block">Status</small>
            {isEditing ? (
              <select 
                className="form-select mt-1" 
                value={editData.status} 
                onChange={(e) => setEditData({...editData, status: e.target.value})}
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Closed">Closed</option>
              </select>
            ) : (
              <span className="badge rounded-pill bg-primary px-3 py-2">{lead.status}</span>
            )}
          </div>

          <div className="col-md-3">
            <small className="text-uppercase text-muted fw-bold d-block">Est. Days to Close</small>
            {isEditing ? (
              <input 
                type="number" 
                className="form-control mt-1" 
                value={editData.timeToClose} 
                onChange={(e) => setEditData({...editData, timeToClose: e.target.value})}
              />
            ) : (
              <p className="fs-5">{lead.timeToClose} Days</p>
            )}
          </div>
        </div>
      </div>

      {/* Activity Log Section */}
      <div className="card p-4 shadow-sm bg-light border-0">
        <h5 className="mb-4 fw-bold text-secondary text-uppercase">Activity Log & Updates</h5>
        
        {/* Comments Display List (Same as before) */}
        <div className="pe-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
           {/* ... lead.comments.map logic remains same ... */}
        </div>

        <hr className="my-4" />

        {/* Updated Input Section with TEXTAREA */}
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label small fw-bold text-muted">Reporting Agent</label>
            <select className="form-select" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
              <option value="">Select Agent...</option>
              {agents?.map(agent => (
                <option key={agent._id} value={agent._id}>{agent.name}</option>
              ))}
            </select>
          </div>
          
          <div className="col-md-7">
            <label className="form-label small fw-bold text-muted">Follow-up Note</label>
            {/* INPUT KI JAGAH TEXTAREA */}
            <textarea 
              className="form-control" 
              rows="3"
              placeholder="Enter detailed interaction notes here..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100 py-3 shadow-sm" onClick={handleAddComment}>
              Post Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;