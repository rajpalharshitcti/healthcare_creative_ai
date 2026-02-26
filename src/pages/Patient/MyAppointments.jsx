import React from "react";
import TableComponent from "../../components/TableComponent.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { patientAppointments } from "../../data/appointmentsData.js";
import "../../styles/pages/myAppointments.css";

const MyAppointments = () => {
  const columns = [
    { key: "id", label: "Appointment ID" },
    { key: "doctor", label: "Doctor" },
    { key: "date", label: "Date" },
    { key: "mode", label: "Mode" },
    { key: "status", label: "Status" }
  ];

  const rows = patientAppointments.map((a) => ({ ...a, status: <StatusBadge status={a.status} /> }));

  return (
    <div className="panel page-fade">
      <h2>My Appointments</h2>
      <TableComponent columns={columns} rows={rows} />
    </div>
  );
};

export default MyAppointments;
