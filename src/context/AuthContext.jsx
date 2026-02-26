import React, { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const menus = {
  patient: [
    { label: "Dashboard", to: "/patient/dashboard" },
    { label: "Search Doctors", to: "/patient/search-doctors" },
    { label: "My Appointments", to: "/patient/appointments" },
    { label: "Medical Records", to: "/patient/records" },
    { label: "Pharmacy", to: "/patient/pharmacy" },
    { label: "Diagnostics", to: "/patient/diagnostics" },
    { label: "Profile Setup", to: "/patient/profile-setup" },
    { label: "Edit Profile", to: "/profile/edit" }
  ],
  doctor: [
    { label: "Dashboard", to: "/doctor/dashboard" },
    { label: "Appointments", to: "/doctor/appointments" },
    { label: "Consultation", to: "/doctor/consultation" },
    { label: "Earnings", to: "/doctor/earnings" },
    { label: "Edit Profile", to: "/profile/edit" }
  ]
};

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState("patient");
  const [entryRole, setEntryRole] = useState("patient");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingOnboardingRole, setPendingOnboardingRole] = useState(null);
  const [registeredRoles, setRegisteredRoles] = useState({
    patient: true,
    doctor: true
  });
  const [profile, setProfile] = useState({
    fullName: "Harshit Sharma",
    email: "harshit@healthsphere.com",
    phone: "+91 98765 43210",
    city: "Mumbai",
    avatar: "https://i.pravatar.cc/320?img=68",
    speciality: "General Physician",
    qualification: "MBBS",
    registrationNo: "REG-1021",
    clinicName: "HealthSphere Clinic",
    experience: "8-12",
    consultationMode: "Both",
    ageGroup: "26-40",
    bloodGroup: "B+",
    primaryNeed: "Routine Checkups"
  });

  const setActiveRole = (nextRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setRole(nextRole);
      setEntryRole(nextRole);
      setIsLoading(false);
    }, 250);
  };

  const login = ({ email }) => {
    setIsLoading(true);
    setTimeout(() => {
      setRole(entryRole);
      setProfile((prev) => ({ ...prev, email: email || prev.email }));
      setPendingOnboardingRole(null);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 300);
  };

  const signup = ({ fullName, email, phone }, selectedRole = "patient") => {
    setIsLoading(true);
    setTimeout(() => {
      setRole(selectedRole);
      setEntryRole(selectedRole);
      setProfile((prev) => ({
        ...prev,
        fullName,
        email,
        phone,
        city: "Not Set",
        avatar: selectedRole === "doctor" ? "https://i.pravatar.cc/320?img=12" : "https://i.pravatar.cc/320?img=68"
      }));
      setRegisteredRoles((prev) => ({ ...prev, [selectedRole]: false }));
      setPendingOnboardingRole(selectedRole);
      setIsAuthenticated(true);
      setIsLoading(false);
    }, 350);
  };

  const completeDoctorOnboarding = (doctorData) => {
    setRegisteredRoles((prev) => ({ ...prev, doctor: true }));
    setPendingOnboardingRole((prev) => (prev === "doctor" ? null : prev));
    if (doctorData) {
      setProfile((prev) => ({
        ...prev,
        speciality: doctorData.speciality,
        qualification: doctorData.qualification,
        registrationNo: doctorData.registrationNo,
        clinicName: doctorData.clinicName,
        experience: doctorData.experience,
        consultationMode: doctorData.consultationMode,
        city: doctorData.city
      }));
    }
    setRole("doctor");
  };

  const completePatientRegistration = (patientData) => {
    setRegisteredRoles((prev) => ({ ...prev, patient: true }));
    setPendingOnboardingRole((prev) => (prev === "patient" ? null : prev));
    if (patientData) {
      setProfile((prev) => ({
        ...prev,
        ageGroup: patientData.ageGroup,
        bloodGroup: patientData.bloodGroup,
        primaryNeed: patientData.primaryNeed,
        city: patientData.city
      }));
    }
    setRole("patient");
  };

  const needsRoleRegistration = () => pendingOnboardingRole === role;

  const canUseRole = (targetRole) => registeredRoles[targetRole];

  const switchWorkspace = (targetRole) => {
    setRole(targetRole);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPendingOnboardingRole(null);
  };

  const updateProfile = (data) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  const value = useMemo(
    () => ({
      role,
      entryRole,
      setEntryRole,
      setActiveRole,
      menus,
      isLoading,
      isAuthenticated,
      registeredRoles,
      pendingOnboardingRole,
      profile,
      login,
      signup,
      logout,
      updateProfile,
      completeDoctorOnboarding,
      completePatientRegistration,
      needsRoleRegistration,
      canUseRole,
      switchWorkspace
    }),
    [role, entryRole, isLoading, isAuthenticated, registeredRoles, pendingOnboardingRole, profile]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
