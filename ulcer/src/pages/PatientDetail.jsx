import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  getPatientById, 
  getRiskLevel, 
  getRiskConfig, 
  updatePatient, 
  deletePatient,
  getMobilityStatus,
  getSkinCondition
} from '../data/patients';
import ThermographyView from '../components/ThermographyView';
import CareInstructions from '../components/CareInstructions';
import EditPatientModal from '../components/EditPatientModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import LanguageToggle from '../components/LanguageToggle';

function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [patient, setPatient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const p = getPatientById(patientId);
    setPatient(p);
  }, [patientId]);

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            {language === 'ko' ? '환자를 찾을 수 없습니다' : 'Patient Not Found'}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-clinical-600 text-white rounded-xl hover:bg-clinical-500 transition-all shadow-md"
          >
            {t('backToDashboard')}
          </button>
        </div>
      </div>
    );
  }

  const handleSavePatient = (updatedData) => {
    const saved = updatePatient(patientId, updatedData);
    if (saved) {
      setPatient(saved);
    }
    setIsEditModalOpen(false);
  };

  const handleDeletePatient = () => {
    deletePatient(patient.id);
    setIsDeleteModalOpen(false);
    navigate('/');
  };

  const riskLevel = getRiskLevel(patient.riskScore);
  const config = getRiskConfig(riskLevel);
  const scorePercentage = Math.round(patient.riskScore * 100);

  const riskLabels = {
    critical: language === 'ko' ? '위험' : 'CRITICAL',
    high: language === 'ko' ? '높음' : 'HIGH',
    moderate: language === 'ko' ? '중간' : 'MODERATE',
    low: language === 'ko' ? '낮음' : 'LOW',
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header with Back Button */}
      <header className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t('backToDashboard')}</span>
          </button>
          
          {/* Language Toggle */}
          <LanguageToggle />
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${config.badge} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-800 tracking-tight">
                {patient.name}
              </h1>
              <p className="text-slate-500 mt-1">
                #{patient.id} • {t('room')} {patient.room} • {patient.age}{t('years')} • {patient.gender === 'M' ? t('male') : t('female')}
              </p>
            </div>
          </div>

          {/* Risk Badge + Edit/Delete Buttons */}
          <div className="flex items-center gap-3">
            <div className={`px-5 py-3 rounded-xl ${config.bg} border ${config.border} ${config.glow}`}>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{t('riskScore')}</p>
                  <p className={`font-mono font-bold text-2xl ${config.textDark}`}>{scorePercentage}%</p>
                </div>
                <div className={`px-3 py-1.5 rounded-lg ${config.badge} text-white font-bold text-sm shadow-sm`}>
                  {riskLabels[riskLevel]}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-clinical-600 to-clinical-700 text-white font-medium hover:from-clinical-500 hover:to-clinical-600 transition-all shadow-lg shadow-clinical-200 hover:shadow-clinical-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {t('edit')}
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200 hover:shadow-red-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t('delete')}
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
              {t('patientInfo')}
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-100 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{t('registrationDate')}</p>
                  <p className="text-slate-800 font-medium mt-1">
                    {new Date(patient.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 bg-slate-100 rounded-xl">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{t('lastAssessment')}</p>
                  <p className="text-slate-800 font-medium mt-1">{patient.lastAssessment}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl">
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t('mobilityStatus')}</p>
                <p className="text-slate-800 font-medium mt-1">{getMobilityStatus(patient.mobility)}</p>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl">
                <p className="text-xs text-slate-500 uppercase tracking-wider">{t('skinCondition')}</p>
                <p className={`font-medium mt-1 ${
                  patient.has_ulcer ? 'text-red-600' : 'text-emerald-600'
                }`}>{getSkinCondition(patient)}</p>
              </div>

              {patient.has_ulcer && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-xs text-red-600 uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {t('ulcerAlert')}
                  </p>
                  <p className="text-red-700 font-medium mt-1">
                    {t('stage')} {patient.ulcer_stage} - {patient.ulcer_location}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Thermography with Care Instructions */}
        <div className="xl:col-span-2 animate-slide-up delay-200">
          <ThermographyView patient={patient}>
            <CareInstructions patient={patient} />
          </ThermographyView>
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
