import React from "react";
import DashboardCard from "../../components/DashboardCard.jsx";
import TableComponent from "../../components/TableComponent.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { apiGet } from "../../services/apiClient.js";
import "../../styles/pages/doctorDashboard.css";

const Dashboard = () => {
  const [cards, setCards] = React.useState([]);
  const [appointmentList, setAppointmentList] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await apiGet("/dashboard/doctor", { withAuth: true });
        if (!mounted) return;
        setCards(response.data.cards || []);
        setAppointmentList(response.data.appointmentList || []);
      } catch (_error) {
        if (!mounted) return;
        setCards([]);
        setAppointmentList([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "patient", label: "Patient" },
    { key: "slot", label: "Slot" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" }
  ];
  const rows = appointmentList.map((a) => ({ ...a, status: <StatusBadge status={a.status} /> }));

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
