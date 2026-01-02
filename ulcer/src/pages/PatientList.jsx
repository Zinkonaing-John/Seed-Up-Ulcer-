import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllPatients,
  getRiskLevel,
  calculateBradenScore,
} from "../data/patients";
import { testBackendConnection } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";
import AddPatientModal from "../components/AddPatientModal";
import { createPatient } from "../data/patients";

function PatientList() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch patients from backend
  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllPatients();
      setPatients(data);
      setFilteredPatients(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch patients:", err);
      setError(err.message || "Failed to load patient data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Filter and search patients
  useEffect(() => {
    let filtered = [...patients];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(query) ||
          patient.room_number?.toLowerCase().includes(query) ||
          patient.id?.toString().includes(query)
      );
    }

    // Apply risk filter
    if (filterRisk !== "all") {
      filtered = filtered.filter((patient) => {
        const riskLevel = getRiskLevel(patient.riskScore || 0);
        return riskLevel === filterRisk;
      });
    }

    setFilteredPatients(filtered);
  }, [patients, searchQuery, filterRisk]);

  // Handle add patient
  const handleAddPatient = async (newPatientData) => {
    try {
      await createPatient(newPatientData);
      setIsAddModalOpen(false);
      await fetchPatients();
    } catch (err) {
      console.error("Failed to create patient:", err);
      alert("Failed to create patient. Please try again.");
    }
  };

  // Get patient initials
  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get risk badge styling
  const getRiskBadge = (patient) => {
    const riskScore = patient.riskScore || 0;
    const bradenScore = patient.bradenScore || calculateBradenScore(patient);
    const riskLevel = getRiskLevel(riskScore);

    if (riskLevel === "critical" || riskLevel === "high") {
      return {
        className:
          "inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300",
        label: `High (${bradenScore})`,
      };
    } else if (riskLevel === "moderate") {
      return {
        className:
          "inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        label: `Medium (${bradenScore})`,
      };
    } else if (riskLevel === "low") {
      return {
        className:
          "inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-300",
        label: `Low (${bradenScore})`,
      };
    }
    return {
      className:
        "inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      label: `Medium (${bradenScore})`,
    };
  };

  // Get avatar color based on patient
  const getAvatarColor = (index, name) => {
    const colors = [
      { bg: "bg-blue-100", text: "text-primary" },
      { bg: "bg-purple-100", text: "text-purple-600" },
      { bg: "bg-green-100", text: "text-green-600" },
      { bg: "bg-pink-100", text: "text-pink-600" },
      { bg: "bg-teal-100", text: "text-teal-600" },
    ];
    return colors[index % colors.length];
  };

  // Format time ago
  const getTimeAgo = (date) => {
    if (!date) return `2 ${t("minsAgo")}`;
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return t("justNow");
    if (diffMins < 60) return `${diffMins} ${t("minsAgo")}`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ${t("hoursAgo")}`;
    return `${Math.floor(diffHours / 24)} ${t("daysAgo")}`;
  };

  // Handle patient details navigation
  const handleViewDetails = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Side Navigation */}
      <aside className="hidden w-64 flex-col border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark lg:flex">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-6">
            {/* Brand/Header */}
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[28px]">
                  monitor_heart
                </span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-base font-bold leading-tight text-text-main dark:text-white">
                  CareMonitor
                </h1>
                <p className="text-xs font-medium text-text-sub dark:text-gray-400">
                  {t("ward")} 3B
                </p>
              </div>
            </div>
            {/* Navigation Links */}
            <nav className="flex flex-col gap-1">
              <a
                onClick={() => navigate("/")}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-text-main dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">
                  grid_view
                </span>
                <span className="text-sm font-medium">{t("dashboard")}</span>
              </a>
              <a
                onClick={() => navigate("/patients")}
                className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-2.5 text-primary dark:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[24px]">
                  group
                </span>
                <span className="text-sm font-medium">{t("patientList")}</span>
              </a>
            </nav>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex flex-1 flex-col overflow-y-auto bg-background-light dark:bg-background-dark">
        {/* Mobile Header */}
        <div className="flex items-center justify-between border-b border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark lg:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              monitor_heart
            </span>
            <span className="font-bold">CareMonitor</span>
          </div>
          <button className="text-text-main dark:text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        <div className="mx-auto w-full max-w-[1400px] flex-1 p-6 lg:p-10">
          {/* Page Headline */}
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-text-main dark:text-white">
                {t("patientList")}
              </h2>
              <p className="mt-1 text-text-sub dark:text-gray-400">
                {language === "ko"
                  ? "병동 3B의 모든 등록된 환자"
                  : "All registered patients in Ward 3B"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <div className="flex items-center gap-2 text-sm text-text-sub dark:text-gray-400">
                <span className="material-symbols-outlined text-base">
                  schedule
                </span>
                <span>
                  {t("lastUpdated")}: {getTimeAgo(lastUpdated)}
                </span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-emerald-500 to-emerald-600 px-5 py-3 text-white font-medium shadow-lg shadow-emerald-200 hover:from-emerald-600 hover:to-emerald-700 transition-all"
              >
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
                <span>{t("addPatient")}</span>
              </button>
            </div>
          </div>

          {/* Filters & Actions Toolbar */}
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border-light bg-surface-light p-4 shadow-sm dark:border-border-dark dark:bg-surface-dark lg:flex-row lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="material-symbols-outlined text-text-sub dark:text-gray-500">
                  search
                </span>
              </div>
              <input
                className="block w-full rounded-lg border-none bg-background-light py-2.5 pl-10 pr-3 text-sm text-text-main placeholder-text-sub focus:ring-2 focus:ring-primary dark:bg-background-dark dark:text-white dark:placeholder-gray-500"
                placeholder={t("searchPlaceholder")}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setFilterRisk("all")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
                  filterRisk === "all"
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-background-light text-text-sub hover:bg-gray-200 dark:bg-background-dark dark:text-gray-300 dark:hover:bg-white/10"
                }`}
              >
                <span>{t("allPatients")}</span>
              </button>
              <button
                onClick={() => setFilterRisk("high")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterRisk === "high"
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-background-light text-text-sub hover:bg-gray-200 dark:bg-background-dark dark:text-gray-300 dark:hover:bg-white/10"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
                <span>{t("highRisk")}</span>
              </button>
              <button
                onClick={() => setFilterRisk("moderate")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterRisk === "moderate"
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-background-light text-text-sub hover:bg-gray-200 dark:bg-background-dark dark:text-gray-300 dark:hover:bg-white/10"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                <span>{t("moderateRisk")}</span>
              </button>
              <button
                onClick={() => setFilterRisk("low")}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filterRisk === "low"
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "bg-background-light text-text-sub hover:bg-gray-200 dark:bg-background-dark dark:text-gray-300 dark:hover:bg-white/10"
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                <span>{t("lowRisk")}</span>
              </button>
            </div>
          </div>

          {/* Patient Status Table */}
          <div className="overflow-hidden rounded-xl border border-border-light bg-surface-light shadow-sm dark:border-border-dark dark:bg-surface-dark">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                  <p className="text-text-sub dark:text-gray-400">
                    {t("loadingPatients")}
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <span className="material-symbols-outlined text-6xl text-red-500">
                    error
                  </span>
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    {error}
                  </p>
                  <button
                    onClick={fetchPatients}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      refresh
                    </span>
                    <span>{t("retry")}</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800/50">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-text-main dark:text-gray-200">
                          {t("patient")}
                        </th>
                        <th className="px-6 py-4 font-semibold text-text-main dark:text-gray-200">
                          {t("room")}
                        </th>
                        <th className="px-6 py-4 font-semibold text-text-main dark:text-gray-200">
                          {t("riskScore")}
                        </th>
                        <th className="px-6 py-4 font-semibold text-text-main dark:text-gray-200">
                          {language === "ko" ? "나이" : "Age"}
                        </th>
                        <th className="px-6 py-4 font-semibold text-text-main dark:text-gray-200">
                          {language === "ko" ? "성별" : "Gender"}
                        </th>
                        <th className="px-6 py-4 font-semibold text-text-main dark:text-gray-200">
                          {t("diagnosis")}
                        </th>
                        <th className="px-6 py-4 font-semibold text-text-main dark:text-gray-200 text-right">
                          {t("action")}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light dark:divide-border-dark">
                      {filteredPatients.length === 0 ? (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-6 py-12 text-center text-text-sub dark:text-gray-400"
                          >
                            {t("noPatientsFound")}
                          </td>
                        </tr>
                      ) : (
                        filteredPatients.map((patient, index) => {
                          const riskBadge = getRiskBadge(patient);
                          const avatarColor = getAvatarColor(
                            index,
                            patient.name
                          );
                          const initials = getInitials(patient.name);

                          return (
                            <tr
                              key={patient.id}
                              className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                      avatarColor.bg
                                    } ${
                                      avatarColor.text
                                    } dark:${avatarColor.bg.replace(
                                      "100",
                                      "900/30"
                                    )} font-bold`}
                                  >
                                    {initials}
                                  </div>
                                  <div>
                                    <div className="font-medium text-text-main dark:text-white">
                                      {patient.name || "Unknown"}
                                    </div>
                                    <div className="text-xs text-text-sub dark:text-gray-500">
                                      ID: {patient.id}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-medium text-text-main dark:text-gray-300">
                                  {patient.room_number || "N/A"}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={riskBadge.className}>
                                  {riskBadge.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-text-main dark:text-gray-300">
                                  {patient.age || "--"}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-text-main dark:text-gray-300">
                                  {patient.gender === "M"
                                    ? t("male")
                                    : patient.gender === "F"
                                    ? t("female")
                                    : "--"}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-text-main dark:text-gray-300 max-w-xs truncate">
                                  {patient.diagnosis || "--"}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={() => handleViewDetails(patient.id)}
                                  className="inline-flex items-center rounded-lg border border-border-light dark:border-border-dark bg-white dark:bg-transparent px-3 py-1.5 text-xs font-medium text-text-main dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                >
                                  {t("details")}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Pagination Footer */}
                <div className="flex items-center justify-between border-t border-border-light bg-surface-light px-6 py-4 dark:border-border-dark dark:bg-surface-dark">
                  <div className="text-xs text-text-sub dark:text-gray-400">
                    {t("showing")}{" "}
                    <span className="font-medium text-text-main dark:text-white">
                      1
                    </span>{" "}
                    {t("to")}{" "}
                    <span className="font-medium text-text-main dark:text-white">
                      {filteredPatients.length}
                    </span>{" "}
                    {t("of")}{" "}
                    <span className="font-medium text-text-main dark:text-white">
                      {patients.length}
                    </span>{" "}
                    {t("totalPatients")}
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center rounded-md border border-border-light bg-white px-3 py-1 text-xs font-medium text-text-sub shadow-sm hover:bg-gray-50 disabled:opacity-50 dark:border-border-dark dark:bg-transparent dark:text-gray-400 dark:hover:bg-white/5">
                      {t("previous")}
                    </button>
                    <button className="inline-flex items-center rounded-md border border-border-light bg-white px-3 py-1 text-xs font-medium text-text-sub shadow-sm hover:bg-gray-50 dark:border-border-dark dark:bg-transparent dark:text-gray-400 dark:hover:bg-white/5">
                      {t("next")}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPatient}
      />
    </div>
  );
}

export default PatientList;
