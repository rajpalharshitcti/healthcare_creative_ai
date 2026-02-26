import React from "react";
import DashboardCard from "../components/DashboardCard.jsx";
import TableComponent from "../components/TableComponent.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { apiGet } from "../services/apiClient.js";
import "../styles/user_dashboard.css";

const Dashboard = () => {
  const [cards, setCards] = React.useState([]);
  const [appointments, setAppointments] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await apiGet("/dashboard/patient", { withAuth: true });
        if (!mounted) return;
        setCards(response.data.cards || []);
        setAppointments(response.data.recentAppointments || []);
      } catch (_error) {
        if (!mounted) return;
        setCards([]);
        setAppointments([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "doctor", label: "Doctor" },
    { key: "date", label: "Date" },
    { key: "mode", label: "Mode" },
    { key: "status", label: "Status" }
  ];

  const rows = appointments.map((a) => ({ ...a, status: <StatusBadge status={a.status} /> }));

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



