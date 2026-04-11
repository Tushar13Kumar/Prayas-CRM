import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLeads } from '../context/LeadContext';
import useFetch from '../hooks/useFetch'; 
import { toast } from 'react-toastify';

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const { updateLeadInState } = useLeads();
  
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

 // 2. handleUpdateLead function ke andar success block mein isse call karo
const handleUpdateLead = async () => {
  try {
    const agentId = editData.salesAgent?._id || editData.salesAgent;

    const res = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editData,
        salesAgent: agentId === "" ? null : agentId 
      }),
    });

    const result = await res.json();

    if (res.ok) {
      setLead(result);
      setEditData(result);
      
      // 🔥 YE LINE IMPORTANT HAI: Global context update karne ke liye
      updateLeadInState(result); 

      setIsEditing(false);
      toast.success("Lead details updated successfully!");
    } else {
      toast.error(result.error || "Update failed.");
    }
  } catch (error) {
    toast.error("Network error.");
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
      text: newComment, // Frontend state se text lo
      authorId: selectedAgent, // Frontend state se ID lo
    }),
  });

  if (response.ok) {
    const updatedComments = await response.json();
    // Yahan state update ho rahi hai
    setLead(prev => ({ ...prev, comments: updatedComments }));
    setNewComment(""); 
    setSelectedAgent(""); 
    toast.success("Activity log updated.");
  } else {
    toast.error("Failed to add comment.");
  }
};

 return (
  <div className="container py-5">
    {/* Lead Info Card */}
    <div className="card p-4 shadow-sm mb-4 border-0 bg-white">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-1 fw-bold">{lead?.name || "Loading..."}</h2>
          <p className="text-muted mb-0">Lead ID: #{id?.slice(-6).toUpperCase()}</p>
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
        {/* Agent Field */}
        <div className="col-md-3">
          <small className="text-uppercase text-muted fw-bold d-block">Assigned Agent</small>
          {isEditing ? (
            <select 
              className="form-select mt-1" 
              value={typeof editData?.salesAgent === 'object' ? editData?.salesAgent?._id : editData?.salesAgent || ""} 
              onChange={(e) => setEditData({...editData, salesAgent: e.target.value})}
            >
              <option value="">Unassigned</option>
              {agents?.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          ) : (
            <p className="fs-5">{lead?.salesAgent?.name || "Unassigned"}</p>
          )}
        </div>

        {/* Priority Field */}
        <div className="col-md-3">
          <small className="text-uppercase text-muted fw-bold d-block">Priority</small>
          {isEditing ? (
            <select className="form-select mt-1" value={editData?.priority} onChange={(e) => setEditData({...editData, priority: e.target.value})}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          ) : (
            <p className={`fs-5 fw-bold ${lead?.priority === 'High' ? 'text-danger' : 'text-dark'}`}>{lead?.priority}</p>
          )}
        </div>

        {/* Status Field */}
        <div className="col-md-3">
          <small className="text-uppercase text-muted fw-bold d-block">Status</small>
          {isEditing ? (
            <select className="form-select mt-1" value={editData?.status} onChange={(e) => setEditData({...editData, status: e.target.value})}>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </select>
          ) : (
            <span className="badge rounded-pill bg-primary px-3 py-2">{lead?.status}</span>
          )}
        </div>
      </div>
    </div>

    {/* Activity Log Section - Line 191 Fix */}
    <div className="card p-4 shadow-sm bg-light border-0">
      <h5 className="mb-4 fw-bold text-secondary text-uppercase">Activity Log & Updates</h5>
      
      <div className="pe-2 mb-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {/* Safe Check: lead?.comments */}
        {lead?.comments && lead.comments.length > 0 ? (
          lead.comments.map((comment, index) => (
            <div key={index} className="mb-3 p-3 bg-white rounded shadow-sm border-start border-primary border-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold text-primary">
                  {typeof comment.author === 'object' ? comment.author?.name : "Agent"}
                </span>
                <small className="text-muted">
                  {comment.createdAt ? new Date(comment.createdAt).toLocaleString('en-IN') : ""}
                </small>
              </div>
              <p className="mb-0 text-dark">{comment.commentText}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-muted">No updates posted yet.</div>
        )}
      </div>

      <hr className="my-4" />

      {/* Input Fields for new comment */}
      <div className="row g-3">
        <div className="col-md-4">
          <select className="form-select" value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
            <option value="">Select Reporting Agent...</option>
            {agents?.map(agent => <option key={agent._id} value={agent._id}>{agent.name}</option>)}
          </select>
        </div>
        <div className="col-12">
          <textarea className="form-control" rows="3" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Enter follow-up note..."></textarea>
        </div>
        <div className="col-12 text-end">
          <button className="btn btn-primary px-4" onClick={handleAddComment}>Post Update</button>
        </div>
      </div>
    </div>
  </div>
);
};

export default LeadDetails;