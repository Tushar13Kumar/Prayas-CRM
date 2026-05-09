import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const AddAgent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false); // To prevent double clicks
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("https://anvaya-project-backend.vercel.app/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        toast.success("congratulation! new agent is added");
        navigate("/agents"); 
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Server error occurred!");
      }
    } catch (err) {
      toast.error("Network issue! Check your internet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (

    <div className="d-flex flex-column w-100 min-vh-100 bg-light">
      <h1>Add Agent & Follow up</h1>
      <div className="p-4">
        <Link to="/agents" className="btn btn-sm btn-outline-secondary mb-3">
           <i className="bi bi-arrow-left"></i> Back to List
        </Link>
        
        <div className="card p-4 shadow-sm mx-auto border-0 rounded-4" style={{ maxWidth: '500px' }}>
          <h4 className="fw-bold mb-4">Add New Sales Agent</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Agent Name</label>
              <input 
                type="text" 
                className="form-control form-control-lg shadow-sm" 
                placeholder="Enter full name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input 
                type="email" 
                className="form-control form-control-lg shadow-sm" 
                placeholder="agent@prayas.com"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 fw-bold mt-3 shadow"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Create Agent"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAgent;