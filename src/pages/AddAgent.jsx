import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';

const AddAgent = () => {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [submitting, setSubmitting] = useState(false);
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
        toast.success("Agent added successfully!");
        navigate("/agents");
      } else {
        const err = await res.json();
        toast.error(err.message || "Server error.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .aa-wrap {
          padding: 28px 28px 48px; font-family: 'Sora','Segoe UI',sans-serif;
          min-height: 100vh; background: var(--bg); color: var(--text);
          display: flex; flex-direction: column; align-items: center;
        }
        .aa-inner { width: 100%; max-width: 480px; }

        /* BACK */
        .aa-back { display: inline-flex; align-items: center; gap: 6px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--text-muted); font-size: 12px; font-weight: 500; font-family: 'Sora',sans-serif; padding: 7px 14px; text-decoration: none; transition: border-color 0.15s, color 0.15s; margin-bottom: 24px; }
        .aa-back:hover { border-color: var(--accent); color: var(--text); }

        /* CARD */
        .aa-card { background: var(--surface); border-radius: 16px; border: 1px solid var(--border); overflow: hidden; }
        .aa-card-head { padding: 24px 28px 20px; border-bottom: 1px solid var(--border); }
        .aa-card-title { font-size: 18px; font-weight: 600; color: var(--text); margin: 0 0 4px; }
        .aa-card-sub { font-size: 13px; color: var(--text-muted); margin: 0; }
        .aa-card-body { padding: 24px 28px 28px; }

        /* FORM */
        .aa-group { margin-bottom: 18px; }
        .aa-label { display: block; font-size: 12px; font-weight: 500; color: var(--text-muted); margin-bottom: 6px; letter-spacing: 0.01em; }
        .aa-input {
          width: 100%; background: var(--input-bg); border: 1px solid var(--border);
          border-radius: 8px; padding: 10px 14px; font-size: 14px;
          font-family: 'Sora',sans-serif; color: var(--text); outline: none;
          transition: border-color 0.15s, box-shadow 0.15s; box-sizing: border-box;
        }
        .aa-input::placeholder { color: var(--text-muted); opacity: 0.6; }
        .aa-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
        .aa-divider { height: 1px; background: var(--border); margin: 20px 0; }
        .aa-submit {
          width: 100%; background: var(--accent); color: white;
          border: none; border-radius: 10px; padding: 12px;
          font-size: 14px; font-weight: 600; font-family: 'Sora',sans-serif;
          cursor: pointer; transition: opacity 0.2s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .aa-submit:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .aa-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .aa-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.25); border-top-color: white; border-radius: 50%; animation: aa-spin 0.7s linear infinite; }
        @keyframes aa-spin { to { transform: rotate(360deg); } }

        @media (max-width: 576px) { .aa-wrap { padding: 16px; } .aa-card-head, .aa-card-body { padding: 18px; } }
      `}</style>

      <div className="aa-wrap">
        <div className="aa-inner">

          <Link to="/agents" className="aa-back">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Agents
          </Link>

          <div className="aa-card">
            <div className="aa-card-head">
              <h1 className="aa-card-title">Add New Agent</h1>
              <p className="aa-card-sub">Create a new sales agent account</p>
            </div>
            <div className="aa-card-body">
              <form onSubmit={handleSubmit}>

                <div className="aa-group">
                  <label className="aa-label">Full Name *</label>
                  <input type="text" className="aa-input" placeholder="e.g. Rahul Sharma"
                    value={name} onChange={e => setName(e.target.value)} required />
                </div>

                <div className="aa-group">
                  <label className="aa-label">Email Address *</label>
                  <input type="email" className="aa-input" placeholder="agent@prayas.com"
                    value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                <div className="aa-divider" />

                <button type="submit" className="aa-submit" disabled={submitting}>
                  {submitting ? (
                    <><div className="aa-spinner" /> Creating Agent...</>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      Create Agent
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AddAgent;