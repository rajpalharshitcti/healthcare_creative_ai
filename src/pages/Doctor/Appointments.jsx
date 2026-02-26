import React, { useState } from "react";
import StatusBadge from "../../components/StatusBadge.jsx";
import { doctorAppointments } from "../../data/appointmentsData.js";
import "../../styles/pages/doctorAppointments.css";

const Appointments = () => {
  const [list, setList] = useState(doctorAppointments);

  const update = (id, status) => {
    setList((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  return (
    <div className="panel page-fade">
      <h2>Manage Appointments</h2>
      <div className="table-wrap">
        <table className="table-base">
          <thead><tr><th>ID</th><th>Patient</th><th>Slot</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td><td>{a.patient}</td><td>{a.slot}</td><td>{a.type}</td><td><StatusBadge status={a.status} /></td>
                <td>
                  <div className="action-row">
                    <button className="btn-ghost" onClick={() => update(a.id, "Confirmed")}>Accept</button>
                    <button className="btn-danger" onClick={() => update(a.id, "Rejected")}>Reject</button>
                    <select value={a.status} onChange={(e) => update(a.id, e.target.value)}>
                      <option>Pending</option><option>Confirmed</option><option>Completed</option><option>Rejected</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
