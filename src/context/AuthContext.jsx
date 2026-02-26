import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiGet, apiPost, apiPut } from "../services/apiClient.js";
import { clearAuthToken, getAuthToken, setAuthToken } from "../services/authStorage.js";

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

const defaultProfile = {
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
};

const mapExtendedProfile = (profile) => {
  const doctor = profile?.doctor || {};
  const patient = profile?.patient || {};
  return {
    fullName: profile?.fullName || defaultProfile.fullName,
    email: profile?.email || defaultProfile.email,
    phone: profile?.phone || defaultProfile.phone,
    city: profile?.city || defaultProfile.city,
    avatar: profile?.avatar || defaultProfile.avatar,
    speciality: doctor.speciality || defaultProfile.speciality,
    qualification: doctor.qualification || defaultProfile.qualification,
    registrationNo: doctor.registration_no || defaultProfile.registrationNo,
    clinicName: doctor.clinic_name || defaultProfile.clinicName,
    experience: doctor.experience || defaultProfile.experience,
    consultationMode: doctor.consultation_mode || defaultProfile.consultationMode,
    ageGroup: patient.age_group || defaultProfile.ageGroup,
    bloodGroup: patient.blood_group || defaultProfile.bloodGroup,
    primaryNeed: patient.primary_need || defaultProfile.primaryNeed
  };
};

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState("patient");
  const [entryRole, setEntryRole] = useState("patient");
  const [isLoading, setIsLoading] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingOnboardingRole, setPendingOnboardingRole] = useState(null);
  const [registeredRoles, setRegisteredRoles] = useState({
    patient: true,
    doctor: true
  });
  const [profile, setProfile] = useState(defaultProfile);

  const applyUserSnapshot = useCallback((user) => {
    if (!user) return;
    const activeRole = user.role || "patient";
    setRole(activeRole);
    setEntryRole(activeRole);
    setPendingOnboardingRole(user.pendingOnboardingRole || null);
    setRegisteredRoles(user.registeredRoles || { patient: true, doctor: true });
    setProfile((prev) => ({
      ...prev,
      fullName: user.fullName || prev.fullName,
      email: user.email || prev.email,
      phone: user.phone || prev.phone,
      city: user.city || prev.city,
      avatar: user.avatar || prev.avatar
    }));
    setIsAuthenticated(true);
  }, []);

  const syncExtendedProfile = useCallback(async () => {
    const profileRes = await apiGet("/users/profile", { withAuth: true });
    const fullProfile = mapExtendedProfile(profileRes.data.profile);
    setProfile((prev) => ({ ...prev, ...fullProfile }));
  }, []);

  const bootstrapAuth = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setAuthInitialized(true);
      return;
    }

    setIsLoading(true);
    try {
      const meRes = await apiGet("/auth/me", { withAuth: true });
      applyUserSnapshot(meRes.data.user);
      await syncExtendedProfile();
    } catch (_error) {
      clearAuthToken();
      setIsAuthenticated(false);
      setPendingOnboardingRole(null);
      setRegisteredRoles({ patient: true, doctor: true });
      setProfile(defaultProfile);
      setRole("patient");
      setEntryRole("patient");
    } finally {
      setIsLoading(false);
      setAuthInitialized(true);
    }
  }, [applyUserSnapshot, syncExtendedProfile]);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const setActiveRole = (nextRole) => {
    setRole(nextRole);
    setEntryRole(nextRole);
  };

  const login = async ({ email, password }) => {
    setIsLoading(true);
    try {
      const response = await apiPost("/auth/login", {
        email,
        password,
        entryRole
      });
      setAuthToken(response.data.token);
      applyUserSnapshot(response.data.user);
      await syncExtendedProfile();
      return { success: true, message: response.message || "Login successful." };
    } catch (error) {
      return { success: false, message: error.message || "Login failed." };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async ({ fullName, email, phone, password }, selectedRole = "patient") => {
    setIsLoading(true);
    try {
      const response = await apiPost("/auth/signup", {
        fullName,
        email,
        phone,
        password,
        role: selectedRole
      });
      setAuthToken(response.data.token);
      applyUserSnapshot(response.data.user);
      await syncExtendedProfile();
      return { success: true, message: response.message || "Signup successful." };
    } catch (error) {
      return { success: false, message: error.message || "Sign-up failed." };
    } finally {
      setIsLoading(false);
    }
  };

  const completeDoctorOnboarding = async (doctorData) => {
    setIsLoading(true);
    try {
      const payload = {
        speciality: doctorData.speciality,
        qualification: doctorData.qualification,
        registrationNo: doctorData.registrationNo,
        clinicName: doctorData.clinicName,
        experience: doctorData.experience,
        consultationMode: doctorData.consultationMode,
        city: doctorData.city
      };
      await apiPost("/doctors/onboarding/complete", payload, { withAuth: true });
      setRegisteredRoles((prev) => ({ ...prev, doctor: true }));
      setPendingOnboardingRole((prev) => (prev === "doctor" ? null : prev));
      setRole("doctor");
      setEntryRole("doctor");
      setProfile((prev) => ({ ...prev, ...doctorData }));
      await syncExtendedProfile();
      return { success: true, message: "Doctor onboarding completed successfully." };
    } catch (error) {
      return { success: false, message: error.message || "Doctor onboarding failed." };
    } finally {
      setIsLoading(false);
    }
  };

  const completePatientRegistration = async (patientData) => {
    setIsLoading(true);
    try {
      await apiPost("/patients/registration/complete", patientData, { withAuth: true });
      setRegisteredRoles((prev) => ({ ...prev, patient: true }));
      setPendingOnboardingRole((prev) => (prev === "patient" ? null : prev));
      setRole("patient");
      setEntryRole("patient");
      setProfile((prev) => ({ ...prev, ...patientData }));
      await syncExtendedProfile();
      return { success: true, message: "Patient registration completed successfully." };
    } catch (error) {
      return { success: false, message: error.message || "Patient registration failed." };
    } finally {
      setIsLoading(false);
    }
  };

  const needsRoleRegistration = () => pendingOnboardingRole === role;

  const canUseRole = (targetRole) => registeredRoles[targetRole];

  const switchWorkspace = async (targetRole) => {
    setIsLoading(true);
    try {
      const response = await apiPost("/auth/switch-role", { role: targetRole }, { withAuth: true });
      applyUserSnapshot(response.data.user);
      await syncExtendedProfile();
      return { success: true, message: response.message || "Workspace switched successfully." };
    } catch (error) {
      return { success: false, message: error.message || "Workspace switch failed." };
    } finally {
      setIsLoading(false);
    }
  };

  const addRole = async (targetRole) => {
    setIsLoading(true);
    try {
      const response = await apiPost("/auth/add-role", { role: targetRole }, { withAuth: true });
      applyUserSnapshot(response.data.user);
      await syncExtendedProfile();
      return { success: true, message: response.message || "Workspace added successfully." };
    } catch (error) {
      return { success: false, message: error.message || "Unable to add workspace." };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthToken();
    setAuthInitialized(true);
    setIsAuthenticated(false);
    setPendingOnboardingRole(null);
    setRegisteredRoles({ patient: true, doctor: true });
    setRole("patient");
    setEntryRole("patient");
    setProfile(defaultProfile);
  };

  const updateProfile = async (data) => {
    setIsLoading(true);
    try {
      await apiPut("/users/profile", {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        avatar: data.avatar
      }, { withAuth: true });

      if (role === "doctor" && data.speciality && data.qualification && data.registrationNo && data.clinicName && data.experience && data.consultationMode) {
        await apiPost("/doctors/onboarding/complete", {
          speciality: data.speciality,
          qualification: data.qualification,
          registrationNo: data.registrationNo,
          clinicName: data.clinicName,
          experience: data.experience,
          consultationMode: data.consultationMode,
          city: data.city
        }, { withAuth: true });
      }

      if (role === "patient" && data.ageGroup && data.bloodGroup && data.primaryNeed) {
        await apiPost("/patients/registration/complete", {
          ageGroup: data.ageGroup,
          bloodGroup: data.bloodGroup,
          primaryNeed: data.primaryNeed,
          city: data.city
        }, { withAuth: true });
      }

      await syncExtendedProfile();
      return { success: true, message: "Profile updated successfully." };
    } catch (error) {
      return { success: false, message: error.message || "Profile update failed." };
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      role,
      entryRole,
      setEntryRole,
      setActiveRole,
      menus,
      isLoading,
      authInitialized,
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
      switchWorkspace,
      addRole,
      refreshProfile: syncExtendedProfile
    }),
    [role, entryRole, isLoading, authInitialized, isAuthenticated, registeredRoles, pendingOnboardingRole, profile, syncExtendedProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
