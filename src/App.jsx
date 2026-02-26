import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import Home from "./pages/Landing/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx";
import ForgotPassword from "./pages/Auth/ForgotPassword.jsx";
import PatientDashboard from "./pages/Patient/Dashboard.jsx";
import SearchDoctors from "./pages/Patient/SearchDoctors.jsx";
import DoctorProfile from "./pages/Patient/DoctorProfile.jsx";
import BookingFlow from "./pages/Patient/BookingFlow.jsx";
import BookingSuccess from "./pages/Patient/BookingSuccess.jsx";
import MyAppointments from "./pages/Patient/MyAppointments.jsx";
import MedicalRecords from "./pages/Patient/MedicalRecords.jsx";
import Pharmacy from "./pages/Patient/Pharmacy.jsx";
import PharmacyCheckout from "./pages/Patient/PharmacyCheckout.jsx";
import Diagnostics from "./pages/Patient/Diagnostics.jsx";
import DiagnosticsCheckout from "./pages/Patient/DiagnosticsCheckout.jsx";
import ProfileSetup from "./pages/Patient/ProfileSetup.jsx";
import DoctorDashboard from "./pages/Doctor/Dashboard.jsx";
import DoctorAppointments from "./pages/Doctor/Appointments.jsx";
import Consultation from "./pages/Doctor/Consultation.jsx";
import Earnings from "./pages/Doctor/Earnings.jsx";
import DoctorOnboarding from "./pages/Doctor/Onboarding.jsx";
import EditProfile from "./pages/Profile/EditProfile.jsx";
import PatientRegistration from "./pages/Patient/Registration.jsx";

const RequireAuth = ({ children, role: allowedRole, needsOnboarding = false, allowUnregistered = false }) => {
  const { isAuthenticated, role, pendingOnboardingRole } = useAuth();

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
