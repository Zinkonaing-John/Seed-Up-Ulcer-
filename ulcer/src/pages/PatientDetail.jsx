import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPatientById, getRiskLevel, getRiskConfig, updatePatient, deletePatient } from '../data/patients';
import ThermographyView from '../components/ThermographyView';
import CareInstructions from '../components/CareInstructions';
import EditPatientModal from '../components/EditPatientModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(getPatientById(patientId));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Patient Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-clinical-600 text-white rounded-xl hover:bg-clinical-500 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleSavePatient = (updatedPatient) => {
    const saved = updatePatient(patientId, updatedPatient);
    if (saved) {
      setPatient({ ...saved });
    }
    setIsEditModalOpen(false);
  };

  const handleDeletePatient = () => {
    deletePatient(patientId);
    navigate('/');
  };

  const riskLevel = getRiskLevel(patient.riskScore);
  const config = getRiskConfig(riskLevel);
  const scorePercentage = Math.round(patient.riskScore * 100);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header with Back Button */}
      <header className="mb-8 animate-fade-in">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-6 group"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${config.badge} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-800 tracking-tight">
                {patient.name}
              </h1>
              <p className="text-slate-500 mt-1">
                {patient.id} • Room {patient.room} • {patient.age} years • {patient.gender}
              </p>
            </div>
          </div>

          {/* Risk Badge + Edit Button */}
          <div className="flex items-center gap-3">
            <div className={`px-5 py-3 rounded-xl ${config.bg} border ${config.border} ${config.glow}`}>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Risk Score</p>
                  <p className={`font-mono font-bold text-2xl ${config.textDark}`}>{scorePercentage}%</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg ${config.badge} text-white font-bold text-sm shadow-sm`}>
                  {config.label}
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-clinical-600 to-clinical-700 text-white font-medium hover:from-clinical-500 hover:to-clinical-600 transition-all shadow-lg shadow-clinical-200 hover:shadow-clinical-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-400 hover:to-red-500 transition-all shadow-lg shadow-red-200 hover:shadow-red-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Patient Info */}
        <div className="xl:col-span-1 space-y-6 animate-slide-up delay-100">
          {/* Patient Details Card */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-clinical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Patient Information
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Admission Date</p>
                  <p className="text-slate-800 font-medium mt-1">{patient.admissionDate}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Braden Score</p>
                  <p className={`font-mono font-bold text-lg mt-1 ${
                    patient.bradenScore <= 12 ? 'text-red-600' : 
                    patient.bradenScore <= 14 ? 'text-orange-600' : 
                    patient.bradenScore <= 16 ? 'text-amber-600' : 'text-emerald-600'
                  }`}>{patient.bradenScore}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Diagnosis</p>
                <p className="text-slate-800 font-medium mt-1">{patient.diagnosis}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Weight</p>
                  <p className="text-slate-800 font-medium mt-1">{patient.weight} kg</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Height</p>
                  <p className="text-slate-800 font-medium mt-1">{patient.height} cm</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Mobility Status</p>
                <p className="text-slate-800 font-medium mt-1">{patient.mobilityStatus}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Skin Condition</p>
                <p className={`font-medium mt-1 ${
                  patient.skinCondition.toLowerCase().includes('stage') ? 'text-orange-600' : 
                  patient.skinCondition === 'Intact' ? 'text-emerald-600' : 'text-amber-600'
                }`}>{patient.skinCondition}</p>
              </div>

              {patient.allergies.length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-xs text-red-600 uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Allergies
                  </p>
                  <p className="text-red-700 font-medium mt-1">{patient.allergies.join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Vital Signs */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-clinical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Vital Signs
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-rose-50 to-rose-100 border border-rose-200 rounded-xl">
                <p className="text-xs text-rose-600 uppercase tracking-wider">Blood Pressure</p>
                <p className="text-slate-800 font-mono font-bold text-xl mt-1">{patient.vitalSigns.bloodPressure}</p>
                <p className="text-xs text-slate-400 mt-1">mmHg</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl">
                <p className="text-xs text-pink-600 uppercase tracking-wider">Heart Rate</p>
                <p className="text-slate-800 font-mono font-bold text-xl mt-1">{patient.vitalSigns.heartRate}</p>
                <p className="text-xs text-slate-400 mt-1">bpm</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-600 uppercase tracking-wider">Temperature</p>
                <p className="text-slate-800 font-mono font-bold text-xl mt-1">{patient.vitalSigns.temperature}°C</p>
                <p className="text-xs text-slate-400 mt-1">Core</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-xl">
                <p className="text-xs text-cyan-600 uppercase tracking-wider">SpO2</p>
                <p className="text-slate-800 font-mono font-bold text-xl mt-1">{patient.vitalSigns.oxygenSaturation}%</p>
                <p className="text-xs text-slate-400 mt-1">Oxygen</p>
              </div>
            </div>
          </div>

          {/* Repositioning Schedule */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-clinical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Repositioning Schedule
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Last Repositioned</p>
                  <p className="text-slate-800 font-medium mt-1">{patient.lastRepositioned}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-xl ${
                patient.nextRepositioning.includes('30') || patient.nextRepositioning.includes('In 1 hour')
                  ? 'bg-orange-50 border border-orange-200'
                  : 'bg-slate-50 border border-slate-100'
              }`}>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">Next Repositioning</p>
                  <p className={`font-medium mt-1 ${
                    patient.nextRepositioning.includes('30') || patient.nextRepositioning.includes('In 1 hour')
                      ? 'text-orange-600'
                      : 'text-slate-800'
                  }`}>{patient.nextRepositioning}</p>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  patient.nextRepositioning.includes('30') || patient.nextRepositioning.includes('In 1 hour')
                    ? 'bg-orange-100'
                    : 'bg-clinical-100'
                }`}>
                  <svg className={`w-5 h-5 ${
                    patient.nextRepositioning.includes('30') || patient.nextRepositioning.includes('In 1 hour')
                      ? 'text-orange-600'
                      : 'text-clinical-600'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Thermography & Care Instructions (stacked) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Thermography Camera - Full Width */}
          <div className="animate-slide-up delay-200">
            <ThermographyView patient={patient} />
          </div>

          {/* Care Instructions - Below Camera */}
          <div className="glass rounded-2xl p-6 animate-slide-up delay-300">
            <CareInstructions patient={patient} />
          </div>
        </div>
      </div>

      {/* Edit Patient Modal */}
      <EditPatientModal
        patient={patient}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSavePatient}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePatient}
        patientName={patient.name}
      />
    </div>
  );
}

export default PatientDetail;
