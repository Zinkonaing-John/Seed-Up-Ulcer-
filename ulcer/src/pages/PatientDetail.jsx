import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  getPatientById, 
  getRiskLevel, 
  getRiskConfig, 
  updatePatient, 
  deletePatient,
  getActivityStatus,
  calculateBMI
} from '../data/patients';
import ThermographyView from '../components/ThermographyView';
import CareInstructions from '../components/CareInstructions';
import EditPatientModal from '../components/EditPatientModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import PatientHistoryModal from '../components/PatientHistoryModal';
import LanguageToggle from '../components/LanguageToggle';

function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [patient, setPatient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const labels = {
    ko: {
      notFound: '환자를 찾을 수 없습니다',
      backToDashboard: '대시보드로 돌아가기',
      edit: '수정',
      delete: '삭제',
      history: '평가 이력',
      riskScore: '위험 점수',
      patientInfo: '환자 상세 정보',
      registrationDate: '등록일',
      diagnosis: '진단명',
      notes: '특이사항',
      activity: '활동 정도',
      room: '병실',
      male: '남성',
      female: '여성',
      loading: '로딩 중...',
      error: '환자 정보를 불러오는데 실패했습니다',
      retry: '다시 시도',
      saveFailed: '저장에 실패했습니다',
      deleteFailed: '삭제에 실패했습니다',
      age: '나이',
      gender: '성별',
      height: '키',
      weight: '체중',
      bmi: 'BMI',
      bloodPressure: '혈압',
      ulcerStatus: '욕창 상태',
      ulcerLocation: '발생 부위',
      stage: '단계',
      noUlcer: '욕창 없음',
    },
    en: {
      notFound: 'Patient Not Found',
      backToDashboard: 'Back to Dashboard',
      edit: 'Edit',
      delete: 'Delete',
      history: 'Assessment History',
      riskScore: 'Risk Score',
      patientInfo: 'Patient Details',
      registrationDate: 'Registration Date',
      diagnosis: 'Diagnosis',
      notes: 'Notes',
      activity: 'Activity Level',
      room: 'Room',
      male: 'Male',
      female: 'Female',
      loading: 'Loading...',
      error: 'Failed to load patient data',
      retry: 'Retry',
      saveFailed: 'Failed to save changes',
      deleteFailed: 'Failed to delete patient',
      age: 'Age',
      gender: 'Gender',
      height: 'Height',
      weight: 'Weight',
      bmi: 'BMI',
      bloodPressure: 'Blood Pressure',
      ulcerStatus: 'Ulcer Status',
      ulcerLocation: 'Location',
      stage: 'Stage',
      noUlcer: 'No Ulcer',
    },
  };

  const t = labels[language] || labels.en;

  // Fetch patient data
  const fetchPatient = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPatientById(patientId);
      setPatient(data);
    } catch (err) {
      console.error('Failed to fetch patient:', err);
      setError(err.message || t.error);
    } finally {
      setIsLoading(false);
    }
  }, [patientId, t.error]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-clinical-200 border-t-clinical-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">{t.loading}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">{t.error}</h1>
          <p className="text-slate-500 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/')} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300">
              {t.backToDashboard}
            </button>
            <button onClick={fetchPatient} className="px-4 py-2 bg-clinical-600 text-white rounded-lg hover:bg-clinical-700">
              {t.retry}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">{t.notFound}</h1>
          <button onClick={() => navigate('/')}
            className="px-6 py-3 bg-clinical-600 text-white rounded-xl hover:bg-clinical-500 transition-all shadow-md">
            {t.backToDashboard}
          </button>
        </div>
      </div>
    );
  }

  const handleSavePatient = async (updatedData) => {
    setIsSaving(true);
    try {
      const saved = await updatePatient(patientId, updatedData);
      setPatient(saved);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Failed to update patient:', err);
      alert(t.saveFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePatient = async () => {
    try {
      await deletePatient(patient.id);
      setIsDeleteModalOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete patient:', err);
      alert(t.deleteFailed);
    }
  };

  const riskLevel = getRiskLevel(patient.riskScore);
  const config = getRiskConfig(riskLevel);
  const scorePercentage = Math.round(patient.riskScore * 100);
  const bmi = calculateBMI(patient.height_cm, patient.weight_kg);

  const riskLabels = {
    critical: language === 'ko' ? '위험' : 'CRITICAL',
    high: language === 'ko' ? '높음' : 'HIGH',
    moderate: language === 'ko' ? '중간' : 'MODERATE',
    low: language === 'ko' ? '낮음' : 'LOW',
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>{t.backToDashboard}</span>
          </button>
          <LanguageToggle />
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl ${config.badge} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-800 tracking-tight">{patient.name}</h1>
              <p className="text-slate-500 mt-1">
                #{patient.id} • {t.room} {patient.room_number} • {patient.age}{language === 'ko' ? '세' : ' yrs'} • {patient.gender === 'M' ? t.male : t.female}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button onClick={() => setIsHistoryModalOpen(true)}
              className="flex items-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-200 hover:scale-105">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {t.history}
            </button>

            <button onClick={() => setIsEditModalOpen(true)} disabled={isSaving}
              className="flex items-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-clinical-600 to-clinical-700 text-white font-medium hover:from-clinical-500 hover:to-clinical-600 transition-all shadow-lg shadow-clinical-200 hover:scale-105 disabled:opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {t.edit}
            </button>

            <button onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-5 py-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-200 hover:scale-105">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t.delete}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Comprehensive Patient Info */}
        <div className="xl:col-span-1 animate-slide-up delay-100">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-clinical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t.patientInfo}
            </h2>
            
            <div className="space-y-3">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.age}</p>
                  <p className="text-slate-800 font-bold text-lg">{patient.age}{language === 'ko' ? '세' : ' yrs'}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.gender}</p>
                  <p className="text-slate-800 font-bold text-lg">{patient.gender === 'M' ? t.male : t.female}</p>
                </div>
              </div>

              {/* Physical Data */}
              {(patient.height_cm || patient.weight_kg || patient.blood_pressure) && (
                <div className="grid grid-cols-3 gap-2">
                  {patient.height_cm && (
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 mb-0.5">{t.height}</p>
                      <p className="text-slate-800 font-mono font-bold text-sm">{patient.height_cm}<span className="text-xs">cm</span></p>
                    </div>
                  )}
                  {patient.weight_kg && (
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 mb-0.5">{t.weight}</p>
                      <p className="text-slate-800 font-mono font-bold text-sm">{patient.weight_kg}<span className="text-xs">kg</span></p>
                    </div>
                  )}
                  {bmi && (
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-600 mb-0.5">{t.bmi}</p>
                      <p className="text-slate-800 font-mono font-bold text-sm">{bmi}</p>
                    </div>
                  )}
                </div>
              )}

              {patient.blood_pressure && (
                <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                  <p className="text-xs text-rose-600 uppercase tracking-wider mb-1">{t.bloodPressure}</p>
                  <p className="text-slate-800 font-mono font-bold text-lg">{patient.blood_pressure}</p>
                </div>
              )}

              {/* Activity & Registration */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.activity}</p>
                  <p className="text-slate-800 font-medium text-sm">{getActivityStatus(patient.activity)}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.registrationDate}</p>
                  <p className="text-slate-800 font-medium text-sm">
                    {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : '-'}
                  </p>
                </div>
              </div>

              {/* Diagnosis */}
              {patient.diagnosis && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{t.diagnosis}</p>
                  <p className="text-slate-800 font-medium">{patient.diagnosis}</p>
                </div>
              )}

              {/* Notes */}
              {patient.notes && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-600 uppercase tracking-wider mb-1">{t.notes}</p>
                  <p className="text-slate-700 text-sm">{patient.notes}</p>
                </div>
              )}

              {/* Ulcer Status */}
              {patient.has_ulcer ? (
                <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700 font-bold uppercase tracking-wider">{t.ulcerStatus}</p>
                  </div>
                  <p className="text-red-800 font-semibold text-lg mb-1">
                    {t.stage} {patient.ulcer_stage}
                  </p>
                  <p className="text-red-700 text-sm">
                    <span className="font-medium">{t.ulcerLocation}:</span> {patient.ulcer_location}
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                  <p className="text-emerald-700 font-medium">✓ {t.noUlcer}</p>
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

      {/* Modals */}
      <EditPatientModal patient={patient} isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)} onSave={handleSavePatient} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeletePatient} patientName={patient.name} />
      <PatientHistoryModal patient={patient} isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)} />
    </div>
  );
}

export default PatientDetail;
