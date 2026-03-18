import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import AddLeadForm from '../components/AddLeadForm';
import useFetch from '../hooks/useFetch';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Dashboard = () => {

  const { leads, deleteLead } = useLeads();

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgentFilter, setSelectedAgentFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Priority");

  const { data: agents } = useFetch(
    "https://anvaya-project-backend.vercel.app/agents",
    []
  );

  


  /* ---------- STATS ---------- */

  const stats = {

    new: leads?.filter(l => l.status === "New").length || 0,

    contacted: leads?.filter(l => l.status === "Contacted").length || 0,

    qualified: leads?.filter(l => l.status === "Qualified").length || 0,

  };


  /* ---------- FILTER ---------- */

  const priorityOrder = { High: 3, Medium: 2, Low: 1 };


  const finalLeads = leads

    ?.filter(lead => {

      const matchesStatus =
        activeFilter === "All" || lead.status === activeFilter;

      const matchesAgent =
        selectedAgentFilter === "All" ||
        lead.salesAgent?._id === selectedAgentFilter;

      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesAgent && matchesSearch;

    })


    ?.sort((a, b) => {

      if (sortBy === "Priority")

        return (
          priorityOrder[b.priority] - priorityOrder[a.priority]
        );

      if (sortBy === "Time to Close")

        return a.timeToClose - b.timeToClose;

      return 0;

    });



  return (

    <div>


      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold">Anvaya CRM Dashboard</h2>

        <span className="text-muted">

          Welcome back, Admin

        </span>

      </div>



      {/* STATS */}

      <div className="row g-3 mb-4">


        <div className="col-md-4">

          <div className="crm-card p-4 bg-primary text-white">

            <small>New Leads</small>

            <h3>{stats.new}</h3>

          </div>

        </div>



        <div className="col-md-4">

          <div className="crm-card p-4 bg-warning">

            <small>Contacted</small>

            <h3>{stats.contacted}</h3>

          </div>

        </div>



        <div className="col-md-4">

          <div className="crm-card p-4 bg-success text-white">

            <small>Qualified</small>

            <h3>{stats.qualified}</h3>

          </div>

        </div>


      </div>




      {/* MAIN GRID */}

      <div className="dashboard-grid">



        {/* LEFT SIDE TABLE */}


        <div className="crm-card p-4">


          {/* FILTER BUTTON */}

          <div className="d-flex justify-content-between mb-3">


            <h5 className="fw-bold">

              Recent Leads

            </h5>


            <div className="btn-group">

              {["All", "New", "Contacted", "Qualified"]

                .map(status => (

                  <button

                    key={status}

                    onClick={() => setActiveFilter(status)}

                    className={`btn btn-sm ${
                      activeFilter === status
                        ? "btn-dark"
                        : "btn-outline-secondary"
                    }`}

                  >

                    {status}

                  </button>

                ))}

            </div>


          </div>




          {/* SEARCH FILTER */}


          <div className="row mb-3 g-2">


            <div className="col-md-6">

              <input

                type="text"

                className="form-control"

                placeholder="Search client..."

                value={searchTerm}

                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }

              />

            </div>



            <div className="col-md-3">

              <select

                className="form-select"

                value={selectedAgentFilter}

                onChange={(e) =>
                  setSelectedAgentFilter(e.target.value)
                }

              >

                <option value="All">

                  All Agents

                </option>


                {agents?.map(agent => (

                  <option

                    key={agent._id}

                    value={agent._id}

                  >

                    {agent.name}

                  </option>

                ))}

              </select>

            </div>




            <div className="col-md-3">

              <select

                className="form-select"

                value={sortBy}

                onChange={(e) =>
                  setSortBy(e.target.value)
                }

              >

                <option value="Priority">

                  Sort Priority

                </option>

                <option value="Time to Close">

                  Sort Closing Time

                </option>

              </select>

            </div>


          </div>




          {/* TABLE */}


<div className="table-responsive" style={{ border: "none" }}>

<table className="table align-middle" style={{ minWidth: "600px" }}>
{/* minWidth dene se mobile par priority aur action columns gayab nahi honge balki scroll honge */}
              <thead>

                <tr>

                  <th>Client</th>

                  <th>Status</th>

                  <th>Agent</th>

                  <th>Priority</th>

                  <th className="text-end">Action</th>

                   

                </tr>

              </thead>




              <tbody>


                {finalLeads?.map(lead => (


                  <tr key={lead._id}>


                    <td>

                      <Link

                        to={`/lead/${lead._id}`}

                        className="fw-semibold text-decoration-none"

                      >

                        {lead.name}

                      </Link>

                    </td>




                    <td>

                      <span className="badge bg-primary">

                        {lead.status}

                      </span>

                    </td>




                    <td>

                      {lead.salesAgent?.name || "Unassigned"}

                    </td>




                    <td>

                      {lead.priority}

                    </td>




                    <td className="text-end">

                      <button

                        className="btn btn-sm btn-link text-danger"

                        onClick={() =>
                          deleteLead(lead._id)
                        }

                      >

                        Remove

                      </button>

                    </td>


                  </tr>


                ))}


              </tbody>


            </table>


          </div>


        </div>




        {/* RIGHT SIDE FORM */}



        <div>


          <div

            className="crm-card p-4 sticky-top"

            style={{ top: "20px" }}

          >


            <h5 className="fw-bold mb-3">

              Create New Lead

            </h5>


            <AddLeadForm

              agents={agents}

            />


          </div>


        </div>




      </div>


    </div>

  );

};


export default Dashboard;
