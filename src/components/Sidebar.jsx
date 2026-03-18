import { NavLink } from "react-router-dom";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle Button (Visible only on small screens) */}
      <button 
        className="btn btn-dark d-md-none position-fixed m-2 z-3" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ top: 10, left: 10 }}
      >
        {isOpen ? "✕" : "☰"}
      </button>

      <div
        className={`bg-white border-end shadow-sm sidebar-container ${isOpen ? 'show' : ''}`}
        style={{
          width: "250px",
          height: "100vh",
          position: "sticky",
          top: 0,
          transition: "0.3s"
        }}
      >
        <div className="p-3">
          <h4 className="mb-4 fw-bold mt-5 mt-md-0">Anvaya CRM</h4>
          <ul className="nav flex-column">
            <li className="nav-item mb-2">
              <NavLink to="/" className="nav-link" onClick={() => setIsOpen(false)}>Leads</NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/sales-agent-view" className="nav-link" onClick={() => setIsOpen(false)}>Sales</NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/agents" className="nav-link" onClick={() => setIsOpen(false)}>Agents</NavLink>
            </li>
            <li className="nav-item mb-2">
              <NavLink to="/reports" className="nav-link" onClick={() => setIsOpen(false)}>Reports</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/status-view" className="nav-link" onClick={() => setIsOpen(false)}>Leads by Status</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;