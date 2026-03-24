import React from 'react';
import useFetch from '../hooks/useFetch';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'; // 👈 1. SweetAlert import karle
import { Link } from 'react-router-dom'; // Add this import

const Agents = () => {
  const { data: agents, loading, error, setData } = useFetch("https://anvaya-project-backend.vercel.app/agents", []);

  const deleteAgent = async (id) => {
    // 👈 2. Ye raha naya React Alert logic
    Swal.fire({
      title: 'Sure ho bhai?',
      text: "Is agent ko nikalne ke baad wapas nahi la paoge!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd', // Bootstrap primary color
      cancelButtonColor: '#dc3545',  // Bootstrap danger color
      confirmButtonText: 'Haan, nikal do!',
      cancelButtonText: 'Nahi, rehne do'
    }).then(async (result) => {
      
      // Agar user ne "Haan" (Confirm) dabaya
      if (result.isConfirmed) {
        try {
          const res = await fetch(`https://anvaya-project-backend.vercel.app/agents/${id}`, {
            method: "DELETE",
          });

          if (res.ok) {
            setData(agents.filter(agent => agent._id !== id));
            
            // Delete hone ke baad chhota sa toast dikha do
            toast.success("Agent ka patta saaf!"); 
          } else {
            toast.error("Server ne mana kar diya!");
          }
        } catch (err) {
          toast.error("Network issue hai bhai!");
        }
      }
    });
  };

  // ... baaki pura code same rahega

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light w-100">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}></div>
      </div>
    );
  }

  return (
    /* Key fix: Removed .container constraints. 
       Using w-100 and flex-grow-1 ensures the right side of the screen is filled.
    */
    <div className="d-flex flex-column w-100 min-vh-100 bg-light overflow-hidden">
      
      {/* HEADER: Spans 100% width */}
      <header className="bg-white border-bottom p-4 shadow-sm w-100">
        <div className="d-flex justify-content-between align-items-center px-2">
          <div>
            <h2 className="fw-bold text-dark mb-1">Sales Team Management</h2>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item small">Anvaya CRM</li>
                <li className="breadcrumb-item small active text-primary fw-semibold">All Agents</li>
              </ol>
            </nav>
          </div>
          <div className="d-flex gap-3 align-items-center">
             <div className="text-end d-none d-md-block">
                <div className="fw-bold text-primary h4 mb-0">{agents.length}</div>
                <div className="text-muted x-small text-uppercase fw-bold">Active Staff</div>
             </div>
             <div className="vr mx-2 d-none d-md-block"></div>
             <button className="btn btn-primary rounded-pill px-4 shadow-sm py-2">
{/* Change the button to a Link or wrap it */}
<Link to="/agents/add" className="btn btn-primary rounded-pill px-4 shadow-sm py-2">
  <i className="bi bi-person-plus-fill me-2"></i>Add New Agent
</Link>             </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA: flex-grow-1 forces this to use all space */}
      <main className="p-4 flex-grow-1 w-100">
        <div className="card border-0 shadow-sm rounded-4 w-100">
          <div className="table-responsive w-100">
            <table className="table table-hover align-middle mb-0 w-100">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="ps-4 py-3 border-0 text-uppercase small fw-bold" style={{ width: '30%' }}>Agent Profile</th>
                  <th className="border-0 text-uppercase small fw-bold" style={{ width: '35%' }}>Contact Information</th>
                  <th className="border-0 text-uppercase small fw-bold text-center" style={{ width: '15%' }}>Account Status</th>
                  <th className="text-end pe-4 border-0 text-uppercase small fw-bold" style={{ width: '20%' }}>Management Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {agents.length > 0 ? (
                  agents.map(agent => (
                    <tr key={agent._id} className="transition-all">
                      <td className="ps-4 py-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary-subtle text-primary rounded-3 d-flex align-items-center justify-content-center me-3 shadow-sm fw-bold" style={{ width: '45px', height: '45px', fontSize: '1.2rem' }}>
                            {agent.name.charAt(0)}
                          </div>
                          <div>
                            <div className="fw-bold text-dark h6 mb-0">{agent.name}</div>
                            <div className="text-muted x-small">ID: {agent._id.slice(-8).toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column">
                          <span className="text-dark small fw-semibold">
                            <i className="bi bi-envelope-fill me-2 text-primary"></i>{agent.email}
                          </span>
                          <span className="text-muted x-small mt-1">
                            <i className="bi bi-shield-check me-2"></i>Verified Sales Representative
                          </span>
                        </div>
                      </td>
                    <td className="text-end pe-4">
  <div className="d-flex justify-content-end align-items-center gap-3">
    {/* Edit Button (Size fixed) */}
    <button className="btn btn-outline-secondary rounded-circle p-2 shadow-sm" title="Edit Agent">
      <i className="bi bi-pencil-square"></i>
    </button>

    {/* Terminate Button (Bada aur clear) */}
    <button 
      className="btn btn-danger px-4 py-2 rounded-pill fw-bold transition shadow-sm" 
      onClick={() => deleteAgent(agent._id)}
      style={{ minWidth: '120px' }} // Taaki button ka size fix rahe
    >
      <i className="bi bi-trash3 me-2"></i>Terminate
    </button>
  </div>
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-5">
                      <div className="py-5">
                        <i className="bi bi-people text-muted opacity-25" style={{ fontSize: '5rem' }}></i>
                        <h4 className="mt-3 text-dark fw-bold">No Agents Found</h4>
                        <p className="text-muted">The agent database is currently empty.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* FOOTER: Optional, helps ground the full-screen look */}
      <footer className="bg-white border-top p-3 w-100 text-center text-muted small">
        &copy; 2026 Anvaya CRM Sales Portal | Edge-to-Edge Interface
      </footer>
    </div>
  );
};

export default Agents;