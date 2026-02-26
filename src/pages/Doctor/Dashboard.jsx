import React from "react";
import DashboardCard from "../../components/DashboardCard.jsx";
import TableComponent from "../../components/TableComponent.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { doctorAppointments } from "../../data/appointmentsData.js";
import "../../styles/pages/doctorDashboard.css";

const cards = [
  { title: "Today's Appointments", value: "9", note: "3 pending confirmations" },
  { title: "Total Patients", value: "312", note: "18 new in this month" },
  { title: "Earnings (Mock)", value: "INR 84,500", note: "Current month projected" }
];

const Dashboard = () => {
  const columns = [
    { key: "id", label: "ID" },
    { key: "patient", label: "Patient" },
    { key: "slot", label: "Slot" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" }
  ];
  const rows = doctorAppointments.map((a) => ({ ...a, status: <StatusBadge status={a.status} /> }));

  return (
    <div className="page-fade">
      <h2>Doctor Dashboard</h2>
      <div className="metrics-grid three-col">{cards.map((item) => <DashboardCard key={item.title} {...item} />)}</div>
      <section className="panel">
        <h3>Appointment List</h3>
        <TableComponent columns={columns} rows={rows} />
      </section>
    </div>
  );
};

export default Dashboard;
