import React, { createContext, useContext, useMemo, useState } from "react";

const AppointmentContext = createContext(null);

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);

  const value = useMemo(() => ({ appointments, setAppointments }), [appointments]);
  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

export const useAppointment = () => useContext(AppointmentContext);
