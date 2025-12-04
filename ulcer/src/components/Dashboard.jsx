import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientCard from './PatientCard';
import StatsPanel from './StatsPanel';
import CareInstructions from './CareInstructions';
import AddPatientModal from './AddPatientModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { getAllPatients, getRiskLevel, createPatient, deletePatient } from '../data/patients';

function Dashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState(getAllPatients());
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [filterRisk, setFilterRisk] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  const filteredPatients = patients.filter(patient => {
    if (filterRisk === 'all') return true;
    return getRiskLevel(patient.riskScore) === filterRisk;
  });

  const stats = {
    total: patients.length,
    critical: patients.filter(p => getRiskLevel(p.riskScore) === 'critical').length,
    high: patients.filter(p => getRiskLevel(p.riskScore) === 'high').length,
    moderate: patients.filter(p => getRiskLevel(p.riskScore) === 'moderate').length,
    low: patients.filter(p => getRiskLevel(p.riskScore) === 'low').length,
  };

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
  };

  const handleViewDetails = (patientId) => {
    navigate(`/patient/${patientId}`);
  };

  const handleAddPatient = (newPatientData) => {
    const newPatient = createPatient(newPatientData);
    setPatients(getAllPatients());
    setSelectedPatient(newPatient);
    setIsAddModalOpen(false);
  };

  const handleDeleteClick = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (patientToDelete) {
      deletePatient(patientToDelete.id);
      const updatedPatients = getAllPatients();
      setPatients(updatedPatients);
      if (selectedPatient?.id === patientToDelete.id) {
        setSelectedPatient(updatedPatients[0] || null);
      }
      setPatientToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 text-slate-800">
      {/* Header */}
      <header className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-clinical-500 to-clinical-700 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-800 tracking-tight">
                Pressure Ulcer Prevention
              </h1>
              <p className="text-slate-500 font-body">
                욕창 위험도 평가 대시보드
              </p>
            </div>
          </div>
          {/* Add Patient Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Patient
          </button>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-clinical-100 border border-clinical-200">
            <span className="w-2 h-2 rounded-full bg-clinical-500 animate-pulse"></span>
            <span className="text-sm text-clinical-700 font-medium">Live Monitoring</span>
          </span>
          <span className="text-slate-500 text-sm">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
        </div>
      </header>

      {/* Stats Panel */}
      <StatsPanel stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        {/* Patient List */}
        <div className="xl:col-span-2 glass rounded-2xl p-6 animate-slide-up delay-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-slate-800">
              Patient Risk Monitor
            </h2>
            <div className="flex gap-2">
              {['all', 'critical', 'high', 'moderate', 'low'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterRisk(level)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterRisk === level
                      ? 'bg-clinical-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {filteredPatients.map((patient, index) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                isSelected={selectedPatient?.id === patient.id}
                onClick={() => handlePatientClick(patient)}
                onViewDetails={() => handleViewDetails(patient.id)}
                onDelete={() => handleDeleteClick(patient.id)}
                delay={index * 100}
              />
            ))}
            {filteredPatients.length === 0 && (
              <div className="text-center py-12 text-slate-500">
                No patients match the selected filter
              </div>
            )}
          </div>
        </div>

        {/* Care Instructions Panel */}
        <div className="glass rounded-2xl p-6 animate-slide-up delay-300">
          <CareInstructions patient={selectedPatient} />
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPatient}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPatientToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        patientName={patientToDelete?.name || ''}
      />
    </div>
  );
}

export default Dashboard;
