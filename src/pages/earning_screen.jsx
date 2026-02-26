import React from "react";
import { apiGet } from "../services/apiClient.js";
import "../styles/earning_screen.css";

const monthly = [
  { label: "Jan", value: 52 },
  { label: "Feb", value: 68 },
  { label: "Mar", value: 61 },
  { label: "Apr", value: 74 },
  { label: "May", value: 79 },
  { label: "Jun", value: 84 }
];

const Earnings = () => {
  const [currentMonthEarning, setCurrentMonthEarning] = React.useState("INR 0.00");

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const response = await apiGet("/dashboard/doctor", { withAuth: true });
        const earningCard = (response.data.cards || []).find((card) => card.title.includes("Earnings"));
        if (!mounted) return;
        setCurrentMonthEarning(earningCard?.value || "INR 0.00");
      } catch (_error) {
        if (!mounted) return;
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="panel page-fade">
      <h2>Earnings Summary</h2>
      <p className="subtle">Monthly earnings performance (mock data)</p>
      <div className="graph-wrap">
        {monthly.map((m) => (
          <div key={m.label} className="bar-col">
            <div className="bar" style={{ height: `${m.value}%` }} />
            <span>{m.label}</span>
          </div>
        ))}
      </div>
      <h3>Current Month: {currentMonthEarning}</h3>
    </div>
  );
};

export default Earnings;



