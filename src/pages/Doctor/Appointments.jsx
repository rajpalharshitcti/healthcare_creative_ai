import React, { useState } from "react";
import StatusBadge from "../../components/StatusBadge.jsx";
import Toast from "../../components/Toast.jsx";
import { apiGet, apiPatch } from "../../services/apiClient.js";
import "../../styles/pages/doctorAppointments.css";

const Appointments = () => {
  const [list, setList] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await apiGet("/appointments/doctor/my", { withAuth: true });
        if (!mounted) return;
        setList(response.data.appointments || []);
        setErrorMessage("");
      } catch (_error) {
        if (!mounted) return;
        setList([]);
        setErrorMessage("Unable to load appointments.");
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const update = async (id, status) => {
    const previous = list;
    setMessage("");
    setErrorMessage("");
    setList((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
    try {
      await apiPatch(`/appointments/${id}/status`, { status }, { withAuth: true });
      setMessage(`Appointment status updated to ${status}.`);
      setTimeout(() => setMessage(""), 1400);
    } catch (_error) {
      setList(previous);
      setErrorMessage("Unable to update appointment status.");
    }
  };

  return (
    <div className="panel page-fade">
      <h2>Manage Appointments</h2>
      {errorMessage ? <small className="field-error">{errorMessage}</small> : null}
      {message ? <small className="field-success">{message}</small> : null}
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
      <Toast open={Boolean(errorMessage || message)} message={errorMessage || message} type={errorMessage ? "error" : "success"} />
    </div>
  );
};

export default Appointments;
