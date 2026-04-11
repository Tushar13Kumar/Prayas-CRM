import { createContext, useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { toast } from 'react-toastify';

const LeadContext = createContext();

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState([]);
  const { data, loading, error } = useFetch("https://anvaya-project-backend.vercel.app/leads", []);

  useEffect(() => {
    if (data) setLeads(data);
  }, [data]);

  // LeadContext.jsx mein deleteLead function update karo:
const deleteLead = (id) => {
  // Create a custom toast with "Yes" and "No" buttons
  const confirmToast = ({ closeToast }) => (
    <div>
      <p style={{ marginBottom: "10px" }}>delete?</p>
      <div style={{ display: "flex", gap: "10px" }}>
        <button 
          onClick={async () => {
            await proceedDelete(id);
            closeToast(); // Close the toast after confirming
          }}
          style={{ background: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
        >
          confirm!
        </button>
        <button 
          onClick={closeToast}
          style={{ background: "#6c757d", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: "pointer" }}
        >
          No!
        </button>
      </div>
    </div>
  );

  // Trigger the toast
  toast.info(confirmToast, {
    position: "top-center",
    autoClose: false, // Don't auto-close so the user can click
    closeOnClick: false,
    draggable: false,
  });
};

// Separate function to handle the actual API call
const proceedDelete = async (id) => {
  try {
    const response = await fetch(`https://anvaya-project-backend.vercel.app/leads/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setLeads(prev => prev.filter(l => l._id !== id));
      toast.success("Lead Delete!");
    }
  } catch (err) {
    toast.error("Network error!");
  }
};

const fetchLeads = async () => {
    const res = await fetch("https://anvaya-project-backend.vercel.app/leads");
    const data = await res.json();
    setLeads(data);
  };
  const updateLeadInState = (updatedLead) => {
  setLeads(prevLeads => 
    prevLeads.map(lead => lead._id === updatedLead._id ? updatedLead : lead)
  );
};

  useEffect(() => { fetchLeads(); }, []);

 return (
  <LeadContext.Provider value={{ leads, loading, error, deleteLead, fetchLeads, updateLeadInState }}>
    {children}
  </LeadContext.Provider>
);
};

// ISKO EKDUM ALAG LINE PE RAKHO
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error("useLeads must be used within a LeadProvider");
  }
  return context;
};