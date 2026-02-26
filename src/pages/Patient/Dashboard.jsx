import React from "react";
import DashboardCard from "../../components/DashboardCard.jsx";
import TableComponent from "../../components/TableComponent.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { patientAppointments } from "../../data/appointmentsData.js";
import "../../styles/pages/patientDashboard.css";

const cards = [
  { title: "Upcoming Appointments", value: "3", note: "Next tomorrow at 10:00 AM" },
  { title: "Total Consultations", value: "26", note: "Across online and in-clinic" },
  { title: "Prescriptions", value: "8", note: "2 active medications" },
  { title: "Medical Reports", value: "14", note: "Last updated Feb 25" }
];

const Dashboard = () => {
  const columns = [
    { key: "id", label: "ID" },
    { key: "doctor", label: "Doctor" },
    { key: "date", label: "Date" },
    { key: "mode", label: "Mode" },
    { key: "status", label: "Status" }
  ];

  const rows = patientAppointments.map((a) => ({ ...a, status: <StatusBadge status={a.status} /> }));

  return (
    <div className="page-fade">
      <h2>Patient Dashboard</h2>
      <div className="metrics-grid">{cards.map((card) => <DashboardCard key={card.title} {...card} />)}</div>
      <section className="panel">
        <h3>Recent Appointments</h3>
        <TableComponent columns={columns} rows={rows} />
      </section>
    </div>
  );
};

export default Dashboard;
