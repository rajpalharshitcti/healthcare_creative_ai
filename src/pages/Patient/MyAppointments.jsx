import React from "react";
import TableComponent from "../../components/TableComponent.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { apiGet } from "../../services/apiClient.js";
import "../../styles/pages/myAppointments.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await apiGet("/appointments/patient/my", { withAuth: true });
        if (!mounted) return;
        setAppointments(response.data.appointments || []);
      } catch (_error) {
        if (!mounted) return;
        setAppointments([]);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const columns = [
    { key: "id", label: "Appointment ID" },
    { key: "doctor", label: "Doctor" },
    { key: "date", label: "Date" },
    { key: "mode", label: "Mode" },
    { key: "status", label: "Status" }
  ];

  const rows = appointments.map((a) => ({ ...a, status: <StatusBadge status={a.status} /> }));

  return (
    <div className="panel page-fade">
      <h2>My Appointments</h2>
      <TableComponent columns={columns} rows={rows} />
    </div>
  );
};

export default MyAppointments;
