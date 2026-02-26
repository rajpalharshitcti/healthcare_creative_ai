import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import Signup from "./pages/signup.jsx";
import ForgotPassword from "./pages/forgot_password.jsx";
import PatientDashboard from "./pages/user_dashboard.jsx";
import SearchDoctors from "./pages/doctor_search.jsx";
import DoctorProfile from "./pages/doctor_detail.jsx";
import BookingFlow from "./pages/book_appointment.jsx";
import BookingSuccess from "./pages/payment_success.jsx";
import MyAppointments from "./pages/my_appointments.jsx";
import MedicalRecords from "./pages/medical_records.jsx";
import Pharmacy from "./pages/pharmacy_search.jsx";
import PharmacyCheckout from "./pages/checkout.jsx";
import Diagnostics from "./pages/diagnostic_search.jsx";
import DiagnosticsCheckout from "./pages/diagnostic_cart.jsx";
import ProfileSetup from "./pages/profile_details.jsx";
import DoctorDashboard from "./pages/doctor_dashboard.jsx";
import DoctorAppointments from "./pages/doctor_appointments.jsx";
import Consultation from "./pages/consultation_screen.jsx";
import Earnings from "./pages/earning_screen.jsx";
import DoctorOnboarding from "./pages/doctor_profile_setup.jsx";
import EditProfile from "./pages/edit_profile.jsx";
import PatientRegistration from "./pages/patient_registration.jsx";

const RequireAuth = ({ children, role: allowedRole, needsOnboarding = false, allowUnregistered = false }) => {
  const { isAuthenticated, role, pendingOnboardingRole, authInitialized } = useAuth();

  if (!authInitialized) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === "patient" ? "/patient/dashboard" : "/doctor/dashboard"} replace />;
  }
  if (needsOnboarding && role === "doctor" && pendingOnboardingRole === "doctor") {
    return <Navigate to="/doctor/onboarding" replace />;
  }
  if (!allowUnregistered && allowedRole === "patient" && pendingOnboardingRole === "patient") {
    return <Navigate to="/patient/register" replace />;
  }
  return children;
};

const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/doctor-profile/:id" element={<DoctorProfile />} />
    <Route
      path="/doctor/onboarding"
      element={
        <RequireAuth role="doctor" allowUnregistered>
          <DoctorOnboarding />
        </RequireAuth>
      }
    />
    <Route
      path="/patient/register"
      element={
        <RequireAuth role="patient" allowUnregistered>
          <PatientRegistration />
        </RequireAuth>
      }
    />

    <Route element={<AppLayout />}>
      <Route
        path="/patient/dashboard"
        element={<RequireAuth role="patient"><PatientDashboard /></RequireAuth>}
      />
      <Route
        path="/patient/search-doctors"
        element={<RequireAuth role="patient"><SearchDoctors /></RequireAuth>}
      />
      <Route
        path="/patient/doctor/:id"
        element={<RequireAuth role="patient"><DoctorProfile /></RequireAuth>}
      />
      <Route
        path="/patient/book"
        element={<RequireAuth role="patient"><BookingFlow /></RequireAuth>}
      />
      <Route
        path="/patient/book/success"
        element={<RequireAuth role="patient"><BookingSuccess /></RequireAuth>}
      />
      <Route
        path="/patient/appointments"
        element={<RequireAuth role="patient"><MyAppointments /></RequireAuth>}
      />
      <Route
        path="/patient/records"
        element={<RequireAuth role="patient"><MedicalRecords /></RequireAuth>}
      />
      <Route
        path="/patient/pharmacy"
        element={<RequireAuth role="patient"><Pharmacy /></RequireAuth>}
      />
      <Route
        path="/patient/pharmacy/checkout"
        element={<RequireAuth role="patient"><PharmacyCheckout /></RequireAuth>}
      />
      <Route
        path="/patient/diagnostics"
        element={<RequireAuth role="patient"><Diagnostics /></RequireAuth>}
      />
      <Route
        path="/patient/diagnostics/checkout"
        element={<RequireAuth role="patient"><DiagnosticsCheckout /></RequireAuth>}
      />
      <Route
        path="/patient/profile-setup"
        element={<RequireAuth role="patient"><ProfileSetup /></RequireAuth>}
      />

      <Route
        path="/doctor/dashboard"
        element={<RequireAuth role="doctor" needsOnboarding><DoctorDashboard /></RequireAuth>}
      />
      <Route
        path="/doctor/appointments"
        element={<RequireAuth role="doctor" needsOnboarding><DoctorAppointments /></RequireAuth>}
      />
      <Route
        path="/doctor/consultation"
        element={<RequireAuth role="doctor" needsOnboarding><Consultation /></RequireAuth>}
      />
      <Route
        path="/doctor/earnings"
        element={<RequireAuth role="doctor" needsOnboarding><Earnings /></RequireAuth>}
      />
      <Route
        path="/profile/edit"
        element={<RequireAuth><EditProfile /></RequireAuth>}
      />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
