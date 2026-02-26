import React from "react";
import { Link } from "react-router-dom";
import "../../styles/pages/bookingSuccess.css";

const BookingSuccess = () => (
  <div className="panel success-box page-fade">
    <h2>Appointment Confirmed</h2>
    <p>Your booking was completed successfully. A confirmation has been shared with you.</p>
    <Link className="btn-primary" to="/patient/appointments">Go to My Appointments</Link>
  </div>
);

export default BookingSuccess;
