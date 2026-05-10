import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LeadProvider } from "./context/LeadContext";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import LeadDetails from "./pages/LeadDetails";
import Agents from "./pages/Agents";
import AddAgent from "./pages/AddAgent";
import Reports from "./pages/Reports";
import LeadStatusView from "./pages/LeadStatusView";
import SalesAgentView from "./pages/SalesAgentView";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./styles/layout.css";

function App() {
  return (
    <LeadProvider>
      <Router>
        <div className="app-layout">

          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="main-content">

            <ToastContainer position="top-right" autoClose={3000} />

            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lead/:id" element={<LeadDetails />} />
              <Route path="/sales-agent-view" element={<SalesAgentView />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/status-view" element={<LeadStatusView />} />
              <Route path="/agents/add" element={<AddAgent />} />
            </Routes>

          </div>

        </div>
      </Router>
    </LeadProvider>
  );
}

export default App;